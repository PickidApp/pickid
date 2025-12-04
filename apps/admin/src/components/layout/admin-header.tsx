import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { navigation, isActivePath, type NavEntry } from '@/config/navigation';
import { cn } from '@pickid/shared';

export function AdminHeader() {
	const location = useLocation();

	const currentItemIndex = navigation.findIndex((n) => n.type === 'item' && isActivePath(location.pathname, n));
	const currentItem =
		currentItemIndex >= 0 ? (navigation[currentItemIndex] as Extract<NavEntry, { type: 'item' }>) : undefined;

	let sectionName: string | undefined;
	if (currentItemIndex > 0) {
		for (let i = currentItemIndex - 1; i >= 0; i--) {
			if (navigation[i].type === 'section') {
				sectionName = navigation[i].name;
				break;
			}
		}
	}

	const breadcrumbItems = sectionName ? [sectionName, currentItem?.name] : [currentItem?.name || '대시보드'];

	return (
		<header className="bg-white px-8 py-3">
			<div className="flex items-center justify-between">
				<nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
					{breadcrumbItems.map((item, index) => (
						<div key={index} className="flex items-center gap-2">
							{index > 0 && <ChevronRight className="size-4 text-neutral-400" />}
							<span
								className={cn(
									index === breadcrumbItems.length - 1 ? 'text-neutral-900 font-medium' : 'text-neutral-500'
								)}
							>
								{item}
							</span>
						</div>
					))}
				</nav>
			</div>
		</header>
	);
}
