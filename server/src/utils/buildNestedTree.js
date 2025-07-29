function buildTree(flatTree) {
  const root = {};

  for (const item of flatTree) {
    const parts = item.path.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (!current[part]) {
        current[part] = {
          name: part,
          type: isLast ? item.type : 'tree',
          ...(isLast ? {} : { children: {} })
        };
      }

      if (!isLast) {
        current = current[part].children;
      }
    }
  }

  function convertToArray(obj) {
    return Object.values(obj).map(node => {
      if (node.children) {
        node.children = convertToArray(node.children);
      }
      return node;
    });
  }

  return convertToArray(root);
}

module.exports = buildTree;
