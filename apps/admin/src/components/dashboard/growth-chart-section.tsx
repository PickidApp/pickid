import type { ChannelShare } from '@pickid/supabase';
import type { DailyGrowthPoint } from '@/types/dashboard';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { DefaultLineChart, EmptyState } from '@/components/common';
import { DASHBOARD_COLORS } from '@/constants';
import { formatNumber, getActiveFilterDays } from '@/utils';
import { Button } from '@pickid/ui';

interface GrowthChartSectionProps {
	growthData: DailyGrowthPoint[];
	channelData: ChannelShare[];
	dateRange: string;
	onQuickFilter: (days: number) => void;
}

export function GrowthChartSection(props: GrowthChartSectionProps) {
	const { growthData, channelData, dateRange, onQuickFilter } = props;

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
							text="30일"
						/>
						<Button
							onClick={() => onQuickFilter(90)}
							size="sm"
							variant={activeFilter === 90 ? 'default' : 'ghost'}
							className={activeFilter === 90 ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'text-neutral-600'}
							text="90일"
						/>
						<Button
							onClick={() => onQuickFilter(365)}
							size="sm"
							variant={activeFilter === 365 ? 'default' : 'ghost'}
							className={activeFilter === 365 ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'text-neutral-600'}
							text="1년"
						/>
					</div>
				</div>
				<DefaultLineChart
					data={growthData}
					lines={[
						{ dataKey: 'new_users', name: '신규 사용자', color: '#171717' },
						{ dataKey: 'completed_sessions', name: '응답 수', color: '#737373' },
					]}
					xAxisKey="date"
					height={256}
					dotRadius={0}
				/>
			</div>

			{/* 채널별 유입 비율 */}
			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<div className="mb-6">
					<h3 className="text-lg text-neutral-900">채널별 유입</h3>
					<p className="text-sm text-neutral-500 mt-1">트래픽 소스 분석</p>
				</div>
				{channelData.length === 0 && <EmptyState message="채널 데이터가 없습니다" className="h-48 mb-6" />}
				{channelData.length > 0 && (
					<>
						<div className="h-48 mb-6">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={channelData as any}
										cx="50%"
										cy="50%"
										labelLine={false}
										outerRadius={60}
										fill="#8884d8"
										dataKey="sessions"
									>
										{channelData.map((entry, index) => (
											<Cell key={`cell-${entry.channel}`} fill={DASHBOARD_COLORS[index % DASHBOARD_COLORS.length]} />
										))}
									</Pie>
									<Tooltip formatter={(value: number) => formatNumber(value)} />
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div className="space-y-3">
							{channelData.map((entry, index) => {
								const total = channelData.reduce((sum, e) => sum + e.sessions, 0);
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
