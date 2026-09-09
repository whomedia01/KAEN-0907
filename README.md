# Algo Partners MediaOffice

알고파트너스가 운영하는 생활경제 전문 매체 **생활경제저널**과 1인 매체 운영 시스템 **MediaOffice**의 Next.js + Supabase MVP입니다.

## 핵심 기능

- 공개 매체 사이트
- 기사 목록/상세/카테고리
- 광고·제휴 상품 안내
- 브랜드 인터뷰 신청 폼
- 필수/선택 동의 체크박스
- 정책 페이지
- 관리자 로그인
- 관리자 대시보드 초안
- 기사 작성 초안
- 리드/고객/영업/상품/주문/납품/템플릿 관리 스켈레톤
- AI 프롬프트 생성기
- 제휴 콘텐츠 고지 자동화
- 금지 표현 감지 함수

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth/Database/Storage
- Vercel 배포 기준
- Resend 이메일 연동 준비

## 브랜드 구조

- 운영사: 알고파트너스 / Algo Partners
- 매체명: 생활경제저널 / Everyday Economy Journal
- 관리자 툴: MediaOffice
- 사업 영역: 인터넷 매체 운영, 브랜드 인터뷰, 제휴 콘텐츠, 광고대행, 콘텐츠 제작, AI 마케팅 컨설팅

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## 환경변수

`.env.local`에 아래 값을 입력하세요.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_EMAIL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY`는 클라이언트에 노출하면 안 됩니다.

## Supabase 설정

1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 `sql/schema.sql`을 실행합니다.
3. SQL Editor에서 `sql/seed.sql`을 실행합니다.
4. Authentication에서 관리자 이메일 계정을 생성합니다.
5. `.env.local`의 `ADMIN_EMAIL`에 관리자 이메일을 입력합니다.

## 관리자 접속

```text
/admin/login
```

Supabase Auth에서 만든 관리자 이메일/비밀번호로 로그인합니다.

## 오픈 전 체크리스트

- 사업자등록 완료
- 통신판매업 신고 여부 확인
- 인터넷신문 등록 여부 결정
- 푸터 사업자 정보 입력
- 개인정보처리방침 확인
- 이용약관 확인
- 환불정책 확인
- 제휴 콘텐츠 윤리정책 확인
- 광고 상품 가격표 확인
- 신청 폼 동의 체크박스 테스트
- 제휴 콘텐츠 고지문 노출 테스트
- 리드 동의 정보 저장 테스트
- 관리자 계정 보안 확인
- 등록 전 “언론사/신문사/보도 송출” 표현 미사용 확인
- 금지 표현 체크 테스트
- 수신동의 없는 문자 자동발송 기능 없음 확인

## 법무 주의

본 프로젝트에 포함된 약관/정책 문구는 운영 초안이며, 실제 서비스 오픈 전에는 변호사, 세무사, 노무사 또는 관련 전문가의 검토를 받는 것을 권장합니다.

## Codex 작업

Codex에는 `docs/CODEX_TASK.md`를 먼저 읽게 하고, Step 1부터 진행시키세요.
