const marked = require('marked');
exports.renderMarkdown = (md) => marked.parse(md || '');
