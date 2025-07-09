'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { name: '1월', total: 15000000 },
  { name: '2월', total: 18000000 },
  { name: '3월', total: 16500000 },
  { name: '4월', total: 21000000 },
  { name: '5월', total: 19500000 },
  { name: '6월', total: 23000000 },
  { name: '7월', total: 25000000 },
  { name: '8월', total: 24000000 },
  { name: '9월', total: 22000000 },
  { name: '10월', total: 26000000 },
  { name: '11월', total: 28000000 },
  { name: '12월', total: 30000000 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
        />
        <Tooltip
          formatter={(value: number) => `${value.toLocaleString()}원`}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
} 