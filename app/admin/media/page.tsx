import { AdminModulePage } from '@/components/admin/admin-module-page';

export default function AdminMediaPage() {
  return (
    <AdminModulePage
      eyebrow="Media Library"
      title="미디어 보관함"
      description="기사 대표 이미지와 본문 중간 이미지를 관리합니다. 이미지는 단순 장식이 아니라 기사 신뢰도와 저작권 리스크에 직접 연결되므로 출처와 권리 확인을 함께 저장해야 합니다."
      items={[
        { title: '대표 이미지', description: '기사 상단과 목록 썸네일에 사용할 이미지를 구분해 저장합니다.', status: '필수' },
        { title: '본문 삽입 이미지', description: '기사 중간에 들어가는 이미지, 캡션, 출처, 라이선스를 함께 관리합니다.', status: '본문' },
        { title: 'Supabase Storage', description: '직접 업로드 파일은 article-images 버킷에 저장하고 공개 URL을 기사에 연결합니다.', status: '저장소' },
        { title: '무료 이미지 검수', description: 'Unsplash, Pexels, Pixabay 등 무료 이미지도 출처와 라이선스 메타데이터를 남깁니다.', status: '권리' },
        { title: '금지 이미지', description: '인물 얼굴, 상표·로고, 의료 전후 비교, 권리 불명확 이미지는 자동 사용하지 않습니다.', status: '차단' },
        { title: '캡션 규칙', description: '사진 아래에는 내용 설명과 출처를 짧게 표시해 기사형 포맷을 유지합니다.', status: '표시' }
      ]}
      primaryHref="/admin/articles/new"
      primaryLabel="이미지 포함 기사 작성"
    />
  );
}
