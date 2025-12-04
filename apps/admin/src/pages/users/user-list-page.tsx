import { useUsersQuery, useUserSummaryQuery } from '@/api/queries';
import { StatCard } from '@/components/common/stat-card';
import { usePagination } from '@/hooks';
import type { UserProvider, UserStatus } from '@/services/user.service';
import { formatDate } from '@/utils';
import {
	getUserProviderLabel,
	getUserProviderVariant,
	getUserStatusLabel,
	getUserStatusVariant,
	USER_PROVIDERS,
	USER_STATUSES,
} from '@/utils/user';
import type { Json, User } from '@pickid/supabase';
import {
	Badge,
	BaseModal,
	BaseModalContent,
	BaseModalFooter,
	BaseModalHeader,
	BaseModalTitle,
	BaseTable,
	Button,
	DefaultPagination,
	IconButton,
	SearchInput,
	type BaseTableColumn,
} from '@pickid/ui';
import { Eye, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function getProvider(meta: Json | null): string {
	if (meta && typeof meta === 'object' && 'provider' in meta) {
		return String(meta.provider);
	}
	return 'email';
}

export function UserListPage() {
	const [statusFilter, setStatusFilter] = useState<UserStatus[]>([]);
	const [providerFilter, setProviderFilter] = useState<UserProvider[]>([]);
	const [search, setSearch] = useState('');
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

	const [searchParams] = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;

	const { data, isLoading } = useUsersQuery({
		status: statusFilter[0],
		provider: providerFilter[0],
		search: search || undefined,
		page: currentPage,
		pageSize: 20,
	});

	const { data: summary } = useUserSummaryQuery();

	const users = data?.users ?? [];
	const totalCount = data?.count ?? 0;

	const { totalPages, handlePageChange } = usePagination({ totalCount });

	const handleCloseModal = () => setSelectedUserId(null);

	const columns: BaseTableColumn<User>[] = [
		{
			key: 'no',
			header: 'No',
			width: 60,
			renderCell: (_, index) => <span className="text-neutral-500">{(currentPage - 1) * 20 + index + 1}</span>,
		},
		{
			key: 'email',
			header: '이메일',
			renderCell: (row) => <span className="text-neutral-900">{row.email}</span>,
		},
		{
			key: 'name',
			header: '이름',
			renderCell: (row) => <span className="text-neutral-900">{row.name || '-'}</span>,
		},
		{
			key: 'provider',
			header: '가입경로',
			filterOptions: USER_PROVIDERS,
			filterValue: providerFilter,
			onFilterChange: (values) => setProviderFilter(values as UserProvider[]),
			renderCell: (row) => (
				<Badge variant={getUserProviderVariant(getProvider(row.meta))}>
					{getUserProviderLabel(getProvider(row.meta))}
				</Badge>
			),
		},
		{
			key: 'status',
			header: '상태',
			filterOptions: USER_STATUSES,
			filterValue: statusFilter,
			onFilterChange: (values) => setStatusFilter(values as UserStatus[]),
			renderCell: (row) => <Badge variant={getUserStatusVariant(row.status)}>{getUserStatusLabel(row.status)}</Badge>,
		},
		{
			key: 'created_at',
			header: '가입일',
			renderCell: (row) => <span className="text-sm text-neutral-500">{formatDate(row.created_at)}</span>,
		},
		{
			key: 'actions',
			header: '',
			width: 120,
			renderCell: (row) => (
				<div className="flex items-center space-x-1">
					<IconButton
						variant="ghost"
						icon={<Eye className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600"
						aria-label="상세보기"
						onClick={(e) => {
							e.stopPropagation();
							setSelectedUserId(row.id);
						}}
					/>
					<IconButton
						variant="ghost"
						icon={row.status === 'active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
						className="text-neutral-400 hover:text-neutral-600"
						aria-label="상태 변경"
						onClick={(e) => {
							e.stopPropagation();
							console.log('Toggle status:', row.id);
						}}
					/>
					<IconButton
						variant="ghost"
						icon={<Trash2 className="w-4 h-4" />}
						className="text-neutral-400 hover:text-red-600"
						aria-label="삭제"
						onClick={(e) => {
							e.stopPropagation();
							console.log('Delete user:', row.id);
						}}
					/>
				</div>
			),
		},
	];

	const stats: { label: string; value: number; color: 'default' | 'green' | 'red' | 'gray' }[] = [
		{ label: '전체', value: summary?.total ?? 0, color: 'default' },
		{ label: '활성', value: summary?.active ?? 0, color: 'green' },
		{ label: '비활성', value: summary?.inactive ?? 0, color: 'gray' },
		{ label: '탈퇴', value: summary?.deleted ?? 0, color: 'red' },
	];

	return (
		<>
			<header className="bg-white border-b px-6 py-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-4">
						<h1 className="text-2xl text-neutral-900">사용자 관리</h1>
						<span className="text-sm text-neutral-500">총 {totalCount}명</span>
					</div>
					<div className="flex items-center gap-2">
						<SearchInput placeholder="이메일, 이름 검색..." value={search} onSearch={setSearch} className="w-64" />
					</div>
				</div>
			</header>

			<main className="p-6">
				<div className="flex gap-3 mb-6">
					{stats.map((stat) => (
						<StatCard key={stat.label} {...stat} />
					))}
				</div>

				<BaseTable
					data={users}
					columns={columns}
					isLoading={isLoading}
					onRowClick={(row) => setSelectedUserId(row.id)}
				/>

				{!isLoading && totalPages > 1 && (
					<div className="mt-6 flex justify-center">
						<DefaultPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
					</div>
				)}
			</main>

			<BaseModal open={!!selectedUserId} onOpenChange={handleCloseModal}>
				<BaseModalHeader onClose={handleCloseModal}>
					<BaseModalTitle>사용자 상세</BaseModalTitle>
				</BaseModalHeader>
				<BaseModalContent>
					<p className="text-neutral-500">사용자 ID: {selectedUserId}</p>
					<p className="text-sm text-neutral-400 mt-2">상세 정보는 추후 구현 예정입니다.</p>
				</BaseModalContent>
				<BaseModalFooter>
					<Button variant="outline" onClick={handleCloseModal} text="닫기" />
				</BaseModalFooter>
			</BaseModal>
		</>
	);
}
