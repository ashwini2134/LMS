#!/usr/bin/env python3
"""Add focused educational visual_aid blocks to lecture sections.
Only index_visual, mapping_visual, and transformation_demo kinds — no process_flow,
architecture_diagram, memory_layout, lifecycle_diagram, decision_tree, or cycle_diagram.
Run AFTER generate_lectures.py and enhance_concepts.py."""
import json, os

BASE = "frontend/public/data/python"

V_INDEX_STR = {
    "type": "visual_aid", "kind": "index_visual", "title": "Character Index Positions",
    "accentColor": "blue",
    "items": [{"label": c} for c in list("HELLO")],
}

V_MAP_DICT = {
    "type": "visual_aid", "kind": "mapping_visual", "title": "Key → Value Mapping",
    "accentColor": "green",
    "items": [
        {"label": "\"name\"", "desc": "\"Alice\""},
        {"label": "\"age\"", "desc": "25"},
        {"label": "\"city\"", "desc": "\"New York\""},
    ],
}

V_TRANSFORM = {
    "type": "visual_aid", "kind": "transformation_demo", "title": "String Transformations",
    "accentColor": "purple",
    "items": [
        {"label": "\"hello\".upper()", "desc": "HELLO"},
        {"label": "\"HELLO\".lower()", "desc": "hello"},
        {"label": "\"  hi  \".strip()", "desc": "hi"},
    ],
}

SECTION_VISUALS: list[tuple[str, dict]] = [
    ("string-indexing", V_INDEX_STR),
    ("string-basics", V_INDEX_STR),
    ("dictionary-basics", V_MAP_DICT),
    ("dict-basics", V_MAP_DICT),
    ("dict-operations", V_MAP_DICT),
    ("string-methods", V_TRANSFORM),
]

def has_visual_aid(blocks: list) -> bool:
    return any(b.get("type") == "visual_aid" for b in blocks)

def add_visual_to_section(section_data: dict, visual: dict) -> int:
    blocks = section_data.setdefault("blocks", [])
    if has_visual_aid(blocks):
        return 0
    blocks.append(visual)
    return 1

def main():
    total = 0
    for n in range(14):
        path = os.path.join(BASE, f"lecture_{n}", "lesson.json")
        if not os.path.exists(path):
            continue
        with open(path) as f:
            data = json.load(f)
        added = 0
        for section in data["sections"]:
            section_id = section.get("id", "")
            for kw, visual in SECTION_VISUALS:
                if kw in section_id.lower():
                    added += add_visual_to_section(section, visual)
                    break
        if added:
            with open(path, "w") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
        total += added
        print(f"  Lecture {n}: {added} visuals added")
    print(f"All visual enhancements applied ({total} total)!")

if __name__ == "__main__":
    main()
