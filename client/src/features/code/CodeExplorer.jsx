import React, { useState } from 'react'

function TreeNode({ node, onFileSelect }) {
  const [expanded, setExpanded] = useState(false)

  if (node.type === 'tree') {
    return (
      <div style={{ marginLeft: 20 }}>
        <div onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
          {expanded ? '📂' : '📁'} {node.name}
        </div>
        {expanded && node.children && node.children.map(child => (
          <TreeNode key={child.path} node={child} onFileSelect={onFileSelect} />
        ))}
      </div>
    )
  }

  if (node.type === 'blob') {
    return (
      <div style={{ marginLeft: 40 }}>
        <span>📄 {node.name}</span>
        <button style={{ marginLeft: 10 }} onClick={() => onFileSelect(node.path)}>
          See Code
        </button>
      </div>
    )
  }

  return null
}

export default function CodeExplorer({ treeData = [], onFileSelect }) {
  if (!treeData.length) return <p>No files or folders found.</p>

  return (
    <div>
      <h3>Code Explorer</h3>
      {treeData.map(node => (
        <TreeNode key={node.path} node={node} onFileSelect={onFileSelect} />
      ))}
    </div>
  )
}
