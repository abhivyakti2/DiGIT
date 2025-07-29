/**
 * Converts flat array of GitHub tree items (with dotted paths) to nested tree
 * 
 * @param {Array} flatTree - array of { path, type }
 * @returns {Array} nested array of { name, path, type, children? }
 */
export function buildNestedTree(flatTree) {
  const root = []
  const pathMap = {}

  flatTree.forEach(({ path, type }) => {
    const parts = path.split('/')
    let currentLevel = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      let node = currentLevel.find(n => n.name === part)

      if (!node) {
        node = {
          name: part,
          path: parts.slice(0, i + 1).join('/'),
          type: i === parts.length - 1 ? type : 'tree',
          children: [],
        }
        currentLevel.push(node)
      }

      if (node.type === 'tree') {
        currentLevel = node.children
      }
    }
  })

  // Remove empty children arrays for blobs
  function cleanEmptyChildren(nodes) {
    nodes.forEach(node => {
      if (node.type === 'blob') {
        delete node.children
      } else {
        cleanEmptyChildren(node.children)
      }
    })
  }
  cleanEmptyChildren(root)

  return root
}
