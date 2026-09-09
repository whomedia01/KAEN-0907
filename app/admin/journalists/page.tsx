import { AdminModulePage } from '@/components/admin/admin-module-page';

export default function AdminJournalistsPage() {
  return (
    <AdminModulePage
      eyebrow="Editorial Accounts"
      title="기자·운영자 계정"
      description="인터넷신문 등록과 운영을 고려해 발행인, 편집인, 청소년보호책임자, 기자명, 관리자 권한을 분리해서 관리합니다."
      items={[
        { title: '발행인·편집인', description: '푸터와 등록정보에 표시되는 발행인·편집인 정보를 사이트 설정과 연결합니다.', status: '등록' },
        { title: '기자명 관리', description: '기사별 author_name을 편집부, 기자명, 외부기고 등으로 구분합니다.', status: '기사' },
        { title: '권한 분리', description: '기사 작성자, 검수자, 발행자, 사업 관리자 권한을 단계적으로 분리합니다.', status: '권한' },
        { title: '청소년보호책임자', description: '인터넷매체 푸터와 청소년보호정책에 노출되는 책임자를 관리합니다.', status: '정책' },
        { title: '활동 기록', description: '기사 작성, 수정, 발행, 삭제 이력을 추후 audit log로 남길 수 있도록 설계합니다.', status: '로그' },
        { title: '외부 기고', description: '오피니언·칼럼 필자의 소속, 직함, 원고 사용 동의를 관리합니다.', status: '기고' }
      ]}
      primaryHref="/admin/settings"
      primaryLabel="등록정보 설정"
    />
  );
}
