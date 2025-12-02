import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './input';
import { cn } from '@pickid/shared';

export interface InputPasswordProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label?: string;
	required?: boolean;
	error?: string;
	helperText?: string;
	icon?: React.ReactNode;
}

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
	({ className, label, required, error, helperText, icon, id, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);
		const inputId = id || `input-password-${Math.random().toString(36).substr(2, 9)}`;

		const togglePasswordVisibility = () => {
			setShowPassword(!showPassword);
		};

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
						type={showPassword ? 'text' : 'password'}
						className={cn(error && 'border-red-500 focus:border-red-500 focus:ring-red-500', icon && 'pl-9', className)}
						{...props}
					/>
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="absolute top-0 right-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
						aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
					>
						{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
				{error && <p className="text-sm text-red-500">{error}</p>}
				{helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
			</div>
		);
	}
);
InputPassword.displayName = 'InputPassword';
