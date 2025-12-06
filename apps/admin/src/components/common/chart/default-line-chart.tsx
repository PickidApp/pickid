import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CHART_DEFAULT_COLORS } from '@/constants/chart';

interface LineConfig {
	dataKey: string;
	name: string;
	color?: string;
}

interface DefaultLineChartProps {
	data: Record<string, any>[];
	lines: LineConfig[];
	xAxisKey?: string;
	height?: number;
	showGrid?: boolean;
	showLegend?: boolean;
	showTooltip?: boolean;
	strokeWidth?: number;
	dotRadius?: number;
	margin?: { top?: number; right?: number; bottom?: number; left?: number };
}

export function DefaultLineChart({
	data,
	lines,
	xAxisKey = 'date',
	height = 288,
	showGrid = true,
	showLegend = true,
	showTooltip = true,
	strokeWidth = 2,
	dotRadius = 3,
	margin = { top: 5, right: 30, left: 20, bottom: 5 },
}: DefaultLineChartProps) {
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
				<LineChart data={data} margin={margin}>
					{showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />}
					<XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} stroke="#737373" />
					<YAxis tick={{ fontSize: 12 }} stroke="#737373" />
					{showTooltip && <Tooltip />}
					{showLegend && <Legend />}
					{lines.map((line, idx) => (
						<Line
							key={line.dataKey}
							type="monotone"
							dataKey={line.dataKey}
							name={line.name}
							stroke={line.color ?? CHART_DEFAULT_COLORS[idx % CHART_DEFAULT_COLORS.length]}
							strokeWidth={strokeWidth}
							dot={{ r: dotRadius }}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
