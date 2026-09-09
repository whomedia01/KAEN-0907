# 생활경제저널 합법적 뉴스 자동화 파이프라인 지시서

이 문서는 생활경제저널의 뉴스 자동화 시스템을 설계하기 위한 기준이다.  
목표는 외부 언론사의 기사를 복제하거나 표현만 바꿔 발행하는 것이 아니라, 공개 메타데이터와 확인 가능한 사실을 바탕으로 편집부 검수용 기사 초안을 생성하는 것이다.

## 1. 금지 원칙

다음 방식은 구현하지 않는다.

- 외부 기사 본문 전체를 크롤링해 저장
- 외부 기사 문장을 AI로 바꿔 저작권을 회피하려는 목적의 재작성
- RSS 제목과 본문을 조합해 자동 발행
- 관리자 검수 없이 `published` 상태로 자동 insert
- 원문 출처를 숨기거나 내부 기사처럼 위장
- created_at 또는 published_at을 과거 송출 이력처럼 조작

## 2. 허용 원칙

다음 방식만 허용한다.

- RSS 또는 공식 API에서 제목, 링크, 발행일, 요약 등 공개 메타데이터만 수집
- 원문 URL을 `source_urls`에 저장
- 기사 본문은 공개 원문 복제가 아니라, 확인 가능한 사실과 편집부 관점으로 새로 작성한 초안으로 생성
- 초안은 기본 `status = review`, `editorial_status = review`로 저장
- 관리자가 출처 확인, 사실 확인, 이미지 권리 확인 후 발행
- 보도자료, 공공기관 발표, 통계자료, 직접 취재, 광고주 제공자료는 출처와 권리 상태를 별도 기록

## 3. 자동화 파이프라인

```text
[Step 1: 수집]
공식 RSS/API에서 제목, 링크, 발행일, 요약 등 메타데이터 수집

[Step 2: 중복 검사]
source_url, raw_title, normalized_title 기준으로 중복 제거

[Step 3: 후보 분류]
생활경제저널 9개 카테고리 중 하나로 분류

[Step 4: 편집부 초안 생성]
원문 표현을 복제하지 않고, 확인 가능한 사실·공개자료·편집부 관점으로 기사 초안 생성

[Step 5: DB 저장]
status = review, editorial_status = review, fact_checked = false로 저장

[Step 6: 관리자 검수]
출처, 사실, 이미지, 금지표현, 광고성 여부 확인

[Step 7: 예약 또는 발행]
관리자가 scheduled_at 또는 published 상태를 직접 결정
```

## 4. DB 저장 기본값

자동화로 생성되는 기사는 절대 즉시 공개하지 않는다.

```json
{
  "status": "review",
  "editorial_status": "review",
  "fact_checked": false,
  "source_urls": ["https://original-source.example/article"],
  "source_note": "RSS 메타데이터와 공개 출처를 바탕으로 작성된 편집부 검수용 초안",
  "scheduled_at": null,
  "published_at": null
}
```

## 5. AI 초안 생성 프롬프트

아래 프롬프트는 외부 기사 복제용이 아니라, 편집부 검수용 초안 생성을 위한 것이다.

```text
너는 생활경제 전문 인터넷매체 '생활경제저널'의 편집 기자다.
입력된 외부 기사 메타데이터와 공개적으로 확인 가능한 사실을 바탕으로, 생활경제저널 독자에게 의미 있는 기사 초안을 작성한다.

중요 원칙:
1. 원문 기사의 문장, 문단 구조, 표현을 복제하지 않는다.
2. 원문을 숨기거나 내부 취재처럼 위장하지 않는다.
3. 확인 가능한 사실과 출처를 source_note에 남긴다.
4. 추측, 단정, 과장, 광고성 표현을 피한다.
5. 결과물은 공개 발행본이 아니라 편집부 검수용 초안이다.
6. 기사 본문에는 [리드], [배경] 같은 관리자용 라벨을 넣지 않는다.
7. 완성형 보도문처럼 자연스러운 문단으로 작성한다.

입력:
- 원문 제목: {raw_title}
- 원문 링크: {source_url}
- 원문 요약: {raw_summary}
- 발행일: {raw_published_at}
- 참고 공개자료: {public_references}

출력은 JSON만 반환한다.

{
  "category": "lifestyle_economy | local_market | education | senior_care | health_beauty | franchise | interview | opinion | press_release 중 하나",
  "title": "생활경제저널 스타일의 새 제목",
  "subtitle": "기사 의미를 설명하는 부제",
  "summary": "핵심 요약 1~2문장",
  "content": "완성형 기사 본문. 최소 900자 이상. 자연스러운 보도체 문단으로 작성. 관리자용 섹션 라벨 금지.",
  "author_name": "생활경제저널 편집부",
  "status": "review",
  "editorial_status": "review",
  "fact_checked": false,
  "source_urls": ["{source_url}"],
  "source_note": "초안 작성에 참고한 공개 출처와 확인 필요 사항",
  "thumbnail_url": null,
  "image_source_name": null,
  "image_license": null
}
```

## 6. 기사 본문 품질 기준

초안 본문은 다음 기준을 만족해야 한다.

- 최소 900자 이상
- 6개 이상 자연 문단
- 첫 문단에서 핵심 이슈 제시
- 중간 문단에서 배경, 현장 맥락, 독자 영향 설명
- 마지막 문단에서 전망 또는 확인할 과제 정리
- `~다`, `~분석된다`, `~전망된다`, `~필요하다는 지적이다` 등 보도체 사용
- `[리드]`, `[배경]`, `[현장 맥락]` 같은 라벨 금지
- 원문 기사와 동일한 제목, 문장, 배열 금지

## 7. 관리자 검수 체크리스트

자동화 초안은 발행 전 관리자가 반드시 확인한다.

- 원문 출처 URL 저장 여부
- 공개자료 또는 보도자료 근거 확인 여부
- 본문 내 원문 문장 복제 여부
- 제목이 과장·선정적이지 않은지 여부
- 이미지 출처와 라이선스 확인 여부
- 민감 업종 표현 검토 여부
- 금지 표현 탐지 결과 확인 여부
- fact_checked 체크 여부

## 8. 배포 및 실행 방식

권장 실행 방식:

- GitHub Actions 또는 Supabase Edge Function은 초안 생성까지만 수행
- Vercel Cron 사용 시에도 published 자동 저장 금지
- 운영 DB에는 review 상태로만 insert
- 발행은 관리자 화면에서만 수행

## 9. 핵심 결론

생활경제저널의 자동화는 '무단 재작성 자동발행'이 아니라 '출처 기반 편집부 초안 생성 자동화'여야 한다.  
이 기준을 지켜야 저작권, 신뢰도, 정기간행물 심사, 운영 데이터 무결성을 함께 보호할 수 있다.
