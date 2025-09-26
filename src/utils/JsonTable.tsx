// components/JsonTable.tsx
export default function JsonTable({ data }: { data: Record<string, any>[] }) {
    if (!data || data.length === 0) return <p>Aucune donnée.</p>;
  
    const columns = Object.keys(data[0]);
  
    return (
      <div className="overflow-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-2 text-left border-b border-gray-300 dark:border-gray-700">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  