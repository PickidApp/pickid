import type { UseQueryResult } from '@tanstack/react-query';
import type { DashboardSummary } from '@/services/dashboard.service';
import { FlaskConical, Users, MessageSquare, TrendingUp, Clock } from 'lucide-react';

interface DashboardSummarySectionProps {
	query: UseQueryResult<DashboardSummary, Error>;
}

export function DashboardSummarySection(props: DashboardSummarySectionProps) {
	const { query } = props;

	if (query.isLoading) {
		return (
			<div className="grid grid-cols-5 gap-6 mb-8">
				{[...Array(5)].map((_, i) => (
					<div key={i} className="bg-white border border-neutral-200 rounded-lg p-6 animate-pulse">
						<div className="h-10 bg-neutral-200 rounded-lg mb-4"></div>
						<div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
						<div className="h-8 bg-neutral-200 rounded w-1/2"></div>
					</div>
				))}
			</div>
		);
	}

	if (query.isError) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
				<p className="text-red-600">대시보드 요약 데이터를 불러오는데 실패했습니다.</p>
			</div>
		);
	}

	const { data } = query;

	if (!data) return null;

	const completionRate =
		data.total_sessions > 0 ? ((data.completed_sessions / data.total_sessions) * 100).toFixed(1) : '0.0';

	const kpiCards = [
		{
			icon: FlaskConical,
			title: '전체 테스트',
			value: data.total_sessions.toLocaleString(),
		},
		{
			icon: Users,
			title: '총 사용자',
			value: data.new_users.toLocaleString(),
		},
		{
			icon: MessageSquare,
			title: '총 응답',
			value: data.completed_sessions.toLocaleString(),
		},
		{
			icon: TrendingUp,
			title: '완료율',
			value: `${completionRate}%`,
		},
		{
			icon: Clock,
			title: '신규 피드백',
			value: data.new_feedback.toLocaleString(),
		},
	];

	return (
		<div className="grid grid-cols-5 gap-6 mb-8">
			{kpiCards.map((card, index) => {
				const Icon = card.icon;
				return (
					<div key={index} className="bg-white border border-neutral-200 rounded-lg p-6">
						<div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">
							<Icon className="w-5 h-5 text-neutral-900" />
						</div>
						<p className="text-sm text-neutral-500 mb-1">{card.title}</p>
						<p className="text-2xl text-neutral-900">{card.value}</p>
					</div>
				);
			})}
		</div>
	);
}
