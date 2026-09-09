import { SimpleTable } from '@/components/admin/simple-table';
import { listTable } from '@/lib/data/admin';

export default async function Page() {
  const rows = await listTable('products');
  return <div><h1 className="text-3xl font-black text-brand-navy">상품 관리</h1><p className="mt-2 text-gray-600">상품 관리 데이터를 확인하고 다음 단계에서 상세 CRUD를 확장합니다.</p><div className="mt-6"><SimpleTable rows={rows as any} /></div></div>;
}
