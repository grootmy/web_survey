import { ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  renderCell?: (row: T, columnKey: string) => ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  renderCell,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-left p-4 font-medium text-muted"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-border hover:bg-bg-soft">
              {columns.map((column) => (
                <td key={column.key} className="p-4">
                  {renderCell
                    ? renderCell(row, column.key)
                    : (row[column.key as keyof T] as ReactNode)
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
