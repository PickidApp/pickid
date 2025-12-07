import { useState, useEffect } from 'react';
import {
	DefaultModal,
	DefaultModalHeader,
	DefaultModalTitle,
	DefaultModalContent,
	DefaultModalFooter,
	Button,
	Input,
	Switch,
	FormField,
	DefaultTextarea,
} from '@pickid/ui';
import { useCreateSeries, useUpdateSeries } from '@/api';
import { generateSlug } from '@/utils';
import type { TestSeries } from '@pickid/supabase';

interface SeriesModalProps {
	isOpen: boolean;
	onClose: () => void;
	series?: TestSeries;
}

export function SeriesModal({ isOpen, onClose, series }: SeriesModalProps) {
	const isEditMode = !!series;

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [sortOrder, setSortOrder] = useState(100);
	const [isActive, setIsActive] = useState(true);

	const createMutation = useCreateSeries();
	const updateMutation = useUpdateSeries();

	const isSubmitting = createMutation.isPending || updateMutation.isPending;

	useEffect(() => {
		if (isOpen) {
			if (series) {
				setName(series.name);
				setDescription(series.description ?? '');
				setSortOrder(series.sort_order);
				setIsActive(series.is_active);
			} else {
				setName('');
				setDescription('');
				setSortOrder(100);
				setIsActive(true);
			}
		}
	}, [isOpen, series]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const slug = isEditMode && series ? series.slug : generateSlug(name);

		const payload = {
			name,
			slug,
			description: description || null,
			sort_order: sortOrder,
			is_active: isActive,
		};

		if (isEditMode && series) {
			updateMutation.mutate(
				{ seriesId: series.id, payload },
				{
					onSuccess: () => {
						onClose();
					},
				}
			);
		} else {
			createMutation.mutate(payload, {
				onSuccess: () => {
					onClose();
				},
			});
		}
	};

	return (
		<DefaultModal open={isOpen} onOpenChange={onClose} className="max-w-md">
			<form onSubmit={handleSubmit}>
				<DefaultModalHeader onClose={onClose}>
					<DefaultModalTitle>{isEditMode ? '시리즈 수정' : '시리즈 추가'}</DefaultModalTitle>
				</DefaultModalHeader>

				<DefaultModalContent className="space-y-4">
					<FormField label="시리즈명" htmlFor="name" required>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="시리즈명을 입력하세요"
							required
						/>
					</FormField>

					<DefaultTextarea
						id="description"
						label="설명"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="시리즈에 대한 설명을 입력하세요"
						rows={3}
					/>

					<FormField label="정렬 순서" htmlFor="sortOrder">
						<Input
							id="sortOrder"
							type="number"
							value={sortOrder}
							onChange={(e) => setSortOrder(Number(e.target.value))}
							min={0}
						/>
						<p className="text-xs text-neutral-500 mt-1">낮을수록 먼저 표시됩니다</p>
					</FormField>

					<div className="flex items-center justify-between">
						<div>
							<div className="text-sm font-medium text-neutral-900">활성화</div>
							<p className="text-xs text-neutral-500">비활성화하면 테스트 폼에서 선택할 수 없습니다</p>
						</div>
						<Switch checked={isActive} onCheckedChange={setIsActive} />
					</div>
				</DefaultModalContent>

				<DefaultModalFooter>
					<Button type="button" variant="outline" onClick={onClose} text="취소" />
					<Button
						type="submit"
						disabled={isSubmitting || !name}
						loading={isSubmitting}
						text={isEditMode ? '수정' : '추가'}
					/>
				</DefaultModalFooter>
			</form>
		</DefaultModal>
	);
}
