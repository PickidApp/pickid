import { useState, useEffect } from 'react';
import {
	BaseModal,
	BaseModalHeader,
	BaseModalTitle,
	BaseModalContent,
	BaseModalFooter,
	Button,
	Input,
	Switch,
	FormField,
} from '@pickid/ui';
import { useCreateCategory, useUpdateCategory } from '@/api/mutations';
import { generateSlug } from '@/utils';
import type { Category } from '@pickid/supabase';
import type { CategoryPayload } from '@/services/category.service';

interface CategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	category?: Category;
}

export function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
	const isEditMode = !!category;

	const [name, setName] = useState('');
	const [sortOrder, setSortOrder] = useState(100);
	const [isActive, setIsActive] = useState(true);

	const createMutation = useCreateCategory();
	const updateMutation = useUpdateCategory();

	const isSubmitting = createMutation.isPending || updateMutation.isPending;

	useEffect(() => {
		if (isOpen) {
			if (category) {
				setName(category.name);
				setSortOrder(category.sort_order);
				setIsActive(category.status === 'active');
			} else {
				setName('');
				setSortOrder(100);
				setIsActive(true);
			}
		}
	}, [isOpen, category]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const slug = isEditMode && category ? category.slug : generateSlug(name);

		const payload: CategoryPayload = {
			name,
			slug,
			sort_order: sortOrder,
			status: isActive ? 'active' : 'inactive',
		};

		if (isEditMode && category) {
			updateMutation.mutate(
				{ categoryId: category.id, payload },
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
		<BaseModal open={isOpen} onOpenChange={onClose} className="max-w-md">
			<form onSubmit={handleSubmit}>
				<BaseModalHeader onClose={onClose}>
					<BaseModalTitle>{isEditMode ? '카테고리 수정' : '카테고리 추가'}</BaseModalTitle>
				</BaseModalHeader>

				<BaseModalContent className="space-y-4">
					<FormField label="카테고리명" htmlFor="name" required>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="카테고리명을 입력하세요"
							required
						/>
					</FormField>

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
							<p className="text-xs text-neutral-500">비활성화하면 사용자에게 표시되지 않습니다</p>
						</div>
						<Switch checked={isActive} onCheckedChange={setIsActive} />
					</div>
				</BaseModalContent>

				<BaseModalFooter>
					<Button type="button" variant="outline" onClick={onClose}>
						취소
					</Button>
					<Button type="submit" disabled={isSubmitting || !name}>
						{isSubmitting ? '저장 중...' : isEditMode ? '수정' : '추가'}
					</Button>
				</BaseModalFooter>
			</form>
		</BaseModal>
	);
}
