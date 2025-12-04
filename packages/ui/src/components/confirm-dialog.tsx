'use client';

import * as React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from './dialog';
import { Button } from './button';

type ConfirmDialogVariant = 'default' | 'delete';

const VARIANT_CONFIG: Record<
	ConfirmDialogVariant,
	{
		titleSuffix: string;
		descriptionSuffix: string;
		confirmText: string;
		buttonVariant: 'default' | 'destructive';
	}
> = {
	default: {
		titleSuffix: '확인',
		descriptionSuffix: '을(를) 진행하시겠습니까?',
		confirmText: '확인',
		buttonVariant: 'default',
	},
	delete: {
		titleSuffix: '삭제',
		descriptionSuffix: '을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
		confirmText: '삭제',
		buttonVariant: 'destructive',
	},
};

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** 대상 이름 (예: "카테고리", "피드백") */
	target: string;
	variant?: ConfirmDialogVariant;
	onConfirm: () => void;
	isLoading?: boolean;
	cancelText?: string;
}

export function ConfirmDialog({
	open,
	onOpenChange,
	target,
	variant = 'default',
	onConfirm,
	isLoading = false,
	cancelText = '취소',
}: ConfirmDialogProps) {
	const config = VARIANT_CONFIG[variant];

	const handleConfirm = () => {
		onConfirm();
		if (!isLoading) {
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>{target} {config.titleSuffix}</DialogTitle>
					<DialogDescription className="pt-2">
						{target}{config.descriptionSuffix}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<div className="flex justify-end gap-2 pt-4">
						<Button variant="outline" text={cancelText} onClick={() => onOpenChange(false)} disabled={isLoading} />
						<Button
							variant={config.buttonVariant}
							text={config.confirmText}
							onClick={handleConfirm}
							loading={isLoading}
						/>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
