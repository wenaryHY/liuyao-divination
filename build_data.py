#!/usr/bin/env python3
"""生成内联到 index.html 的 JSON 数据"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "liuyao_pkg"))
from liuyao import HEXAGRAMS
from liuyao.data import BAGUA

# 1. liuyao_pkg: 读取所有 .py 文件
pkg_files = {}
pkg_dir = Path(__file__).parent / "liuyao_pkg" / "liuyao"
for py_file in pkg_dir.glob("*.py"):
    rel = py_file.relative_to(pkg_dir.parent)
    pkg_files[str(rel)] = py_file.read_text(encoding="utf-8")

# 2. hexagram_list: 64 卦带索引
hex_list = []
seen = set()
for rec in HEXAGRAMS.values():
    name = rec["name"]
    if name in seen:
        continue
    seen.add(name)
    hex_list.append({
        "idx": len(hex_list) + 1,
        "name": name,
        "alias": rec["alias"],
        "upper": rec["upper"],
        "lower": rec["lower"],
        "palace": rec["palace"],
        "palace_wx": rec["palace_wx"],
        "world": rec["world"]
    })

# 3. ai_rules_index: 断卦流程目录 + GitHub raw 链接
rules_index = [
    {"step": 1, "title": "排盘定盘", "file": "01-%E8%A3%85%E5%8D%A6%E6%8E%92%E7%9B%98.md"},
    {"step": 2, "title": "取用神", "file": "02-%E5%8F%96%E7%94%A8%E7%A5%9E.md"},
    {"step": 3, "title": "用神旺衰（月令/日令/十二长生）", "file": "03-%E6%97%BA%E8%A1%9C%E6%9C%88%E6%97%A5.md"},
    {"step": 4, "title": "世爻状态", "file": "04-%E5%8A%A8%E9%9D%99%E6%9A%97%E7%A0%B4.md"},
    {"step": 5, "title": "查动静、暗动、月破、日破", "file": "04-%E5%8A%A8%E9%9D%99%E6%9A%97%E7%A0%B4.md"},
    {"step": 6, "title": "查化变（进退神化）", "file": "05-%E8%BF%9B%E9%80%80%E7%A5%9E%E5%8C%96.md"},
    {"step": 6, "title": "查合冲刑害", "file": "06-%E5%90%88%E5%86%B2%E5%88%91%E5%AE%B3.md"},
    {"step": 7, "title": "查墓库、空亡", "file": "07-%E5%A2%93%E5%BA%93%E7%A9%BA%E4%BA%A1.md"},
    {"step": 8, "title": "综合定性、定应期", "file": "08-%E6%96%AD%E5%8D%A6%E5%BA%94%E6%9C%9F%E6%B5%81%E7%A8%8B.md"},
    {"step": 9, "title": "推算节气/大小月/小日", "file": "09-%E6%9C%AD%E7%AE%97%E9%92%88%E7%AE%97%E5%A4%A7%E5%B0%8F%E6%9C%88%E5%B0%8F%E6%97%A5.md"},
    {"step": 10, "title": "发动墓库与空亡", "file": "10-%E5%8F%91%E5%8A%A8%E5%A2%93%E5%BA%93%E5%92%8C%E7%A9%BA%E4%BA%A1.md"},
    {"step": 11, "title": "实战案例参考", "file": "11-%E5%AE%9E%E6%88%98%E6%A1%88%E4%BE%8B%E6%96%87%E6%9C%AC.md"},
]

# 写入独立 JSON 文件供构建时读取
out_dir = Path(__file__).parent
(out_dir / "liuyao_pkg.json").write_text(json.dumps(pkg_files, ensure_ascii=False), encoding="utf-8")
(out_dir / "ai_rules_index.json").write_text(json.dumps(rules_index, ensure_ascii=False), encoding="utf-8")
(out_dir / "hexagram_list.json").write_text(json.dumps(hex_list, ensure_ascii=False), encoding="utf-8")

print(f"Generated JSON files in {out_dir}")
print(f"  liuyao_pkg.json: {len(pkg_files)} files")
print(f"  hexagram_list.json: {len(hex_list)} entries")
print(f"  ai_rules_index.json: {len(rules_index)} entries")