export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onSelect?: (selectedRows: T[]) => void;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
}

// Table.tsx
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import React, { useState } from 'react';

export function Table<T extends { id: string | number }>({ data, columns, onSelect, onSort, onRowClick }: Readonly<TableProps<T>>) {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
      onSelect?.([]);
    } else {
      const newSelected = new Set(data.map((row) => row.id));
      setSelectedRows(newSelected);
      onSelect?.(data);
    }
  };

  const handleSelectRow = (row: T) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(row.id)) {
      newSelected.delete(row.id);
    } else {
      newSelected.add(row.id);
    }
    setSelectedRows(newSelected);
    onSelect?.(data.filter((item) => newSelected.has(item.id)));
  };

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    const newDirection = sortConfig?.key === column.key && sortConfig.direction === 'asc' ? 'desc' : 'asc';

    setSortConfig({ key: column.key, direction: newDirection });
    onSort?.(column.key, newDirection);
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="">
          <tr>
            <th className="w-12 px-6 py-3 border-t border-gray-300">
              <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={selectedRows.size === data.length} onChange={handleSelectAll} />
            </th>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-l border-gray-300 border-t border-b"
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <Typography className="text-sm font-medium mr-2">{column.title}</Typography>
                  {column.sortable && (
                    <div className="flex flex-col">
                      <ExpandLessIcon className={`w-3 h-3 ${sortConfig?.key === column.key && sortConfig.direction === 'asc' ? 'text-indigo-600' : 'text-gray-400'}`} />
                      <ExpandMoreIcon className={`w-3 h-3 ${sortConfig?.key === column.key && sortConfig.direction === 'desc' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-4 text-center">
                <Typography className="text-lg text-gray-500">No data available</Typography>
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={`${row.id}+${index}`} className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}>
                <td className="w-12 px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={selectedRows.has(row.id)} onChange={() => handleSelectRow(row)} />
                </td>
                {columns.map((column, index) => (
                  <td key={`${String(column.key)}+${index}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" onClick={() => onRowClick?.(row)}>
                    <Typography className="text-xs">{column.render ? column.render(row[column.key], row) : String(row[column.key])}</Typography>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
