import { AdminModulePage } from '@/components/admin/admin-module-page';

const items = [
  { title: '기사 DB → 공개 기사', description: '관리자가 articles 테이블에 저장한 published 기사가 홈, 카테고리, 기사 상세의 우선 데이터가 됩니다.', status: '핵심' },
  { title: '카테고리 DB → 메뉴·목록', description: 'categories 테이블의 이름, slug, 정렬값으로 공개 카테고리 메뉴와 목록 화면을 제어합니다.', status: '편성' },
  { title: '사이트 설정 → 푸터·등록정보', description: 'site_settings 데이터로 제호, 운영사, 대표자, 발행인, 편집인, 등록번호, 연락처를 관리합니다.', status: '설정' },
  { title: '대표 이미지 → 카드·상세 썸네일', description: 'thumbnail_url, image_caption, image_source_* 값이 공개 기사 카드와 상세 대표 이미지에 반영됩니다.', status: '이미지' },
  { title: '발행 상태 → 노출 여부', description: 'draft, review 상태는 관리자에서만 보이고 published 상태만 공개 화면에 노출됩니다.', status: '발행' },
  { title: '예약 발행 → 공개 시점', description: 'scheduled_at 값으로 예약 발행 대상을 관리하고, 예약 공개 작업과 연결할 수 있습니다.', status: '예약' },
  { title: '기사 배치 → 홈 섹션', description: '메인 톱뉴스, 최신뉴스, 랭킹뉴스, 스포트라이트, 인터뷰 등 홈 섹션 노출 순서를 관리합니다.', status: '홈' },
  { title: '제보·보도자료 → 접수함', description: '독자 제보, 기관 보도자료, 정정보도 요청을 접수 데이터로 보관하고 기사화 여부를 관리합니다.', status: '접수' },
  { title: '정책 페이지 → 심사 정보', description: '개인정보처리방침, 청소년보호정책, 이용약관, 정정보도 안내를 관리자 데이터로 관리합니다.', status: '정책' },
  { title: '광고 상태 → 노출 제어', description: '애드센스 승인 전에는 미노출, 승인 후에는 지정 슬롯만 활성화하는 방식으로 관리합니다.', status: '광고' },
  { title: '권한 → 편집 권한 분리', description: '발행인, 편집인, 기자, 외부 필진, 운영자 역할을 분리해 작성·검수·발행 권한을 구분합니다.', status: '권한' },
  { title: '운영 지표 → 점검판', description: '기사 수, 최근 발행일, 이미지 누락, 빈 카테고리, 접수 처리량을 신청 전 점검 지표로 확인합니다.', status: '통계' }
];

export default function AdminSystemPage() {
  return (
    <AdminModulePage
      eyebrow="MediaOffice Control Map"
      title="어드민이 공개 사이트를 제어하는 범위"
      description="에듀저널은 코드에 기사를 직접 박아 넣는 방식에서 벗어나, 관리자 데이터베이스를 공개 사이트의 우선 데이터로 사용하는 구조로 전환합니다. 아래 항목은 관리자에서 조작하면 프론트 화면에 반영되는 핵심 범위입니다."
      items={items}
      primaryHref="/admin/articles/new"
      primaryLabel="기사 작성하기"
    />
  );
}
