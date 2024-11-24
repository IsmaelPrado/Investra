import { Server } from "socket.io";
import { AccionPriceUpdateStrategy, BonoGubernamentalPriceUpdateStrategy, BonoOrganizacionalPriceUpdateStrategy, DefaultInvestmentUpdateStrategy } from "./ConcreteStrategy";
import { obtenerTodosLosActivos } from "../../../models/Simulation/assetModel";
import { MarketSimulationContext } from "./Context";

export const iniciarSimulacionStrategy = (io: Server): void => {
    const investmentUpdateStrategy = new DefaultInvestmentUpdateStrategy();

    setInterval(async () => {
        try {
            console.log("Simulando actualización de mercado...");
            const activos = await obtenerTodosLosActivos();

            const acciones = activos.filter(activo => activo.tipo === "accion");
            const bonosGubernamentales = activos.filter(activo => activo.tipo === "bono_gubernamental");
            const bonosOrganizacionales = activos.filter(activo => activo.tipo === "bono_organizacional");

            const accionesSimulationContext = new MarketSimulationContext(
                new AccionPriceUpdateStrategy(),
                investmentUpdateStrategy
            );

            const bonosGubernamentalesSimulationContext = new MarketSimulationContext(
                new BonoGubernamentalPriceUpdateStrategy(),
                investmentUpdateStrategy
            );

            const bonosOrganizacionalesSimulationContext = new MarketSimulationContext(
                new BonoOrganizacionalPriceUpdateStrategy(),
                investmentUpdateStrategy
            );

            // Ejecutar las simulaciones en paralelo
            const [
                { updatedAssets: accionesResult, updatedInvestments: accionesInvestments },
                { updatedAssets: bonosGubernamentalesResult, updatedInvestments: bonosGubernamentalesInvestments },
                { updatedAssets: bonosOrganizacionalesResult, updatedInvestments: bonosOrganizacionalesInvestments }
            ] = await Promise.all([
                accionesSimulationContext.simulate(io, acciones),
                bonosGubernamentalesSimulationContext.simulate(io, bonosGubernamentales),
                bonosOrganizacionalesSimulationContext.simulate(io, bonosOrganizacionales)
            ]);

            // Consolidar resultados
            const allUpdatedAssets = [
                ...accionesResult,
                ...bonosGubernamentalesResult,
                ...bonosOrganizacionalesResult
            ];
            const allUpdatedInvestments = [
                ...accionesInvestments,
                ...bonosGubernamentalesInvestments,
                ...bonosOrganizacionalesInvestments
            ];

            // Emitir todos los activos y las inversiones actualizadas en un solo socket
            io.emit("updateAssets", allUpdatedAssets);
            io.emit("updateInvestments", allUpdatedInvestments);

        } catch (error) {
            console.error("Error in market simulation:", error);
        }
    }, 30000); // Cada 30 segundos
};
