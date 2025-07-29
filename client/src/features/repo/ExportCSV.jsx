import { CSVLink } from 'react-csv'
export default function ExportCSV({ data, filename }) {
  if (!data || !data.length) return null
  return (
    <CSVLink data={data} filename={filename || "export.csv"}>
      <button>Export CSV</button>
    </CSVLink>
  )
}
