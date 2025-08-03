import React from 'react'

export default function RepoTable({ data }) {
  if (!data || data.length === 0) return <p>No data to show.</p>

  return (
    <table border="1" cellPadding="8" cellSpacing="0">
      <thead>
        <tr>
          <th>Title</th>
          <th>State</th>
          <th>Created At</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.state}</td>
            <td>{new Date(item.created_at).toLocaleDateString()}</td>
            <td>
              <a href={item.url} target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
