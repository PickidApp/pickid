'use client';

import * as React from 'react';
import { cn } from '@pickid/shared';
import { Dialog, DialogContent } from './dialog';
import { X } from 'lucide-react';

interface BaseModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
	className?: string;
}

const BaseModal = ({ open, onOpenChange, children, className }: BaseModalProps) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className={cn('max-h-[90vh] p-0 flex flex-col', className)}>{children}</DialogContent>
	</Dialog>
);

interface BaseModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	onClose?: () => void;
}

const BaseModalHeader = React.forwardRef<HTMLDivElement, BaseModalHeaderProps>(
	({ className, children, onClose, ...props }, ref) => (
		<div ref={ref} className={cn('flex justify-between items-center p-6 border-b', className)} {...props}>
			<div className="flex items-center gap-4">{children}</div>
			{onClose && (
				<button
					type="button"
					onClick={onClose}
					className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md"
					aria-label="닫기"
				>
					<X className="w-5 h-5" />
				</button>
			)}
		</div>
	)
);

const BaseModalTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => <h2 ref={ref} className={cn('text-xl text-neutral-900', className)} {...props} />
);

const BaseModalContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 overflow-y-auto flex-1', className)} {...props} />
);

const BaseModalFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex justify-end items-center gap-3 p-6 border-t bg-neutral-50', className)} {...props} />
	)
);

BaseModal.displayName = 'BaseModal';
BaseModalHeader.displayName = 'BaseModalHeader';
BaseModalTitle.displayName = 'BaseModalTitle';
BaseModalContent.displayName = 'BaseModalContent';
BaseModalFooter.displayName = 'BaseModalFooter';

export { BaseModal, BaseModalHeader, BaseModalTitle, BaseModalContent, BaseModalFooter };
