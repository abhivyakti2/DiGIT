export default function buildNestedTree(flatTree) {
  // Helper: path -> node
  const pathMap = new Map();
  flatTree.forEach(item => {
    pathMap.set(item.path, { ...item, name: item.path.split("/").pop(), children: [] });
  });
  // Build structure
  const roots = [];
  for (const item of flatTree) {
    const pathParts = item.path.split("/");
    if (pathParts.length === 1) {
      // Root node
      roots.push(pathMap.get(item.path));
    } else {
      // Nested node
      const parentPath = pathParts.slice(0, -1).join("/");
      const parentNode = pathMap.get(parentPath);
      if (parentNode) {
        parentNode.children = parentNode.children || [];
        parentNode.children.push(pathMap.get(item.path));
      }
    }
  }
  return roots;
}
