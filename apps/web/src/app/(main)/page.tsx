'use client';

import { Flame } from 'lucide-react';
import { Badge, DefaultCarousel, BannerCarousel, CardCarousel } from '@pickid/ui';
import { CATEGORIES, BANNERS, MOCK_TRENDING_TESTS, MOCK_NEW_TESTS } from '@/constants';

export default function Home() {
	return (
		<div className="pb-4 bg-white">
			<section>
				<BannerCarousel images={BANNERS} loop showDots dotsPosition="bottom-center" />
			</section>

			<section className="py-4 bg-white">
				<h2 className="text-base font-semibold text-neutral-900 px-4 mb-3">카테고리</h2>
				<DefaultCarousel items={CATEGORIES} />
			</section>

			<section className="py-6 bg-neutral-50">
				<div className="flex items-center gap-2 px-4 mb-4">
					<Badge variant="hot" size="sm">인기</Badge>
					<h2 className="text-lg font-semibold">요즘 인기 테스트</h2>
				</div>
				<CardCarousel
					items={MOCK_TRENDING_TESTS}
					renderItem={(test) => <TestCard test={test} />}
				/>
			</section>

			<section className="py-6 bg-white">
				<div className="flex items-center gap-2 px-4 mb-4">
					<Badge variant="purple" size="sm">밸런스게임</Badge>
					<h2 className="text-lg font-semibold">바로 참여하기</h2>
				</div>
				<div className="px-4">
					<div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
						<p className="text-center mb-4 text-neutral-700 font-medium">당신의 선택은?</p>
						<div className="grid grid-cols-2 gap-3">
							<button className="flex flex-col items-center bg-white border-2 border-neutral-200 rounded-xl p-5 hover:border-neutral-400 hover:shadow-md transition-all active:scale-[0.98]">
								<span className="text-3xl mb-2">🍕</span>
								<span className="text-sm font-medium text-neutral-700">평생 피자만</span>
							</button>
							<button className="flex flex-col items-center bg-white border-2 border-neutral-200 rounded-xl p-5 hover:border-neutral-400 hover:shadow-md transition-all active:scale-[0.98]">
								<span className="text-3xl mb-2">🍔</span>
								<span className="text-sm font-medium text-neutral-700">평생 햄버거만</span>
							</button>
						</div>
					</div>
				</div>
			</section>

			<section className="py-6 bg-neutral-50">
				<div className="flex items-center gap-2 px-4 mb-4">
					<Badge variant="new" size="sm">NEW</Badge>
					<h2 className="text-lg font-semibold">새로 올라온 테스트</h2>
				</div>
				<CardCarousel
					items={MOCK_NEW_TESTS}
					renderItem={(test) => <TestCard test={test} compact />}
				/>
			</section>
		</div>
	);
}

interface ITest {
	id: number;
	title: string;
	description: string;
	category: string;
	participants: number;
}

function TestCard({ test, compact }: { test: ITest; compact?: boolean }) {
	return (
		<div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
			<div className={`bg-neutral-200 ${compact ? 'h-32' : 'h-40'} flex items-center justify-center`}>
				<span className="text-neutral-400 text-sm">테스트 이미지</span>
			</div>
			<div className={compact ? 'p-3' : 'p-4'}>
				<div className={`flex items-center ${compact ? 'gap-1.5 mb-1.5' : 'gap-2 mb-2'}`}>
					<Badge variant={compact ? 'amber' : 'pink'} size="sm">{test.category}</Badge>
				</div>
				<h3 className={`font-semibold text-neutral-900 mb-1 ${compact ? 'text-sm' : ''}`}>{test.title}</h3>
				<p className={`text-neutral-500 ${compact ? 'text-xs mb-2 line-clamp-1' : 'text-sm mb-3 line-clamp-2'}`}>{test.description}</p>
				{compact ? (
					<div className="text-xs text-neutral-400">{test.participants.toLocaleString()}명 참여</div>
				) : (
					<div className="flex items-center text-xs text-neutral-400">
						<Flame className="w-3 h-3 mr-1 text-orange-400" />
						<span>{test.participants.toLocaleString()}명 참여</span>
					</div>
				)}
			</div>
		</div>
	);
}
