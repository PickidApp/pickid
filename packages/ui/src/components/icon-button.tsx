import React from 'react';
import { Button, type ButtonProps } from './button';
import { cn } from '@pickid/shared';

interface IconButtonProps extends ButtonProps {
	icon?: React.ReactNode;
	text?: string;
	'aria-label'?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	({ icon, text, className, 'aria-label': ariaLabel, variant = 'ghost', children, ...props }, ref) => (
		<Button
			ref={ref}
			variant={variant}
			className={cn(text ? 'px-3' : 'p-2', className)}
			aria-label={ariaLabel || text}
			{...props}
		>
			{children ?? (
				<>
					{icon}
					{text && <span>{text}</span>}
				</>
			)}
		</Button>
	)
);

IconButton.displayName = 'IconButton';
