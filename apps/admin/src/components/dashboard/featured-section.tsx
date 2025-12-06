import type { FeaturedTest, CurrentTheme, ThemeTest } from '@pickid/supabase';
import { Star, Calendar, ExternalLink, Edit, Tag } from 'lucide-react';
import { Button } from '@pickid/ui';
import { HREF } from '@/constants';

interface FeaturedSectionProps {
	featuredTest: FeaturedTest | null | undefined;
	currentTheme: CurrentTheme | null | undefined;
	themeTests: ThemeTest[] | undefined;
}

export function FeaturedSection({ featuredTest, currentTheme, themeTests }: FeaturedSectionProps) {
	// TODO: 웹 앱 URL 설정 필요 - 환경변수로 관리
	const webBaseUrl = 'https://pickid.app';

	const handleViewOnWeb = (slug: string | null | undefined) => {
		if (slug) {
			window.open(`${webBaseUrl}/tests/${slug}`, '_blank');
		}
	};

	const handleEditTest = (id: string | null | undefined) => {
		if (id) {
			window.location.href = HREF.TEST_EDIT(id);
		}
	};

	return (
		<div className="grid grid-cols-2 gap-6">
			{/* 오늘의 테스트 */}
			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<div className="flex items-center gap-2 mb-4">
					<Star className="w-5 h-5 text-amber-500" />
					<h3 className="text-lg font-medium text-neutral-900">오늘의 테스트</h3>
				</div>

				{featuredTest ? (
					<div className="space-y-4">
						<div className="flex gap-4">
							{featuredTest.thumbnail_url && (
								<img
									src={featuredTest.thumbnail_url}
									alt={featuredTest.title}
									className="w-20 h-20 rounded-lg object-cover"
								/>
							)}
							<div className="flex-1">
								<h4 className="font-medium text-neutral-900 line-clamp-2">{featuredTest.title}</h4>
								{featuredTest.category_name && (
									<div className="flex items-center gap-1 mt-1">
										<Tag className="w-3 h-3 text-neutral-400" />
										<span className="text-sm text-neutral-500">{featuredTest.category_name}</span>
									</div>
								)}
							</div>
						</div>

						<div className="grid grid-cols-3 gap-3 py-3 border-t border-neutral-100">
							<div>
								<p className="text-xs text-neutral-500">오늘 응답</p>
								<p className="text-lg font-semibold text-neutral-900">{featuredTest.today_responses ?? 0}</p>
							</div>
							<div>
								<p className="text-xs text-neutral-500">오늘 공유</p>
								<p className="text-lg font-semibold text-neutral-900">{featuredTest.today_shares ?? 0}</p>
							</div>
							<div>
								<p className="text-xs text-neutral-500">완료율</p>
								<p className="text-lg font-semibold text-neutral-900">{featuredTest.completion_rate ?? 0}%</p>
							</div>
						</div>

						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								className="flex-1"
								onClick={() => handleViewOnWeb(featuredTest.slug)}
							>
								<ExternalLink className="w-4 h-4 mr-1" />
								웹에서 보기
							</Button>
							<Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditTest(featuredTest.id)}>
								<Edit className="w-4 h-4 mr-1" />
								테스트 수정
							</Button>
						</div>
					</div>
				) : (
					<div className="text-center py-8 text-neutral-400">
						<Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>오늘의 테스트가 없습니다</p>
						<p className="text-sm mt-1">테스트 응답이 쌓이면 자동으로 선정됩니다</p>
					</div>
				)}
			</div>

			{/* 오늘의 테마 */}
			<div className="bg-white border border-neutral-200 rounded-lg p-6">
				<div className="flex items-center gap-2 mb-4">
					<Calendar className="w-5 h-5 text-purple-500" />
					<h3 className="text-lg font-medium text-neutral-900">오늘의 테마</h3>
				</div>

				{currentTheme ? (
					<div className="space-y-4">
						<div>
							<h4 className="font-medium text-neutral-900">{currentTheme.name}</h4>
							{currentTheme.description && (
								<p className="text-sm text-neutral-500 mt-1 line-clamp-2">{currentTheme.description}</p>
							)}
							{(currentTheme.start_date || currentTheme.end_date) && (
								<p className="text-xs text-neutral-400 mt-2">
									{currentTheme.start_date && `${currentTheme.start_date}`}
									{currentTheme.start_date && currentTheme.end_date && ' ~ '}
									{currentTheme.end_date && `${currentTheme.end_date}`}
								</p>
							)}
						</div>

						{themeTests && themeTests.length > 0 && (
							<div className="border-t border-neutral-100 pt-3">
								<p className="text-xs text-neutral-500 mb-2">소속 테스트 (TOP 3)</p>
								<div className="space-y-2">
									{themeTests.map((test) => (
										<div key={test.id} className="flex items-center justify-between text-sm">
											<span className="text-neutral-700 truncate flex-1">{test.title}</span>
											<span className="text-neutral-400 ml-2">{test.response_count}회</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* TODO: 테마 편집 페이지 구현 후 활성화 */}
						{/* <Button variant="outline" size="sm" className="w-full">
							<Edit className="w-4 h-4 mr-1" />
							테마 편집
						</Button> */}
					</div>
				) : (
					<div className="text-center py-8 text-neutral-400">
						<Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>활성화된 테마가 없습니다</p>
						<p className="text-sm mt-1">테마를 생성하여 테스트를 묶어보세요</p>
					</div>
				)}
			</div>
		</div>
	);
}
