import { BaseTable, type BaseTableColumn } from '@pickid/ui';
import type { ViralMetrics, ShareChannelStats, ShareBasedSessions } from '@pickid/supabase';

interface ViralContentProps {
	viralMetrics?: ViralMetrics;
	shareChannelStats?: ShareChannelStats[];
	shareBasedSessions?: ShareBasedSessions;
}

const shareChannelColumns: BaseTableColumn<ShareChannelStats>[] = [
	{
		key: 'label',
		header: '채널',
		renderCell: (row) => <span className="text-neutral-900">{row.label}</span>,
	},
	{
		key: 'shares',
		header: '공유 수',
		renderCell: (row) => <span className="text-neutral-600 text-right block">{row.shares.toLocaleString()}</span>,
	},
	{
		key: 'percentage',
		header: '비율',
		renderCell: (row) => <span className="font-medium text-blue-600 text-right block">{row.percentage}%</span>,
	},
];

export function ViralContent({ viralMetrics, shareChannelStats, shareBasedSessions }: ViralContentProps) {
	const summaryCards = [
		{
			label: '공유 전환율',
			value: viralMetrics?.share_conversion_rate?.toFixed(1) ?? '0',
			suffix: '%',
			description: '완료 → 공유',
		},
		{
			label: '총 공유',
			value: viralMetrics?.total_shares?.toLocaleString() ?? '0',
			suffix: '회',
			description: '결과 공유 횟수',
		},
		{
			label: '세션당 테스트',
			value: viralMetrics?.avg_tests_per_session?.toFixed(2) ?? '0',
			suffix: '개',
			description: '한 방문당 평균',
		},
		{
			label: '공유 유입 세션',
			value: shareBasedSessions?.total_sessions?.toLocaleString() ?? '0',
			suffix: '회',
			description: `신규 ${shareBasedSessions?.new_user_rate?.toFixed(1) ?? 0}%`,
		},
	];

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-4 gap-4">
				{summaryCards.map((card) => (
					<div key={card.label} className="bg-white border border-neutral-200 rounded-lg p-6">
						<div className="text-sm text-neutral-500 mb-1">{card.label}</div>
						<div className="text-2xl font-semibold text-neutral-900 mb-1">
							{card.value}
							<span className="text-lg font-normal text-neutral-500 ml-1">{card.suffix}</span>
						</div>
						<div className="text-sm text-neutral-400">{card.description}</div>
					</div>
				))}
			</div>

			<div className="grid grid-cols-2 gap-6">
				<div className="bg-white border border-neutral-200 rounded-lg p-6">
					<h3 className="text-lg font-medium text-neutral-900 mb-4">공유 채널별 분포</h3>
					<BaseTable columns={shareChannelColumns} data={shareChannelStats || []} emptyMessage="데이터가 없습니다" />
				</div>

				<div className="bg-white border border-neutral-200 rounded-lg p-6">
					<h3 className="text-lg font-medium text-neutral-900 mb-4">공유 기반 유입</h3>
					<div className="space-y-4">
						<div className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
							<span className="text-neutral-700">총 유입 세션</span>
							<span className="text-xl font-semibold text-neutral-900">
								{shareBasedSessions?.total_sessions?.toLocaleString() ?? 0}
							</span>
						</div>
						<div className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
							<span className="text-neutral-700">신규 사용자</span>
							<span className="text-xl font-semibold text-green-600">
								{shareBasedSessions?.new_user_sessions?.toLocaleString() ?? 0}
							</span>
						</div>
						<div className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
							<span className="text-neutral-700">신규 비율</span>
							<span className="text-xl font-semibold text-blue-600">
								{shareBasedSessions?.new_user_rate?.toFixed(1) ?? 0}%
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
				<h3 className="text-lg font-medium text-amber-900 mb-2">바이럴 개선 포인트</h3>
				<ul className="text-sm text-amber-800 space-y-2">
					<li>• 공유 전환율이 20% 미만이면 결과 화면의 공유 UI/문구를 개선하세요</li>
					<li>• 인스타그램 스토리용 결과 이미지를 제공하면 공유율이 높아집니다</li>
					<li>• 공유 시 친구가 같은 테스트를 풀도록 유도하는 메시지를 추가하세요</li>
					<li>• 카카오톡 공유는 한국 사용자에게 가장 효과적인 채널입니다</li>
				</ul>
			</div>
		</div>
	);
}
