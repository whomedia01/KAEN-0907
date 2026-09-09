export function SimpleTable({ rows }: { rows: Record<string, unknown>[] }) {
  if (!rows.length) return <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">데이터가 없습니다.</div>;
  const columns = Object.keys(rows[0]).slice(0, 8);
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>{columns.map((col) => <th key={col} className="px-4 py-3">{col}</th>)}</tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">{columns.map((col) => <td key={col} className="max-w-xs truncate px-4 py-3">{String(row[col] ?? '')}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
