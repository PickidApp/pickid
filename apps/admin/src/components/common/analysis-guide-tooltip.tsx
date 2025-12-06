import { useState } from 'react';
import type { AnalysisGuide } from '@/types/analytics';

interface AnalysisGuideTooltipProps extends AnalysisGuide {}

export function AnalysisGuideTooltip({ title, purpose, keyQuestions, actionTip }: AnalysisGuideTooltipProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative inline-block">
			<button
				type="button"
				className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-300 hover:bg-neutral-400 text-neutral-600 text-[10px] font-medium transition-colors"
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
				onClick={() => setIsOpen(!isOpen)}
			>
				?
			</button>

			{isOpen && (
				<div className="absolute left-1/2 -translate-x-1/2 top-6 z-50 w-72 p-3 bg-white border border-neutral-200 rounded-lg shadow-lg">
					<div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-l border-t border-neutral-200 rotate-45" />

					<h4 className="text-sm font-semibold text-neutral-900 mb-2">{title}</h4>

					<div className="space-y-3 text-xs">
						<div>
							<span className="font-medium text-neutral-700">목적:</span>
							<p className="text-neutral-600 mt-0.5">{purpose}</p>
						</div>

						<div>
							<span className="font-medium text-neutral-700">핵심 질문:</span>
							<ul className="mt-1 space-y-1 text-neutral-600">
								{keyQuestions.map((q, i) => (
									<li key={i}>• {q}</li>
								))}
							</ul>
						</div>

						<div className="pt-2 border-t border-neutral-100">
							<span className="font-medium text-blue-600">Tip:</span>
							<p className="text-neutral-600 mt-0.5">{actionTip}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
