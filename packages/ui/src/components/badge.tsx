import * as React from 'react';
import { cn } from '@pickid/shared';

const variants = {
	// Color variants
	gray: 'bg-gray-100 text-gray-700 fill-gray-700',
	blue: 'bg-blue-100 text-blue-700 fill-blue-700',
	purple: 'bg-purple-100 text-purple-700 fill-purple-700',
	amber: 'bg-amber-100 text-amber-700 fill-amber-700',
	red: 'bg-red-100 text-red-700 fill-red-700',
	pink: 'bg-pink-100 text-pink-700 fill-pink-700',
	green: 'bg-green-100 text-green-700 fill-green-700',
	teal: 'bg-teal-100 text-teal-700 fill-teal-700',
	// Semantic variants
	default: 'bg-neutral-900 text-white fill-white',
	secondary: 'bg-neutral-100 text-neutral-700 fill-neutral-700',
	outline: 'bg-white text-neutral-700 fill-neutral-700 border border-neutral-300',
	// Gradient variants
	popular: 'bg-gradient-to-r from-red-500 to-pink-500 text-white fill-white',
	new: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white fill-white',
	recommended: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white fill-white',
	trending: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white fill-white',
	hot: 'bg-gradient-to-r from-orange-500 to-red-500 text-white fill-white',
};

const sizes = {
	sm: 'text-[11px] h-5 px-1.5 gap-[3px]',
	md: 'text-[12px] h-6 px-2.5 gap-1',
	lg: 'text-[14px] h-8 px-3 gap-1.5',
};

type BadgeVariant = keyof typeof variants;
type BadgeSize = keyof typeof sizes;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	variant?: BadgeVariant;
	size?: BadgeSize;
	icon?: React.ReactNode;
	className?: string;
}

function Badge({ children, variant = 'default', size = 'md', icon, className, ...props }: BadgeProps) {
	return (
		<div
			className={cn(
				'inline-flex justify-center items-center shrink-0 rounded-full font-medium whitespace-nowrap',
				variants[variant],
				sizes[size],
				className
			)}
			{...props}
		>
			{icon && <span className="flex items-center justify-center [&>svg]:w-3 [&>svg]:h-3">{icon}</span>}
			{children}
		</div>
	);
}

// cva와 호환성을 위한 export
const badgeVariants = (options: { variant?: BadgeVariant }) => {
	return cn(
		'inline-flex justify-center items-center shrink-0 rounded-full font-medium whitespace-nowrap',
		variants[options.variant || 'default'],
		sizes.md
	);
};

export { Badge, badgeVariants };
