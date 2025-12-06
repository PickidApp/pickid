import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CHART_DEFAULT_COLORS } from '@/constants/chart';

interface BarConfig {
	dataKey: string;
	name: string;
	color?: string;
}

interface DefaultBarChartProps {
	data: Record<string, any>[];
	bars: BarConfig[];
	xAxisKey?: string;
	height?: number;
	showGrid?: boolean;
	showLegend?: boolean;
	showTooltip?: boolean;
	barRadius?: [number, number, number, number];
	margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

export function DefaultBarChart({
	data,
	bars,
	xAxisKey = 'date',
	height = 288,
	showGrid = true,
	showLegend = true,
	showTooltip = true,
	barRadius = [2, 2, 0, 0],
	margin = { top: 5, right: 30, left: 20, bottom: 5 },
}: DefaultBarChartProps) {
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
				<BarChart data={data} margin={margin}>
					{showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />}
					<XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} stroke="#737373" />
					<YAxis tick={{ fontSize: 12 }} stroke="#737373" />
					{showTooltip && <Tooltip />}
					{showLegend && <Legend />}
					{bars.map((bar, idx) => (
						<Bar
							key={bar.dataKey}
							dataKey={bar.dataKey}
							name={bar.name}
							fill={bar.color ?? CHART_DEFAULT_COLORS[idx % CHART_DEFAULT_COLORS.length]}
							radius={barRadius}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
