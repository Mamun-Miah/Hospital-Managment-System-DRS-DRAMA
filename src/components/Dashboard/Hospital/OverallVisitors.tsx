"use client"

import type React from "react"

export interface OverallVisitorsProps {
  name: string
  value: string | number
  icon: string
  iconBg: string
  bgColor: string 
}

const OverallVisitors: React.FC<OverallVisitorsProps> = ({ name, value, icon, iconBg, bgColor }) => {
  return (
    <div
      className="rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-4"
        style={{ backgroundColor: iconBg }}
      >
        <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
      </div>

      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-600 leading-relaxed">{name}</p>
        <h3 className="text-2xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h3>
      </div>
    </div>
  )
}

export default OverallVisitors
