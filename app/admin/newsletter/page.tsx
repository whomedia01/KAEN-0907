import { AdminModulePage } from '@/components/admin/admin-module-page';

export default function AdminNewsletterPage() {
  return (
    <AdminModulePage
      eyebrow="Newsletter"
      title="뉴스레터·메일링"
      description="독자 뉴스레터와 광고주 안내 메일을 구분합니다. 수신동의가 없는 대상에게 광고성 정보를 발송하지 않도록 안전장치를 둡니다."
      items={[
        { title: '독자 뉴스레터', description: '주요 기사, 생활경제 이슈, 주간 인기기사 중심의 독자용 메일을 준비합니다.', status: '독자' },
        { title: '광고주 안내', description: '브랜드 인터뷰, 제휴 콘텐츠, 납품 안내는 수신동의가 있는 고객에게만 발송합니다.', status: '광고' },
        { title: '수신동의 관리', description: 'email_marketing_agreed, sms_marketing_agreed, marketing_withdrawn_at 값을 확인합니다.', status: '동의' },
        { title: '템플릿 관리', description: '발행 알림, 제휴 안내, 납품 완료, 후속 상담 메일 템플릿을 분리합니다.', status: '템플릿' },
        { title: '발송 전 검수', description: '광고성 문구, 수신거부 안내, 전송자 정보가 포함됐는지 확인합니다.', status: '검수' },
        { title: '초기 정책', description: 'MVP에서는 자동 대량 발송을 금지하고, 검수 후 수동 발송 또는 제한된 발송만 허용합니다.', status: 'MVP' }
      ]}
      primaryHref="/admin/templates"
      primaryLabel="템플릿 보기"
    />
  );
}
