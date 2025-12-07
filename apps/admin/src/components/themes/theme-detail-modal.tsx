import { useState } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import {
	DefaultModal,
	DefaultModalHeader,
	DefaultModalTitle,
	DefaultModalContent,
	DefaultModalFooter,
	Button,
	Badge,
	IconButton,
} from '@pickid/ui';
import { useThemeTestsQuery, useRemoveTestFromTheme, useTestsQuery, useAddTestsToTheme } from '@/api';
import { getTestTypeLabel } from '@/utils/test';
import type { TestTheme } from '@pickid/supabase';
import type { ThemeStatus } from '@/types/theme';

interface ThemeDetailModalProps {
	theme: TestTheme | null;
	isOpen: boolean;
	onClose: () => void;
}

function getThemeStatus(theme: TestTheme): ThemeStatus {
	if (!theme.is_active) return 'inactive';
	const today = new Date().toISOString().split('T')[0];
	if (!theme.start_date && !theme.end_date) return 'ongoing';
	if (theme.start_date && theme.start_date > today) return 'upcoming';
	if (theme.end_date && theme.end_date < today) return 'ended';
	return 'active';
}

function getThemeStatusLabel(status: ThemeStatus): string {
	switch (status) {
		case 'inactive': return '비활성';
		case 'ongoing': return '상시 진행';
		case 'upcoming': return '예정';
		case 'active': return '진행중';
		case 'ended': return '종료';
	}
}

function getThemeStatusVariant(status: ThemeStatus): 'default' | 'secondary' | 'outline' | 'gray' {
	switch (status) {
		case 'active': return 'default';
		case 'ongoing': return 'default';
		case 'upcoming': return 'outline';
		case 'ended': return 'gray';
		case 'inactive': return 'secondary';
	}
}

export function ThemeDetailModal({ theme, isOpen, onClose }: ThemeDetailModalProps) {
	const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);

	const { data: themeTests, isLoading: testsLoading } = useThemeTestsQuery(theme?.id ?? '');
	const { data: allTestsData } = useTestsQuery({ status: 'published', pageSize: 100 });
	const removeTestMutation = useRemoveTestFromTheme();
	const addTestsMutation = useAddTestsToTheme();

	if (!theme) return null;

	const status = getThemeStatus(theme);
	const availableTests = (allTestsData?.tests ?? []).filter(
		(test) => !themeTests?.some((t) => t.id === test.id)
	);

	const handleRemoveTest = (testId: string) => {
		removeTestMutation.mutate(testId);
	};

	const handleToggleTestSelection = (testId: string) => {
		setSelectedTestIds((prev) =>
			prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
		);
	};

	const handleAddTests = () => {
		if (selectedTestIds.length > 0) {
			addTestsMutation.mutate(
				{ themeId: theme.id, testIds: selectedTestIds },
				{
					onSuccess: () => {
						setSelectedTestIds([]);
					},
				}
			);
		}
	};

	return (
		<DefaultModal open={isOpen} onOpenChange={onClose} className="max-w-4xl">
			<DefaultModalHeader onClose={onClose}>
				<DefaultModalTitle>{theme.name}</DefaultModalTitle>
				<Badge variant={getThemeStatusVariant(status)}>{getThemeStatusLabel(status)}</Badge>
				<span className="text-sm text-neutral-500">테스트 {themeTests?.length ?? 0}개</span>
			</DefaultModalHeader>

			<DefaultModalContent className="p-0">
				<div className="grid grid-cols-2 divide-x divide-neutral-200 h-[400px]">
					{/* 왼쪽: 연결된 테스트 */}
					<div className="flex flex-col">
						<div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
							<h4 className="text-sm font-medium text-neutral-700">연결된 테스트</h4>
						</div>
						<div className="flex-1 overflow-y-auto p-3">
							{testsLoading ? (
								<div className="text-center py-8 text-neutral-500 text-sm">로딩 중...</div>
							) : !themeTests || themeTests.length === 0 ? (
								<div className="text-center py-8 text-neutral-400 text-sm">
									연결된 테스트가 없습니다
								</div>
							) : (
								<div className="space-y-2">
									{themeTests.map((test) => (
										<div
											key={test.id}
											className="flex items-center justify-between p-2 bg-white border border-neutral-200 rounded-lg group"
										>
											<div className="flex items-center gap-2 min-w-0">
												{test.thumbnail_url ? (
													<img
														src={test.thumbnail_url}
														alt={test.title}
														className="w-8 h-8 rounded object-cover shrink-0"
													/>
												) : (
													<div className="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center shrink-0">
														<FileText className="w-4 h-4 text-neutral-400" />
													</div>
												)}
												<div className="min-w-0">
													<div className="text-sm font-medium text-neutral-900 truncate">{test.title}</div>
													<div className="text-xs text-neutral-500">{getTestTypeLabel(test.type)}</div>
												</div>
											</div>
											<IconButton
												icon={<Trash2 className="w-4 h-4" />}
												className="text-neutral-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
												onClick={() => handleRemoveTest(test.id)}
												disabled={removeTestMutation.isPending}
												aria-label="연결 해제"
											/>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* 오른쪽: 추가할 테스트 */}
					<div className="flex flex-col">
						<div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
							<h4 className="text-sm font-medium text-neutral-700">테스트 추가</h4>
							{selectedTestIds.length > 0 && (
								<IconButton
									size="sm"
									onClick={handleAddTests}
									disabled={addTestsMutation.isPending}
									icon={<Plus className="w-3 h-3" />}
									text={addTestsMutation.isPending ? '추가 중...' : `${selectedTestIds.length}개 추가`}
									aria-label="테스트 추가"
								/>
							)}
						</div>
						<div className="flex-1 overflow-y-auto p-3">
							{availableTests.length === 0 ? (
								<div className="text-center py-8 text-neutral-400 text-sm">
									추가할 수 있는 테스트가 없습니다
								</div>
							) : (
								<div className="space-y-1">
									{availableTests.map((test) => (
										<label
											key={test.id}
											className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
												selectedTestIds.includes(test.id)
													? 'bg-blue-50 border border-blue-200'
													: 'hover:bg-neutral-50 border border-transparent'
											}`}
										>
											<input
												type="checkbox"
												checked={selectedTestIds.includes(test.id)}
												onChange={() => handleToggleTestSelection(test.id)}
												className="rounded shrink-0"
											/>
											<div className="min-w-0">
												<div className="text-sm font-medium text-neutral-900 truncate">{test.title}</div>
												<div className="text-xs text-neutral-500">{getTestTypeLabel(test.type)}</div>
											</div>
										</label>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</DefaultModalContent>

			<DefaultModalFooter className="py-3">
				<Button variant="outline" onClick={onClose} text="닫기" />
			</DefaultModalFooter>
		</DefaultModal>
	);
}
