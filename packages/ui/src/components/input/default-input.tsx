import * as React from 'react';
import { Input } from './input';
import { cn } from '@pickid/shared';

export interface DefaultInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	required?: boolean;
	error?: string;
	helperText?: string;
	icon?: React.ReactNode;
}

export const DefaultInput = React.forwardRef<HTMLInputElement, DefaultInputProps>(
	({ className, label, required, error, helperText, icon, id, ...props }, ref) => {
		const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

		return (
			<div className="space-y-2">
				{label && (
					<label htmlFor={inputId} className="text-sm font-medium text-gray-700">
						{label} {required && <span className="text-red-500">*</span>}
					</label>
				)}
				<div className="relative">
					{icon && (
						<div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground pointer-events-none">
							{icon}
						</div>
					)}
					<Input
						ref={ref}
						id={inputId}
						className={cn(error && 'border-red-500 focus:border-red-500 focus:ring-red-500', icon && 'pl-9', className)}
						{...props}
					/>
				</div>
				{error && <p className="text-sm text-red-500">{error}</p>}
				{helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
			</div>
		);
	}
);
DefaultInput.displayName = 'DefaultInput';
