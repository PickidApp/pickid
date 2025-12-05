# PickID

모노레포 + 터보레포로 구성된 프로젝트입니다.

## 구조

- `apps/web`: Next.js 기반 웹 애플리케이션
- `apps/admin`: React + Vite 기반 어드민 애플리케이션

## 시작하기

### 의존성 설치

```bash
pnpm install
```

### 개발 서버 실행

모든 앱을 동시에 실행:

```bash
pnpm dev
```

개별 앱 실행:

```bash
# 웹 앱
pnpm --filter web dev

# 어드민 앱
pnpm --filter admin dev
```

### 빌드

모든 앱 빌드:

```bash
pnpm build
```

개별 앱 빌드:

```bash
pnpm --filter web build
pnpm --filter admin build
```

## 기술 스택

- **모노레포**: Turborepo
- **패키지 매니저**: pnpm
- **웹**: Next.js 14
- **어드민**: React 18 + Vite 5
- **언어**: TypeScript
