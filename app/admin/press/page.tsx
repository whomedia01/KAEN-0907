import { AdminModulePage } from '@/components/admin/admin-module-page';

export default function AdminPressPage() {
  return (
    <AdminModulePage
      eyebrow="Press Desk"
      title="보도자료 관리"
      description="기관·기업·광고주가 제공한 자료를 그대로 복사하지 않고, 출처와 제공 주체를 남긴 뒤 편집부 검수 기사로 전환합니다."
      items={[
        { title: '자료 접수', description: '이메일, 제보 폼, 광고주 제출 자료를 보도자료 후보로 저장합니다.', status: '접수' },
        { title: '출처 기록', description: '제공 기관, 담당자, 원문 URL, 제공일, 사용 허락 여부를 기록합니다.', status: '출처' },
        { title: '기사화 검수', description: '홍보성 문구를 보도체로 정리하고 사실관계와 과장 표현을 점검합니다.', status: '검수' },
        { title: '제휴 고지 판단', description: '유료 제작·광고 목적이면 브랜드 인터뷰 또는 제휴 콘텐츠로 분류합니다.', status: '고지' },
        { title: '첨부자료 관리', description: '로고, 사진, PDF, 통계표 등 첨부 자료의 권리 확인 여부를 저장합니다.', status: '첨부' },
        { title: '발행 전 승인', description: '민감 업종, 인증·수상 표현, 공공기관 오인 표현은 발행 전 별도 확인합니다.', status: '승인' }
      ]}
      primaryHref="/admin/leads"
      primaryLabel="접수 내역 보기"
    />
  );
}
