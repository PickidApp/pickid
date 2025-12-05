# Supabase Storage 설정 가이드

이미지 업로드 기능을 사용하려면 Supabase Storage에 `tests` 버킷을 생성해야 합니다.

## 버킷 구조

```
tests/                          # 단일 버킷
├── thumbnails/                 # 테스트 썸네일
├── questions/                  # 질문 이미지
└── results/
    ├── thumbnails/             # 결과 썸네일
    └── backgrounds/            # 결과 배경 이미지
```

## 버킷 생성 방법

### 1. Supabase Dashboard 접속

```
https://supabase.com/dashboard/project/YOUR_PROJECT_ID
```

### 2. Storage 메뉴에서 버킷 생성

1. 왼쪽 사이드바에서 **Storage** 클릭
2. **New Bucket** 버튼 클릭

### 3. tests 버킷 설정

```
Name: tests
Public bucket: ✅ (체크)
File size limit: 5MB
Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp, image/gif
```

## RLS (Row Level Security) 정책

### SQL Editor에서 실행

```sql
-- 읽기 정책 (모든 사용자)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'tests');

-- 업로드 정책 (인증된 사용자)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tests');

-- 삭제 정책 (인증된 사용자)
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'tests');
```

## 사용 예시

```typescript
import { uploadFile } from '@/lib/storage/upload';

// 테스트 썸네일 업로드
const result = await uploadFile(file, {
  folder: 'thumbnails',
  maxSizeMB: 3,
});

// 질문 이미지 업로드
const result = await uploadFile(file, {
  folder: 'questions',
  maxSizeMB: 3,
});

// 결과 썸네일 업로드
const result = await uploadFile(file, {
  folder: 'results/thumbnails',
  maxSizeMB: 3,
});

// 결과 배경 이미지 업로드
const result = await uploadFile(file, {
  folder: 'results/backgrounds',
  maxSizeMB: 5,
});
```

## 문제 해결

### 업로드 실패 시

1. **버킷이 Public인지 확인**: Storage > 버킷 설정 > Public bucket 체크
2. **RLS 정책 확인**: 위의 정책들이 추가되었는지 확인
3. **파일 크기 확인**: 5MB 이하인지 확인
4. **MIME 타입 확인**: 허용된 이미지 형식인지 확인

### 이미지가 보이지 않을 때

1. **Public URL 확인**: `getPublicUrl()` 함수가 제대로 호출되는지 확인
2. **CORS 설정**: Supabase Dashboard > Settings > API > CORS에 도메인 추가

## 참고 파일

- 업로드 유틸: `apps/admin/src/lib/storage/upload.ts`
- 이미지 컴포넌트: `apps/admin/src/components/common/image-upload.tsx`
