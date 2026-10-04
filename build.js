/* Build script: 注入内联数据到 index.html */
const fs = require('fs');
const path = require('path');

// 读取生成的 JSON 数据（直接从 inline_data.js 解析，或重新生成）
const pkgFiles = JSON.parse(fs.readFileSync(path.join(__dirname, 'liuyao_pkg.json'), 'utf8'));
const rulesIndex = JSON.parse(fs.readFileSync(path.join(__dirname, 'ai_rules_index.json'), 'utf8'));
const hexList = JSON.parse(fs.readFileSync(path.join(__dirname, 'hexagram_list.json'), 'utf8'));

let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

html = html.replace('{LIUYAO_PKG_JSON}', JSON.stringify(pkgFiles));
html = html.replace('{AI_RULES_INDEX_JSON}', JSON.stringify(rulesIndex));
html = html.replace('{HEXAGRAM_LIST_JSON}', JSON.stringify(hexList));

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Built index.html with inline data');