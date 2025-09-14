import React from 'react';

/**
 * Definition of a table column.  Each column must specify a key that
 * matches a property on the row data, and a header to display.
 */
export interface TableColumn<T> {
  key: keyof T;
  header: string;
  /** Optional function to render a cell; receives the row and returns React */
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  /** An optional className for custom styling */
  className?: string;
}

/**
 * A simple, unstyled data table.  Pass in an array of columns and data
 * objects.  You can provide a custom render function per column to format
 * values.  Pagination, sorting and filtering can be added as needed.
 */
export default function DataTable<T>({ columns, data, className }: DataTableProps<T>) {
  return (
    <table className={['data-table', className].filter(Boolean).join(' ')}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={String(column.key)}>
                {column.render ? column.render(row) : (row[column.key] as unknown as React.ReactNode)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}