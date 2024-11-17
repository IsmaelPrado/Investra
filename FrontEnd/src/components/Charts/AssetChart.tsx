import React, { useEffect, useRef, useState } from "react";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title } from "chart.js";
import 'chartjs-adapter-date-fns'; // Asegúrate de instalar esta librería
import { format } from 'date-fns';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title);

interface AssetChartProps {
    asset: {
        name: string;
        prices: number[];
        timestamps: string[];
    };
}

const AssetChart: React.FC<AssetChartProps> = ({ asset }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const [absoluteChange, setAbsoluteChange] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);

    useEffect(() => {
        const canvas = chartRef.current;

        if (canvas) {
            const ctx = canvas.getContext("2d");

            if (ctx) {
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }

                // Formatear las fechas a un formato deseado
                const formattedTimestamps = asset.timestamps.map(ts => format(new Date(ts), 'dd/MM/yyyy HH:mm'));

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: formattedTimestamps,
                        datasets: [{
                            label: asset.name,
                            data: asset.prices,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            fill: false,
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Time',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Price',
                                },
                                beginAtZero: true,
                            },
                        },
                    },
                });
            }
        }

        // Calcular rendimiento absoluto y porcentual
        const absChange = calculateAbsoluteChange(asset.prices);
        const percChange = calculatePercentageChange(asset.prices);
        setAbsoluteChange(absChange);
        setPercentageChange(percChange);

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [asset]);

    const calculateAbsoluteChange = (prices: string | any[]) => {
        if (prices.length < 2) return 0; 
        return prices[prices.length - 1] - prices[0]; 
    };

    const calculatePercentageChange = (prices: string | any[]) => {
        if (prices.length < 2) return 0; 
        const absoluteChange = calculateAbsoluteChange(prices);
        return (absoluteChange / prices[0]) * 100; 
    };

    return (
        <div>
            <canvas ref={chartRef} style={{ height: "400px", width: "100%" }} />
            <div>
                <h3>Rendimiento del Activo</h3>
                <p>Cambio absoluto: {absoluteChange.toFixed(2)} </p>
                <p>Cambio porcentual: {percentageChange.toFixed(2)}%</p>
            </div>
        </div>
    );
};

export default AssetChart;
