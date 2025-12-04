import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@pickid/shared';
import { debounce } from 'lodash';
import { Input } from './input';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	onClear?: () => void;
	onSearch?: (value: string) => void;
	showClear?: boolean;
	containerClassName?: string;
	icon?: 'search' | 'none';
	debounceMs?: number;
}

export function SearchInput({
	className,
	onClear,
	onSearch,
	showClear = true,
	value,
	containerClassName,
	placeholder = '검색',
	icon = 'search',
	debounceMs = 300,
	onChange,
	...props
}: SearchInputProps) {
	const [inputValue, setInputValue] = React.useState(value?.toString() || '');

	const debouncedSearch = React.useMemo(
		() => debounce((val: string) => onSearch?.(val), debounceMs),
		[onSearch, debounceMs]
	);

	React.useEffect(() => {
		return () => debouncedSearch.cancel();
	}, [debouncedSearch]);

	React.useEffect(() => {
		setInputValue(value?.toString() || '');
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setInputValue(val);
		onChange?.(e);
		debouncedSearch(val);
	};

	const handleClear = () => {
		setInputValue('');
		debouncedSearch.cancel();
		onSearch?.('');
		onClear?.();
	};

	const hasValue = inputValue.length > 0;

	if (icon === 'search') {
		return (
			<div className={cn('relative', containerClassName)}>
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
				<Input
					value={inputValue}
					onChange={handleChange}
					className={cn(
						'pl-10 border-neutral-300 rounded-md text-sm placeholder:text-neutral-400',
						showClear && hasValue && 'pr-9',
						className
					)}
					placeholder={placeholder}
					{...props}
				/>
				{showClear && hasValue && (
					<button
						type="button"
						onClick={handleClear}
						className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 hover:text-neutral-600 transition-colors"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>
		);
	}

	return <Input value={inputValue} onChange={handleChange} className={className} placeholder={placeholder} {...props} />;
}
