import * as XLSX from "xlsx";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

export default function JsonTable({ data }: { data: Record<string, any>[] }) {
  if (!data || data.length === 0) return <p>Aucune donnée.</p>;

  const columns = Object.keys(data[0]);
  
  // Filtrer les colonnes à exclure
  const filteredColumns = columns.filter(col => 
    col !== "@search.score" && col !== "row_id"
  );

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AïnaFinance");
    XLSX.writeFile(wb, "AinaFinance.xlsx");
  };

  return (
    <div className="relative max-h-[400px] border border-gray-300 dark:border-gray-700 rounded-lg">
      {/* Bouton téléchargement en dehors du scroll */}
      <div className="absolute top-2 right-2 z-50">
        <button
          onClick={exportToExcel}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
          title="Télécharger Excel"
        >
          <ArrowDownTrayIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="overflow-auto max-h-[400px] rounded-lg scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-200 dark:scrollbar-thumb-indigo-600 dark:scrollbar-track-gray-700">
        <table className="min-w-full text-sm md:text-xs border-collapse">
          <thead className="bg-indigo-600 text-white sticky top-0 z-10">
            <tr>
              {/* Utiliser filteredColumns au lieu de columns */}
              {filteredColumns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left font-medium border-b border-gray-300 dark:border-gray-700"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
              >
                {/* Utiliser filteredColumns au lieu de columns */}
                {filteredColumns.map((col) => (
                  <td
                    key={col}
                    className="px-3 py-1 border-b border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 truncate"
                    title={row[col]}
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
