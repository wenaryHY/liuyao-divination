import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// Load data
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'inline-data.json'), 'utf-8'));

// Get git info
let gitSha = 'unknown';
let gitDate = new Date().toISOString().split('T')[0];
try {
  gitSha = execSync('git rev-parse --short HEAD', { cwd: ROOT, encoding: 'utf-8' }).trim();
  gitDate = execSync('git log -1 --format=%cd --date=short', { cwd: ROOT, encoding: 'utf-8' }).trim();
} catch {}

const BASE = 'https://wenary.me/';
const UPDATE_INFO = `*更新时间：${gitDate} | Commit: ${gitSha}*`;

// ============ 生成 llms.txt (索引) ============
function generateIndex() {
  const lines = [
    '# 六爻排盘 - AI 解卦知识库',
    '',
    '> 传统纳甲筮法完整参考文档，包含 11 步断卦流程、术语词汇表、黄金卦例、入门教程、卜卦指南、64 卦完整数据（卦辞、爻辞、宫属、世爻）。',
    '',
    UPDATE_INFO,
    '',
    '## 快速导航',
    '',
    '### 断卦流程 11 步',
    ...[
      {step: 1, title: '排盘定盘'},
      {step: 2, title: '取用神'},
      {step: 3, title: '用神旺衰（月令/日令/十二长生）'},
      {step: 4, title: '世爻状态'},
      {step: 5, title: '查动静、暗动、月破、日破'},
      {step: 6, title: '查化变（进退神化）'},
      {step: 7, title: '查合冲刑害'},
      {step: 8, title: '查墓库、空亡'},
      {step: 9, title: '推算节气/大小月/小日'},
      {step: 10, title: '发动墓库与空亡'},
      {step: 11, title: '实战案例参考'}
    ].map(r => `- [${r.step}. ${r.title}](${BASE}#ref-${r.step})`),
    '',
    '### 附加参考',
    `- [术语词汇表](${BASE}#glossary) (${Object.keys(data.GLOSSARY || {}).length} 术语)`,
    `- [黄金卦例](${BASE}#golden-cases) (${data.GOLDEN_CASES ? 1 : 0} 详细案例)`,
    `- [入门教程](${BASE}#beginner) (${data.BEGINNER_GUIDE ? 1 : 0} 课程)`,
    `- [卜卦指南](${BASE}#guide) (完整操作手册)`,
    `- [64 卦完整数据](${BASE}#hexagrams) (卦辞、爻辞、宫属、世爻、纳甲)`,
    '',
    '## 全量内容',
    '',
    `- [llms-full.txt](${BASE}llms-full.txt) - 完整 Markdown 内容`,
    '',
    '## 来源',
    '',
    `- 网站: ${BASE}`,
    `- 仓库: https://github.com/wenaryHY/liuyao-divination`,
    `- 更新: GitHub Actions 自动同步`,
    '',
    '---',
    '',
    '*本文件遵循 [llms.txt 标准](https://llmstxt.org/)*'
  ];
  return lines.join('\n');
}

// ============ 生成 llms-full.txt (全量) ============
function escapeMd(text) {
  return text;
}

function formatHexagrams(zhouyi) {
  const lines = ['## 64 卦完整数据', ''];
  
  const hexagrams = [];
  for (const [key, value] of Object.entries(zhouyi)) {
    if ('卦' !== key && 'gua' !== key.toLowerCase()) continue;
    if (value && value.name) {
      hexagrams.push({
        name: value.name,
        alias: value.alias,
        upper: value.upper,
        lower: value.lower,
        palace: value.palace,
        palace_wx: value.palace_wx,
        world: value.world,
        gua_ci: value.gua_ci,
        yao: value.yao
      });
    }
  }
  
  // Sort by standard order if possible
  hexagrams.sort((a, b) => (a.world || 0) - (b.world || 0));
  
  for (const h of hexagrams) {
    lines.push(`### ${h.name} (${h.alias})`);
    lines.push(`**宫属**：${h.palace}宫 | **五行**：${h.palace_wx} | **世爻**：${h.world}`);
    lines.push(`**上卦**：${h.upper} | **下卦**：${h.lower}`);
    lines.push('');
    lines.push(`**卦辞**：${h.gua_ci || ''}`);
    lines.push('');
    if (h.yao) {
      lines.push('**爻辞**：');
      const yaoOrder = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
      for (let i = 0; i < yaoOrder.length; i++) {
        const key = yaoOrder[i];
        if (h.yao[key]) {
          lines.push(`- ${key}：${h.yao[key]}`);
        }
      }
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  }
  return lines.join('\n');
}

function generateFull() {
  const sections = [];
  
  // 11 步规则
  const rulesIndex = [
    {step: 1, title: '排盘定盘', key: '01'},
    {step: 2, title: '取用神', key: '02'},
    {step: 3, title: '用神旺衰（月令/日令/十二长生）', key: '03'},
    {step: 4, title: '世爻状态', key: '04'},
    {step: 5, title: '查动静、暗动、月破、日破', key: '04'},
    {step: 6, title: '查化变（进退神化）', key: '05'},
    {step: 7, title: '查合冲刑害', key: '06'},
    {step: 8, title: '查墓库、空亡', key: '07'},
    {step: 9, title: '推算节气/大小月/小日', key: '08'},
    {step: 10, title: '发动墓库与空亡', key: '09'},
    {step: 11, title: '实战案例参考', key: '10'}
  ];
  
  for (const r of rulesIndex) {
    const content = data.REFS_CONTENT?.[r.key] || '';
    sections.push(`# ${r.step}. ${r.title}\n\n${content}`);
  }
  
  // 术语表
  if (data.GLOSSARY && Object.keys(data.GLOSSARY).length) {
    const glossaryContent = Object.entries(data.GLOSSARY)
      .map(([k, v]) => `**${k}**：${v}`)
      .join('\n\n');
    sections.push(`## 术语词汇表\n\n${glossaryContent}`);
  }
  
  // 黄金卦例
  if (data.GOLDEN_CASES) {
    const g = data.GOLDEN_CASES;
    const goldenContent = [
      g.title ? `### ${g.title}` : '',
      g.subtitle || '',
      g.meta?.question ? `**占问**：${g.meta.question}` : '',
      g.board?.hexagram ? `**得卦**：${g.board.hexagram}` : '',
      g.summary ? `**断语**：${g.summary}` : '',
      g.verdict ? `**验证**：${Array.isArray(g.verdict) ? g.verdict.join('；') : g.verdict}` : ''
    ].filter(Boolean).join('\n\n');
    sections.push(`## 黄金卦例\n\n${goldenContent}`);
  }
  
  // 入门教程
  if (data.BEGINNER_GUIDE) {
    const b = data.BEGINNER_GUIDE;
    const beginnerContent = [
      b.title ? `### ${b.title}` : '',
      b.subtitle || '',
      b.meta?.question ? `**问题**：${b.meta.question}` : '',
      b.summary ? `**总结**：${b.summary}` : '',
      b.sections?.map(s => s.title ? `#### ${s.title}\n\n${s.content || ''}` : '').filter(Boolean).join('\n\n') || ''
    ].filter(Boolean).join('\n\n');
    sections.push(`## 入门教程\n\n${beginnerContent}`);
  }
  
  // 卜卦指南
  if (data.GUIDE) {
    sections.push(`## 卜卦指南\n\n${data.GUIDE}`);
  }
  
  // 64 卦完整数据
  sections.push(formatHexagrams(data.ZHOUYI_DATA || {}));
  
  const header = [
    '# 六爻排盘 - AI 解卦知识库 (完整版)',
    '',
    '> 传统纳甲筮法完整参考文档，包含 11 步断卦流程、术语词汇表、黄金卦例、入门教程、卜卦指南、64 卦完整数据（卦辞、爻辞、宫属、世爻、纳甲）。',
    '',
    UPDATE_INFO,
    '',
    '---',
    ''
  ].join('\n');
  
  return header + sections.join('\n\n---\n\n');
}

// ============ 写入文件 ============
const indexContent = generateIndex();
const fullContent = generateFull();

fs.writeFileSync(path.join(ROOT, 'llms.txt'), indexContent, 'utf-8');
fs.writeFileSync(path.join(ROOT, 'llms-full.txt'), fullContent, 'utf-8');

console.log('Generated:');
console.log(`  llms.txt: ${indexContent.length} chars`);
console.log(`  llms-full.txt: ${fullContent.length} chars`);
console.log(`  Update: ${gitDate} | ${gitSha}`);