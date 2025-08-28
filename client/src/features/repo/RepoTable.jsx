import React from 'react';

export default function RepoTable({ data, columns }) {
  if (!data || data.length === 0) return <p>No data to show.</p>;

  return (
    <table className="issue-table" border="1" cellPadding="8" cellSpacing="0">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.Header}>{col.Header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.accessor}>
                {col.render
                  ? col.render(row[col.accessor], row)
                  : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
