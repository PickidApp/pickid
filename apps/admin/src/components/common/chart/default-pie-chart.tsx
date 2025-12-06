import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CHART_DEFAULT_COLORS } from '@/constants/chart';

interface DefaultPieChartProps {
	data: { name: string; value: number }[];
	colors?: string[];
	height?: number;
	innerRadius?: number;
	outerRadius?: number;
	showLegend?: boolean;
	showTooltip?: boolean;
	paddingAngle?: number;
}

export function DefaultPieChart({
	data,
	colors = CHART_DEFAULT_COLORS,
	height = 256,
	innerRadius = 0,
	outerRadius = 80,
	showLegend = true,
	showTooltip = true,
	paddingAngle = 2,
}: DefaultPieChartProps) {
	if (!data || data.length === 0) {
		return (
			<div className="flex items-center justify-center text-neutral-400" style={{ height }}>
				데이터가 없습니다
			</div>
		);
	}

	return (
		<div style={{ height }}>
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={innerRadius}
						outerRadius={outerRadius}
						dataKey="value"
						paddingAngle={paddingAngle}
					>
						{data.map((_, idx) => (
							<Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
						))}
					</Pie>
					{showTooltip && <Tooltip formatter={(value: number) => value.toLocaleString()} />}
					{showLegend && <Legend />}
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
