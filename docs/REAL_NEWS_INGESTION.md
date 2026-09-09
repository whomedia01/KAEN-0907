# 생활경제저널 실제 뉴스 수집·초안 생성 운영 가이드

## 원칙

생활경제저널은 타 언론사의 기사 본문을 무단 복제하거나, 본문을 긁어와 AI로 바꿔치기한 뒤 자동 발행하지 않는다.

자동화는 다음 범위까지만 수행한다.

1. 공식 RSS/API의 메타데이터 수집
2. 제목, 링크, 요약, 발행일, 출처명 저장
3. 생활경제저널 카테고리 자동 분류
4. 원문 본문 복제 없는 편집부 검수용 초안 생성
5. `status = review`, `editorial_status = review`로 DB 적재
6. 관리자 검수 후 예약 발행 또는 발행

## 금지

- 원문 본문 전체 크롤링
- AI 재작성으로 저작권 회피를 목적으로 한 자동 발행
- 출처 URL 없는 기사 생성
- `published` 상태 자동 insert
- 운영 DB에서 검수 없는 대량 발행

## 실행 방법

환경변수 설정 후 기본은 dry run으로 실행한다.

```bash
npm run ingest:news
```

실제 Supabase에 review 초안을 넣으려면 명시적으로 실행한다.

```bash
DRY_RUN=false MAX_ITEMS_PER_SOURCE=5 npm run ingest:news
```

## 데이터 저장 기준

자동 수집된 기사는 아래 상태로 들어간다.

```text
status = review
editorial_status = review
fact_checked = false
published_at = null
source_urls = [원문 링크]
source_note = 출처와 검수 필요 사항
```

관리자는 원문 링크를 확인하고 사실관계, 문체, 이미지 권리, 중간 이미지, 캡션을 검수한 뒤 발행한다.

## 소스 추가

`seeds/rss-sources.json`에 공식 RSS를 추가한다.

```json
{
  "name": "출처명",
  "url": "https://example.com/rss.xml",
  "defaultCategory": "생활경제",
  "kind": "rss"
}
```

## 이미지

자동 수집 단계에서는 외부 기사 이미지를 가져오지 않는다. 이미지는 관리자 검수 단계에서 다음 중 하나로 지정한다.

- 직접 촬영 이미지
- 권리 확인된 제공 이미지
- 사용 조건이 확인된 무료 이미지
- 공공기관 공식 배포 이미지 중 재사용 조건이 확인된 이미지

모든 이미지는 caption, credit, license 정보를 저장한다.
