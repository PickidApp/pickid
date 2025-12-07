import React from 'react';
import { Button, type ButtonProps } from './button';
import { cn } from '@pickid/shared';

interface IconButtonProps extends Omit<ButtonProps, 'children'> {
	icon: React.ReactNode;
	text?: string;
	'aria-label'?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	({ icon, text, className, 'aria-label': ariaLabel, variant = 'ghost', ...props }, ref) => (
		<Button ref={ref} variant={variant} className={cn('p-2', className)} aria-label={ariaLabel || text} {...props}>
			{icon}
			{text && <span>{text}</span>}
		</Button>
	)
);

IconButton.displayName = 'IconButton';
