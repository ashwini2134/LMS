#!/usr/bin/env python3
"""Add visual learning aid blocks to all 14 Python lectures."""
import json, os

BASE = "frontend/public/data/python"

def add_visual_aid(sections, section_id, kind, title, **kwargs):
    """Insert a visual_aid block after the last block in the given section."""
    for sec in sections:
        if sec["id"] == section_id:
            block = {
                "type": "visual_aid",
                "kind": kind,
                "title": title,
                "accentColor": kwargs.get("accentColor", "blue"),
            }
            if "comparison" in kwargs:
                block["comparison"] = kwargs["comparison"]
            if "flow" in kwargs:
                block["flow"] = kwargs["flow"]
            if "steps" in kwargs:
                block["steps"] = kwargs["steps"]
            if "items" in kwargs:
                block["items"] = kwargs["items"]
            if "columns" in kwargs:
                block["columns"] = kwargs["columns"]
            if "code" in kwargs:
                block["code"] = kwargs["code"]
                block["language"] = kwargs.get("language", "python")
            if "output" in kwargs:
                block["output"] = kwargs["output"]
            # Insert after the first explanation/concept block
            sec["blocks"].insert(1, block)
            return True
    return False

def add_visual_at_end(sections, section_id, kind, title, **kwargs):
    """Append a visual_aid block at the end of a section."""
    for sec in sections:
        if sec["id"] == section_id:
            block = {
                "type": "visual_aid",
                "kind": kind,
                "title": title,
                "accentColor": kwargs.get("accentColor", "blue"),
            }
            for key in ("comparison", "flow", "steps", "items", "columns", "code", "output"):
                if key in kwargs:
                    block[key] = kwargs[key]
            if "language" in kwargs:
                block["language"] = kwargs["language"]
            sec["blocks"].append(block)
            return True
    return False


# ── Lecture 0: What is Python? ──────────────────────────────────────────────
def update_lecture_0(sec):
    add_visual_aid(sec, "what-is-programming", "process_flow", "How Programming Works",
        accentColor="blue",
        flow=[
            {"emoji": "🧑‍💻", "text": "You Write Code"},
            {"emoji": "🐍", "text": "Python Reads It"},
            {"emoji": "⚙️", "text": "Interpreter Translates"},
            {"emoji": "💻", "text": "Computer Executes"},
            {"emoji": "🎯", "text": "See Output"},
        ])
    add_visual_aid(sec, "getting-started", "process_flow", "How a .py File Runs",
        accentColor="green",
        flow=[
            {"emoji": "📝", "text": "Write hello.py"},
            {"emoji": "💾", "text": "Save the file"},
            {"emoji": "▶️", "text": "python hello.py"},
            {"emoji": "🖨️", "text": "Output appears"},
        ])
    return sec

def update_lecture_1(sec):
    add_visual_aid(sec, "data-types", "comparison_grid", "Data Type Comparison",
        accentColor="purple",
        columns=[
            {
                "header": "🔢 int (Integer)",
                "items": [
                    {"emoji": "✅", "label": "Whole numbers", "desc": "42, -7, 0"},
                    {"emoji": "➗", "label": "Math operations", "desc": "+ - * / // %"},
                    {"emoji": "📏", "label": "No decimal point"},
                    {"emoji": "⚡", "label": "Fast computation"},
                ]
            },
            {
                "header": "⚖️ float (Float)",
                "items": [
                    {"emoji": "✅", "label": "Decimal numbers", "desc": "3.14, -0.5"},
                    {"emoji": "🎯", "label": "Precision matters", "desc": "For measurements"},
                    {"emoji": "🔬", "label": "Scientific notation", "desc": "1.5e10"},
                    {"emoji": "⚠️", "label": "Rounding quirks", "desc": "0.1 + 0.2 ≠ 0.3"},
                ]
            },
            {
                "header": "📝 str & ✅ bool",
                "items": [
                    {"emoji": "💬", "label": "str = text", "desc": "\"Hello\", 'Python'"},
                    {"emoji": "🔗", "label": "String concatenation", "desc": "+ joins strings"},
                    {"emoji": "✅", "label": "bool = True/False", "desc": "For decisions"},
                    {"emoji": "🔀", "label": "Logical operations", "desc": "and, or, not"},
                ]
            },
        ])
    add_visual_aid(sec, "strings-basics", "transformation_demo", "String Operations",
        accentColor="green",
        items=[
            {"label": "\"Hello\" + \" World\"", "desc": "\"Hello World\" (Concatenation)"},
            {"label": "\"Ha! \" * 3", "desc": "\"Ha! Ha! Ha! \" (Repeat)"},
            {"label": "len(\"Python\")", "desc": "6 (Length)"},
            {"label": "\"Python\"[0]", "desc": "\"P\" (First character)"},
        ])
    return sec

def update_lecture_2(sec):
    add_visual_aid(sec, "user-input", "process_flow", "Input → Processing → Output",
        accentColor="purple",
        flow=[
            {"emoji": "⌨️", "text": "User Input"},
            {"emoji": "⚙️", "text": "Process Data"},
            {"emoji": "🖨️", "text": "Display Output"},
        ])
    return sec

def update_lecture_3(sec):
    add_visual_aid(sec, "arithmetic", "comparison_chart", "Operator Quick Reference",
        accentColor="blue",
        comparison={
            "headers": ["Operator", "Name", "Example", "Result"],
            "rows": [
                {"label": "+", "values": ["Addition", "5 + 3", "8"]},
                {"label": "-", "values": ["Subtraction", "5 - 3", "2"]},
                {"label": "*", "values": ["Multiplication", "5 * 3", "15"]},
                {"label": "/", "values": ["Division", "5 / 2", "2.5"]},
                {"label": "//", "values": ["Floor Div", "5 // 2", "2"]},
                {"label": "%", "values": ["Modulo", "5 % 2", "1"]},
                {"label": "**", "values": ["Power", "5 ** 2", "25"]},
            ]
        })
    add_visual_aid(sec, "arithmetic", "process_flow", "PEMDAS Order of Operations",
        accentColor="purple",
        flow=[
            {"emoji": "📐", "text": "1. Parentheses ()"},
            {"emoji": "🔢", "text": "2. Exponents **"},
            {"emoji": "✖️", "text": "3. Multiply / Divide"},
            {"emoji": "➕", "text": "4. Add / Subtract"},
        ])
    return sec

def update_lecture_4(sec):
    add_visual_aid(sec, "if-else", "decision_tree", "if / elif / else Flowchart",
        accentColor="purple",
        steps=[
            {"emoji": "🔀", "label": "Start: Check Condition"},
            {"emoji": "✅", "label": "if True → Run if Block"},
            {"emoji": "❌", "label": "if False → Check elif"},
            {"emoji": "✅", "label": "elif True → Run elif Block"},
            {"emoji": "❌", "label": "elif False → Check Next"},
            {"emoji": "🏁", "label": "else → Run else Block (default)"},
        ])
    return sec

def update_lecture_5(sec):
    add_visual_aid(sec, "loop-concept", "iteration_diagram", "For Loop Iteration",
        accentColor="blue",
        steps=[
            {"emoji": "1️⃣", "label": "Get first item"},
            {"emoji": "▶️", "label": "Run code block"},
            {"emoji": "2️⃣", "label": "Get next item"},
            {"emoji": "▶️", "label": "Run code block"},
            {"emoji": "3️⃣", "label": "Get next item..."},
            {"emoji": "🏁", "label": "No more items → Stop"},
        ])
    add_visual_aid(sec, "range", "index_visual", "range() Visualization",
        accentColor="purple",
        items=[
            {"label": "0"},
            {"label": "1"},
            {"label": "2"},
            {"label": "3"},
            {"label": "4"},
        ])
    return sec

def update_lecture_6(sec):
    add_visual_aid(sec, "while-basics", "cycle_diagram", "While Loop Cycle",
        accentColor="blue",
        steps=[
            {"emoji": "❓", "label": "Check condition"},
            {"emoji": "▶️", "label": "Run body"},
            {"emoji": "🔄", "label": "Update counter"},
            {"emoji": "❓", "label": "Check condition..."},
            {"emoji": "⏹️", "label": "Condition False → Stop"},
        ])
    add_visual_aid(sec, "break-continue", "comparison_grid", "break vs continue",
        accentColor="purple",
        columns=[
            {
                "header": "⏹️ break",
                "items": [
                    {"emoji": "🚪", "label": "Exits loop immediately"},
                    {"emoji": "🎯", "label": "Used for \"found it!\""},
                    {"emoji": "⏭️", "label": "Skips remaining iterations"},
                    {"emoji": "📝", "label": "Code continues after loop"},
                ]
            },
            {
                "header": "⏩ continue",
                "items": [
                    {"emoji": "⤵️", "label": "Skips current iteration"},
                    {"emoji": "🚫", "label": "Skips to next iteration"},
                    {"emoji": "🔂", "label": "Loop keeps running"},
                    {"emoji": "📝", "label": "Only current iteration skips"},
                ]
            },
            {
                "header": "🔑 Key Difference",
                "items": [
                    {"emoji": "⏹️", "label": "break → Loop stopped"},
                    {"emoji": "⏭️", "label": "continue → One iteration skipped"},
                    {"emoji": "🔄", "label": "break ends; continue continues"},
                ]
            },
        ])
    return sec

def update_lecture_7(sec):
    add_visual_aid(sec, "indexing", "memory_layout", "List Memory Layout",
        accentColor="purple",
        items=[
            {"label": "🍎", "value": "apple"},
            {"label": "🍌", "value": "banana"},
            {"label": "🍒", "value": "cherry"},
            {"label": "📅", "value": "date"},
            {"label": "🫐", "value": "elderberry"},
        ])
    add_visual_aid(sec, "indexing", "index_visual", "Index Position Visualizer",
        accentColor="blue",
        items=[
            {"label": "A"},
            {"label": "P"},
            {"label": "P"},
            {"label": "L"},
            {"label": "E"},
        ])
    return sec

def update_lecture_8(sec):
    add_visual_aid(sec, "tuples", "comparison_grid", "List vs Tuple vs Set",
        accentColor="purple",
        columns=[
            {
                "header": "📋 List []",
                "items": [
                    {"emoji": "✅", "label": "Mutable (changeable)"},
                    {"emoji": "✅", "label": "Ordered (indexed)"},
                    {"emoji": "✅", "label": "Duplicates allowed"},
                    {"emoji": "✅", "label": "append(), remove(), sort()"},
                ]
            },
            {
                "header": "📦 Tuple ()",
                "items": [
                    {"emoji": "❌", "label": "Immutable (fixed)"},
                    {"emoji": "✅", "label": "Ordered (indexed)"},
                    {"emoji": "✅", "label": "Duplicates allowed"},
                    {"emoji": "⚡", "label": "Faster than lists"},
                ]
            },
            {
                "header": "🔢 Set {}",
                "items": [
                    {"emoji": "✅", "label": "Mutable (changeable)"},
                    {"emoji": "❌", "label": "Unordered (no index)"},
                    {"emoji": "❌", "label": "No duplicates"},
                    {"emoji": "🔀", "label": "Union, Intersection, Diff"},
                ]
            },
        ])
    return sec

def update_lecture_9(sec):
    add_visual_aid(sec, "dict-basics", "mapping_visual", "Key → Value Mapping",
        accentColor="blue",
        items=[
            {"emoji": "👤", "label": "\"name\"", "desc": "\"Lakshanya\""},
            {"emoji": "🎂", "label": "\"age\"", "desc": "20"},
            {"emoji": "🏫", "label": "\"college\"", "desc": "\"SRM University\""},
            {"emoji": "🏙️", "label": "\"city\"", "desc": "\"Chennai\""},
        ])
    return sec

def update_lecture_10(sec):
    add_visual_aid(sec, "defining-functions", "process_flow", "Function Call Flow",
        accentColor="purple",
        flow=[
            {"emoji": "📞", "text": "Call greet(\"Alice\")"},
            {"emoji": "📥", "text": "Parameter: name = \"Alice\""},
            {"emoji": "⚙️", "text": "Function body runs"},
            {"emoji": "📤", "text": "Return value / Output"},
        ])
    add_visual_aid(sec, "defining-functions", "process_flow", "Parameter → Function → Return",
        accentColor="blue",
        flow=[
            {"emoji": "📦", "text": "Parameters (Inputs)"},
            {"emoji": "⚙️", "text": "Function (Process)"},
            {"emoji": "🎁", "text": "Return (Output)"},
        ])
    return sec

def update_lecture_11(sec):
    add_visual_aid(sec, "string-basics", "index_visual", "String Index Visualization",
        accentColor="blue",
        items=[
            {"label": "P"},
            {"label": "y"},
            {"label": "t"},
            {"label": "h"},
            {"label": "o"},
            {"label": "n"},
        ])
    add_visual_aid(sec, "string-methods", "transformation_demo", "String Method Transformations",
        accentColor="purple",
        items=[
            {"label": "\"hello\".upper()", "desc": "\"HELLO\""},
            {"label": "\"  Hi  \".strip()", "desc": "\"Hi\""},
            {"label": "\"a,b,c\".split(\",\")", "desc": "[\"a\", \"b\", \"c\"]"},
            {"label": "[\"a\", \"b\"].join(\"-\")", "desc": "\"a-b\""},
            {"label": "\"Hello World\".replace(\"World\", \"Python\")", "desc": "\"Hello Python\""},
        ])
    return sec

def update_lecture_12(sec):
    add_visual_aid(sec, "reading-files", "lifecycle_diagram", "File Read Lifecycle",
        accentColor="purple",
        steps=[
            {"emoji": "📂", "label": "Open file (open())"},
            {"emoji": "📖", "label": "Read content (.read())"},
            {"emoji": "🔄", "label": "Process data"},
            {"emoji": "🔒", "label": "Close file (.close())"},
        ])
    add_visual_aid(sec, "writing-files", "lifecycle_diagram", "File Write Lifecycle",
        accentColor="green",
        steps=[
            {"emoji": "📂", "label": "Open file mode 'w'"},
            {"emoji": "✏️", "label": "Write data (.write())"},
            {"emoji": "💾", "label": "Data saved to disk"},
            {"emoji": "🔒", "label": "Close file (.close())"},
        ])
    return sec

def update_lecture_13(sec):
    add_visual_aid(sec, "project-options", "architecture_diagram", "Project Architecture",
        accentColor="blue",
        steps=[
            {"emoji": "📋", "label": "Plan: Choose project + features"},
            {"emoji": "🏗️", "label": "Structure: Functions + Data"},
            {"emoji": "⚙️", "label": "Logic: Loops + Conditionals"},
            {"emoji": "💾", "label": "Storage: List/Dict + File I/O"},
            {"emoji": "🎨", "label": "UI: Menu + Input + Output"},
            {"emoji": "🚀", "label": "Run & Test everything"},
        ])
    add_visual_aid(sec, "project-options", "process_flow", "Project Flow",
        accentColor="purple",
        flow=[
            {"emoji": "👋", "text": "Show Menu"},
            {"emoji": "⌨️", "text": "Get User Choice"},
            {"emoji": "⚙️", "text": "Process Request"},
            {"emoji": "🎯", "text": "Show Result"},
            {"emoji": "🔄", "text": "Repeat until Exit"},
        ])
    return sec


# ── Update all lectures ─────────────────────────────────────────────────────
UPDATERS = {
    0: update_lecture_0,
    1: update_lecture_1,
    2: update_lecture_2,
    3: update_lecture_3,
    4: update_lecture_4,
    5: update_lecture_5,
    6: update_lecture_6,
    7: update_lecture_7,
    8: update_lecture_8,
    9: update_lecture_9,
    10: update_lecture_10,
    11: update_lecture_11,
    12: update_lecture_12,
    13: update_lecture_13,
}

for n, updater in UPDATERS.items():
    path = os.path.join(BASE, f"lecture_{n}", "lesson.json")
    if not os.path.exists(path):
        print(f"  ✗ Lecture {n}: lesson.json not found")
        continue
    with open(path, "r") as f:
        data = json.load(f)
    sections = data.get("sections", [])
    updater(sections)
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  ✓ Lecture {n}: visuals added")

print("\n✓ All visuals added successfully!")
