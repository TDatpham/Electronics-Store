"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesChart = () => {
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState<{ name: string, quantity: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        fetch("http://localhost:3001/api/orders/sales-statistics")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    // Filter out any invalid items just in case
                    const cleanData = data.filter(item => item && typeof item.name === 'string');
                    setStats(cleanData);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("SalesChart Error:", err);
                setLoading(false);
            });
    }, []);

    // Don't render anything until mounted to avoid hydration/render order issues
    if (!mounted) return <div className="h-[400px] w-full bg-gray-50 rounded-xl animate-pulse" />;

    if (loading) return (
        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-center items-center h-[400px]">
            <div className="flex flex-col items-center gap-2">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-gray-500 animate-pulse">Đang tải biểu đồ...</p>
            </div>
        </div>
    );

    if (stats.length === 0) return (
        <div className="w-full bg-white p-10 rounded-xl shadow-sm border border-dashed border-gray-300 flex flex-col items-center justify-center h-[400px]">
            <p className="text-gray-500 text-lg font-medium">Chưa có dữ liệu bán hàng.</p>
            <p className="text-gray-400 text-sm mt-1">Dữ liệu sẽ hiển thị sau khi có đơn hàng được tạo.</p>
        </div>
    );

    const chartOptions = {
        chart: {
            id: "sales-chart",
            toolbar: {
                show: false
            },
            animations: {
                enabled: true
            }
        },
        xaxis: {
            categories: stats.map(s => s.name || "Unknown"),
            labels: {
                rotate: -45,
                style: {
                    colors: "#6b7280",
                    fontSize: "11px"
                }
            }
        },
        yaxis: {
            title: {
                text: 'Số lượng'
            },
            labels: {
                formatter: (val: number) => Math.floor(val).toString()
            }
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} sản phẩm`
            }
        },
        colors: ["#3b82f6"],
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
                columnWidth: '55%'
            }
        },
        dataLabels: {
            enabled: false
        },
        title: {
            text: "Top 5 Sản phẩm Bán chạy nhất",
            align: "left" as const,
            style: {
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827"
            }
        },
        grid: {
            borderColor: '#f3f4f6',
        }
    };

    const chartSeries = [
        {
            name: "Số lượng đã bán",
            data: stats.map(s => s.quantity || 0)
        }
    ];

    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md h-[400px]">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height="100%"
                width="100%"
            />
        </div>
    );
};

export default SalesChart; 
