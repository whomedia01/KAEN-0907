import { AdminModulePage } from '@/components/admin/admin-module-page';

export default function AdminAdsensePage() {
  return (
    <AdminModulePage
      eyebrow="AdSense Readiness"
      title="애드센스 승인 준비"
      description="승인 전에는 광고 영역을 노출하지 않고, 콘텐츠 품질·정책 페이지·사업자 정보·ads.txt 준비 상태를 관리합니다. 승인 후 환경변수로 광고 슬롯을 활성화합니다."
      items={[
        { title: '광고 미노출 기본값', description: 'NEXT_PUBLIC_ADSENSE_ENABLED=false 상태에서는 광고 스크립트와 슬롯이 렌더링되지 않습니다.', status: '승인 전' },
        { title: '정책 페이지', description: '개인정보처리방침, 이용약관, 청소년보호정책, 저작권보호정책, 광고·제휴 정책을 유지합니다.', status: '정책' },
        { title: '충분한 콘텐츠', description: '카테고리별 자체 기사, 이미지, 캡션, 저작권 고지를 갖춘 페이지를 확보합니다.', status: '콘텐츠' },
        { title: 'ads.txt', description: 'AdSense client ID가 설정되면 /ads.txt에서 Google 형식의 레코드를 출력합니다.', status: '준비' },
        { title: '광고 슬롯', description: '상단, 하단, 사이드바, 인피드 슬롯은 승인 이후에만 환경변수로 켭니다.', status: '슬롯' },
        { title: '오해 방지', description: '광고 클릭 유도 문구, 콘텐츠와 광고가 혼동되는 배치, 빈 광고 박스를 금지합니다.', status: '준수' }
      ]}
      primaryHref="/admin/settings"
      primaryLabel="사이트 정보 확인"
    />
  );
}
