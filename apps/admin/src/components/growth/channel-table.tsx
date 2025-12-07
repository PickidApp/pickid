import { DefaultTable, type DefaultTableColumn } from '@pickid/ui';
import type { ChannelData } from '@/types/analytics';

interface ChannelTableProps {
	data?: ChannelData[];
}

const columns: DefaultTableColumn<ChannelData>[] = [
	{
		key: 'label',
		header: '채널',
		renderCell: (row) => <span className="text-neutral-900">{row.label}</span>,
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

export function ChannelTable({ data }: ChannelTableProps) {
	return <DefaultTable columns={columns} data={data || []} emptyMessage="데이터가 없습니다" />;
}
