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
import { useCreateTheme, useUpdateTheme } from '@/api';
import { generateSlug } from '@/utils';
import type { TestTheme } from '@pickid/supabase';
import type { ThemePayload } from '@/types/theme';

interface ThemeModalProps {
	isOpen: boolean;
	onClose: () => void;
	theme?: TestTheme;
}

export function ThemeModal({ isOpen, onClose, theme }: ThemeModalProps) {
	const isEditMode = !!theme;

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [isActive, setIsActive] = useState(true);

	const createMutation = useCreateTheme();
	const updateMutation = useUpdateTheme();

	const isSubmitting = createMutation.isPending || updateMutation.isPending;

	useEffect(() => {
		if (isOpen) {
			if (theme) {
				setName(theme.name);
				setDescription(theme.description ?? '');
				setStartDate(theme.start_date ?? '');
				setEndDate(theme.end_date ?? '');
				setIsActive(theme.is_active);
			} else {
				setName('');
				setDescription('');
				setStartDate('');
				setEndDate('');
				setIsActive(true);
			}
		}
	}, [isOpen, theme]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const slug = isEditMode && theme ? theme.slug : generateSlug(name);

		const payload: ThemePayload = {
			name,
			slug,
			description: description || null,
			start_date: startDate || null,
			end_date: endDate || null,
			is_active: isActive,
		};

		if (isEditMode && theme) {
			updateMutation.mutate(
				{ themeId: theme.id, payload },
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
					<DefaultModalTitle>{isEditMode ? '테마 수정' : '테마 추가'}</DefaultModalTitle>
				</DefaultModalHeader>

				<DefaultModalContent className="space-y-4">
					<FormField label="테마명" htmlFor="name" required>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="테마명을 입력하세요"
							required
						/>
					</FormField>

					<DefaultTextarea
						id="description"
						label="설명"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="테마에 대한 설명을 입력하세요"
						rows={3}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField label="시작일" htmlFor="startDate">
							<Input
								id="startDate"
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
							/>
						</FormField>

						<FormField label="종료일" htmlFor="endDate">
							<Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
						</FormField>
					</div>
					<p className="text-xs text-neutral-500 -mt-2">기간을 비워두면 상시 진행 테마로 표시됩니다</p>

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
