"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CategoryPieChart = () => {
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState<{ name: string, value: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        fetch("http://localhost:3001/api/orders/category-statistics")
            .then((res) => {
                if (!res.ok) throw new Error("Phản hồi server không hợp lệ");
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    // Lọc dữ liệu hợp lệ: value phải là số và lớn hơn 0
                    const cleanData = data.filter(item =>
                        item &&
                        typeof item.name === 'string' &&
                        typeof item.value === 'number' &&
                        item.value >= 0
                    );
                    setStats(cleanData);
                } else {
                    setError("Dữ liệu không đúng định dạng");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("CategoryPieChart Error:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (!mounted) return <div className="h-[400px] w-full bg-gray-50 rounded-xl animate-pulse" />;

    if (loading) return (
        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-center items-center h-[400px]">
            <div className="flex flex-col items-center gap-2">
                <span className="loading loading-spinner loading-lg text-secondary"></span>
                <p className="text-gray-500 animate-pulse">Đang tải biểu đồ...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="w-full bg-white p-10 rounded-xl shadow-sm border border-red-100 flex flex-col items-center justify-center h-[400px]">
            <p className="text-red-500 font-medium text-lg">Lỗi tải dữ liệu.</p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
        </div>
    );

    if (stats.length === 0) return (
        <div className="w-full bg-white p-10 rounded-xl shadow-sm border border-dashed border-gray-300 flex flex-col items-center justify-center h-[400px]">
            <p className="text-gray-500 text-lg font-medium">Chưa có doanh số theo danh mục.</p>
            <p className="text-gray-400 text-sm mt-1">Dữ liệu sẽ hiển thị sau khi có đơn hàng.</p>
        </div>
    );

    // Chuẩn bị dữ liệu cho Pie Chart: Series phải là mảng số
    const chartSeries = stats.map(s => Number(s.value) || 0);
    const chartLabels = stats.map(s => s.name || "Khác");

    const chartOptions = {
        labels: chartLabels,
        chart: {
            id: "category-pie-chart",
            type: 'pie' as const,
        },
        legend: {
            position: 'bottom' as const,
            fontSize: '14px'
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number, opts: any) => {
                return opts.w.config.series[opts.seriesIndex];
            }
        },
        title: {
            text: "Phân bổ Doanh số theo Danh mục",
            align: "left" as const,
            style: {
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827"
            }
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} sản phẩm`
            }
        },
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#3F51B5', '#03A9F4']
    };

    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md h-[400px]">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="pie"
                height="100%"
                width="100%"
            />
        </div>
    );
};

export default CategoryPieChart; 
