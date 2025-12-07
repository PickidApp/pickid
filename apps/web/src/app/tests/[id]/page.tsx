/**
 * 테스트 상세/진행 페이지 구현 TODO (WEB-PRD.md 참조)
 *
 * [테스트 정보 표시]
 * TODO: 테스트 기본 정보 조회 (제목, 설명, 썸네일, 소개 텍스트)
 * TODO: 예상 소요 시간 표시 (estimated_time_minutes)
 * TODO: 카테고리 정보 표시
 * TODO: 시리즈 정보 표시 (series_id, series_order) - "시리즈 N화" 형식
 * TODO: 테마 정보 표시 (theme_id)
 *
 * [테스트 시작 화면]
 * TODO: 테스트 시작 버튼
 * TODO: 성별 입력 폼 (requires_gender가 true인 경우)
 * TODO: 테스트 시작 카운트 증가 (increment_test_start RPC)
 *
 * [테스트 진행]
 * TODO: 질문 목록 조회 (question_order 순서대로)
 * TODO: 질문별 선택지 표시
 * TODO: 이미지 질문 지원 (image_url)
 * TODO: 진행률 표시
 * TODO: 이전/다음 질문 네비게이션
 * TODO: 답변 저장 (test_session_answers)
 *
 * [세션 관리]
 * TODO: test_session 생성
 * TODO: 완료 시 상태 업데이트 (status: 'completed')
 * TODO: 완료 시간 기록 (completion_time_seconds)
 *
 * [시리즈 연동]
 * TODO: 같은 시리즈의 다른 테스트 표시
 * TODO: 시리즈 내 이전/다음 테스트 네비게이션
 */

interface TestPageProps {
  params: Promise<{ id: string }>;
}

export default async function TestPage({ params }: TestPageProps) {
  const { id } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">테스트 상세</h1>
        <p className="text-center text-gray-600">테스트 ID: {id}</p>
      </div>
    </main>
  );
}
