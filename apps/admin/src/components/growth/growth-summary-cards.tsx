import type { GrowthSummary } from '@/types/analytics';

interface GrowthSummaryCardsProps {
	data?: GrowthSummary;
}

export function GrowthSummaryCards({ data }: GrowthSummaryCardsProps) {
	if (!data) return null;

	const cards = [
		{
			label: '총 방문',
			value: data.totalVisits.toLocaleString(),
			change: data.totalVisitsChange,
			suffix: '회',
		},
		{
			label: '테스트 응답',
			value: data.totalResponses.toLocaleString(),
			change: data.totalResponsesChange,
			suffix: '회',
		},
		{
			label: '완료율',
			value: data.completionRate.toFixed(1),
			change: data.completionRateChange,
			suffix: '%',
		},
		{
			label: '평균 소요시간',
			value: Math.floor(data.avgResponseDuration / 60),
			change: data.avgResponseDurationChange,
			suffix: '분',
		},
	];

	return (
		<div className="grid grid-cols-4 gap-4">
			{cards.map((card) => (
				<div key={card.label} className="bg-white border border-neutral-200 rounded-lg p-6">
					<div className="text-sm text-neutral-500 mb-1">{card.label}</div>
					<div className="text-2xl font-semibold text-neutral-900 mb-1">
						{card.value}
						<span className="text-lg font-normal text-neutral-500 ml-1">{card.suffix}</span>
					</div>
					<div className={`text-sm ${card.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
						{card.change >= 0 ? '+' : ''}
						{card.change.toFixed(1)}% vs 이전 기간
					</div>
				</div>
			))}
		</div>
	);
}
