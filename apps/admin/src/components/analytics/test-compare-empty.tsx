import { TrendingUp } from 'lucide-react';

export function TestCompareEmpty() {
	return (
		<div className="bg-white border border-neutral-200 rounded-lg p-12">
			<div className="text-center">
				<TrendingUp className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
				<h3 className="text-lg font-medium text-neutral-900 mb-2">테스트를 비교해보세요</h3>
				<p className="text-sm text-neutral-500 mb-6">
					&apos;테스트별 성과&apos; 탭에서 비교할 테스트 2개 이상을 선택하세요
				</p>
				<div className="flex flex-wrap justify-center gap-2 text-xs text-neutral-400">
					<span className="px-2 py-1 bg-neutral-100 rounded">응답수 비교</span>
					<span className="px-2 py-1 bg-neutral-100 rounded">완료율 비교</span>
					<span className="px-2 py-1 bg-neutral-100 rounded">트렌드 비교</span>
					<span className="px-2 py-1 bg-neutral-100 rounded">질문별 이탈률</span>
				</div>
			</div>
		</div>
	);
}
