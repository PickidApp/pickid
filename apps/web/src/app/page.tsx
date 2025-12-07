/**
 * 홈 페이지 구현 TODO (WEB-PRD.md 참조)
 *
 * [테스트 관리 연동]
 * TODO: 테스트 목록 조회 API 연동 (published 상태만)
 * TODO: 테스트 상세 정보 표시 (제목, 설명, 썸네일, 예상 소요시간, 카테고리)
 * TODO: 테스트 메타데이터 표시 (시리즈 정보, 테마 정보)
 *
 * [홈 페이지 섹션]
 * TODO: Hero Section - 서비스 소개 및 CTA
 * TODO: Banner Carousel - 배너 슬라이드
 * TODO: Category Filter Navigation - 카테고리 필터
 * TODO: Today's Test Section - 오늘의 테스트 (recommended_slot: 'today_pick')
 * TODO: This Week HOT Section - 인기 테스트 (최근 7일 참여수 기준)
 * TODO: Balance Game Section - 밸런스 게임
 * TODO: New Tests Section - 신규 테스트
 * TODO: Recommended Tests Section - 추천 테스트 (recommended_slot: 'theme_pick')
 * TODO: Hall of Fame Section - 명예의 전당
 *
 * [시리즈/테마 기능]
 * TODO: 시리즈별 테스트 그룹핑 표시
 * TODO: 테마별 테스트 필터링
 * TODO: 시리즈 내 순서(series_order) 표시
 *
 * [테마 배너 섹션] - 기간 한정 캠페인/이벤트 프로모션
 * TODO: 테마 배너 컴포넌트 구현
 *   - 활성화된 테마 목록 조회 (is_active: true, 현재 날짜가 start_date ~ end_date 범위 내)
 *   - 배너 형태로 테마 표시 (테마 이름, 설명, 썸네일)
 *   - 예: "여름 특집 밸런스게임 모아보기", "시험기간 스트레스 해소 테스트"
 * TODO: 테마 상세 페이지 (/themes/[slug])
 *   - 해당 테마에 속한 테스트 목록 표시
 *   - 테마 설명 및 기간 표시
 * TODO: 테마 배너 클릭 시 테마 상세 페이지로 이동
 * TODO: 홈페이지에 테마 배너 섹션 추가 (Banner Carousel 또는 별도 섹션)
 * TODO: 테마 종료 D-day 카운트다운 표시 (선택)
 */

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          PickID Web
        </h1>
        <p className="text-center text-gray-600">
          Next.js 기반 웹 애플리케이션
        </p>
      </div>
    </main>
  )
}

