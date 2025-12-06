import { useState, useEffect } from 'react';
import type { DashboardSummary } from '@pickid/supabase';
import { PlayCircle, CheckCircle, TrendingUp, FileText, Share2, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@pickid/ui';

interface DashboardSummarySectionProps {
	data: DashboardSummary;
}

const STORAGE_KEY = 'dashboard_extended_kpi_visible';

export function DashboardSummarySection({ data }: DashboardSummarySectionProps) {
	const [showExtendedKpi, setShowExtendedKpi] = useState(() => {
		if (typeof window === 'undefined') return false;
		return localStorage.getItem(STORAGE_KEY) === 'true';
	});

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, String(showExtendedKpi));
	}, [showExtendedKpi]);

	const completionRate =
		data.total_sessions > 0 ? ((data.completed_sessions / data.total_sessions) * 100).toFixed(1) : '0.0';

	const coreKpiCards = [
		{
			icon: FileText,
			title: '활성 테스트',
			value: data.published_tests?.toLocaleString() ?? '0',
			color: 'bg-blue-50 text-blue-600',
		},
		{
			icon: PlayCircle,
			title: '오늘 응답',
			value: data.total_sessions.toLocaleString(),
			color: 'bg-green-50 text-green-600',
		},
		{
			icon: CheckCircle,
			title: '오늘 완료',
			value: data.completed_sessions.toLocaleString(),
			color: 'bg-purple-50 text-purple-600',
		},
		{
			icon: TrendingUp,
			title: '완료율',
			value: `${completionRate}%`,
			color: 'bg-orange-50 text-orange-600',
		},
	];

	const extendedKpiCards = [
		{
			icon: Share2,
			title: '오늘 공유 수',
			value: data.today_shares?.toLocaleString() ?? '0',
			color: 'bg-pink-50 text-pink-600',
		},
		{
			icon: BarChart3,
			title: '세션당 테스트',
			value: data.avg_tests_per_session?.toFixed(2) ?? '0',
			color: 'bg-cyan-50 text-cyan-600',
		},
	];

	const handleToggle = () => {
		setShowExtendedKpi((prev) => !prev);
	};

	const visibleCards = showExtendedKpi ? [...coreKpiCards, ...extendedKpiCards] : coreKpiCards;

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-medium text-neutral-900">핵심 KPI</h2>
				<Button variant="ghost" size="sm" onClick={handleToggle} className="text-neutral-500 hover:text-neutral-700">
					{showExtendedKpi ? (
						<>
							<ChevronUp className="w-4 h-4 mr-1" />
							확장 지표 숨기기
						</>
					) : (
						<>
							<ChevronDown className="w-4 h-4 mr-1" />
							확장 지표 보기
						</>
					)}
				</Button>
			</div>

			<div className={`grid gap-4 ${showExtendedKpi ? 'grid-cols-6' : 'grid-cols-4'}`}>
				{visibleCards.map((card, index) => {
					const Icon = card.icon;
					return (
						<div key={index} className="bg-white border border-neutral-200 rounded-lg p-5">
							<div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
								<Icon className="w-5 h-5" />
							</div>
							<p className="text-sm text-neutral-500 mb-1">{card.title}</p>
							<p className="text-2xl font-semibold text-neutral-900">{card.value}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
