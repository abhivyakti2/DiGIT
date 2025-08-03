import React from 'react'
import { CSVLink } from 'react-csv'

export default function ExportCSV({ data = [], filename = 'export.csv' }) {
  if (!data.length) return null
  const headers = Object.keys(data[0]).map(key => ({ label: key.toUpperCase(), key }))

  return (
    <CSVLink filename={filename} data={data} headers={headers}>
      <button>Export as CSV</button>
    </CSVLink>
  )
}
