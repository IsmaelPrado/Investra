import { Server } from "socket.io";
import { Asset, actualizarPrecioActivo, obtenerTodosLosActivos } from "../../../models/Simulation/assetModel";
import { BuyAsset, actualizarInversionUsuario, obtenerInversionesPorActivo } from "../../../models/Simulation/buyAssetsModel";
import { BuysHistory, PriceHistory, crearHistorialCompra, crearHistorialPrecio, obtenerHistorialCompraPorActivoComprado, obtenerHistorialPreciosPorActivo } from "../../../models/Simulation/priceHistoryModel";
import { InvestmentUpdateStrategy, PriceUpdateStrategy } from "./Strategy";


// Estrategia de actualización de precio para acciones
export class AccionPriceUpdateStrategy implements PriceUpdateStrategy {
    async updatePrice(asset: Asset): Promise<Asset> {
        const minVariation = parseFloat(asset.min_variacion.toString()) || -5;
        const maxVariation = parseFloat(asset.max_variacion.toString()) || 4;

        const variation = this.getRandomVariation(minVariation, maxVariation);
        const currentPrice = parseFloat(asset.precio.toString());
        const newPrice = parseFloat((currentPrice + variation).toFixed(2));

        await actualizarPrecioActivo(asset.id!, newPrice);

        const timestamp = new Date();
        const priceHistory: PriceHistory = {
            activo_id: asset.id!,
            precio: newPrice,
            timestamp,
        };

        await crearHistorialPrecio(priceHistory);

        const historialPrecios = await obtenerHistorialPreciosPorActivo(asset.id!);

        return {
            ...asset,
            precio: newPrice,
            historialPrecios,
            rendimientoAbsoluto: (newPrice - currentPrice).toFixed(2),
            cambioPorcentual: (((newPrice - currentPrice) / currentPrice) * 100).toFixed(2),
            fecha_actualizacion: timestamp
        };
    }

    private getRandomVariation(min: number, max: number): number {
        return parseFloat((Math.random() * (max - min) + min).toFixed(2));
    }
}

// Estrategia de actualización de precio para bonos gubernamentales
export class BonoGubernamentalPriceUpdateStrategy implements PriceUpdateStrategy {
    async updatePrice(asset: Asset): Promise<Asset> {
        const variation = this.getRandomVariation(-0.5, 0.5);
        const currentPrice = parseFloat(asset.precio.toString());
        const newPrice = parseFloat((currentPrice + variation).toFixed(2));

        await actualizarPrecioActivo(asset.id!, newPrice);

        const timestamp = new Date();
        const priceHistory: PriceHistory = {
            activo_id: asset.id!,
            precio: newPrice,
            timestamp,
        };

        await crearHistorialPrecio(priceHistory);

        const historialPrecios = await obtenerHistorialPreciosPorActivo(asset.id!);

        return {
            ...asset,
            precio: newPrice,
            historialPrecios,
            rendimientoAbsoluto: (newPrice - currentPrice).toFixed(2),
            cambioPorcentual: (((newPrice - currentPrice) / currentPrice) * 100).toFixed(2),
            fecha_actualizacion: timestamp
        };
    }

    private getRandomVariation(min: number, max: number): number {
        return parseFloat((Math.random() * (max - min) + min).toFixed(2));
    }
}

// Estrategia de actualización de precio para bonos organizacionales
export class BonoOrganizacionalPriceUpdateStrategy implements PriceUpdateStrategy {
    async updatePrice(asset: Asset): Promise<Asset> {
        const variation = this.getRandomVariation(-0.3, 0.3);
        const currentPrice = parseFloat(asset.precio.toString());
        const newPrice = parseFloat((currentPrice + variation).toFixed(2));

        await actualizarPrecioActivo(asset.id!, newPrice);

        const timestamp = new Date();
        const priceHistory: PriceHistory = {
            activo_id: asset.id!,
            precio: newPrice,
            timestamp,
        };

        await crearHistorialPrecio(priceHistory);

        const historialPrecios = await obtenerHistorialPreciosPorActivo(asset.id!);

        return {
            ...asset,
            precio: newPrice,
            historialPrecios,
            rendimientoAbsoluto: (newPrice - currentPrice).toFixed(2),
            cambioPorcentual: (((newPrice - currentPrice) / currentPrice) * 100).toFixed(2),
            fecha_actualizacion: timestamp
        };
    }

    private getRandomVariation(min: number, max: number): number {
        return parseFloat((Math.random() * (max - min) + min).toFixed(2));
    }
}

// Estrategia común para inversiones
export class DefaultInvestmentUpdateStrategy implements InvestmentUpdateStrategy {
    async updateInvestments(asset: Asset, newPrice: number, timestamp: Date): Promise<BuyAsset[]> {
        const investments = await obtenerInversionesPorActivo(asset.id!);
        const updatedInvestments: BuyAsset[] = [];

        for (const investment of investments) {
            const cantidad = investment.cantidad ?? 0;
            const totalInvested = investment.precio_compra * cantidad;
            const profitLoss = (newPrice - investment.precio_compra) * cantidad;
            const profitPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

            const totalInvestment = totalInvested + profitLoss;
            if (parseFloat(profitLoss.toFixed(2)) !== investment.ganancia_perdida) {
                await actualizarInversionUsuario(investment.id ?? 0, newPrice, totalInvestment);
            }

            const purchaseHistory: BuysHistory = {
                usuario_id: investment.usuario_id,
                activo_id: asset.id!,
                precio_inicial: investment.precio_compra,
                precio_final: parseFloat(totalInvestment.toFixed(2)),
                cantidad,
                fecha_compra: new Date(investment.fecha_compra ?? timestamp),
                fecha_final: timestamp,
                estado: investment.estado,
                tipo_activo: investment.tipo_activo,
            };
            await crearHistorialCompra(purchaseHistory);

            const historialPreciosCompra = await obtenerHistorialCompraPorActivoComprado(asset.id!);

            updatedInvestments.push({
                ...investment,
                cantidad,
                precio_compra: investment.precio_compra,
                precio_actual: newPrice,
                ganancia_perdida: parseFloat(totalInvestment.toFixed(2)),
                rendimientoPorcentual: parseFloat(profitPercentage.toFixed(2)),
                estado: investment.estado,
                tipo_activo: investment.tipo_activo,
                historialPreciosCompra,
            });
        }

        return updatedInvestments;
    }
}

