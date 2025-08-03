import React from 'react'

export default function FileViewer({ fileName, content }) {
  if (!content) return <p>Select a file to view its content.</p>
  return (
    <div>
      <h4>{fileName}</h4>
      <pre
        style={{
          backgroundColor: '#282c34',
          color: 'white',
          padding: 12,
          borderRadius: 5,
          maxHeight: 400,
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
        }}
      >
        {content}
      </pre>
    </div>
  )
}
