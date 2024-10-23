import { Server } from "socket.io";
import {
  obtenerTodosLosActivos,
  actualizarPrecioActivo,
  Asset,
} from "../../models/Simulation/assetModel";
import {
  crearHistorialPrecio,
  PriceHistory,
  obtenerHistorialPreciosPorActivo,
  HistorialCompras,
  crearHistorialCompra,
  obtenerHistorialCompraPorActivoComprado,
} from "../../models/Simulation/priceHistoryModel";
import { Request, Response } from "express";
import { format } from "date-fns";
import { CompraActivo, actualizarInversionUsuario, obtenerInversionesPorActivo } from "../../models/Simulation/buyAssetsModel";


export const iniciarSimulacion = (io: Server): void => {
  setInterval(async () => {
      try {
          const activos: Asset[] = await obtenerTodosLosActivos();
          const activosActualizados: Asset[] = [];
          const inversionesActualizadas: CompraActivo[] = [];

          for (const activo of activos) {
              const minVariacion = parseFloat(activo.min_variacion.toString()) || 0;
              const maxVariacion = parseFloat(activo.max_variacion.toString()) || 0;

              const variacion = getRandomVariation(minVariacion, maxVariacion);
              const precioActual = parseFloat(activo.precio.toString());

              if (isNaN(precioActual) || isNaN(variacion)) {
                  throw new Error(`precio o variacion no son números: precio=${activo.precio}, variacion=${variacion}`);
              }

              const nuevoPrecio = parseFloat((precioActual + variacion).toFixed(2));
              await actualizarPrecioActivo(activo.id!, nuevoPrecio);

              const timestamp = new Date();
              const formattedTimestamp = format(timestamp, "yyyy-MM-dd HH:mm:ss");

              const historial: PriceHistory = {
                  activo_id: activo.id!,
                  precio: nuevoPrecio,
                  timestamp: new Date(),
              };
              await crearHistorialPrecio(historial);

              const historialPrecios = await obtenerHistorialPreciosPorActivo(activo.id!);

              // Cálculo del rendimiento
              const rendimientoAbsoluto = nuevoPrecio - precioActual;
              const cambioPorcentual = (rendimientoAbsoluto / precioActual) * 100;

              activosActualizados.push({
                  ...activo,
                  precio: nuevoPrecio,
                  historialPrecios,
                  rendimientoAbsoluto: rendimientoAbsoluto.toFixed(2),
                  cambioPorcentual: cambioPorcentual.toFixed(2),
              });

            // Verificar si hay inversiones relacionadas con este activo
            const inversiones = await obtenerInversionesPorActivo(activo.id!);

          for (const inversion of inversiones) {
            const cantidad = inversion.cantidad ?? 0;
            if (cantidad === 0) {
              console.warn(`Inversión con id ${inversion.id} tiene cantidad 0 o indefinida`);
              continue;
            }

            const totalInvertido = inversion.precio_compra * cantidad;
            const gananciaPerdida = (nuevoPrecio - inversion.precio_compra) * cantidad;
            const rendimientoPorcentual = totalInvertido > 0 ? ((gananciaPerdida * 100) / totalInvertido) : 0;

            // Variación del precio de la acción en los últimos 30 segundos
            const cambioPrecio30Segundos = variacion;

            // Total actual de la inversión
            const totalInversion = totalInvertido + gananciaPerdida;

            // Solo actualizar la inversión si la ganancia/pérdida cambia
            if (parseFloat(gananciaPerdida.toFixed(2)) !== inversion.ganancia_perdida) {
              await actualizarInversionUsuario(inversion.id ?? 0, nuevoPrecio, totalInversion);
            }

             // Crear historial de compra para esta inversión
          const historialCompra: HistorialCompras = {
            usuario_id: inversion.usuario_id,
            activo_id: activo.id!,
            precio_inicial: inversion.precio_compra,
            precio_final:  parseFloat(totalInversion.toFixed(2)),
            cantidad,
            fecha_compra: new Date(inversion.fecha_compra ?? timestamp),
            fecha_final: timestamp,
            estado: inversion.estado,
            tipo_activo: inversion.tipo_activo,
          };
          await crearHistorialCompra(historialCompra);

          // Obtener historial de compras para el activo
          const historialPreciosCompra = await obtenerHistorialCompraPorActivoComprado(activo.id!);


            inversionesActualizadas.push({
              ...inversion,
              cantidad,
              precio_compra: inversion.precio_compra,
              precio_actual: nuevoPrecio,
             
              rendimientoPorcentual: parseFloat(rendimientoPorcentual.toFixed(2)),
              cambioPrecio30Segundos: parseFloat(cambioPrecio30Segundos.toFixed(2)),
              ganancia_perdida: parseFloat(totalInversion.toFixed(2)),
    
              estado: inversion.estado,
              tipo_activo: inversion.tipo_activo,
              historialPreciosCompra
            });
          }
        }
      

          io.emit("updateAssets", activosActualizados);
          io.emit("updateInvestments", inversionesActualizadas);
          console.log("Activos actualizados y emitidos a clientes.");
      } catch (error) {
          console.error("Error en la simulación de inversión:", error);
      }
  }, 30000);
};


// Función para generar una variación aleatoria dentro del rango, permitiendo valores negativos
const getRandomVariation = (min: number, max: number): number => {
  if (typeof min !== "number" || typeof max !== "number") {
    throw new Error("min y max deben ser números");
  }
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Nueva ruta para obtener los datos iniciales de los activos
export const obtenerActivosIniciales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activos: Asset[] = await obtenerTodosLosActivos();
    const activosConHistorial = await Promise.all(
      activos.map(async (activo) => {
        const historialPrecios: PriceHistory[] =
          await obtenerHistorialPreciosPorActivo(activo.id!);

        const historialPreciosFormateado = historialPrecios.map((precio) => {
            const timestamp = precio.timestamp ? precio.timestamp : new Date();
            return {
                ...precio,
                timestamp: format(timestamp, "yyyy-MM-dd HH:mm:ss"),
            };
        });
        
        return {
          ...activo,
          historialPrecios: historialPreciosFormateado,
        };
      })
    );

    res.json(activosConHistorial);
  } catch (error) {
    console.error("Error obteniendo los activos iniciales:", error);
    res.status(500).json({ message: "Error obteniendo los activos iniciales" });
  }
};
