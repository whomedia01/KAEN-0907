import { AdminModulePage } from '@/components/admin/admin-module-page';

export default function AdminCategoriesPage() {
  return (
    <AdminModulePage
      eyebrow="Section Desk"
      title="카테고리·섹션 관리"
      description="인터넷매체의 메뉴와 기사 분류 체계를 관리합니다. 카테고리는 공개 헤더, 메인 편집판, 기사 목록, SEO 구조와 연결됩니다."
      items={[
        { title: '기본 섹션', description: '생활경제, 지역상권, 교육·학원, 시니어·요양, 건강·뷰티, 창업·프랜차이즈를 기본 섹션으로 운영합니다.', status: '운영' },
        { title: '브랜드 인터뷰', description: '제휴 콘텐츠 고지가 필요한 인터뷰성 기사와 일반 보도기사를 분리합니다.', status: '제휴' },
        { title: '오피니언·보도자료', description: '편집부 칼럼, 외부 기고, 기관·기업 보도자료를 별도 섹션으로 관리합니다.', status: '확장' },
        { title: '노출 순서', description: '헤더 메뉴, 메인 섹션, 카테고리 페이지의 노출 순서를 sort_order 기준으로 정리합니다.', status: '편성' },
        { title: 'SEO 슬러그', description: '영문 slug를 고정해 검색엔진과 공유 URL이 깨지지 않게 관리합니다.', status: 'SEO' },
        { title: '등록 심사 대비', description: '매체가 지속적으로 운영되는 것처럼 카테고리별 기사 분포를 점검합니다.', status: '심사' }
      ]}
      primaryHref="/admin/articles/new"
      primaryLabel="기사 작성"
    />
  );
}
