import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

interface PriceHistoryChartProps {
    historialPrecios: { fecha_final: string; precio_final: number; }[];
}

const PriceHistoryChartCompras: React.FC<PriceHistoryChartProps> = ({ historialPrecios }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null); // Mantén una referencia al gráfico actual

    useEffect(() => {
        if (chartRef.current) {
            // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            // Crear un nuevo gráfico
            chartInstanceRef.current = new Chart(chartRef.current, {
                type: 'line',
                data: {
                    labels: historialPrecios.map((data) => data.fecha_final),
                    datasets: [{
                        label: 'Precio',
                        data: historialPrecios.map((data) => data.precio_final),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false,
                    }],
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Fecha'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Precio'
                            }
                        }
                    }
                }
            });
        }

        // Limpiar el gráfico cuando el componente se desmonte
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [historialPrecios]);

    return <canvas ref={chartRef} />;
};

export default PriceHistoryChartCompras;
