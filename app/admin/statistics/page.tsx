import { AdminModulePage } from '@/components/admin/admin-module-page';

export default function AdminStatisticsPage() {
  return (
    <AdminModulePage
      eyebrow="Analytics"
      title="접속·콘텐츠 통계"
      description="애드센스 승인과 광고주 제안에 필요한 콘텐츠 운영 지표를 확인하는 영역입니다. 초기에는 내부 통계 구조를 마련하고, 이후 Vercel Analytics 또는 별도 로그 테이블을 연결합니다."
      items={[
        { title: '기사 발행량', description: '카테고리별 발행 기사 수, 검수 대기 기사 수, 예약 발행 수를 확인합니다.', status: '콘텐츠' },
        { title: '인기 기사', description: '많이 본 뉴스, 관련기사, 우측 사이드바 추천 기사 구성에 활용합니다.', status: '편집' },
        { title: '제보 전환', description: '기사제보와 광고 문의가 실제 고객 상담으로 이어지는 흐름을 확인합니다.', status: '리드' },
        { title: '광고주 리포트', description: '브랜드 인터뷰 링크, 납품 콘텐츠, 발행일, 노출 위치를 고객에게 보고합니다.', status: 'B2B' },
        { title: '애드센스 준비', description: '광고 승인 전 콘텐츠 수, 정책 페이지, 카테고리 분포, 빈 페이지 여부를 점검합니다.', status: '승인' },
        { title: '개인정보 최소화', description: '개별 방문자 식별보다 집계 통계 중심으로 운영해 개인정보 리스크를 줄입니다.', status: '보안' }
      ]}
      primaryHref="/admin/articles"
      primaryLabel="기사 관리"
    />
  );
}
