# 六爻排盘 PWA

传统六爻纳甲筮法排盘工具，单文件 PWA，可离线使用。

## 功能特性

- **三种起卦方式**：手动摆卦 / 模拟摇卦 / 时间起卦（辅助）
- **准确农历/干支**：引入 `lunar-javascript` 库，精确到 1900-2100 年
- **完整排盘引擎**：复用 `liuyao-divination` Python 核心（纳甲、六亲、六神、世应、空亡、进退神化、墓库、三合等）
- **双输出**：
  - 人类可读卦盘文本（可复制）
  - AI 结构化解卦文本（含断卦流程目录 + GitHub Raw 链接）
- **历史记录**：本地存储，支持 JSONL 导出/导入
- **PWA 支持**：可「添加到主屏幕」，离线缓存核心资源
- **零 Emoji，极简界面**：语义化 HTML + CSS Grid，响应式三栏/单列

## 快速开始

### 本地预览
```bash
cd liuyao-web
python -m http.server 8888
# 浏览器打开 http://localhost:8888
```

### 部署到 GitHub Pages

1. 推送到 `pages` 分支：
```bash
git init
git checkout -b pages
git add .
git commit -m "deploy: liuyao-web PWA"
git remote add origin https://github.com/wenaryHY/liuyao-divination.git
git push -u origin pages
```

2. GitHub 仓库 Settings → Pages → Source: `pages` branch / `/ (root)`

3. 访问：`https://wenaryHY.github.io/liuyao-divination/`

### 手机使用
- 浏览器打开网址 → 点「添加到主屏幕」 → 像原生 App 一样使用
- 首次加载约 300KB（Pyodide + lunar-javascript 走 CDN 缓存），二次访问极快

## 目录结构

```
liuyao-web/
├── index.html      # 单文件应用（含内联 Python/JSON/JS/CSS）
├── manifest.json   # PWA 配置
├── sw.js           # Service Worker 离线缓存
├── build_data.py   # 生成内联数据脚本
├── build.js        # 注入数据到 index.html
├── liuyao_pkg/     # Python 引擎源码（构建时读取）
│   └── liuyao/
│       ├── __init__.py
│       ├── board.py
│       ├── data.py
│       ├── format.py
│       └── wuxing.py
└── tests/
    └── test_liuyao_engine.py  # TDD 测试（20 项全通过）
```

## 核心依赖（运行时 CDN 加载）

| 库 | 用途 | 版本 |
|---|---|---|
| Pyodide | Python 运行时 (WASM) | 0.26.2 |
| lunar-javascript | 农历/干支/节气计算 | latest |

## 断卦流程（AI 必须联网查阅）

1. 排盘定盘 → `01-装卦排盘.md`
2. 取用神 → `02-取用神.md`
3. 用神旺衰 → `03-旺衰月日.md`
4. 世爻状态 → `04-动静暗破.md`
5. 动静/暗动/月破/日破 → `04-动静暗破.md`
6. 化变（进退神化） → `05-进退神化.md`
7. 合冲刑害 → `06-合冲刑害.md`
8. 墓库/空亡 → `07-墓库空亡.md`
9. 综合定性/应期 → `08-断卦应期流程.md`
10. 节气/大小月/小日 → `09-推算节气针算大小月小日.md`
11. 发动墓库与空亡 → `10-发动墓库和空亡.md`
12. 实战案例 → `11-实战案例文本.md`

> **重要**：AI 解卦文本仅包含目录索引，**具体规则必须逐条访问上述 GitHub Raw 链接查阅**，未联网查阅视为断卦失败。

## 开发与测试

```bash
# 运行测试（需 PYTHONUTF8=1）
$env:PYTHONUTF8=1; python -m pytest tests/ -v

# 重新生成内联数据并构建
python build_data.py
node build.js
```

## 许可证

MIT License - 基于 `liuyao-divination` 核心引擎