import { useState } from 'react';
import { Plus, Trash2, GripVertical, FileText } from 'lucide-react';
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
import {
	useSeriesTestsQuery,
	useRemoveTestFromSeries,
	useTestsQuery,
	useAddTestsToSeries,
	useUpdateSeriesTestOrder,
} from '@/api';
import { getTestTypeLabel } from '@/utils/test';
import type { TestSeries } from '@pickid/supabase';

interface SeriesDetailModalProps {
	series: TestSeries | null;
	isOpen: boolean;
	onClose: () => void;
}

export function SeriesDetailModal({ series, isOpen, onClose }: SeriesDetailModalProps) {
	const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

	const { data: seriesTests, isLoading: testsLoading } = useSeriesTestsQuery(series?.id ?? '');
	const { data: allTestsData } = useTestsQuery({ status: 'published', pageSize: 100 });
	const removeTestMutation = useRemoveTestFromSeries();
	const addTestsMutation = useAddTestsToSeries();
	const updateOrderMutation = useUpdateSeriesTestOrder();

	if (!series) return null;

	const availableTests = (allTestsData?.tests ?? []).filter(
		(test) => !seriesTests?.some((t) => t.id === test.id)
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
				{ seriesId: series.id, testIds: selectedTestIds },
				{
					onSuccess: () => {
						setSelectedTestIds([]);
					},
				}
			);
		}
	};

	const handleDragStart = (index: number) => {
		setDraggedIndex(index);
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		if (draggedIndex === null || draggedIndex === index || !seriesTests) return;

		const newTests = [...seriesTests];
		const draggedItem = newTests[draggedIndex];
		newTests.splice(draggedIndex, 1);
		newTests.splice(index, 0, draggedItem);

		// 순서 업데이트
		const testIds = newTests.map((t) => t.id);
		updateOrderMutation.mutate({ seriesId: series.id, testIds });
		setDraggedIndex(index);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
	};

	return (
		<DefaultModal open={isOpen} onOpenChange={onClose} className="max-w-4xl">
			<DefaultModalHeader onClose={onClose}>
				<DefaultModalTitle>{series.name}</DefaultModalTitle>
				<Badge variant={series.is_active ? 'default' : 'secondary'}>
					{series.is_active ? '활성' : '비활성'}
				</Badge>
				<span className="text-sm text-neutral-500">테스트 {seriesTests?.length ?? 0}개</span>
			</DefaultModalHeader>

			<DefaultModalContent className="p-0">
				<div className="grid grid-cols-2 divide-x divide-neutral-200 h-[400px]">
					{/* 왼쪽: 연결된 테스트 (드래그로 순서 변경) */}
					<div className="flex flex-col">
						<div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
							<h4 className="text-sm font-medium text-neutral-700">연결된 테스트 (드래그로 순서 변경)</h4>
						</div>
						<div className="flex-1 overflow-y-auto p-3">
							{testsLoading ? (
								<div className="text-center py-8 text-neutral-500 text-sm">로딩 중...</div>
							) : !seriesTests || seriesTests.length === 0 ? (
								<div className="text-center py-8 text-neutral-400 text-sm">
									연결된 테스트가 없습니다
								</div>
							) : (
								<div className="space-y-2">
									{seriesTests.map((test, index) => (
										<div
											key={test.id}
											draggable
											onDragStart={() => handleDragStart(index)}
											onDragOver={(e) => handleDragOver(e, index)}
											onDragEnd={handleDragEnd}
											className={`flex items-center justify-between p-2 bg-white border border-neutral-200 rounded-lg cursor-move group transition-colors ${
												draggedIndex === index ? 'opacity-50 border-blue-300' : ''
											}`}
										>
											<div className="flex items-center gap-2 min-w-0">
												<GripVertical className="w-4 h-4 text-neutral-400 shrink-0" />
												<span className="w-5 h-5 bg-neutral-900 text-white rounded-full flex items-center justify-center text-xs shrink-0">
													{index + 1}
												</span>
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
