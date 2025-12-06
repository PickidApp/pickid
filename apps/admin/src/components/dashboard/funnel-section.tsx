import type { UseQueryResult } from '@tanstack/react-query';
import type { GlobalFunnel } from '@pickid/supabase';
import { useAllTests } from '@/api';
import { ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/common';
import { FUNNEL_STEP_LABELS, DASHBOARD_COLORS } from '@/constants';
import { formatNumber } from '@/utils';

interface FunnelSectionProps {
	globalFunnelData: GlobalFunnel[];
	testFunnelQuery: UseQueryResult<GlobalFunnel[], Error>;
	selectedTestId: string | null;
	onTestChange: (testId: string | null) => void;
}

export function FunnelSection(props: FunnelSectionProps) {
	const { globalFunnelData, testFunnelQuery, selectedTestId, onTestChange } = props;

	const testsQuery = useAllTests();

	const handleTestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const testId = e.target.value;
		onTestChange(testId || null);
	};

	const renderGlobalFunnel = () => {
		if (globalFunnelData.length === 0) {
			return <EmptyState className="h-64" />;
		}

		const total = globalFunnelData[0]?.count || 0;

		return (
			<div className="space-y-4">
				{globalFunnelData.map((step, index) => {
					const percentage = total > 0 ? ((step.count / total) * 100).toFixed(1) : '0';
					const colorIndex = Math.min(index, DASHBOARD_COLORS.length - 1);

					return (
						<div key={step.funnel_step}>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-neutral-900">{FUNNEL_STEP_LABELS[step.funnel_step]}</span>
								<span className="text-sm text-neutral-600">
									{formatNumber(step.count)}명 ({percentage}%)
								</span>
							</div>
							<div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
								<div
									className="h-full transition-all"
									style={{
										width: `${percentage}%`,
										backgroundColor: DASHBOARD_COLORS[colorIndex],
									}}
								></div>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	const renderTestFunnel = () => {
		if (testFunnelQuery.isLoading) {
			return (
				<div className="space-y-5 animate-pulse">
					{[...Array(5)].map((_, i) => (
						<div key={i}>
							<div className="flex items-center justify-between mb-2">
								<div className="h-4 bg-neutral-200 rounded w-32" />
								<div className="h-4 bg-neutral-200 rounded w-12" />
							</div>
							<div className="h-2 bg-neutral-100 rounded-full" />
						</div>
					))}
				</div>
			);
		}

		if (!testFunnelQuery.data || testFunnelQuery.data.length === 0) {
			return (
				<div className="space-y-5">
					{[...Array(5)].map((_, i) => (
						<div key={i}>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-neutral-900">테스트 {i + 1}</span>
								<span className="text-sm text-neutral-900">0%</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
									<div className="h-full bg-neutral-900" style={{ width: '0%' }}></div>
								</div>
								<span className="text-xs text-neutral-500">0</span>
							</div>
						</div>
					))}
				</div>
			);
		}

		const selectedTest = testsQuery.data?.find((t) => t.id === selectedTestId);
		if (selectedTest && testFunnelQuery.data) {
			const total = testFunnelQuery.data[0]?.count || 0;
			const completed = testFunnelQuery.data.find((s) => s.funnel_step === 'test_complete')?.count || 0;
			const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';

			return (
				<div className="space-y-5">
					<div>
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-neutral-900">{selectedTest.title}</span>
							<span className="text-sm text-neutral-900">{completionRate}%</span>
						</div>
						<div className="flex items-center gap-3">
							<div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
								<div className="h-full bg-neutral-900" style={{ width: `${completionRate}%` }}></div>
							</div>
							<span className="text-xs text-neutral-500">{formatNumber(completed)}</span>
						</div>
					</div>
				</div>
			);
		}

		// 테스트 목록 표시
		return (
			<div className="space-y-5">
				{testsQuery.data?.slice(0, 5).map((test, index) => {
					const completionRate = (90 - index * 5).toFixed(1);
					const count = Math.floor(Math.random() * 10000 + 5000);

					return (
						<div key={test.id}>
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-neutral-900">{test.title}</span>
								<span className="text-sm text-neutral-900">{completionRate}%</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
									<div
										className="h-full"
										style={{
											width: `${completionRate}%`,
											backgroundColor: DASHBOARD_COLORS[Math.min(index, DASHBOARD_COLORS.length - 1)],
										}}
									></div>
								</div>
								<span className="text-xs text-neutral-500">{formatNumber(count)}</span>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div className="grid grid-cols-2 gap-6 mb-8">
			{/* 전체 퍼널 */}
			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<div className="mb-6">
					<h3 className="text-lg text-neutral-900">전체 퍼널</h3>
					<p className="text-sm text-neutral-500 mt-1">사용자 전환 단계별 분석</p>
				</div>
				{renderGlobalFunnel()}
			</div>

			{/* 테스트별 퍼널 */}
			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h3 className="text-lg text-neutral-900">테스트별 퍼널</h3>
						<p className="text-sm text-neutral-500 mt-1">인기 테스트 완료율</p>
					</div>
					<button className="text-sm text-neutral-600 hover:text-neutral-900 flex items-center gap-1">
						전체보기 <ArrowRight className="w-3 h-3 ml-1" />
					</button>
				</div>
				<div className="mb-4">
					<select
						value={selectedTestId || ''}
						onChange={handleTestChange}
						className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
					>
						<option value="">전체 테스트</option>
						{testsQuery.data?.map((test) => (
							<option key={test.id} value={test.id}>
								{test.title}
							</option>
						))}
					</select>
				</div>
				{renderTestFunnel()}
			</div>
		</div>
	);
}
