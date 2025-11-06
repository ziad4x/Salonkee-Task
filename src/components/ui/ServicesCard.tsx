
import React from "react";

interface ServiceCardProps {
    createdAt: string;
    customerName: string;
    service: string;
    duration: number;
}

const ServicesCard = ({ createdAt, customerName, service, duration }: ServiceCardProps) => {
    const colors = ["#F8A975", "#F4E7B3", "#B2B2B2", "#B6D8D1", "#F07686"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const date = new Date(createdAt).toLocaleString();

    return (
        <div
            style={{ backgroundColor: color }}
            className="flex flex-col p-3 gap-1 rounded-lg text-gray-800 shadow-md"
        >
            <div className="text-xs opacity-80">{date}</div>
            <div className="font-semibold text-sm truncate">{customerName}</div>
            <div className="text-sm opacity-90 truncate">{service}</div>
            <div className="text-xs opacity-70">{duration} min</div>
        </div>
    );
};

export default ServicesCard;
