import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useThemePerformanceQuery, useThemeDailyTrendQuery } from '@/api';
import { ProgressBar, ChartSkeleton, BaseLineChart } from '@/components/common';
import { getCompletionRateColor } from '@/utils/analytics';
import { formatDate } from '@/utils/format';
import { DefaultTable, DefaultSelect, type DefaultTableColumn } from '@pickid/ui';
import type { ThemePerformance, ThemeDailyTrend } from '@/types/test-analytics';
import { BarChart3, CalendarRange } from 'lucide-react';

interface ThemePerformanceContentProps {
	dateParams: { from: string; to: string };
}

export function ThemePerformanceContent({ dateParams }: ThemePerformanceContentProps) {
	const [selectedThemeId, setSelectedThemeId] = useState<string>('');

	const { data: themeList, isLoading: themeListLoading } = useThemePerformanceQuery(dateParams);
	const { data: dailyTrend, isLoading: trendLoading } = useThemeDailyTrendQuery(selectedThemeId, dateParams);

	const themeOptions = useMemo(() => {
		if (!themeList) return [];
		return themeList.map((t) => ({
			value: t.themeId,
			label: t.themeName,
		}));
	}, [themeList]);

	const trendData = useMemo(() => {
		if (!dailyTrend) return [];
		return dailyTrend.map((item: ThemeDailyTrend) => ({
			date: dayjs(item.date).format('MM/DD'),
			응답수: item.responses,
			완료수: item.completions,
		}));
	}, [dailyTrend]);

	const lineConfigs = [
		{ dataKey: '응답수', name: '응답수', color: '#3b82f6' },
		{ dataKey: '완료수', name: '완료수', color: '#10b981' },
	];

	const themeColumns: DefaultTableColumn<ThemePerformance>[] = [
		{
			key: 'themeName',
			header: '테마',
			renderCell: (row: ThemePerformance) => (
				<div>
					<div className="font-medium text-neutral-900">{row.themeName}</div>
					<div className="text-xs text-neutral-400">{row.themeSlug}</div>
				</div>
			),
		},
		{
			key: 'testsCount',
			header: '테스트 수',
			renderCell: (row: ThemePerformance) => <span className="font-medium">{row.testsCount.toLocaleString()}</span>,
		},
		{
			key: 'period',
			header: '캠페인 기간',
			renderCell: (row: ThemePerformance) => {
				if (!row.startDate && !row.endDate) {
					return <span className="text-neutral-400">-</span>;
				}
				return (
					<div className="flex items-center gap-1.5 text-neutral-600">
						<CalendarRange className="w-3.5 h-3.5" />
						<span className="text-sm">
							{row.startDate ? formatDate(row.startDate) : '?'} ~ {row.endDate ? formatDate(row.endDate) : '진행중'}
						</span>
					</div>
				);
			},
		},
		{
			key: 'totalResponses',
			header: '총 응답수',
			renderCell: (row: ThemePerformance) => (
				<div className="flex items-center gap-1.5">
					<BarChart3 className="w-3.5 h-3.5 text-neutral-400" />
					<span className="font-medium">{row.totalResponses.toLocaleString()}</span>
				</div>
			),
		},
		{
			key: 'completionRate',
			header: '완료율',
			renderCell: (row: ThemePerformance) => (
				<div className="flex items-center gap-2">
					<ProgressBar value={row.completionRate} color={getCompletionRateColor(row.completionRate)} className="w-16" />
					<span className="text-sm font-medium w-10">{row.completionRate}%</span>
				</div>
			),
		},
	];

	const handleThemeSelect = (row: ThemePerformance) => {
		setSelectedThemeId(row.themeId);
	};

	if (themeListLoading) {
		return <ChartSkeleton height={400} title="테마별 성과" />;
	}

	return (
		<div className="space-y-6">
			<div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
				<div className="px-6 py-4 border-b border-neutral-200">
					<h4 className="text-sm font-medium text-neutral-700">테마별 성과</h4>
					<p className="text-xs text-neutral-500 mt-1">테마를 클릭하면 일별 트렌드를 확인할 수 있습니다</p>
				</div>
				<DefaultTable
					columns={themeColumns}
					data={themeList || []}
					isLoading={themeListLoading}
					emptyMessage="테마 데이터가 없습니다"
					onRowClick={handleThemeSelect}
				/>
			</div>

			{selectedThemeId && (
				<div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
					<div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
						<div>
							<h4 className="text-sm font-medium text-neutral-700">테마 일별 트렌드</h4>
							<p className="text-xs text-neutral-500 mt-1">캠페인 기간 동안의 응답 추이</p>
						</div>
						<DefaultSelect
							value={selectedThemeId}
							onValueChange={setSelectedThemeId}
							options={themeOptions}
							placeholder="테마 선택"
							className="w-48"
						/>
					</div>
					<div className="p-6">
						{trendLoading ? (
							<ChartSkeleton height={256} />
						) : !trendData || trendData.length === 0 ? (
							<div className="text-center text-neutral-500 py-8">트렌드 데이터가 없습니다</div>
						) : (
							<BaseLineChart data={trendData} lines={lineConfigs} xAxisKey="date" height={288} />
						)}
					</div>
				</div>
			)}
		</div>
	);
}
