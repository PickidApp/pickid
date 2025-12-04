import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export interface BaseSelectOption {
	value: string;
	label: string;
	description?: string;
}

interface BaseSelectProps {
	value?: string;
	onValueChange?: (value: string) => void;
	options: BaseSelectOption[];
	placeholder?: string;
	id?: string;
	disabled?: boolean;
	className?: string;
}

export const BaseSelect = React.forwardRef<HTMLButtonElement, BaseSelectProps>(
	({ value, onValueChange, options, placeholder, id, disabled, className, ...props }, ref) => {
		return (
			<Select value={value} onValueChange={onValueChange} disabled={disabled} {...props}>
				<SelectTrigger id={id} ref={ref} className={className}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.description ? `${option.label} - ${option.description}` : option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	}
);

BaseSelect.displayName = 'BaseSelect';
