import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestPerformanceSummaryQuery, useTestPerformanceListQuery } from '@/api';
import {
	DATE_RANGE_OPTIONS,
	ANALYTICS_TABS,
	ANALYTICS_SORT_OPTIONS,
	TEST_ANALYTICS_GUIDES,
	type DateRangeOption,
	type AnalyticsTab,
	type AnalyticsSortOption,
} from '@/constants/analytics';
import { TEST_TYPES, TEST_STATUSES } from '@/constants/test';
import { AnalysisGuideTooltip, ProgressBar } from '@/components/common';
import { StatCard } from '@/components/common/stat-card';
import { TestCompareEmpty, TestCompareContent } from '@/components/analytics';
import { getTestTypeLabel, getTestStatusLabel, getTestStatusVariant, getTestTypeVariant } from '@/utils/test';
import { formatDate, formatTime, getDateRangeParams } from '@/utils/format';
import { getCompletionRateColor } from '@/utils/analytics';
import type { TestType, TestStatus } from '@pickid/supabase';
import type { IFetchTestPerformanceOptions, TestPerformanceItem } from '@/types/test-analytics';
import { Badge, DefaultTable, DefaultSelect, DefaultPagination, SearchInput, Button, type DefaultTableColumn } from '@pickid/ui';
import { BarChart3, Clock } from 'lucide-react';

export function AnalyticsPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<AnalyticsTab>('list');
	const [dateRange, setDateRange] = useState<DateRangeOption>('30d');
	const [search, setSearch] = useState('');
	const [typeFilter, setTypeFilter] = useState<TestType[]>([]);
	const [statusFilter, setStatusFilter] = useState<TestStatus[]>([]);
	const [sortBy, setSortBy] = useState<AnalyticsSortOption>('responses');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedTests, setSelectedTests] = useState<string[]>([]);
	const pageSize = 20;

	const dateParams = useMemo(() => getDateRangeParams(dateRange), [dateRange]);

	const listOptions: IFetchTestPerformanceOptions = useMemo(
		() => ({
			type: typeFilter[0] || undefined,
			status: statusFilter[0] || undefined,
			search: search || undefined,
			sortBy: sortBy === 'avgTime' ? 'completionRate' : sortBy,
			sortOrder: 'desc',
			page: currentPage,
			pageSize,
		}),
		[typeFilter, statusFilter, search, sortBy, currentPage]
	);

	const { data: summary, isLoading: summaryLoading } = useTestPerformanceSummaryQuery(dateParams);
	const { data: listData, isLoading: listLoading } = useTestPerformanceListQuery(dateParams, listOptions);

	const totalPages = Math.ceil((listData?.count || 0) / pageSize);

	const statCards = useMemo(
		() => [
			{ label: '전체 테스트', value: summary?.totalTests ?? '-' },
			{ label: '발행됨', value: summary?.publishedCount ?? '-', color: 'green' as const },
			{ label: '초안', value: summary?.draftCount ?? '-', color: 'gray' as const },
			{ label: '예약됨', value: summary?.scheduledCount ?? '-', color: 'blue' as const },
			{ label: '총 응답수', value: summary?.totalResponses?.toLocaleString() ?? '-', dividerBefore: true },
			{
				label: '평균 완료율',
				value: summary?.avgCompletionRate !== undefined ? `${summary.avgCompletionRate}%` : '-',
				color: summary?.avgCompletionRate ? getCompletionRateColor(summary.avgCompletionRate) : ('default' as const),
			},
		],
		[summary]
	);

	const handleRowClick = (row: TestPerformanceItem) => {
		navigate(`/analytics/tests/${row.id}`);
	};

	const handleDateRangeChange = (value: string) => {
		setDateRange(value as DateRangeOption);
		setCurrentPage(1);
	};

	const handleSearch = (value: string) => {
		setSearch(value);
		setCurrentPage(1);
	};

	const handleSortChange = (value: string) => {
		setSortBy(value as AnalyticsSortOption);
		setCurrentPage(1);
	};

	const handleTestSelect = (testId: string, checked: boolean) => {
		if (checked) {
			setSelectedTests((prev) => [...prev, testId]);
		} else {
			setSelectedTests((prev) => prev.filter((id) => id !== testId));
		}
	};

	const handleCompareTests = () => {
		if (selectedTests.length >= 2) {
			setActiveTab('comparison');
		}
	};

	const columns: DefaultTableColumn<TestPerformanceItem>[] = [
		{
			key: 'select',
			header: '',
			width: 40,
			renderCell: (row: TestPerformanceItem) => (
				<input
					type="checkbox"
					checked={selectedTests.includes(row.id)}
					onChange={(e) => handleTestSelect(row.id, e.target.checked)}
					onClick={(e) => e.stopPropagation()}
					className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-500"
				/>
			),
		},
		{
			key: 'title',
			header: '테스트',
			renderCell: (row: TestPerformanceItem) => (
				<div className="max-w-[280px]">
					<div className="font-medium text-neutral-900 truncate">{row.title}</div>
					{row.description && <div className="text-xs text-neutral-500 truncate mt-0.5">{row.description}</div>}
				</div>
			),
		},
		{
			key: 'type',
			header: '타입',
			filterOptions: TEST_TYPES,
			filterValue: typeFilter,
			onFilterChange: (values) => {
				setTypeFilter(values as TestType[]);
				setCurrentPage(1);
			},
			renderCell: (row: TestPerformanceItem) => (
				<Badge variant={getTestTypeVariant(row.type)}>{getTestTypeLabel(row.type)}</Badge>
			),
		},
		{
			key: 'status',
			header: '상태',
			filterOptions: TEST_STATUSES,
			filterValue: statusFilter,
			onFilterChange: (values) => {
				setStatusFilter(values as TestStatus[]);
				setCurrentPage(1);
			},
			renderCell: (row: TestPerformanceItem) => (
				<Badge variant={getTestStatusVariant(row.status)}>{getTestStatusLabel(row.status)}</Badge>
			),
		},
		{
			key: 'categories',
			header: '카테고리',
			renderCell: (row: TestPerformanceItem) =>
				row.categories.length > 0 ? (
					<div className="flex flex-wrap gap-1 max-w-[150px]">
						{row.categories.slice(0, 2).map((cat) => (
							<Badge key={cat.id} variant="secondary" className="text-xs">
								{cat.name}
							</Badge>
						))}
						{row.categories.length > 2 && (
							<span className="text-xs text-neutral-400">+{row.categories.length - 2}</span>
						)}
					</div>
				) : (
					<span className="text-xs text-neutral-400">-</span>
				),
		},
		{
			key: 'totalResponses',
			header: '응답수',
			renderCell: (row: TestPerformanceItem) => (
				<div className="flex items-center gap-1.5">
					<BarChart3 className="w-3.5 h-3.5 text-neutral-400" />
					<span className="font-medium">{row.totalResponses.toLocaleString()}</span>
				</div>
			),
		},
		{
			key: 'completionRate',
			header: '완료율',
			renderCell: (row: TestPerformanceItem) => (
				<div className="flex items-center gap-2">
					<ProgressBar value={row.completionRate} color={getCompletionRateColor(row.completionRate)} className="w-16" />
					<span className="text-sm font-medium w-10">{row.completionRate}%</span>
				</div>
			),
		},
		{
			key: 'avgCompletionTime',
			header: '평균 소요시간',
			renderCell: (row: TestPerformanceItem) => (
				<div className="flex items-center gap-1.5 text-neutral-600">
					<Clock className="w-3.5 h-3.5" />
					<span className="text-sm">{formatTime(row.avgCompletionTime)}</span>
				</div>
			),
		},
		{
			key: 'lastResponseAt',
			header: '최근 응답',
			renderCell: (row: TestPerformanceItem) => (
				<span className="text-sm text-neutral-500">{row.lastResponseAt ? formatDate(row.lastResponseAt) : '-'}</span>
			),
		},
	];

	return (
		<>
			<header className="bg-white border-b px-6 py-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						<h1 className="text-2xl text-neutral-900">테스트 성과 분석</h1>
						<span className="text-sm text-neutral-500">총 {listData?.count ?? 0}개</span>
					</div>
					<div className="flex items-center gap-2">
						<SearchInput value={search} onSearch={handleSearch} placeholder="테스트명 검색..." className="w-64" />
						<DefaultSelect
							value={sortBy}
							onValueChange={handleSortChange}
							options={ANALYTICS_SORT_OPTIONS}
							placeholder="정렬"
							className="w-32"
						/>
						<DefaultSelect
							value={dateRange}
							onValueChange={handleDateRangeChange}
							options={DATE_RANGE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
							placeholder="기간 선택"
							className="w-36"
						/>
						{selectedTests.length >= 2 && (
							<Button variant="outline" size="sm" onClick={handleCompareTests}>
								{selectedTests.length}개 테스트 비교
							</Button>
						)}
					</div>
				</div>
			</header>

			<main className="p-6 space-y-6">
				<div className="border-b border-neutral-200">
					<div className="flex items-end gap-3">
						<div className="flex gap-6">
							{ANALYTICS_TABS.map((tab) => (
								<button
									key={tab.value}
									onClick={() => setActiveTab(tab.value as AnalyticsTab)}
									className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
										activeTab === tab.value
											? 'text-neutral-900 border-neutral-900'
											: 'text-neutral-500 border-transparent hover:text-neutral-700'
									}`}
								>
									{tab.label}
								</button>
							))}
						</div>
						<div className="pb-3">
							<AnalysisGuideTooltip {...TEST_ANALYTICS_GUIDES[activeTab]} />
						</div>
					</div>
				</div>

				{activeTab === 'list' && (
					<>
						<div className="flex flex-wrap gap-3">
							{statCards.map(({ dividerBefore, ...cardProps }) => (
								<div key={cardProps.label} className="flex items-center gap-3">
									{dividerBefore && <div className="border-l border-neutral-200 h-12" />}
									<StatCard {...cardProps} />
								</div>
							))}
						</div>

						<DefaultTable
							columns={columns}
							data={listData?.tests || []}
							isLoading={listLoading || summaryLoading}
							emptyMessage="해당 조건의 테스트가 없습니다"
							onRowClick={handleRowClick}
						/>

						{totalPages > 1 && (
							<div className="mt-6 flex justify-center">
								<DefaultPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
							</div>
						)}
					</>
				)}

				{activeTab === 'comparison' &&
					(selectedTests.length < 2 ? (
						<TestCompareEmpty />
					) : (
						<TestCompareContent testIds={selectedTests} dateParams={dateParams} />
					))}
			</main>
		</>
	);
}
