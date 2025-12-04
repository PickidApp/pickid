import React from 'react';
import { Label } from './label';

interface FormFieldProps {
	label: React.ReactNode;
	children: React.ReactNode;
	htmlFor?: string;
	required?: boolean;
	className?: string;
}

export const FormField = ({ label, children, htmlFor, required, className }: FormFieldProps) => {
	return (
		<div className={className}>
			<Label htmlFor={htmlFor}>
				{label} {required && <span className="text-red-500">*</span>}
			</Label>
			{children}
		</div>
	);
};
