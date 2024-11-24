import { Server } from "socket.io";
import { Asset } from "../../../models/Simulation/assetModel";
import { AccionPriceUpdateStrategy, BonoGubernamentalPriceUpdateStrategy, BonoOrganizacionalPriceUpdateStrategy, DefaultInvestmentUpdateStrategy } from "./ConcreteStrategy";
import { InvestmentUpdateStrategy, PriceUpdateStrategy } from "./Strategy";
import { BuyAsset } from "../../../models/Simulation/buyAssetsModel";

// Contexto para simulación de mercado
export class MarketSimulationContext {
    private priceUpdateStrategy: PriceUpdateStrategy;
    private investmentUpdateStrategy: InvestmentUpdateStrategy;

    constructor(
        priceUpdateStrategy: PriceUpdateStrategy,
        investmentUpdateStrategy: InvestmentUpdateStrategy
    ) {
        this.priceUpdateStrategy = priceUpdateStrategy;
        this.investmentUpdateStrategy = investmentUpdateStrategy;
    }

    // Simula la actualización de precios e inversiones de los activos
    async simulate(io: Server, assets: Asset[]): Promise<{ updatedAssets: Asset[], updatedInvestments: BuyAsset[] }> {
        try {
            // Arreglos para almacenar activos e inversiones actualizadas
            const updatedAssets: Asset[] = [];
            const updatedInvestments: BuyAsset[] = [];

            // Itera sobre los activos para actualizar precios e inversiones
            for (const asset of assets) {
                const priceUpdateStrategy = this.getPriceUpdateStrategy(asset.tipo);
                const investmentUpdateStrategy = new DefaultInvestmentUpdateStrategy();

                try {
                    // Actualiza el precio del activo
                    const updatedAsset = await priceUpdateStrategy.updatePrice(asset);
                    // Actualiza las inversiones basadas en el activo actualizado
                    const investments = await investmentUpdateStrategy.updateInvestments(
                        asset,
                        updatedAsset.precio!,
                        updatedAsset.fecha_actualizacion!
                    );

                    // Agrega el activo actualizado al arreglo
                    updatedAssets.push(updatedAsset);
                    // Si hay inversiones, agrégalas al arreglo
                    if (Array.isArray(investments) && investments.length > 0) {
                        updatedInvestments.push(...investments);
                    }
                } catch (error) {
                    console.error(`Error procesando activo con ID ${asset.id}:`, error);
                }
            }

            // Emite los resultados al frontend a través de WebSocket
            io.emit("updateAssets", updatedAssets);
            io.emit("updateInvestments", updatedInvestments);

            return { updatedAssets, updatedInvestments };  // Retorna los activos e inversiones actualizados
        } catch (error) {
            console.error("Error during simulation:", error);
            return { updatedAssets: [], updatedInvestments: [] }; // Retorna arreglos vacíos en caso de error
        }
    }

    // Determina la estrategia de actualización de precios basada en el tipo de activo
    private getPriceUpdateStrategy(tipo: string): PriceUpdateStrategy {
        switch (tipo) {
            case "accion":
                return new AccionPriceUpdateStrategy();
            case "bono_gubernamental":
                return new BonoGubernamentalPriceUpdateStrategy();
            case "bono_organizacional":
                return new BonoOrganizacionalPriceUpdateStrategy();
            default:
                throw new Error(`Tipo de activo desconocido: ${tipo}`);
        }
    }
}
