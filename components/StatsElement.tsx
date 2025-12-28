import React from "react";
import { FaArrowUp } from "react-icons/fa6";

interface StatsElementProps {
  title: string;
  value: string | number;
  percentage: string;
  color?: string;
}

const StatsElement = ({ title, value, percentage, color = "bg-blue-500" }: StatsElementProps) => {
  return (
    <div className={`w-full h-32 ${color} text-white flex flex-col justify-center items-center rounded-xl shadow-md transition-all hover:scale-[1.02]`}>
      <h4 className="text-lg text-blue-100">{title}</h4>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      <p className="text-green-300 text-sm flex gap-x-1 items-center font-medium">
        <FaArrowUp className="text-xs" />
        {percentage} <span className="text-blue-200 font-normal">Kể từ tháng trước</span>
      </p>
    </div>
  );
};

export default StatsElement;
