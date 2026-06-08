#!/usr/bin/env python3
"""Fix td() calls in enhance_concepts.py that use strings instead of (label,value) tuples."""
with open("enhance_concepts.py") as f:
    content = f.read()

replacements = []

# Dictionary CRUD: td → ml
old1 = 'td("Dictionary CRUD",\n            ["dict['
new1 = 'ml("Dictionary CRUD",\n            ["dict['
replacements.append((old1, new1))

# List Method Effects: already fixed
# Pack → Unpack: already fixed
# Type Conversion Chain: already fixed

# String Transformations: td → ml
old2 = ('        ("powerful string methods", td("String Transformations", [\n'
        '            (".upper()", "HELLO"),\n'
        '            (".lower()", "hello"),\n'
        '            (".strip()", "hi"),\n'
        '            ("split(\',\')", "[\'a\', \'b\', \'c\']"),\n'
        '            ("\'--\'.join([\'a\', \'b\'])", "a--b")])')
new2 = ('        ("powerful string methods", ml("String Transformations",\n'
        '            [".upper() -> HELLO",\n'
        '             ".lower() -> hello",\n'
        '             ".strip() -> hi",\n'
        '             "split(\',\') -> [\'a\',\'b\',\'c\']",\n'
        '             "\'--\'.join([\'a\',\'b\']) -> a--b"])')
replacements.append((old2, new2))

# Split → Join Pipeline: td → ml
old3 = ('        ("splitting and joining", td("Split -> Join Pipeline", [\n'
        '            ("split()", "[\'hello\', \'world\', \'python\']"),\n'
        '            ("join()", "\'hello world\'")])')
new3 = ('        ("splitting and joining", ml("Split -> Join Pipeline",\n'
        '            ["split() -> [\'hello\', \'world\', \'python\']",\n'
        '             "join() -> \'hello world\'"])')
replacements.append((old3, new3))

for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        print("  Replaced one match")
    else:
        print("  ! No match found for:", old[:60])

with open("enhance_concepts.py", "w") as f:
    f.write(content)
print("Done")
