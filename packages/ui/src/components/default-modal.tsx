'use client';

import * as React from 'react';
import { cn } from '@pickid/shared';
import { Dialog, DialogContent } from './dialog';
import { X } from 'lucide-react';

interface DefaultModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
	className?: string;
}

const DefaultModal = ({ open, onOpenChange, children, className }: DefaultModalProps) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className={cn('max-h-[90vh] p-0 flex flex-col', className)}>{children}</DialogContent>
	</Dialog>
);

interface DefaultModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	onClose?: () => void;
}

const DefaultModalHeader = React.forwardRef<HTMLDivElement, DefaultModalHeaderProps>(
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

const DefaultModalTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => <h2 ref={ref} className={cn('text-xl text-neutral-900', className)} {...props} />
);

const DefaultModalContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 overflow-y-auto flex-1', className)} {...props} />
);

const DefaultModalFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn('flex justify-end items-center gap-3 p-6 border-t bg-neutral-50', className)} {...props} />
	)
);

DefaultModal.displayName = 'DefaultModal';
DefaultModalHeader.displayName = 'DefaultModalHeader';
DefaultModalTitle.displayName = 'DefaultModalTitle';
DefaultModalContent.displayName = 'DefaultModalContent';
DefaultModalFooter.displayName = 'DefaultModalFooter';

export { DefaultModal, DefaultModalHeader, DefaultModalTitle, DefaultModalContent, DefaultModalFooter };

/** @deprecated Use DefaultModal instead */
export const BaseModal = DefaultModal;
/** @deprecated Use DefaultModalHeader instead */
export const BaseModalHeader = DefaultModalHeader;
/** @deprecated Use DefaultModalTitle instead */
export const BaseModalTitle = DefaultModalTitle;
/** @deprecated Use DefaultModalContent instead */
export const BaseModalContent = DefaultModalContent;
/** @deprecated Use DefaultModalFooter instead */
export const BaseModalFooter = DefaultModalFooter;
