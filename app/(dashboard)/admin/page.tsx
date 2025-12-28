"use client";
import { DashboardSidebar, StatsElement, SalesChart, CategoryPieChart } from "@/components";
import React from "react";

const AdminDashboardPage = () => {
  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col items-center ml-5 p-5 gap-y-8 w-full max-xl:ml-0 max-xl:px-4 max-xl:mt-5 max-md:gap-y-6">

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4">
          <StatsElement
            title="Khách truy cập"
            value="1,200"
            percentage="12.5%"
            color="bg-blue-600"
          />
          <StatsElement
            title="Sản phẩm mới"
            value="2,230"
            percentage="12.5%"
            color="bg-blue-500"
          />
          <StatsElement
            title="Đơn hàng"
            value="156"
            percentage="8.2%"
            color="bg-indigo-500"
          />
          <StatsElement
            title="Doanh thu"
            value="$42,500"
            percentage="5.4%"
            color="bg-violet-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          <SalesChart />
          <CategoryPieChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
