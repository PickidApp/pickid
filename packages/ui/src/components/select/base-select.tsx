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
	label?: string;
	id?: string;
	disabled?: boolean;
	className?: string;
}

export const BaseSelect = React.forwardRef<HTMLButtonElement, BaseSelectProps>(
	({ value, onValueChange, options, placeholder, label, id, disabled, className, ...props }, ref) => {
		const selectElement = (
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

		if (label) {
			return (
				<div className="flex items-center space-x-2">
					<label className="text-sm text-neutral-700">{label}</label>
					{selectElement}
				</div>
			);
		}

		return selectElement;
	}
);

BaseSelect.displayName = 'BaseSelect';
