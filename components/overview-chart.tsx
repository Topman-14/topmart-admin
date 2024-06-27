'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { FC } from "react"

interface OverviewChartProps{
    data: any[]
} 

const OverviewChart: FC<OverviewChartProps> = ({
    data
}) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
            <XAxis 
                dataKey="month"
                stroke="#888"
                tickLine={false}
                axisLine={true}
                fontSize={12}
            />
            <YAxis 
                stroke="#888"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(value)=>`₦${value}`}
            />
            <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
  )
}

export default OverviewChart