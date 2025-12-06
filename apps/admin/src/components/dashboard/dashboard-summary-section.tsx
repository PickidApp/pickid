import type { DashboardSummary } from '@pickid/supabase';
import { PlayCircle, Users, CheckCircle, TrendingUp, MessageSquare } from 'lucide-react';

interface DashboardSummarySectionProps {
	data: DashboardSummary;
}

export function DashboardSummarySection({ data }: DashboardSummarySectionProps) {
	const completionRate =
		data.total_sessions > 0 ? ((data.completed_sessions / data.total_sessions) * 100).toFixed(1) : '0.0';

	const kpiCards = [
		{
			icon: PlayCircle,
			title: '테스트 시작',
			value: data.total_sessions.toLocaleString(),
		},
		{
			icon: CheckCircle,
			title: '테스트 완료',
			value: data.completed_sessions.toLocaleString(),
		},
		{
			icon: TrendingUp,
			title: '완료율',
			value: `${completionRate}%`,
		},
		{
			icon: Users,
			title: '신규 사용자',
			value: data.new_users.toLocaleString(),
		},
		{
			icon: MessageSquare,
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
