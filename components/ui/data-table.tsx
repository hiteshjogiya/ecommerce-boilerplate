'use client';

import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onSort?: (key: keyof T, ascending: boolean) => void;
  sortKey?: keyof T;
  sortAscending?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  loading = false,
  totalItems = 0,
  currentPage = 1,
  pageSize = 20,
  onPageChange,
  onSearch,
  onSort,
  sortKey,
  sortAscending = true,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No items found',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      onSort?.(key, !sortAscending);
    } else {
      onSort?.(key, true);
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-4">
      {/* Search */}
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && onSort && (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="inline-flex"
                      >
                        {sortKey === col.key ? (
                          sortAscending ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 opacity-30" />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-sm">
                      {col.render
                        ? col.render(item[col.key], item)
                        : String(item[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
            {totalItems > 0 && ` (${totalItems} total)`}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
