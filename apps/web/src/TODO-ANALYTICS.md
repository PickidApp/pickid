# Web Analytics TODO

어드민 대시보드에 실제 데이터가 표시되려면 웹에서 다음 테이블들에 데이터를 기록해야 합니다.

## 필요한 테이블 & 데이터 기록 시점

### 1. `web_sessions` - 웹 방문 세션
**기록 시점**: 사용자가 웹사이트에 처음 방문할 때
**필요 데이터**:
- `id`: UUID (자동 생성)
- `user_id`: 로그인 사용자의 경우 user_id, 비로그인은 null
- `started_at`: 세션 시작 시간
- `channel`: 유입 채널 (utm_source 또는 referrer 기반)
- `converted`: 테스트 시작 여부 (boolean)

```typescript
// TODO: 웹 방문 시 세션 기록
// shared/api/services/analytics.service.ts
export const analyticsService = {
  async createWebSession(channel: string, userId?: string) {
    const { data, error } = await supabase
      .from('web_sessions')
      .insert({
        user_id: userId || null,
        channel,
        started_at: new Date().toISOString(),
        converted: false,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data;
  },

  async markWebSessionConverted(sessionId: string) {
    const { error } = await supabase
      .from('web_sessions')
      .update({ converted: true })
      .eq('id', sessionId);

    if (error) throw error;
  },
};
```

### 2. `test_sessions` - 테스트 참여 세션
**기록 시점**:
- INSERT: 사용자가 테스트를 시작할 때 (status: 'in_progress')
- UPDATE: 사용자가 테스트를 완료할 때 (status: 'completed')

**필요 데이터**:
- `id`: UUID (자동 생성)
- `test_id`: 테스트 ID
- `user_id`: 사용자 ID (비로그인은 null)
- `started_at`: 시작 시간
- `completed_at`: 완료 시간 (완료 시 업데이트)
- `status`: 'in_progress' | 'completed' | 'abandoned'

```typescript
// TODO: 테스트 시작 시
export async function startTestSession(testId: string, userId?: string) {
  const { data, error } = await supabase
    .from('test_sessions')
    .insert({
      test_id: testId,
      user_id: userId || null,
      started_at: new Date().toISOString(),
      status: 'in_progress',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

// TODO: 테스트 완료 시
export async function completeTestSession(sessionId: string) {
  const { error } = await supabase
    .from('test_sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) throw error;
}
```

### 3. `funnel_events` - 퍼널 이벤트
**기록 시점**: 각 퍼널 단계에서 이벤트 발생 시
**퍼널 단계**:
- `visit`: 테스트 페이지 방문
- `test_start`: 테스트 시작 버튼 클릭
- `test_complete`: 테스트 완료 (결과 페이지 도달)

**필요 데이터**:
- `id`: UUID (자동 생성)
- `test_id`: 테스트 ID (visit 단계는 null 가능)
- `user_id`: 사용자 ID
- `funnel_step`: 퍼널 단계
- `occurred_at`: 발생 시간

```typescript
// TODO: 퍼널 이벤트 기록
export async function trackFunnelEvent(
  step: 'visit' | 'test_start' | 'test_complete',
  testId?: string,
  userId?: string
) {
  const { error } = await supabase
    .from('funnel_events')
    .insert({
      funnel_step: step,
      test_id: testId || null,
      user_id: userId || null,
      occurred_at: new Date().toISOString(),
    });

  if (error) throw error;
}
```

## 구현 위치 제안

### 1. 웹 세션 추적
```
apps/web/src/
├── shared/
│   └── api/
│       └── services/
│           └── analytics.service.ts  # 분석 관련 API
│
├── app/
│   └── layout.tsx  # 최초 방문 시 웹 세션 생성 (쿠키로 중복 방지)
```

### 2. 테스트 세션 추적
```
apps/web/src/
├── features/
│   └── test/
│       ├── hooks/
│       │   └── api/
│       │       └── useStartTestMutation.ts  # 테스트 시작 시 세션 생성
│       │       └── useCompleteTestMutation.ts  # 테스트 완료 시 세션 업데이트
│       └── components/
│           └── TestStartButton.tsx  # 시작 버튼 - trackFunnelEvent('test_start')
```

### 3. 퍼널 이벤트 추적
- `visit`: 테스트 상세 페이지 진입 시 (page.tsx의 useEffect)
- `test_start`: 테스트 시작 버튼 클릭 시
- `test_complete`: 결과 페이지 진입 시

## 채널 감지 로직
```typescript
// TODO: 유입 채널 감지
function detectChannel(): string {
  if (typeof window === 'undefined') return 'direct';

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');

  if (utmSource) return utmSource;

  const referrer = document.referrer;
  if (!referrer) return 'direct';

  const referrerHost = new URL(referrer).hostname;

  if (referrerHost.includes('google')) return 'google';
  if (referrerHost.includes('naver')) return 'naver';
  if (referrerHost.includes('instagram')) return 'instagram';
  if (referrerHost.includes('facebook')) return 'facebook';
  if (referrerHost.includes('twitter') || referrerHost.includes('x.com')) return 'twitter';
  if (referrerHost.includes('tiktok')) return 'tiktok';

  return 'referral';
}
```

## 주의사항
1. 세션 ID는 브라우저 쿠키 또는 sessionStorage에 저장하여 중복 생성 방지
2. 비로그인 사용자도 추적 가능하도록 user_id는 nullable
3. 테스트 완료 시 web_session의 converted도 true로 업데이트
