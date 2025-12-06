import { BaseTable, type BaseTableColumn } from '@pickid/ui';
import type { LandingPageData } from '@/types/analytics';

interface LandingPageTableProps {
	data?: LandingPageData[];
}

const columns: BaseTableColumn<LandingPageData>[] = [
	{
		key: 'path',
		header: '페이지 경로',
		renderCell: (row) => (
			<span className="text-neutral-900 max-w-[200px] truncate block" title={row.path}>
				{row.path}
			</span>
		),
	},
	{
		key: 'visits',
		header: '방문',
		renderCell: (row) => <span className="text-neutral-600 text-right block">{row.visits.toLocaleString()}</span>,
	},
	{
		key: 'responses',
		header: '응답',
		renderCell: (row) => <span className="text-neutral-600 text-right block">{row.responses.toLocaleString()}</span>,
	},
	{
		key: 'completions',
		header: '완료',
		renderCell: (row) => <span className="text-neutral-600 text-right block">{row.completions.toLocaleString()}</span>,
	},
	{
		key: 'conversionRate',
		header: '전환율',
		renderCell: (row) => <span className="font-medium text-green-600 text-right block">{row.conversionRate}%</span>,
	},
];

export function LandingPageTable({ data }: LandingPageTableProps) {
	return (
		<BaseTable
			columns={columns}
			data={data || []}
			emptyMessage="데이터가 없습니다"
		/>
	);
}
