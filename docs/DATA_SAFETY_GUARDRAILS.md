# 데이터 안정성·무결성 운영 가드레일

이 문서는 GitHub, Vercel, Supabase 운영 중 데이터 꼬임·소멸·운영 DB 오염을 막기 위한 기본 정책이다.

## 1. 환경 분리

운영 환경은 반드시 아래처럼 분리한다.

| 구분 | 용도 | Vercel Environment | Supabase Project |
|---|---|---|---|
| Production | 실제 사이트 | Production | 운영 DB |
| Preview | PR/브랜치 미리보기 | Preview | 개발/스테이징 DB |
| Development | 로컬 개발 | Development | 로컬 또는 개발 DB |

금지 사항:

- 로컬 `.env.local`이 운영 Supabase 프로젝트를 바라보면 안 된다.
- Vercel Preview 환경변수가 운영 Supabase URL/KEY를 바라보면 안 된다.
- 테스트용 seed, reset, truncate, delete-all 스크립트를 운영 DB에서 실행하면 안 된다.

Vercel에서 확인할 항목:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

위 값이 Production / Preview / Development별로 다르게 설정되어 있는지 확인한다.

## 2. GitHub 배포 프로세스

main 브랜치는 운영 배포 브랜치로 취급한다.

권장 Branch Protection Rule:

- Require a pull request before merging
- Require approvals: 1명 이상
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Restrict force pushes
- Restrict deletions
- Do not allow bypassing the above settings

이 저장소 작업 원칙:

- main 직접 push 금지
- 기능 수정은 `feature/*`, 버그 수정은 `fix/*`, 운영 안전 조치는 `chore/*` 브랜치 사용
- PR 설명에 DB 변경 여부와 마이그레이션 영향도를 반드시 적는다

## 3. 마이그레이션 관리

DB 스키마 변경은 `sql/migrations/`에 누적 파일로 추가한다.

원칙:

- 기존 컬럼 삭제 금지
- 기존 데이터 truncate 금지
- `drop table`, `delete from`, `truncate`, `alter column type`은 운영 전 별도 검토 필요
- nullable 컬럼 추가 → 데이터 백필 → not null 전환 순서로 진행
- seed.sql은 신규 프로젝트 초기화용으로만 사용하고, 운영 DB에 반복 실행하지 않는다

마이그레이션 파일명 예시:

`20260617_add_article_image_metadata.sql`

## 4. 배포 전 데이터 정합성 체크

PR 병합 전 체크리스트:

- [ ] 운영 DB 연결 문자열을 코드나 문서에 노출하지 않았다.
- [ ] `sql/seed.sql`을 운영 배포 과정에서 자동 실행하지 않는다.
- [ ] destructive SQL이 없다.
- [ ] 새 컬럼은 기존 데이터에 안전한 기본값 또는 nullable로 추가했다.
- [ ] RLS 정책이 공개 데이터와 관리자 데이터를 분리한다.
- [ ] Supabase Service Role Key가 클라이언트에 노출되지 않는다.

## 5. 백업 정책

운영 DB는 최소 아래 정책을 따른다.

- 스키마 변경 전 수동 백업 또는 Supabase 백업 확인
- 주요 릴리스 전 DB dump 보관
- 주문, 리드, 고객, 기사 데이터는 삭제보다 soft delete 우선
- 관리자에서 삭제 기능은 기본적으로 비활성화하고, 보관/비공개 처리 우선

## 6. 관리자 페이지 데이터 정책

관리자 페이지는 운영 데이터의 단일 입력 창구다.

기사 이미지 관련 필수 입력:

- 대표 이미지 URL 또는 업로드 파일
- 이미지 캡션
- 출처명
- 원본 URL
- 라이선스명
- 권리 확인 여부

기사 발행 전 필수 검토:

- 제휴 콘텐츠 표시 여부
- 금지 표현 여부
- 이미지 권리 확인 여부
- 개인정보 노출 여부
- 발행 상태와 공개 여부

## 7. 자동화 제한

MVP에서는 아래 자동화를 금지한다.

- 운영 DB 자동 reset
- 운영 DB seed 자동 실행
- 문자 자동발송
- 결제 자동취소/환불
- AI 생성 이미지 자동 대표 이미지 확정
- 관리자 승인 없는 자동 발행
