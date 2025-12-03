import type { UseQueryResult } from '@tanstack/react-query';
import type { DailyGrowthPoint, ChannelSharePoint } from '@/services/dashboard.service';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';
import { DASHBOARD_COLORS } from '@/constants';
import { formatDateShort, formatDateKorean, formatNumber } from '@/utils';
import { getActiveFilterDays } from '@/utils';
import { Button } from '@pickid/ui';

interface GrowthChartSectionProps {
	growthQuery: UseQueryResult<DailyGrowthPoint[], Error>;
	channelQuery: UseQueryResult<ChannelSharePoint[], Error>;
	dateRange: { from: Date; to: Date };
	onQuickFilter: (days: number) => void;
}

export function GrowthChartSection(props: GrowthChartSectionProps) {
	const { growthQuery, channelQuery, dateRange, onQuickFilter } = props;

	const activeFilter = getActiveFilterDays(dateRange);

	return (
		<div className="grid grid-cols-3 gap-6 mb-8">
			{/* 일별 성장 차트 */}
			<div className="col-span-2 bg-white border border-neutral-200 rounded-lg p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg text-neutral-900">일별 성장 추이</h3>
						<p className="text-sm text-neutral-500 mt-1">최근 30일간 사용자 및 응답 데이터</p>
					</div>
					<div className="flex gap-2">
						<Button
							onClick={() => onQuickFilter(30)}
							size="sm"
							variant={activeFilter === 30 ? 'default' : 'ghost'}
							className={activeFilter === 30 ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'text-neutral-600'}
						>
							30일
						</Button>
						<Button
							onClick={() => onQuickFilter(90)}
							size="sm"
							variant={activeFilter === 90 ? 'default' : 'ghost'}
							className={activeFilter === 90 ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'text-neutral-600'}
						>
							90일
						</Button>
						<Button
							onClick={() => onQuickFilter(365)}
							size="sm"
							variant={activeFilter === 365 ? 'default' : 'ghost'}
							className={activeFilter === 365 ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'text-neutral-600'}
						>
							1년
						</Button>
					</div>
				</div>
				{growthQuery.isLoading && (
					<div className="h-64 bg-neutral-50 rounded flex items-center justify-center">
						<p className="text-neutral-400">로딩 중...</p>
					</div>
				)}
				{growthQuery.isError && (
					<div className="h-64 flex items-center justify-center text-red-600">데이터를 불러오는데 실패했습니다.</div>
				)}
				{growthQuery.data && (
					<>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={growthQuery.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
									<XAxis dataKey="date" tickFormatter={(value) => formatDateShort(value)} stroke="#737373" />
									<YAxis stroke="#737373" />
									<Tooltip
										labelFormatter={(value) => formatDateKorean(value as string)}
										formatter={(value: number) => formatNumber(value)}
									/>
									<Line
										type="monotone"
										dataKey="new_users"
										stroke="#171717"
										name="신규 사용자"
										strokeWidth={2}
										dot={false}
									/>
									<Line
										type="monotone"
										dataKey="completed_sessions"
										stroke="#737373"
										name="응답 수"
										strokeWidth={2}
										dot={false}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
						<div className="flex items-center justify-center gap-6 mt-4">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-neutral-900 rounded-full"></div>
								<span className="text-xs text-neutral-600">신규 사용자</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-neutral-400 rounded-full"></div>
								<span className="text-xs text-neutral-600">응답 수</span>
							</div>
						</div>
					</>
				)}
			</div>

			{/* 채널별 유입 비율 */}
			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<div className="mb-6">
					<h3 className="text-lg text-neutral-900">채널별 유입</h3>
					<p className="text-sm text-neutral-500 mt-1">트래픽 소스 분석</p>
				</div>
				{channelQuery.isLoading && (
					<div className="h-48 bg-neutral-50 rounded flex items-center justify-center mb-6">
						<p className="text-neutral-400">로딩 중...</p>
					</div>
				)}
				{channelQuery.isError && (
					<div className="h-48 flex items-center justify-center text-red-600 mb-6">
						데이터를 불러오는데 실패했습니다.
					</div>
				)}
				{channelQuery.data && channelQuery.data.length === 0 && (
					<div className="h-48 flex items-center justify-center text-neutral-500 mb-6">채널 데이터가 없습니다</div>
				)}
				{channelQuery.data && channelQuery.data.length > 0 && (
					<>
						<div className="h-48 mb-6">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={channelQuery.data as any}
										cx="50%"
										cy="50%"
										labelLine={false}
										outerRadius={60}
										fill="#8884d8"
										dataKey="sessions"
									>
										{channelQuery.data.map((entry, index) => (
											<Cell key={`cell-${entry.channel}`} fill={DASHBOARD_COLORS[index % DASHBOARD_COLORS.length]} />
										))}
									</Pie>
									<Tooltip formatter={(value: number) => formatNumber(value)} />
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div className="space-y-3">
							{channelQuery.data.map((entry, index) => {
								const total = channelQuery.data.reduce((sum, e) => sum + e.sessions, 0);
								const percentage = total > 0 ? ((entry.sessions / total) * 100).toFixed(1) : '0';
								return (
									<div key={entry.channel} className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: DASHBOARD_COLORS[index % DASHBOARD_COLORS.length] }}
											></div>
											<span className="text-sm text-neutral-600">{entry.channel}</span>
										</div>
										<span className="text-sm text-neutral-900">{percentage}%</span>
									</div>
								);
							})}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
