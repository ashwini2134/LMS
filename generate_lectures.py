#!/usr/bin/env python3
"""Generate all 14 Python Programming lecture files."""
import json, os

BASE = "frontend/public/data/python"

LECTURES = []

# ── Lecture 0 ────────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 0, "title": "What is Python?", "nextUp": "Variables & Data Types",
    "overview": "Python is one of the most popular and beginner-friendly programming languages. In this first lecture you will learn what programming is, why Python is the perfect language to start with, and how to run your very first Python program.",
    "estimatedMinutes": 45,
    "sections": [
        {
            "id": "what-is-programming", "label": "What is Programming?",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "What Does It Mean to Program?",
                 "body": "**Programming** is the art of giving instructions to a computer so it can perform tasks automatically. Instead of clicking buttons in an app, you write the instructions yourself. The computer follows them step by step, exactly as written.",
                 "bullets": [
                     "Computers are very fast but also very literal — they do exactly what you tell them",
                     "Programming lets you automate repetitive tasks",
                     "Programs are written in a **programming language** like Python, which both humans and computers can understand",
                     "Every program is just a sequence of instructions stored in a text file"
                 ]},
                {"type": "analogy", "title": "Think of a Program as a Cooking Recipe", "emoji": "📖",
                 "text": "A recipe lists ingredients and steps: chop onions, boil water, cook for 10 minutes. A program does the same thing — it lists steps like 'store this value,' 'add these two numbers,' 'print the result.' The computer follows the recipe just like you follow cooking instructions."},
                {"type": "explanation", "accentColor": "blue", "title": "Programming Languages",
                 "body": "There are hundreds of programming languages, each designed for different purposes. Python is special because it is designed to be easy to read and write.",
                 "bullets": [
                     "Python's syntax (the rules for writing code) is similar to English",
                     "You can write simple programs with just a few lines of code",
                     "Python hides complex details so you can focus on solving problems"
                 ]},
                {"type": "code_example", "title": "Your First Program — Hello World", "language": "python",
                 "code": "print(\"Hello, World!\")",
                 "expectedOutput": "Hello, World!"},
                {"type": "code_example", "title": "Printing Multiple Lines", "language": "python",
                 "code": "print(\"Welcome to Python!\")\nprint(\"I am learning to code.\")\nprint(\"This is fun!\")",
                 "expectedOutput": "Welcome to Python!\nI am learning to code.\nThis is fun!"},
                {"type": "reflection",
                 "question": "What do you think happens if you put numbers inside print() instead of text? For example: print(42)",
                 "answer": "It works! Numbers don't need quotes. Python will print exactly the number you give it. Try it: print(42) prints 42."},
                {"type": "practice", "title": "Print Your Name",
                 "instructions": "Write a program that prints your name on the first line and your college name on the second line.",
                 "starterCode": "# Print your name\nprint(\"\")\n# Print your college\n",
                 "solution": "print(\"Lakshanya\")\nprint(\"SRM University\")",
                 "hint": "Use print(\"YourName\") for the first line and print(\"YourCollege\") for the second. Put quotes around text.",
                 "expectedOutput": "Lakshanya\nSRM University"}
            ]
        },
        {
            "id": "why-python", "label": "Why Python?",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Why Python is Perfect for Beginners",
                 "body": "Python was created by Guido van Rossum in 1991 with a clear philosophy: make programming easy and fun. Today it is used by beginners and professionals alike.",
                 "bullets": [
                     "Easy to read — Python code looks almost like plain English",
                     "No complicated symbols or punctuation — clean and minimal",
                     "Huge community — millions of tutorials and libraries available for free",
                     "Runs everywhere — Windows, Mac, Linux, even on small devices"
                 ]},
                {"type": "explanation", "accentColor": "purple", "title": "Real-World Applications of Python",
                 "body": "Python is not just for learning — it powers some of the most important technology in the world.",
                 "bullets": [
                     "**Web Development** — Instagram, Pinterest, and Spotify use Python for their backends",
                     "**Data Science** — Python is the #1 language for analyzing data and building charts",
                     "**Artificial Intelligence** — Most AI and machine learning libraries are written in Python",
                     "**Automation** — Python can automate boring tasks like renaming files or sending emails"
                 ]},
                {"type": "analogy", "title": "Think of Python as a Swiss Army Knife", "emoji": "🔧",
                 "text": "A Swiss Army knife has many tools — blade, scissors, screwdriver — all in one device. Python is the same: you can build websites, analyze data, make games, or automate tasks, all with the same language."},
                {"type": "reflection",
                 "question": "Think about something you do every day on your phone or computer. Can you imagine how a Python program could automate or improve it?",
                 "answer": "There are so many possibilities! Maybe a program that automatically organizes your downloads folder, or sends you a weather alert each morning. That's the power of programming — you can build tools that make your life easier."}
            ]
        },
        {
            "id": "getting-started", "label": "Getting Started",
            "blocks": [
                {"type": "explanation", "accentColor": "green", "title": "Installing Python",
                 "body": "Before you can write Python programs, you need to install Python on your computer. It's free and takes just a few minutes.",
                 "bullets": [
                     "Go to python.org and download the latest version",
                     "Run the installer and check 'Add Python to PATH'",
                     "After installation, open Terminal (Mac/Linux) or Command Prompt (Windows)",
                     "Type python --version to verify it installed correctly"
                 ]},
                {"type": "explanation", "accentColor": "green", "title": "Python Shell (Interactive Mode)",
                 "body": "The **Python shell** (also called REPL) lets you type Python commands one at a time and see results immediately.",
                 "bullets": [
                     "Type python in your terminal to start the shell",
                     "You'll see >>> prompt — Python is waiting for your command",
                     "Type print(\"Hello\") and press Enter — Python runs it instantly",
                     "Type exit() to leave the shell"
                 ]},
                {"type": "explanation", "accentColor": "green", "title": "Running .py Files",
                 "body": "For real programs, you save your code in a file with a .py extension and run the entire file at once.",
                 "bullets": [
                     "Create a new file called hello.py",
                     "Write your Python code in the file using any text editor",
                     "Open terminal, navigate to the folder containing the file",
                     "Type python hello.py and press Enter — Python runs every line in order"
                 ]},
                {"type": "concept_visualization", "title": "How Python Runs Your Code", "accentColor": "green",
                 "leftPanel": {"label": "Step 1", "emoji": "📝", "title": "Write Code", "description": "You write Python instructions in a .py file using a text editor."},
                 "centerPanel": {"label": "Step 2", "visualType": "flow_diagram", "flowSteps": ["Python reads your file line by line", "It checks for errors (syntax check)", "It translates to bytecode", "Python Virtual Machine executes it"]},
                 "rightPanel": {"label": "Step 3", "emoji": "🎯", "title": "See Output", "description": "The result appears on your screen. If there's an error, Python shows what went wrong."}},
                {"type": "code_example", "title": "Interactive Shell vs File: Same Code, Same Result", "language": "python",
                 "code": "# In the shell:\n>>> print(\"Hello, World!\")\nHello, World!\n\n# In a .py file:\nprint(\"Hello, World!\")\n\n# Run: python myfile.py\n# Output: Hello, World!",
                 "expectedOutput": "Hello, World!"},
                {"type": "explanation", "accentColor": "green", "title": "Python is Interpreted",
                 "body": "Python is an **interpreted language**, which means it runs your code line by line without needing a separate compilation step.",
                 "bullets": [
                     "No compile step — write code and run it immediately",
                     "If Python finds an error on line 5, it stops there and shows the error message",
                     "This makes Python great for beginners — you get instant feedback",
                     "You can test small pieces of code in the shell without creating files"
                 ]},
                {"type": "reflection",
                 "question": "What do you think is the advantage of an interpreted language like Python compared to a compiled language?",
                 "answer": "You can test code immediately without waiting for compilation. If you make a mistake, Python tells you on the spot. This makes learning faster and debugging easier."},
                {"type": "practice", "title": "Run Your First Python Program",
                 "instructions": "Write a program that prints your name and your college on separate lines, then prints 'I am learning Python!' on a third line.",
                 "starterCode": "# My first Python program\nprint(\"\")\n",
                 "solution": "print(\"Lakshanya\")\nprint(\"SRM University\")\nprint(\"I am learning Python!\")",
                 "hint": "Use print() three times, once for each line. Each print() outputs text on a new line.",
                 "expectedOutput": "Lakshanya\nSRM University\nI am learning Python!"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "📖", "text": "A program is a sequence of instructions for a computer"},
        {"emoji": "🐍", "text": "Python is beginner-friendly, readable, and used worldwide"},
        {"emoji": "🖨️", "text": "print() displays text on the screen"},
        {"emoji": "🔧", "text": "Python is interpreted — runs line by line, no compile step"},
        {"emoji": "📁", "text": ".py files store Python programs; run them with python filename.py"},
        {"emoji": "💻", "text": "The Python shell lets you test code interactively"}
    ],
    "whatYouLearned": [
        "What programming is and how it works",
        "Why Python is the best language for beginners",
        "Real-world applications of Python",
        "How to install Python and run programs",
        "The difference between interactive shell and .py files",
        "How to use print() to display output"
    ]
})

# ── Lecture 1 ────────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 1, "title": "Variables & Data Types", "nextUp": "Input & Output",
    "overview": "Every program works with data — numbers, text, true/false values. In this lecture you'll learn how to store data in variables and understand the different types of data Python can work with.",
    "estimatedMinutes": 50,
    "sections": [
        {
            "id": "variables", "label": "Variables",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "What is a Variable?",
                 "body": "A **variable** is a named container that stores a value. Think of it like a labeled box where you can put information. You create a variable with the `=` sign.",
                 "bullets": [
                     "Variables store values like numbers, text, or true/false",
                     "Use the = sign to assign a value: name = \"Lakshanya\"",
                     "Once assigned, use the variable name anywhere to access the value",
                     "Variables can be updated — old value is replaced"
                 ]},
                {"type": "analogy", "title": "A Variable is a Labeled Jar", "emoji": "📦",
                 "text": "Imagine jars with labels. One jar labeled 'sugar' contains sugar. Another labeled 'flour' contains flour. You look at the label to know what's inside. In Python, the label is the variable name and the contents is the value."},
                {"type": "concept_visualization", "title": "Variables Store Data", "accentColor": "blue",
                 "leftPanel": {"label": "Real Life", "emoji": "📦", "title": "Labeled Storage", "description": "A box labeled 'age' stores the number 20 inside it."},
                 "centerPanel": {"label": "Variable", "visualType": "storage_box", "varName": "age", "varValue": "20"},
                 "rightPanel": {"label": "Python Code", "code": "age = 20\nprint(age)", "language": "python", "output": "20"}},
                {"type": "explanation", "accentColor": "blue", "title": "Naming Rules",
                 "body": "Variable names must follow clear rules.",
                 "bullets": [
                     "Start with a letter or underscore (_), not a number",
                     "Use only letters, numbers, and underscores",
                     "Case-sensitive: myVar and myvar are different",
                     "Cannot use Python keywords like if, else, while, for, print"
                 ]},
                {"type": "code_example", "title": "Creating Variables", "language": "python",
                 "code": "name = \"Lakshanya\"\nage = 20\nheight = 5.6\n\nprint(name)\nprint(age)\nprint(height)",
                 "expectedOutput": "Lakshanya\n20\n5.6"},
                {"type": "code_example", "title": "Updating Variables", "language": "python",
                 "code": "score = 0\nprint(score)\n\nscore = score + 10\nprint(score)\n\nscore = score + 5\nprint(score)",
                 "expectedOutput": "0\n10\n15"},
                {"type": "reflection",
                 "question": "What would happen if you used a number as the first character of a variable name, like 1st_name = \"John\"?",
                 "answer": "Python would show a SyntaxError because variable names cannot start with a number."},
                {"type": "practice", "title": "Store Information",
                 "instructions": "Create three variables: your name, your age, and your college. Print each on a separate line.",
                 "starterCode": "# Store your information\nname = \"\"\nage = \ncollege = \"\"\n\n# Print each variable\n",
                 "solution": "name = \"Lakshanya\"\nage = 20\ncollege = \"SRM University\"\n\nprint(name)\nprint(age)\nprint(college)",
                 "hint": "Text values need quotes (\" \"), numbers don't. Use = to assign.",
                 "expectedOutput": "Lakshanya\n20\nSRM University"}
            ]
        },
        {
            "id": "data-types", "label": "Data Types",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Every Value Has a Type",
                 "body": "In Python, every value belongs to a **type** that tells Python what kind of data it is and what you can do with it.",
                 "bullets": [
                     "int — whole numbers like 42, 0, -7",
                     "float — decimal numbers like 3.14, 2.5, -0.001",
                     "str — text/strings like \"hello\", \"Python\"",
                     "bool — True or False values",
                     "Use type() to check the type of any value"
                 ]},
                {"type": "concept_visualization", "title": "The Four Basic Data Types", "accentColor": "purple",
                 "leftPanel": {"label": "int", "emoji": "🔢", "title": "Whole Numbers", "description": "42, 0, -7, 1000 — no decimal point"},
                 "centerPanel": {"label": "float", "emoji": "⚖️", "title": "Decimal Numbers", "description": "3.14, 2.5, -0.001, 99.9"},
                 "rightPanel": {"label": "str & bool", "emoji": "📝", "title": "Text & Logic", "description": "str: \"hello\", \"Python\", \"42\"\nbool: True, False"}},
                {"type": "code_example", "title": "Checking Types with type()", "language": "python",
                 "code": "print(type(42))\nprint(type(3.14))\nprint(type(\"Hello\"))\nprint(type(True))",
                 "expectedOutput": "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>"},
                {"type": "explanation", "accentColor": "purple", "title": "Type Conversion",
                 "body": "Sometimes you need to convert between types — turn a string into a number or a number into a string.",
                 "bullets": [
                     "int(\"5\") converts string \"5\" to integer 5",
                     "str(42) converts integer 42 to string \"42\"",
                     "float(\"3.14\") converts string to float 3.14",
                     "Be careful: int(\"hello\") causes an error because \"hello\" is not a number"
                 ]},
                {"type": "code_example", "title": "Type Conversion in Action", "language": "python",
                 "code": "age_str = \"20\"\nprint(age_str + \"5\")  # string concatenation\n\nage_int = int(age_str)\nprint(age_int + 5)   # integer addition\n\npi = 3.14159\nprint(\"Pi is \" + str(pi))",
                 "expectedOutput": "205\n25\nPi is 3.14159"},
                {"type": "code_example", "title": "Common Type Errors", "language": "python",
                 "code": "# This causes an error:\n# print(\"Age: \" + 20)\n\n# This works:\nprint(\"Age: \" + str(20))\n\n# So does this:\nprint(f\"Age: {20}\")",
                 "expectedOutput": "Age: 20\nAge: 20"},
                {"type": "reflection",
                 "question": "What do you think happens when you add string \"10\" and integer 10 together? Try: \"10\" + 10",
                 "answer": "Python gives a TypeError. You cannot add a string and an integer directly. You must convert one to the other's type first using int() or str()."},
                {"type": "practice", "title": "Age After 5 Years",
                 "instructions": "Store your current age in a variable. Add 5 to it. Print the result using an f-string.",
                 "starterCode": "# Store current age\nage = \n\n# Calculate age after 5 years\nfuture_age = \n\n# Print the result\n",
                 "solution": "age = 20\nfuture_age = age + 5\nprint(f\"After 5 years, I will be {future_age} years old.\")",
                 "hint": "Use + to add numbers. Use f-strings with {} to insert variables into text.",
                 "expectedOutput": "After 5 years, I will be 25 years old."}
            ]
        },
        {
            "id": "strings-basics", "label": "Strings",
            "blocks": [
                {"type": "explanation", "accentColor": "green", "title": "Working with Strings",
                 "body": "A **string** is a sequence of characters — letters, numbers, spaces, symbols — enclosed in quotes.",
                 "bullets": [
                     "Use single quotes: 'Hello' or double quotes: \"Hello\"",
                     "Both work the same way — choose what you prefer",
                     "Strings can contain spaces, punctuation, and special characters",
                     "Add strings together with + (concatenation)"
                 ]},
                {"type": "code_example", "title": "String Operations", "language": "python",
                 "code": "first = \"Lakshanya\"\nlast = \"Krishna\"\n\n# Concatenation\nfull = first + \" \" + last\nprint(full)\n\n# Repeat string\nprint(\"Ha! \" * 3)\n\n# Length\nprint(len(first))",
                 "expectedOutput": "Lakshanya Krishna\nHa! Ha! Ha! \n9"},
                {"type": "practice", "title": "Profile Card",
                 "instructions": "Create variables for name, age, and college. Print them in this format: \"Name: [name], Age: [age], College: [college]\"",
                 "starterCode": "name = \"\"\nage = \ncollege = \"\"\n\n# Print profile card\n",
                 "solution": "name = \"Lakshanya\"\nage = 20\ncollege = \"SRM University\"\n\nprint(\"Name: \" + name + \", Age: \" + str(age) + \", College: \" + college)",
                 "hint": "Use + to join strings. Convert numbers to strings with str() before concatenating.",
                 "expectedOutput": "Name: Lakshanya, Age: 20, College: SRM University"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "📦", "text": "Variables store values using the = operator"},
        {"emoji": "🔢", "text": "int is for whole numbers, float is for decimals"},
        {"emoji": "📝", "text": "str is for text, always in quotes"},
        {"emoji": "✅", "text": "bool is for True/False values"},
        {"emoji": "🔍", "text": "type() tells you the type of any value"},
        {"emoji": "🔄", "text": "Use int(), str(), float() to convert between types"}
    ],
    "whatYouLearned": [
        "How to create and update variables",
        "The four basic data types: int, float, str, bool",
        "How to check types with type()",
        "How to convert between types safely",
        "How to concatenate strings with +",
        "Why type errors happen and how to fix them"
    ]
})

# ── Lecture 2 ────────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 2, "title": "Input & Output", "nextUp": "Operators",
    "overview": "Programs are interactive — they ask for input, process it, and show output. In this lecture you'll master getting user input and formatting output like a pro.",
    "estimatedMinutes": 45,
    "sections": [
        {
            "id": "print-output", "label": "print() Output",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "Displaying Output with print()",
                 "body": "You already know print() displays text. But print() has superpowers — you can print multiple items, change separators, and control line endings.",
                 "bullets": [
                     "print() accepts multiple items separated by commas",
                     "By default, items are separated by a space",
                     "Use sep parameter to change the separator",
                     "Use end parameter to change what comes at the end (default is newline)"
                 ]},
                {"type": "code_example", "title": "Print Multiple Items", "language": "python",
                 "code": "print(\"Hello\", \"World\")\nprint(1, 2, 3, 4)\nprint(\"Python\", \"is\", \"awesome\")",
                 "expectedOutput": "Hello World\n1 2 3 4\nPython is awesome"},
                {"type": "code_example", "title": "Custom Separator with sep", "language": "python",
                 "code": "print(\"apple\", \"banana\", \"cherry\", sep=\", \")\nprint(\"one\", \"two\", \"three\", sep=\" - \")\nprint(\"A\", \"B\", \"C\", sep=\"\")",
                 "expectedOutput": "apple, banana, cherry\none - two - three\nABC"},
                {"type": "code_example", "title": "Custom Ending with end", "language": "python",
                 "code": "print(\"Loading\", end=\"\")\nprint(\".\", end=\"\")\nprint(\".\", end=\"\")\nprint(\".\")\nprint(\"Done!\")",
                 "expectedOutput": "Loading...\nDone!"},
                {"type": "practice", "title": "Design Your Output",
                 "instructions": "Use print() with sep to display numbers 1 through 5 separated by arrows: \"1 → 2 → 3 → 4 → 5\"",
                 "starterCode": "# Print numbers with arrow separator\nprint(1, 2, 3, 4, 5, sep=\"\")",
                 "solution": "print(1, 2, 3, 4, 5, sep=\" → \")",
                 "hint": "Put your numbers as separate arguments to print(). Set sep=\" → \" with the arrow symbol.",
                 "expectedOutput": "1 → 2 → 3 → 4 → 5"}
            ]
        },
        {
            "id": "user-input", "label": "User Input",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Getting Input with input()",
                 "body": "The `input()` function waits for the user to type something and press Enter. It **always returns a string** — even if the user types a number.",
                 "bullets": [
                     "input() pauses the program and waits for the user",
                     "You can show a prompt: input(\"Enter your name: \")",
                     "The return value is always a string",
                     "Use int(input()) to get an integer from the user"
                 ]},
                {"type": "analogy", "title": "input() is Like a Receptionist", "emoji": "🎤",
                 "text": "You ask a question (the prompt), then wait for the person to answer (type and press Enter). The receptionist (input()) hands you the answer on a piece of paper (a string). If you need it as a number, you must convert it yourself."},
                {"type": "code_example", "title": "Getting and Using Input", "language": "python",
                 "code": "name = input(\"Enter your name: \")\nprint(\"Hello, \" + name + \"!\")",
                 "expectedOutput": "Enter your name: Lakshanya\nHello, Lakshanya!"},
                {"type": "code_example", "title": "Converting Input to Number", "language": "python",
                 "code": "age_str = input(\"Enter your age: \")\nage = int(age_str)\nnext_year = age + 1\nprint(f\"Next year you will be {next_year}\")",
                 "expectedOutput": "Enter your age: 20\nNext year you will be 21"},
                {"type": "code_example", "title": "Shortcut: int(input())", "language": "python",
                 "code": "age = int(input(\"Enter your age: \"))\nprint(f\"You are {age} years old\")",
                 "expectedOutput": "Enter your age: 20\nYou are 20 years old"},
                {"type": "reflection",
                 "question": "What happens if the user types 'twenty' instead of 20, and you try int(input())?",
                 "answer": "Python gives a ValueError because 'twenty' cannot be converted to an integer. This is called an exception."},
                {"type": "practice", "title": "Student Details Form",
                 "instructions": "Ask the user for their name (string), age (integer), and city (string). Then print all details in a formatted card using f-strings.",
                 "starterCode": "# Get student details\nname = input(\"Enter your name: \")\nage = \ncity = \n\n# Print details card\n",
                 "solution": "name = input(\"Enter your name: \")\nage = int(input(\"Enter your age: \"))\ncity = input(\"Enter your city: \")\n\nprint(f\"--- Student Card ---\")\nprint(f\"Name: {name}\")\nprint(f\"Age: {age}\")\nprint(f\"City: {city}\")",
                 "hint": "Use int(input()) for numbers. Use f-strings to format the output nicely.",
                 "expectedOutput": "--- Student Card ---\nName: Lakshanya\nAge: 20\nCity: Chennai"}
            ]
        },
        {
            "id": "fstrings-deep", "label": "f-Strings Deep Dive",
            "blocks": [
                {"type": "explanation", "accentColor": "green", "title": "Formatting with f-Strings",
                 "body": "**f-strings** (formatted strings) are the cleanest way to combine text and variables. Just prefix your string with `f` and put expressions inside `{}`.",
                 "bullets": [
                     "Prefix the string with f: f\"Hello {name}\"",
                     "Any expression works inside {}: math, function calls, variables",
                     "f-strings handle type conversion automatically",
                     "They are faster and more readable than + concatenation"
                 ]},
                {"type": "code_example", "title": "f-String Examples", "language": "python",
                 "code": "name = \"Lakshanya\"\nage = 20\n\nprint(f\"Hello, {name}!\")\nprint(f\"{name} is {age} years old\")\nprint(f\"In 5 years, {name} will be {age + 5}\")",
                 "expectedOutput": "Hello, Lakshanya!\nLakshanya is 20 years old\nIn 5 years, Lakshanya will be 25"},
                {"type": "code_example", "title": "f-Strings vs Concatenation", "language": "python",
                 "code": "# f-strings are cleaner:\nname = \"Alice\"\nscore = 95\nprint(f\"{name} scored {score}%\")\n\n# vs concatenation:\nprint(name + \" scored \" + str(score) + \"%\")",
                 "expectedOutput": "Alice scored 95%\nAlice scored 95%"},
                {"type": "practice", "title": "Simple Calculator",
                 "instructions": "Ask the user for two numbers. Convert them to integers. Print the sum, difference, and product using f-strings.",
                 "starterCode": "# Get two numbers\nnum1 = int(input(\"Enter first number: \"))\nnum2 = \n\n# Calculate and print\n",
                 "solution": "num1 = int(input(\"Enter first number: \"))\nnum2 = int(input(\"Enter second number: \"))\n\nprint(f\"Sum: {num1 + num2}\")\nprint(f\"Difference: {num1 - num2}\")\nprint(f\"Product: {num1 * num2}\")",
                 "hint": "Use int(input()) for both numbers. Use f-strings with {} to show calculations.",
                 "expectedOutput": "Enter first number: 10\nEnter second number: 5\nSum: 15\nDifference: 5\nProduct: 50"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "🖨️", "text": "print() can take multiple items, sep changes separator, end changes line ending"},
        {"emoji": "⌨️", "text": "input() gets text from the user, always returns a string"},
        {"emoji": "🔄", "text": "Use int(input()) to get numbers from user input"},
        {"emoji": "🏷️", "text": "f-strings embed variables with {} and are cleaner than concatenation"},
        {"emoji": "⚠️", "text": "int() fails with ValueError if the input is not a valid number"},
        {"emoji": "🧩", "text": "Combine input, conversion, and f-strings for interactive programs"}
    ],
    "whatYouLearned": [
        "How to format print() output with sep and end",
        "How to get user input with input()",
        "How to convert string input to integers",
        "How to format strings with f-strings",
        "The difference between f-strings and concatenation",
        "How to build a simple interactive calculator"
    ]
})

# ── Lecture 3 ────────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 3, "title": "Operators", "nextUp": "Conditional Statements",
    "overview": "Operators let you perform calculations, compare values, and make logical decisions. In this lecture you'll master Python's arithmetic, comparison, and logical operators.",
    "estimatedMinutes": 50,
    "sections": [
        {
            "id": "arithmetic", "label": "Arithmetic Operators",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "Math in Python",
                 "body": "Python can do all the math you learned in school. Arithmetic operators let you add, subtract, multiply, divide, and perform advanced operations.",
                 "bullets": [
                     "+ addition, - subtraction, * multiplication, / division",
                     "// floor division — divides and rounds down",
                     "% modulo — returns the remainder of division",
                     "** power (exponent) — raises a number to a power"
                 ]},
                {"type": "code_example", "title": "Basic Arithmetic", "language": "python",
                 "code": "print(10 + 5)\nprint(10 - 5)\nprint(10 * 5)\nprint(10 / 5)",
                 "expectedOutput": "15\n5\n50\n2.0"},
                {"type": "code_example", "title": "Floor Division and Modulo", "language": "python",
                 "code": "print(17 // 5)\nprint(17 % 5)\n\nprint(20 // 6)\nprint(20 % 6)",
                 "expectedOutput": "3\n2\n3\n2"},
                {"type": "code_example", "title": "Power Operator", "language": "python",
                 "code": "print(2 ** 3)\nprint(5 ** 2)\nprint(10 ** 4)",
                 "expectedOutput": "8\n25\n10000"},
                {"type": "explanation", "accentColor": "blue", "title": "PEMDAS — Order of Operations",
                 "body": "Python follows standard math rules: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction.",
                 "bullets": [
                     "Parentheses () have the highest priority",
                     "Exponents ** come next",
                     "Multiplication *, Division /, Floor Division //, Modulo % are next",
                     "Addition + and Subtraction - are last"
                 ]},
                {"type": "code_example", "title": "PEMDAS in Action", "language": "python",
                 "code": "print(2 + 3 * 4)\nprint((2 + 3) * 4)\nprint(10 - 2 * 3 + 1)\nprint(10 + 2 ** 3)",
                 "expectedOutput": "14\n20\n5\n18"},
                {"type": "reflection",
                 "question": "What do you think 7 // 2 and 7 % 2 will give? How are they related?",
                 "answer": "7 // 2 = 3 (floor division), 7 % 2 = 1 (remainder). They are related: 7 = (2 × 3) + 1."},
                {"type": "practice", "title": "Percentage Calculator",
                 "instructions": "Ask the user for marks obtained and total marks. Calculate percentage = (obtained / total) * 100. Print with 2 decimal places.",
                 "starterCode": "obtained = int(input(\"Marks obtained: \"))\ntotal = int(input(\"Total marks: \"))\n\npercentage = \nprint(f\"Percentage: {percentage:.2f}%\")",
                 "solution": "obtained = int(input(\"Marks obtained: \"))\ntotal = int(input(\"Total marks: \"))\npercentage = (obtained / total) * 100\nprint(f\"Percentage: {percentage:.2f}%\")",
                 "hint": "Use (obtained / total) * 100. The :.2f in f-string rounds to 2 decimal places.",
                 "expectedOutput": "Marks obtained: 85\nTotal marks: 100\nPercentage: 85.00%"}
            ]
        },
        {
            "id": "comparison", "label": "Comparison Operators",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Comparing Values",
                 "body": "**Comparison operators** compare two values and return either True or False.",
                 "bullets": [
                     "== equal to (not = which is assignment)",
                     "!= not equal to",
                     "< less than, > greater than",
                     "<= less than or equal, >= greater than or equal"
                 ]},
                {"type": "code_example", "title": "Comparison in Action", "language": "python",
                 "code": "print(5 == 5)\nprint(5 != 5)\nprint(10 > 5)\nprint(3 < 1)\nprint(7 >= 7)\nprint(8 <= 4)",
                 "expectedOutput": "True\nFalse\nTrue\nFalse\nTrue\nFalse"},
                {"type": "code_example", "title": "Comparing Variables", "language": "python",
                 "code": "age = 18\nvoting_age = 18\nprint(age >= voting_age)\nprint(age == voting_age)\n\nscore = 85\npassing = 70\nprint(score > passing)",
                 "expectedOutput": "True\nTrue\nTrue"},
                {"type": "reflection",
                 "question": "What is the difference between = and == in Python?",
                 "answer": "= is assignment (puts a value in a variable). == is comparison (checks if values are equal)."},
                {"type": "practice", "title": "Eligibility Checker",
                 "instructions": "Ask the user for their age. Check if they are eligible to vote (age >= 18). Print the result.",
                 "starterCode": "age = int(input(\"Enter your age: \"))\neligible = \nprint(f\"Eligible to vote: {eligible}\")",
                 "solution": "age = int(input(\"Enter your age: \"))\neligible = age >= 18\nprint(f\"Eligible to vote: {eligible}\")",
                 "hint": "Use age >= 18 as the comparison. This gives a boolean True or False.",
                 "expectedOutput": "Enter your age: 20\nEligible to vote: True"}
            ]
        },
        {
            "id": "logical", "label": "Logical Operators",
            "blocks": [
                {"type": "explanation", "accentColor": "green", "title": "Combining Conditions",
                 "body": "**Logical operators** let you combine multiple conditions to make complex decisions.",
                 "bullets": [
                     "and — True only if BOTH sides are True",
                     "or — True if AT LEAST ONE side is True",
                     "not — reverses the result (True becomes False)"
                 ]},
                {"type": "analogy", "title": "Think of and/or as Gatekeepers", "emoji": "🚪",
                 "text": "Two guards at a door. With and: both must say yes. With or: if either says yes, you enter. With not: the guard says the opposite."},
                {"type": "code_example", "title": "Logical Operators", "language": "python",
                 "code": "age = 20\nhas_id = True\nprint(age >= 18 and has_id)\nprint(age >= 18 or has_id)\nprint(not has_id)\n\nscore = 85\nextra = False\nprint(score >= 80 or extra)",
                 "expectedOutput": "True\nTrue\nFalse\nTrue"},
                {"type": "practice", "title": "Scholarship Checker",
                 "instructions": "Ask for marks and family income. Qualifies if marks >= 85 AND income < 50000.",
                 "starterCode": "marks = int(input(\"Marks: \"))\nincome = int(input(\"Income: \"))\nqualifies = \nprint(f\"Qualifies: {qualifies}\")",
                 "solution": "marks = int(input(\"Marks: \"))\nincome = int(input(\"Income: \"))\nqualifies = marks >= 85 and income < 50000\nprint(f\"Qualifies: {qualifies}\")",
                 "hint": "Use marks >= 85 and income < 50000 with the and operator.",
                 "expectedOutput": "Marks: 90\nIncome: 40000\nQualifies: True"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "➕", "text": "Arithmetic operators: +, -, *, /, //, %, **"},
        {"emoji": "📐", "text": "PEMDAS rules apply — parentheses first, then exponents, etc."},
        {"emoji": "⚖️", "text": "Comparison operators: ==, !=, <, >, <=, >="},
        {"emoji": "🔗", "text": "Logical operators: and, or, not combine conditions"},
        {"emoji": "⚠️", "text": "= is assignment, == is comparison — don't mix them up"}
    ],
    "whatYouLearned": [
        "All arithmetic operators including floor division and modulo",
        "How PEMDAS determines the order of calculations",
        "How to compare values with comparison operators",
        "How to combine conditions with and, or, not",
        "How to build a percentage calculator and eligibility checker"
    ]
})

# ── Lecture 4 ────────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 4, "title": "Conditional Statements", "nextUp": "For Loops",
    "overview": "Programs need to make decisions. Conditional statements let your code choose different paths based on conditions.",
    "estimatedMinutes": 50,
    "sections": [
        {
            "id": "if-basics", "label": "if Statements",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "Making Decisions with if",
                 "body": "The `if` statement lets you run code only when a condition is True. If False, the code is skipped.",
                 "bullets": [
                     "Write if followed by a condition and a colon",
                     "The code to run goes on the next line, indented 4 spaces",
                     "Python uses indentation to show what code belongs to the if",
                     "If True, the indented block runs; if False, it is skipped"
                 ]},
                {"type": "analogy", "title": "if is Like a Traffic Light", "emoji": "🚦",
                 "text": "Green light (True) → you go. Red light (False) → you stop. The if statement checks the condition and decides whether to run the code or skip it."},
                {"type": "code_example", "title": "Basic if Statement", "language": "python",
                 "code": "age = 18\nif age >= 18:\n    print(\"You are an adult\")\n    print(\"You can vote!\")",
                 "expectedOutput": "You are an adult\nYou can vote!"},
                {"type": "practice", "title": "Voting Eligibility",
                 "instructions": "Ask for age. If 18+, print \"You are eligible to vote!\"",
                 "starterCode": "age = int(input(\"Enter your age: \"))\nif age >= 18:\n    ",
                 "solution": "age = int(input(\"Enter your age: \"))\nif age >= 18:\n    print(\"You are eligible to vote!\")",
                 "hint": "Use if age >= 18: followed by an indented print() statement.",
                 "expectedOutput": "Enter your age: 20\nYou are eligible to vote!"}
            ]
        },
        {
            "id": "if-else", "label": "if-else & elif",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Two Paths with if-else",
                 "body": "When you need to choose between two options, use if-else. One block runs if True, another if False.",
                 "bullets": [
                     "if condition: — runs when True",
                     "else: — runs when False",
                     "Only ONE of the two blocks runs, never both"
                 ]},
                {"type": "code_example", "title": "if-else in Action", "language": "python",
                 "code": "age = 16\nif age >= 18:\n    print(\"You can vote\")\nelse:\n    print(\"Too young to vote\")",
                 "expectedOutput": "Too young to vote"},
                {"type": "explanation", "accentColor": "purple", "title": "Multiple Conditions with elif",
                 "body": "When you have more than two possibilities, use elif. You can chain as many as needed.",
                 "bullets": [
                     "if checks the first condition",
                     "elif checks the next (if previous was False)",
                     "else runs only if ALL conditions were False"
                 ]},
                {"type": "code_example", "title": "elif Chain", "language": "python",
                 "code": "score = 85\nif score >= 90:\n    print(\"Grade: A\")\nelif score >= 80:\n    print(\"Grade: B\")\nelif score >= 70:\n    print(\"Grade: C\")\nelse:\n    print(\"Grade: F\")",
                 "expectedOutput": "Grade: B"},
                {"type": "explanation", "accentColor": "purple", "title": "Truthy and Falsy Values",
                 "body": "Some values are treated as True (truthy) and others as False (falsy) in conditions.",
                 "bullets": [
                     "Falsy: None, 0, 0.0, \"\" (empty string), [] (empty list)",
                     "Truthy: everything else — non-zero numbers, non-empty strings",
                     "Lets you write concise conditions like if name:"
                 ]},
                {"type": "code_example", "title": "Truthy and Falsy", "language": "python",
                 "code": "name = \"\"\nif name:\n    print(f\"Hello, {name}\")\nelse:\n    print(\"No name entered\")",
                 "expectedOutput": "No name entered"},
                {"type": "practice", "title": "Grade Calculator",
                 "instructions": "Ask for marks. Print grade: 90+ = A, 80-89 = B, 70-79 = C, 60-69 = D, below 60 = F.",
                 "starterCode": "marks = int(input(\"Enter marks: \"))\nif marks >= 90:\n    \nelif \nelif \nelif \nelse:\n    ",
                 "solution": "marks = int(input(\"Enter marks: \"))\nif marks >= 90:\n    print(\"Grade: A\")\nelif marks >= 80:\n    print(\"Grade: B\")\nelif marks >= 70:\n    print(\"Grade: C\")\nelif marks >= 60:\n    print(\"Grade: D\")\nelse:\n    print(\"Grade: F\")",
                 "hint": "Check the highest grade first (>= 90), then work down.",
                 "expectedOutput": "Enter marks: 85\nGrade: B"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "🔀", "text": "if runs code only when a condition is True"},
        {"emoji": "🔄", "text": "if-else provides two paths: one for True, one for False"},
        {"emoji": "🔗", "text": "elif chains multiple conditions in sequence"},
        {"emoji": "✅", "text": "Truthy values: non-zero numbers, non-empty strings"},
        {"emoji": "❌", "text": "Falsy values: 0, None, empty strings, empty lists"}
    ],
    "whatYouLearned": [
        "How to write if statements with proper indentation",
        "How to use if-else for two-way decisions",
        "How to chain multiple conditions with elif",
        "What truthy and falsy values are",
        "How to build a complete grade calculator"
    ]
})

# ── Lecture 5 ────────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 5, "title": "For Loops", "nextUp": "While Loops",
    "overview": "Loops let you repeat code multiple times without writing it over and over. The for loop is perfect for working with sequences of items.",
    "estimatedMinutes": 50,
    "sections": [
        {
            "id": "loop-concept", "label": "Loop Basics",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "What is a Loop?",
                 "body": "A **loop** repeats a block of code multiple times. Instead of writing the same code 10 times, you write it once inside a loop.",
                 "bullets": [
                     "Loops eliminate repetitive code",
                     "You control how many times the loop runs",
                     "Each repetition is called an iteration"
                 ]},
                {"type": "analogy", "title": "A Loop is Like a Washing Machine Cycle", "emoji": "🌀",
                 "text": "You load clothes, set the timer, and the machine repeats the cycle until time runs out. A for loop processes each item in a list automatically."},
                {"type": "code_example", "title": "Basic for Loop with a List", "language": "python",
                 "code": "fruits = [\"apple\", \"banana\", \"cherry\"]\nfor fruit in fruits:\n    print(f\"I like {fruit}\")",
                 "expectedOutput": "I like apple\nI like banana\nI like cherry"},
                {"type": "practice", "title": "Iterate a List",
                 "instructions": "Create a list of three colors. Use a for loop to print each color.",
                 "starterCode": "colors = [\"red\", \"blue\", \"green\"]\nfor color in colors:\n    ",
                 "solution": "colors = [\"red\", \"blue\", \"green\"]\nfor color in colors:\n    print(f\"Color: {color}\")",
                 "hint": "Use for color in colors: and indent the print() statement.",
                 "expectedOutput": "Color: red\nColor: blue\nColor: green"}
            ]
        },
        {
            "id": "range", "label": "range() Function",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Counting with range()",
                 "body": "The `range()` function generates a sequence of numbers. Perfect when you want to repeat a specific number of times.",
                 "bullets": [
                     "range(stop) — numbers from 0 to stop-1",
                     "range(start, stop) — numbers from start to stop-1",
                     "range(start, stop, step) — numbers with custom step"
                 ]},
                {"type": "code_example", "title": "range() Basics", "language": "python",
                 "code": "print(\"range(5):\")\nfor i in range(5):\n    print(i)\n\nprint(\"range(2, 6):\")\nfor i in range(2, 6):\n    print(i)",
                 "expectedOutput": "range(5):\n0\n1\n2\n3\n4\nrange(2, 6):\n2\n3\n4\n5"},
                {"type": "code_example", "title": "range() with Step", "language": "python",
                 "code": "print(\"Even numbers:\")\nfor i in range(0, 10, 2):\n    print(i)\n\nprint(\"Countdown:\")\nfor i in range(5, 0, -1):\n    print(i)\nprint(\"Blast off!\")",
                 "expectedOutput": "Even numbers:\n0\n2\n4\n6\n8\nCountdown:\n5\n4\n3\n2\n1\nBlast off!"},
                {"type": "practice", "title": "Print 1 to 10",
                 "instructions": "Use a for loop with range() to print numbers 1 through 10.",
                 "starterCode": "for i in range(, ):\n    print(i)",
                 "solution": "for i in range(1, 11):\n    print(i)",
                 "hint": "Use range(1, 11) — range stops before the end value.",
                 "expectedOutput": "1\n2\n3\n4\n5\n6\n7\n8\n9\n10"}
            ]
        },
        {
            "id": "nested-loops", "label": "Nested Loops",
            "blocks": [
                {"type": "explanation", "accentColor": "green", "title": "Loops Inside Loops",
                 "body": "You can put a loop inside another loop. The inner loop runs completely for EACH iteration of the outer loop.",
                 "bullets": [
                     "The outer loop controls rows",
                     "The inner loop controls columns",
                     "Nested loops are great for patterns and tables"
                 ]},
                {"type": "code_example", "title": "Multiplication Table", "language": "python",
                 "code": "for i in range(1, 4):\n    for j in range(1, 4):\n        print(f\"{i} x {j} = {i*j}\")",
                 "expectedOutput": "1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9"},
                {"type": "practice", "title": "Multiplication Table",
                 "instructions": "Ask for a number. Print its multiplication table from 1 to 10.",
                 "starterCode": "num = int(input(\"Enter a number: \"))\nfor i in range(1, 11):\n    print(f\"{num} x {i} = \")",
                 "solution": "num = int(input(\"Enter a number: \"))\nfor i in range(1, 11):\n    print(f\"{num} x {i} = {num * i}\")",
                 "hint": "Loop from 1 to 10. Inside the loop, print num * i.",
                 "expectedOutput": "Enter a number: 5\n5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "🔄", "text": "Loops repeat code without writing it multiple times"},
        {"emoji": "📋", "text": "For loops iterate over each item in a sequence"},
        {"emoji": "🔢", "text": "range(n) generates 0 to n-1"},
        {"emoji": "📊", "text": "Nested loops are useful for tables and patterns"},
        {"emoji": "⚠️", "text": "range(stop) excludes stop — range(5) gives 0-4"}
    ],
    "whatYouLearned": [
        "How for loops iterate over sequences",
        "How to use range() for counting loops",
        "How nested loops work",
        "How to generate multiplication tables"
    ]
})

# ── Lecture 6 ────────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 6, "title": "While Loops", "nextUp": "Lists",
    "overview": "While loops run as long as a condition is true. They're perfect when you don't know exactly how many times you need to repeat.",
    "estimatedMinutes": 45,
    "sections": [
        {
            "id": "while-basics", "label": "while Loop",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "The while Loop",
                 "body": "A `while` loop keeps running as long as its condition is True. It checks the condition BEFORE each iteration.",
                 "bullets": [
                     "while condition: — checks before each run",
                     "If True, the body runs, then checks again",
                     "If False, the loop stops"
                 ]},
                {"type": "analogy", "title": "while is Like Checking Your Phone", "emoji": "📱",
                 "text": "While waiting for a friend: check for messages. No message → wait. Message arrives → stop. The while loop checks a condition and keeps going until it changes."},
                {"type": "code_example", "title": "Basic while Loop", "language": "python",
                 "code": "count = 1\nwhile count <= 5:\n    print(f\"Count: {count}\")\n    count = count + 1\nprint(\"Done!\")",
                 "expectedOutput": "Count: 1\nCount: 2\nCount: 3\nCount: 4\nCount: 5\nDone!"},
                {"type": "explanation", "accentColor": "blue", "title": "Avoiding Infinite Loops",
                 "body": "An **infinite loop** runs forever because the condition never becomes False.",
                 "bullets": [
                     "Always update the counter variable inside the loop",
                     "Make sure the condition will eventually become False",
                     "Use break to exit early if needed",
                     "Press Ctrl+C to stop a running program"
                 ]},
                {"type": "reflection",
                 "question": "What happens if you forget to update the counter inside a while loop?",
                 "answer": "The condition never becomes False, creating an infinite loop. The program runs forever until you force-stop it with Ctrl+C."},
                {"type": "practice", "title": "Sum of N Numbers",
                 "instructions": "Ask for a number N. Use a while loop to calculate sum of 1 to N.",
                 "starterCode": "n = int(input(\"Enter N: \"))\ncount = 1\ntotal = 0\nwhile count <= n:\n    total = \n    count = \nprint(f\"Sum: {total}\")",
                 "solution": "n = int(input(\"Enter N: \"))\ncount = 1\ntotal = 0\nwhile count <= n:\n    total = total + count\n    count = count + 1\nprint(f\"Sum of 1 to {n} = {total}\")",
                 "hint": "Add count to total each iteration, then increment count.",
                 "expectedOutput": "Enter N: 5\nSum of 1 to 5 = 15"}
            ]
        },
        {
            "id": "break-continue", "label": "break & continue",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Controlling Loop Flow",
                 "body": "Sometimes you need to exit early or skip an iteration. break and continue give you this control.",
                 "bullets": [
                     "break — exits the loop immediately",
                     "continue — skips to the next iteration",
                     "break is useful for 'found it!' scenarios",
                     "continue is useful for 'skip this one' scenarios"
                 ]},
                {"type": "code_example", "title": "break — Exit Early", "language": "python",
                 "code": "for num in range(1, 10):\n    if num == 5:\n        print(\"Found 5! Stopping...\")\n        break\n    print(f\"Checking: {num}\")",
                 "expectedOutput": "Checking: 1\nChecking: 2\nChecking: 3\nChecking: 4\nFound 5! Stopping..."},
                {"type": "code_example", "title": "continue — Skip an Iteration", "language": "python",
                 "code": "for num in range(1, 8):\n    if num % 2 == 0:\n        continue\n    print(f\"Odd: {num}\")",
                 "expectedOutput": "Odd: 1\nOdd: 3\nOdd: 5\nOdd: 7"},
                {"type": "explanation", "accentColor": "purple", "title": "while vs for",
                 "body": "Choose the right loop for the right job.",
                 "bullets": [
                     "Use for when you know the count or have a list",
                     "Use while when waiting for a condition to change",
                     "for loops are safer (no infinite loops)"
                 ]},
                {"type": "practice", "title": "Number Guessing Game",
                 "instructions": "Set secret = 7. Keep asking the user to guess until correct.",
                 "starterCode": "secret = 7\nwhile True:\n    guess = int(input(\"Guess (1-10): \"))\n    if guess == secret:\n        print(\"Correct!\")\n        \n    else:\n        print(\"Wrong!\")",
                 "solution": "secret = 7\nwhile True:\n    guess = int(input(\"Guess (1-10): \"))\n    if guess == secret:\n        print(\"Correct! You got it!\")\n        break\n    else:\n        print(\"Wrong, try again.\")",
                 "hint": "Use while True for infinite loop, break when guessed correctly.",
                 "expectedOutput": "Guess (1-10): 3\nWrong, try again.\nGuess (1-10): 7\nCorrect! You got it!"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "🔄", "text": "while loops run as long as the condition is True"},
        {"emoji": "⚠️", "text": "Always update the condition variable to avoid infinite loops"},
        {"emoji": "⏹️", "text": "break exits the loop immediately"},
        {"emoji": "⏭️", "text": "continue skips to the next iteration"},
        {"emoji": "🔀", "text": "Use for when you know the count, while when you don't"}
    ],
    "whatYouLearned": [
        "How while loops work with conditions",
        "How to avoid infinite loops",
        "How to use break and continue",
        "When to use while vs for loops",
        "How to build a number guessing game"
    ]
})

# ── Lecture 7 ────────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 7, "title": "Lists", "nextUp": "Tuples & Sets",
    "overview": "Lists are Python's way of storing collections of items. They're flexible, powerful, and everywhere in Python programs.",
    "estimatedMinutes": 50,
    "sections": [
        {
            "id": "list-basics", "label": "List Basics",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "What is a List?",
                 "body": "A **list** is an ordered collection of items enclosed in square brackets []. You can store any type of data.",
                 "bullets": [
                     "Create: fruits = [\"apple\", \"banana\", \"cherry\"]",
                     "Items are separated by commas",
                     "Lists keep their order (first item stays first)",
                     "Lists can contain mixed types"
                 ]},
                {"type": "analogy", "title": "A List is Like a Shopping List", "emoji": "🛒",
                 "text": "You write items in order: first eggs, then milk, then bread. You can add items, remove items, or check what's at position 2. Python lists work exactly the same way."},
                {"type": "code_example", "title": "Creating and Printing Lists", "language": "python",
                 "code": "fruits = [\"apple\", \"banana\", \"cherry\"]\nprint(fruits)\n\nmixed = [\"hello\", 42, True, 3.14]\nprint(mixed)\nprint(type(fruits))",
                 "expectedOutput": "['apple', 'banana', 'cherry']\n['hello', 42, True, 3.14]\n<class 'list'>"},
                {"type": "practice", "title": "Create a Shopping List",
                 "instructions": "Create a list with 3 items. Use a for loop to print each with a number.",
                 "starterCode": "groceries = [\"milk\", \"bread\", \"eggs\"]\nfor i in range(len(groceries)):\n    ",
                 "solution": "groceries = [\"milk\", \"bread\", \"eggs\"]\nfor i in range(len(groceries)):\n    print(f\"{i+1}. {groceries[i]}\")",
                 "hint": "Use range(len(groceries)) to get indices. Add 1 to display starting from 1.",
                 "expectedOutput": "1. milk\n2. bread\n3. eggs"}
            ]
        },
        {
            "id": "indexing", "label": "Indexing & Slicing",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Accessing Items with Index",
                 "body": "Each item in a list has a position called an **index**. Python uses zero-based indexing.",
                 "bullets": [
                     "Index starts at 0: fruits[0] is the first item",
                     "Negative index counts from end: fruits[-1] is last",
                     "Slicing extracts a portion: fruits[1:3] gets index 1 and 2",
                     "len(list) gives the number of items"
                 ]},
                {"type": "code_example", "title": "Indexing and Slicing", "language": "python",
                 "code": "fruits = [\"apple\", \"banana\", \"cherry\", \"date\", \"elderberry\"]\nprint(fruits[0])\nprint(fruits[-1])\nprint(fruits[1:4])\nprint(fruits[:3])\nprint(fruits[2:])\nprint(fruits[::2])",
                 "expectedOutput": "apple\nelderberry\n['banana', 'cherry', 'date']\n['apple', 'banana', 'cherry']\n['cherry', 'date', 'elderberry']\n['apple', 'cherry', 'elderberry']"},
                {"type": "practice", "title": "Access List Elements",
                 "instructions": "Create a list of 5 numbers. Print the first, last, and middle elements.",
                 "starterCode": "nums = [10, 20, 30, 40, 50]\nprint(f\"First: {nums[0]}\")\nprint(f\"Last: {nums[]}\")\nprint(f\"Middle: {nums[]}\")",
                 "solution": "nums = [10, 20, 30, 40, 50]\nprint(f\"First: {nums[0]}\")\nprint(f\"Last: {nums[-1]}\")\nprint(f\"Middle: {nums[2]}\")",
                 "hint": "Use index 0 for first, -1 for last, and len(nums)//2 for middle.",
                 "expectedOutput": "First: 10\nLast: 50\nMiddle: 30"}
            ]
        },
        {
            "id": "list-methods", "label": "List Methods",
            "blocks": [
                {"type": "explanation", "accentColor": "green", "title": "Working with List Methods",
                 "body": "Lists have built-in **methods** that let you modify and analyze them.",
                 "bullets": [
                     "append(item) — adds item to the end",
                     "remove(item) — removes the first occurrence",
                     "sort() — sorts in ascending order",
                     "len(list) — returns the number of items"
                 ]},
                {"type": "code_example", "title": "List Operations", "language": "python",
                 "code": "tasks = [\"study\", \"exercise\", \"code\"]\nprint(tasks)\ntasks.append(\"read\")\nprint(tasks)\ntasks.remove(\"exercise\")\nprint(tasks)\ntasks[0] = \"review\"\nprint(tasks)\nprint(f\"Total: {len(tasks)}\")",
                 "expectedOutput": "['study', 'exercise', 'code']\n['study', 'exercise', 'code', 'read']\n['study', 'code', 'read']\n['review', 'code', 'read']\nTotal: 3"},
                {"type": "code_example", "title": "Sorting and Looping", "language": "python",
                 "code": "scores = [88, 72, 95, 60, 81]\nscores.sort()\nprint(f\"Sorted: {scores}\")\nprint(f\"Highest: {scores[-1]}\")",
                 "expectedOutput": "Sorted: [60, 72, 81, 88, 95]\nHighest: 95"},
                {"type": "practice", "title": "Student Marks Manager",
                 "instructions": "Start with [78, 92, 85, 63, 88]. Add 95, remove the lowest, sort, and print the average.",
                 "starterCode": "marks = [78, 92, 85, 63, 88]\nmarks.append()\nmarks.remove()\nmarks.sort()\nprint(f\"Marks: {marks}\")\nprint(f\"Average: {sum(marks)//len(marks)}\")",
                 "solution": "marks = [78, 92, 85, 63, 88]\nmarks.append(95)\nmarks.remove(min(marks))\nmarks.sort()\nprint(f\"Marks: {marks}\")\nprint(f\"Average: {sum(marks)//len(marks)}\")",
                 "hint": "Use append() to add, min(marks) with remove() for lowest, sort() to sort.",
                 "expectedOutput": "Marks: [78, 85, 88, 92, 95]\nAverage: 87"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "📋", "text": "Lists are ordered collections in square brackets []"},
        {"emoji": "🔢", "text": "Index starts at 0; negative indices count from end"},
        {"emoji": "✂️", "text": "Slicing [start:stop:step] extracts portions"},
        {"emoji": "➕", "text": "append() adds items, remove() deletes items"},
        {"emoji": "📐", "text": "sort() orders lists, len() counts items"}
    ],
    "whatYouLearned": [
        "How to create and print lists",
        "How to access items with indices",
        "How to slice lists",
        "How to use list methods: append, remove, sort",
        "How to build a marks manager"
    ]
})

# ── Lecture 8 ────────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 8, "title": "Tuples & Sets", "nextUp": "Dictionaries",
    "overview": "Python offers more ways to store collections. Tuples are ordered and unchangeable; sets are unordered with unique items.",
    "estimatedMinutes": 40,
    "sections": [
        {
            "id": "tuples", "label": "Tuples",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "What is a Tuple?",
                 "body": "A **tuple** is like a list but **immutable** — you cannot change it after creation. Use parentheses ().",
                 "bullets": [
                     "Tuples are created with (): coordinates = (10, 20)",
                     "Items cannot be added, removed, or changed",
                     "Tuples are faster than lists and protect data from modification",
                     "Use tuples for data that should stay constant"
                 ]},
                {"type": "analogy", "title": "A Tuple is Like a Sealed Envelope", "emoji": "✉️",
                 "text": "Once sealed with coordinates inside, you can read them but not change them. Tuples work the same — great for fixed data like RGB colors or dates."},
                {"type": "code_example", "title": "Creating and Using Tuples", "language": "python",
                 "code": "colors = (255, 0, 0)\ncoordinates = (10.5, 20.3)\nperson = (\"Alice\", 25, \"Engineer\")\n\nprint(colors[0])\nprint(coordinates)\nprint(person[1])\n\n# This would FAIL:\n# colors[0] = 128  # TypeError!",
                 "expectedOutput": "255\n(10.5, 20.3)\n25"},
                {"type": "explanation", "accentColor": "blue", "title": "Tuple Packing and Unpacking",
                 "body": "**Packing** creates a tuple by grouping values. **Unpacking** extracts values into separate variables.",
                 "bullets": [
                     "Packing: point = 10, 20 (parentheses optional)",
                     "Unpacking: x, y = point",
                     "Swap variables: a, b = b, a (uses tuple unpacking)",
                     "Great for returning multiple values from functions"
                 ]},
                {"type": "code_example", "title": "Packing and Unpacking", "language": "python",
                 "code": "point = 10, 20\nprint(point)\n\nx, y = point\nprint(f\"x = {x}, y = {y}\")\n\na = 5\nb = 10\na, b = b, a\nprint(f\"a = {a}, b = {b}\")",
                 "expectedOutput": "(10, 20)\nx = 10, y = 20\na = 10, b = 5"},
                {"type": "practice", "title": "Work with Tuples",
                 "instructions": "Create a tuple with your name, age, and city. Unpack it and print each value.",
                 "starterCode": "my_info = (\"\", , \"\")\nname, age, city = my_info\n",
                 "solution": "my_info = (\"Lakshanya\", 20, \"Chennai\")\nname, age, city = my_info\nprint(f\"Name: {name}\")\nprint(f\"Age: {age}\")\nprint(f\"City: {city}\")",
                 "hint": "Unpack by putting variable names separated by commas on the left.",
                 "expectedOutput": "Name: Lakshanya\nAge: 20\nCity: Chennai"}
            ]
        },
        {
            "id": "sets", "label": "Sets",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "What is a Set?",
                 "body": "A **set** is an unordered collection of **unique** items. Duplicates are automatically removed.",
                 "bullets": [
                     "Sets have no duplicates — each item appears once",
                     "Sets are unordered — cannot access by index",
                     "Great for removing duplicates and membership tests"
                 ]},
                {"type": "code_example", "title": "Creating Sets", "language": "python",
                 "code": "numbers = {1, 2, 3, 2, 1, 4, 3}\nprint(numbers)\n\nfruits = {\"apple\", \"banana\", \"apple\", \"cherry\"}\nprint(fruits)\n\nmy_list = [1, 2, 2, 3, 3, 3]\nunique = set(my_list)\nprint(unique)",
                 "expectedOutput": "{1, 2, 3, 4}\n{'banana', 'apple', 'cherry'}\n{1, 2, 3}"},
                {"type": "explanation", "accentColor": "purple", "title": "Set Operations",
                 "body": "Sets support mathematical operations like union, intersection, and difference.",
                 "bullets": [
                     "union (|) — all items from both sets",
                     "intersection (&) — items in BOTH sets",
                     "difference (-) — items in first but NOT second",
                     "in — check membership (very fast in sets)"
                 ]},
                {"type": "code_example", "title": "Set Operations", "language": "python",
                 "code": "a = {1, 2, 3, 4, 5}\nb = {4, 5, 6, 7, 8}\n\nprint(f\"Union: {a | b}\")\nprint(f\"Intersection: {a & b}\")\nprint(f\"A - B: {a - b}\")\nprint(f\"B - A: {b - a}\")\n\nprint(3 in a)\nprint(9 in b)",
                 "expectedOutput": "Union: {1, 2, 3, 4, 5, 6, 7, 8}\nIntersection: {4, 5}\nA - B: {1, 2, 3}\nB - A: {8, 6, 7}\nTrue\nFalse"},
                {"type": "practice", "title": "Remove Duplicates",
                 "instructions": "Remove duplicates from [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5] using a set, then sort.",
                 "starterCode": "numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]\nunique = sorted()\nprint(f\"Unique sorted: {unique}\")",
                 "solution": "numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]\nunique = sorted(set(numbers))\nprint(f\"Unique sorted: {unique}\")",
                 "hint": "Use set(numbers) to remove duplicates, then sorted() to sort.",
                 "expectedOutput": "Unique sorted: [1, 2, 3, 4, 5, 6, 9]"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "📦", "text": "Tuples are immutable ordered collections with ()"},
        {"emoji": "📤", "text": "Tuple packing groups values; unpacking extracts them"},
        {"emoji": "🔄", "text": "Use tuples for swapping: a, b = b, a"},
        {"emoji": "🔢", "text": "Sets store unique items only"},
        {"emoji": "🔀", "text": "Set operations: | union, & intersection, - difference"}
    ],
    "whatYouLearned": [
        "How to create and use tuples",
        "How tuple packing and unpacking works",
        "How to swap variables with tuple unpacking",
        "How to create sets and remove duplicates",
        "How to perform set operations"
    ]
})

# ── Lecture 9 ────────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 9, "title": "Dictionaries", "nextUp": "Functions",
    "overview": "Dictionaries store data as key-value pairs — like a real dictionary where you look up a word (key) to find its definition (value).",
    "estimatedMinutes": 50,
    "sections": [
        {
            "id": "dict-basics", "label": "Dictionary Basics",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "What is a Dictionary?",
                 "body": "A **dictionary** stores pairs of keys and values. Each key is unique and maps to a value.",
                 "bullets": [
                     "Keys must be unique and immutable (strings, numbers)",
                     "Values can be anything: numbers, strings, lists, even other dicts",
                     "Access: student[\"name\"] gets the value for key \"name\"",
                     "Dictionaries are unordered — accessed by key, not position"
                 ]},
                {"type": "analogy", "title": "A Dictionary is Like a Phone Book", "emoji": "📞",
                 "text": "You look up a person's name (the key) to find their phone number (the value). Each name is unique. You search by name directly — that's how Python dictionaries work."},
                {"type": "code_example", "title": "Creating and Accessing Dictionaries", "language": "python",
                 "code": "student = {\n    \"name\": \"Lakshanya\",\n    \"age\": 20,\n    \"college\": \"SRM University\"\n}\nprint(student[\"name\"])\nprint(student[\"age\"])\nprint(student)",
                 "expectedOutput": "Lakshanya\n20\n{'name': 'Lakshanya', 'age': 20, 'college': 'SRM University'}"},
                {"type": "practice", "title": "Create Your Profile",
                 "instructions": "Create a dictionary with keys: name, age, city, hobby. Print each value.",
                 "starterCode": "profile = {\n    \"name\": \"\",\n    \"age\": ,\n    \"city\": \"\",\n    \"hobby\": \"\"\n}\nprint(f\"Name: {profile['name']}\")\n",
                 "solution": "profile = {\"name\": \"Lakshanya\", \"age\": 20, \"city\": \"Chennai\", \"hobby\": \"coding\"}\nprint(f\"Name: {profile['name']}\")\nprint(f\"Age: {profile['age']}\")\nprint(f\"City: {profile['city']}\")\nprint(f\"Hobby: {profile['hobby']}\")",
                 "hint": "Use profile[\"key_name\"] to access each value.",
                 "expectedOutput": "Name: Lakshanya\nAge: 20\nCity: Chennai\nHobby: coding"}
            ]
        },
        {
            "id": "dict-operations", "label": "Modifying Dictionaries",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Adding, Updating, and Deleting",
                 "body": "Dictionaries are mutable — you can change them after creation.",
                 "bullets": [
                     "Add: student[\"grade\"] = \"A\" — creates a new key-value pair",
                     "Update: student[\"age\"] = 21 — changes the existing value",
                     "Delete: del student[\"grade\"] — removes the key-value pair",
                     "Check: \"name\" in student — returns True if key exists"
                 ]},
                {"type": "code_example", "title": "Dictionary Modifications", "language": "python",
                 "code": "student = {\"name\": \"Lakshanya\", \"age\": 20}\nprint(student)\n\nstudent[\"grade\"] = \"A\"\nprint(student)\n\nstudent[\"age\"] = 21\nprint(student)\n\nprint(\"name\" in student)\ndel student[\"grade\"]\nprint(student)",
                 "expectedOutput": "{'name': 'Lakshanya', 'age': 20}\n{'name': 'Lakshanya', 'age': 20, 'grade': 'A'}\n{'name': 'Lakshanya', 'age': 21}\nTrue\n{'name': 'Lakshanya', 'age': 21}"},
                {"type": "explanation", "accentColor": "purple", "title": "Dictionary Methods",
                 "body": "Dictionaries have useful methods for working with keys, values, and items.",
                 "bullets": [
                     ".keys() — returns all keys",
                     ".values() — returns all values",
                     ".items() — returns all (key, value) pairs",
                     ".get(key) — safely gets value or returns None if missing"
                 ]},
                {"type": "code_example", "title": "Dictionary Methods", "language": "python",
                 "code": "student = {\"name\": \"Lakshanya\", \"age\": 20, \"city\": \"Chennai\"}\nprint(\"Keys:\", student.keys())\n\nfor key, value in student.items():\n    print(f\"{key}: {value}\")\n\nprint(student.get(\"grade\"))\nprint(student.get(\"grade\", \"N/A\"))",
                 "expectedOutput": "Keys: dict_keys(['name', 'age', 'city'])\nname: Lakshanya\nage: 20\ncity: Chennai\nNone\nN/A"},
                {"type": "practice", "title": "Student Database",
                 "instructions": "Create a student dict with name and 3 subject marks. Calculate average and add as new key. Print all items.",
                 "starterCode": "student = {\"name\": \"Lakshanya\", \"math\": 85, \"science\": 92, \"english\": 78}\nstudent[\"average\"] = \nfor key, value in student.items():\n    print(f\"{key}: {value}\")",
                 "solution": "student = {\"name\": \"Lakshanya\", \"math\": 85, \"science\": 92, \"english\": 78}\nstudent[\"average\"] = (student[\"math\"] + student[\"science\"] + student[\"english\"]) // 3\nfor key, value in student.items():\n    print(f\"{key}: {value}\")",
                 "hint": "Calculate (math + science + english) // 3. Add with student['average'] = avg.",
                 "expectedOutput": "name: Lakshanya\nmath: 85\nscience: 92\nenglish: 78\naverage: 85"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "📖", "text": "Dictionaries store key-value pairs with {key: value}"},
        {"emoji": "🔑", "text": "Keys must be unique and immutable"},
        {"emoji": "✏️", "text": "Add/update with dict[key] = value; delete with del"},
        {"emoji": "🔍", "text": ".get(key, default) safely accesses values"},
        {"emoji": "🔄", "text": ".keys(), .values(), .items() iterate dictionary data"}
    ],
    "whatYouLearned": [
        "How to create dictionaries with key-value pairs",
        "How to access values using keys",
        "How to add, update, and delete dictionary entries",
        "How to check if a key exists",
        "How to use .keys(), .values(), .items(), .get()"
    ]
})

# ── Lecture 10 ──────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 10, "title": "Functions", "nextUp": "String Operations",
    "overview": "Functions are the building blocks of organized code. They let you package logic into reusable units — write once, use anywhere.",
    "estimatedMinutes": 50,
    "sections": [
        {
            "id": "why-functions", "label": "Why Functions?",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "Why Do We Need Functions?",
                 "body": "Without functions, you copy-paste the same code everywhere. Functions let you **define once, use many times**.",
                 "bullets": [
                     "Avoid repeating the same code",
                     "Make programs easier to read and understand",
                     "Fix bugs in one place instead of everywhere",
                     "Break complex problems into smaller pieces"
                 ]},
                {"type": "analogy", "title": "A Function is Like a Vending Machine", "emoji": "🏪",
                 "text": "You press A3 (parameters), the machine runs its code (function body), and out comes a snack (return value). You don't care HOW it works inside — just press the button and get the result."},
                {"type": "code_example", "title": "Without Functions vs With Functions", "language": "python",
                 "code": "# WITHOUT functions:\nprint(\"Hello, Alice!\")\nprint(\"Hello, Bob!\")\nprint(\"Hello, Charlie!\")\n\n# WITH functions:\ndef greet(name):\n    print(f\"Hello, {name}!\")\n\ngreet(\"Alice\")\ngreet(\"Bob\")\ngreet(\"Charlie\")",
                 "expectedOutput": "Hello, Alice!\nHello, Bob!\nHello, Charlie!\nHello, Alice!\nHello, Bob!\nHello, Charlie!"}
            ]
        },
        {
            "id": "defining-functions", "label": "Defining Functions",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "How to Define a Function",
                 "body": "Use `def` followed by the function name, parentheses for parameters, a colon, and an indented body.",
                 "bullets": [
                     "def function_name(): — define a function",
                     "Parameters go inside parentheses: def add(a, b):",
                     "Use return to send a value back",
                     "If no return, the function returns None"
                 ]},
                {"type": "code_example", "title": "Functions with and without Return", "language": "python",
                 "code": "def say_hello():\n    print(\"Hello!\")\n\nresult = say_hello()\nprint(f\"Return value: {result}\")\n\ndef add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(f\"3 + 4 = {result}\")",
                 "expectedOutput": "Hello!\nReturn value: None\n3 + 4 = 7"},
                {"type": "code_example", "title": "Multiple Parameters", "language": "python",
                 "code": "def describe_person(name, age, city):\n    return f\"{name} is {age} years old from {city}\"\n\nprint(describe_person(\"Alice\", 25, \"New York\"))\nprint(describe_person(\"Bob\", 30, \"London\"))",
                 "expectedOutput": "Alice is 25 years old from New York\nBob is 30 years old from London"},
                {"type": "explanation", "accentColor": "purple", "title": "Default Parameters",
                 "body": "You can give parameters **default values**. If the caller doesn't provide that argument, the default is used.",
                 "bullets": [
                     "def greet(name=\"Guest\"): — default value",
                     "greet() uses \"Guest\", greet(\"Alice\") uses \"Alice\"",
                     "Parameters with defaults must come LAST"
                 ]},
                {"type": "code_example", "title": "Default Parameters", "language": "python",
                 "code": "def greet(name=\"Guest\", greeting=\"Hello\"):\n    return f\"{greeting}, {name}!\"\n\nprint(greet())\nprint(greet(\"Alice\"))\nprint(greet(\"Bob\", \"Hi\"))",
                 "expectedOutput": "Hello, Guest!\nHello, Alice!\nHi, Bob!"},
                {"type": "reflection",
                 "question": "What happens if you put a parameter with a default BEFORE one without? Like def add(a=5, b):",
                 "answer": "Python gives a SyntaxError! Parameters with defaults must come AFTER those without."},
                {"type": "practice", "title": "Area Calculator",
                 "instructions": "Define rectangle_area(length, width) and test with two different pairs of values.",
                 "starterCode": "def rectangle_area(length, width):\n    \n\nprint(rectangle_area(5, 3))\nprint(rectangle_area(7, 4))",
                 "solution": "def rectangle_area(length, width):\n    return length * width\n\nprint(rectangle_area(5, 3))\nprint(rectangle_area(7, 4))",
                 "hint": "Use return length * width. Indent the function body with 4 spaces.",
                 "expectedOutput": "15\n28"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "♻️", "text": "Functions let you write code once and reuse it"},
        {"emoji": "📝", "text": "Use def to define, return to send back a value"},
        {"emoji": "📦", "text": "Parameters are inputs; return values are outputs"},
        {"emoji": "⚙️", "text": "Default parameters make functions flexible"},
        {"emoji": "🧩", "text": "Break complex programs into small, reusable functions"}
    ],
    "whatYouLearned": [
        "Why functions are essential for organized code",
        "How to define functions with def",
        "How to use parameters and return values",
        "How to create functions with default parameters",
        "How to build reusable calculation functions"
    ]
})

# ── Lecture 11 ──────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 11, "title": "String Operations", "nextUp": "File Handling",
    "overview": "Strings are everywhere in programming. Python gives you an incredibly rich set of tools to analyze, transform, and manipulate text.",
    "estimatedMinutes": 50,
    "sections": [
        {
            "id": "string-basics", "label": "String Basics",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "Strings are Sequences",
                 "body": "A string is a sequence of characters. You can access individual characters, slice portions, and measure length — just like lists.",
                 "bullets": [
                     "Indexing: text[0] gets the first character",
                     "Slicing: text[1:4] gets characters at index 1-3",
                     "len(text) returns the number of characters",
                     "Negative indexing: text[-1] gets the last character"
                 ]},
                {"type": "code_example", "title": "String Indexing and Slicing", "language": "python",
                 "code": "text = \"Python\"\nprint(text[0])\nprint(text[-1])\nprint(text[1:4])\nprint(text[:3])\nprint(text[::2])\nprint(len(text))",
                 "expectedOutput": "P\nn\n yth\nPyt\nPto\n6"},
                {"type": "practice", "title": "Explore a String",
                 "instructions": "Create a string with your name. Print first char, last char, length, and first 3 chars.",
                 "starterCode": "name = \"Lakshanya\"\nprint(f\"First: {name[0]}\")\nprint(f\"Last: {name[]}\")\nprint(f\"Length: {len()}\")\nprint(f\"First 3: {name[:]}\")",
                 "solution": "name = \"Lakshanya\"\nprint(f\"First: {name[0]}\")\nprint(f\"Last: {name[-1]}\")\nprint(f\"Length: {len(name)}\")\nprint(f\"First 3: {name[:3]}\")",
                 "hint": "Use index 0 for first, -1 for last, len() for length, [:3] for slice.",
                 "expectedOutput": "First: L\nLast: a\nLength: 9\nFirst 3: Lak"}
            ]
        },
        {
            "id": "string-methods", "label": "String Methods",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Powerful String Methods",
                 "body": "Python strings have built-in methods for changing case, removing whitespace, finding text, and more.",
                 "bullets": [
                     "upper() / lower() — change case",
                     "strip() — removes whitespace from both ends",
                     "replace(old, new) — replaces text",
                     "find(substring) — returns index or -1 if not found",
                     "startswith() / endswith() — check beginning/end"
                 ]},
                {"type": "code_example", "title": "Case Methods and Cleanup", "language": "python",
                 "code": "text = \"  Hello, World!  \"\nprint(text.upper())\nprint(text.lower())\nprint(text.strip())\nprint(text.strip().replace(\"World\", \"Python\"))\n\nmsg = \"hello.txt\"\nprint(msg.endswith(\".txt\"))",
                 "expectedOutput": "  HELLO, WORLD!  \n  hello, world!  \nHello, World!\nHello, Python!\nTrue"},
                {"type": "code_example", "title": "Searching in Strings", "language": "python",
                 "code": "sentence = \"The quick brown fox jumps over the lazy dog\"\nprint(sentence.find(\"fox\"))\nprint(sentence.find(\"cat\"))\nprint(sentence.count(\"the\"))\nprint(sentence.lower().count(\"the\"))",
                 "expectedOutput": "16\n-1\n1\n2"},
                {"type": "explanation", "accentColor": "purple", "title": "Splitting and Joining",
                 "body": "Strings can be split into lists and lists can be joined into strings.",
                 "bullets": [
                     "split() — splits a string into a list (default: space)",
                     "split(\",\") — splits by comma",
                     "\" \".join(list) — joins list items into a string"
                 ]},
                {"type": "code_example", "title": "Split and Join", "language": "python",
                 "code": "csv_data = \"Alice,Bob,Charlie,Diana\"\nnames = csv_data.split(\",\")\nprint(names)\n\nsentence = \"Python is awesome\"\nwords = sentence.split()\nprint(words)\n\nrejoined = \" - \".join(words)\nprint(rejoined)",
                 "expectedOutput": "['Alice', 'Bob', 'Charlie', 'Diana']\n['Python', 'is', 'awesome']\nPython - is - awesome"},
                {"type": "practice", "title": "Palindrome Checker",
                 "instructions": "Ask for a word. Check if it reads the same forward and backward (ignore case).",
                 "starterCode": "word = input(\"Enter a word: \")\ncleaned = word.lower().strip()\nif cleaned == cleaned[]:\n    print(\"Palindrome!\")\nelse:\n    print(\"Not a palindrome\")",
                 "solution": "word = input(\"Enter a word: \")\ncleaned = word.lower().strip()\nif cleaned == cleaned[::-1]:\n    print(\"Yes, it's a palindrome!\")\nelse:\n    print(\"No, it's not a palindrome.\")",
                 "hint": "Use [::-1] to reverse the string. Use lower() to ignore case.",
                 "expectedOutput": "Enter a word: Racecar\nYes, it's a palindrome!"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "🔤", "text": "Strings are sequences — index, slice, and measure with len()"},
        {"emoji": "🔠", "text": "upper(), lower(), strip() change and clean strings"},
        {"emoji": "🔍", "text": "find(), startswith(), endswith(), count() search strings"},
        {"emoji": "✂️", "text": "split() breaks strings into lists; join() combines them"},
        {"emoji": "🔄", "text": "String reversal with [::-1] is useful for palindrome checks"}
    ],
    "whatYouLearned": [
        "How to index and slice strings like lists",
        "How to change case and clean strings with methods",
        "How to search within strings",
        "How to split and join strings",
        "How to build a palindrome checker"
    ]
})

# ── Lecture 12 ──────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 12, "title": "File Handling", "nextUp": "Mini Project",
    "overview": "Programs that only work with in-memory data are limited. File handling lets you save data permanently — read from files, write to files, and build applications that persist information.",
    "estimatedMinutes": 45,
    "sections": [
        {
            "id": "why-files", "label": "Why Files?",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "Why Do We Need File Handling?",
                 "body": "Without files, all data disappears when your program ends. Files let you save data permanently.",
                 "bullets": [
                     "Variables disappear when the program closes — files persist",
                     "Files let you share data between different programs",
                     "Real applications save user data, settings, and logs to files",
                     "Python handles text files (.txt) and structured files (.csv, .json)"
                 ]},
                {"type": "analogy", "title": "File Handling is Like a Notebook", "emoji": "📓",
                 "text": "Writing in a notebook saves information even after you close it. Open it tomorrow and the information is still there. File handling does the same for your programs."}
            ]
        },
        {
            "id": "reading-files", "label": "Reading Files",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Opening and Reading Files",
                 "body": "Use the open() function to work with files. The default mode is 'read' (r).",
                 "bullets": [
                     "file = open(\"filename.txt\", \"r\") — opens for reading",
                     "file.read() — reads the entire file as one string",
                     "file.readlines() — reads all lines into a list",
                     "Always close the file: file.close()"
                 ]},
                {"type": "code_example", "title": "Reading a File", "language": "python",
                 "code": "# First create a file\nwith open(\"notes.txt\", \"w\") as f:\n    f.write(\"Line 1\\nLine 2\\nLine 3\")\n\n# Now read it\nfile = open(\"notes.txt\", \"r\")\ncontent = file.read()\nprint(content)\nfile.close()",
                 "expectedOutput": "Line 1\nLine 2\nLine 3"},
                {"type": "explanation", "accentColor": "purple", "title": "The with Statement",
                 "body": "The `with` statement automatically closes the file even if an error occurs.",
                 "bullets": [
                     "with open(\"file.txt\", \"r\") as f: — auto-closes when done",
                     "No need to call .close() manually",
                     "Safer and cleaner than manual open/close"
                 ]},
                {"type": "code_example", "title": "Using with to Read", "language": "python",
                 "code": "with open(\"notes.txt\", \"r\") as file:\n    lines = file.readlines()\n    for i, line in enumerate(lines, 1):\n        print(f\"{i}: {line}\", end=\"\")",
                 "expectedOutput": "1: Line 1\n2: Line 2\n3: Line 3"},
                {"type": "practice", "title": "Read and Greet",
                 "instructions": "Write 3 names to students.txt. Read them back and greet each: 'Hello, [name]!'",
                 "starterCode": "with open(\"students.txt\", \"w\") as f:\n    f.write(\"Alice\\nBob\\nCharlie\\n\")\n\nwith open(\"students.txt\", \"r\") as f:\n    for name in f:\n        print(f\"Hello, {name.strip()}!\")",
                 "solution": "with open(\"students.txt\", \"w\") as f:\n    f.write(\"Alice\\nBob\\nCharlie\\n\")\n\nwith open(\"students.txt\", \"r\") as f:\n    for name in f:\n        print(f\"Hello, {name.strip()}!\")",
                 "hint": "Use strip() on each line to remove the newline character.",
                 "expectedOutput": "Hello, Alice!\nHello, Bob!\nHello, Charlie!"}
            ]
        },
        {
            "id": "writing-files", "label": "Writing Files",
            "blocks": [
                {"type": "explanation", "accentColor": "green", "title": "Writing and Appending",
                 "body": "Python has three main file modes: read (r), write (w), and append (a).",
                 "bullets": [
                     "\"w\" mode — WRITE: creates or overwrites",
                     "\"a\" mode — APPEND: adds to end of existing file",
                     "\"r\" mode — READ: reads from existing file",
                     "Use \"w\" carefully — it deletes existing content!"
                 ]},
                {"type": "code_example", "title": "Write vs Append", "language": "python",
                 "code": "with open(\"diary.txt\", \"w\") as f:\n    f.write(\"Day 1: Started Python\\n\")\n\nwith open(\"diary.txt\", \"a\") as f:\n    f.write(\"Day 2: File handling!\\n\")\n\nwith open(\"diary.txt\", \"r\") as f:\n    print(f.read())",
                 "expectedOutput": "Day 1: Started Python\nDay 2: File handling!\n"},
                {"type": "practice", "title": "Notes Application",
                 "instructions": "Ask for 3 notes, write them to a file, then read and display with line numbers.",
                 "starterCode": "filename = input(\"Filename: \")\nn1 = input(\"Note 1: \")\nn2 = input(\"Note 2: \")\nn3 = input(\"Note 3: \")\n\nwith open(filename, \"w\") as f:\n    f.write(n1 + \"\\n\")\n    f.write(n2 + \"\\n\")\n    f.write(n3 + \"\\n\")\n\nwith open(filename, \"r\") as f:\n    for i, line in enumerate(f, 1):\n        print(f\"{i}. {line}\", end=\"\")",
                 "solution": "filename = input(\"Filename: \")\nn1 = input(\"Note 1: \")\nn2 = input(\"Note 2: \")\nn3 = input(\"Note 3: \")\nwith open(filename, \"w\") as f:\n    f.write(n1 + \"\\n\")\n    f.write(n2 + \"\\n\")\n    f.write(n3 + \"\\n\")\nwith open(filename, \"r\") as f:\n    for i, line in enumerate(f, 1):\n        print(f\"{i}. {line}\", end=\"\")",
                 "hint": "Use \"w\" mode. Add \\\\n at the end of each line when writing.",
                 "expectedOutput": "Filename: notes.txt\nNote 1: Learn Python\nNote 2: Practice daily\nNote 3: Build projects\n1. Learn Python\n2. Practice daily\n3. Build projects"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "📁", "text": "Files persist data beyond program execution"},
        {"emoji": "📖", "text": "Use open(\"file\", \"r\") to read, \"w\" to write, \"a\" to append"},
        {"emoji": "🔒", "text": "Always close files — use with open() for automatic closing"},
        {"emoji": "⚠️", "text": "\"w\" mode overwrites existing files — use carefully!"},
        {"emoji": "➕", "text": "Append mode (\"a\") adds to the end without deleting"}
    ],
    "whatYouLearned": [
        "Why file handling is essential for data persistence",
        "How to open files in read, write, and append modes",
        "How to use with open() for automatic closing",
        "How to read and write to files",
        "How to build a simple notes application"
    ]
})

# ── Lecture 13 ──────────────────────────────────────────────────────────────
LECTURES.append({
    "number": 13, "title": "Mini Project", "nextUp": "",
    "overview": "Congratulations! You've learned all the fundamentals of Python. Now it's time to apply everything by building a complete project of your choice.",
    "estimatedMinutes": 60,
    "sections": [
        {
            "id": "project-options", "label": "Project Options",
            "blocks": [
                {"type": "explanation", "accentColor": "blue", "title": "Choose Your Project",
                 "body": "You've learned variables, conditionals, loops, functions, lists, dictionaries, strings, and file handling. Now pick one of four projects to build from scratch.",
                 "bullets": [
                     "**Student Management System** — Add, view, update, and delete student records",
                     "**Expense Tracker** — Log expenses, view totals, and filter by category",
                     "**Quiz Application** — Create quizzes with multiple choice questions and scoring",
                     "**To-Do List** — Add tasks, mark complete, and save/load from a file"
                 ]},
                {"type": "analogy", "title": "This is Your Graduation Project", "emoji": "🎓",
                 "text": "Just like a chef who learns all the techniques before cooking their signature dish, you've learned all the Python ingredients. Now put them together to create something amazing!"}
            ]
        },
        {
            "id": "requirements", "label": "Project Requirements",
            "blocks": [
                {"type": "explanation", "accentColor": "purple", "title": "Minimum Requirements",
                 "body": "Your project must include the following features to be complete.",
                 "bullets": [
                     "Minimum 3 functions (including main())",
                     "User input and formatted output",
                     "At least one loop (for or while)",
                     "At least one conditional (if/elif/else)",
                     "Use a list or dictionary to store data",
                     "**Bonus**: File handling (save/load data from a file)"
                 ]},
                {"type": "text", "content": "Start by planning your project on paper: What features will it have? What data structure will you use? How will functions be organized? Write the pseudocode first, then translate to Python."},
                {"type": "code_example", "title": "Project Template — Student Management System", "language": "python",
                 "code": "# Student Management System\n\ndef add_student(students):\n    name = input(\"Enter student name: \")\n    grade = int(input(\"Enter grade: \"))\n    students[name] = grade\n    print(f\"Added {name}\")\n\ndef view_all(students):\n    if not students:\n        print(\"No students yet\")\n        return\n    for name, grade in students.items():\n        print(f\"{name}: {grade}\")\n\ndef main():\n    students = {}\n    while True:\n        print(\"\\n1. Add Student\")\n        print(\"2. View All\")\n        print(\"3. Exit\")\n        choice = input(\"Choose: \")\n        if choice == \"1\":\n            add_student(students)\n        elif choice == \"2\":\n            view_all(students)\n        elif choice == \"3\":\n            break\n        else:\n            print(\"Invalid choice\")\n\nmain()",
                 "expectedOutput": "1. Add Student\n2. View All\n3. Exit\nChoose: "},
                {"type": "reflection",
                 "question": "Which project would you like to build and why? Think about which one you'd find most useful in your daily life.",
                 "answer": "Any project is great for practice! The Student Management System teaches CRUD operations. The Expense Tracker teaches data analysis. The Quiz App teaches logic and scoring. The To-Do List teaches file persistence. Choose what excites you!"},
                {"type": "practice", "title": "Project Menu",
                 "instructions": "Write a menu program showing 4 project options. Let the user pick one (1-4) and print a confirmation.",
                 "starterCode": "print(\"1. Student Management System\")\nprint(\"2. Expense Tracker\")\nprint(\"3. Quiz Application\")\nprint(\"4. To-Do List\")\nchoice = int(input(\"Choose (1-4): \"))\nprojects = [\"\", \"Student Management System\", \"Expense Tracker\", \"Quiz Application\", \"To-Do List\"]\n",
                 "solution": "print(\"1. Student Management System\")\nprint(\"2. Expense Tracker\")\nprint(\"3. Quiz Application\")\nprint(\"4. To-Do List\")\nchoice = int(input(\"Choose (1-4): \"))\nprojects = [\"\", \"Student Management System\", \"Expense Tracker\", \"Quiz Application\", \"To-Do List\"]\nprint(f\"You selected: {projects[choice]}\")",
                 "hint": "Use a list to map choice numbers to project names.",
                 "expectedOutput": "1. Student Management System\n2. Expense Tracker\n3. Quiz Application\n4. To-Do List\nChoose (1-4): 3\nYou selected: Quiz Application"}
            ]
        }
    ],
    "keyTakeaways": [
        {"emoji": "🎓", "text": "You've learned all Python fundamentals — now apply them!"},
        {"emoji": "📋", "text": "Plan your project before coding"},
        {"emoji": "🧩", "text": "Use functions to organize code into clear sections"},
        {"emoji": "💾", "text": "Bonus: add file saving/loading for data persistence"},
        {"emoji": "🚀", "text": "Build something YOU want to use — that's the best motivation"}
    ],
    "whatYouLearned": [
        "How to plan and structure a complete Python project",
        "How to use functions, loops, conditionals, and data structures together",
        "How to handle file saving/loading for persistence",
        "How to build a menu-driven interactive program",
        "How to apply everything you've learned in one complete project"
    ]
})

# ── Helper ────────────────────────────────────────────────────────────────────
def generate_lesson_json(lect):
    n = lect["number"]
    lesson_json = {
        "id": f"python-lecture-{n}",
        "courseSlug": "python",
        "number": n,
        "title": lect["title"],
        "overview": lect["overview"],
        "estimatedMinutes": lect["estimatedMinutes"],
        "sections": lect["sections"],
        "summary": {
            "keyTakeaways": lect["keyTakeaways"],
            "whatYouLearned": lect["whatYouLearned"],
            "nextUp": lect["nextUp"]
        }
    }
    return lesson_json

def generate_quiz_json(n):
    quizzes = {
        0: [
            {"question": "What does the print() function do in Python?", "options": ["Reads user input", "Displays output on the screen", "Creates a new file", "Calculates math expressions"], "answer": "Displays output on the screen", "explanation": "print() is used to display text, numbers, or other values on the screen."},
            {"question": 'What does print("Hello" + " " + "World") output?', "options": ["Hello World", "HelloWorld", "Hello + World", "Error"], "answer": "Hello World", "explanation": "The + operator concatenates strings, joining them together."},
            {"question": "Which of the following is a valid variable name in Python?", "options": ["2nd_place", "my-var", "_count", "class"], "answer": "_count", "explanation": "Variable names can start with a letter or underscore, but not a number."},
            {"question": "What is the result of 17 // 5 in Python?", "options": ["3.4", "3", "2", "4"], "answer": "3", "explanation": "Floor division (//) divides and rounds down to the nearest whole number."},
            {"question": "What type of value does input() always return?", "options": ["Integer", "Float", "String", "Boolean"], "answer": "String", "explanation": 'input() always returns a string, even if the user types a number. Use int() to convert.'}
        ],
        1: [
            {"question": "What is the correct way to create a variable in Python?", "options": ['var name = "Alice"', 'name = "Alice"', 'name == "Alice"', 'let name = "Alice"'], "answer": 'name = "Alice"', "explanation": "In Python, you create a variable by writing the name, then =, then the value."},
            {"question": "Which of these is NOT a valid Python data type?", "options": ["int", "float", "char", "bool"], "answer": "char", "explanation": "Python does not have a char type. Single characters are treated as strings of length 1."},
            {"question": "What does type(3.14) return?", "options": ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'decimal'>"], "answer": "<class 'float'>", "explanation": "3.14 is a decimal number, so its type is float."},
            {"question": 'What is the result of int("42") + 3?', "options": ["423", "45", "39", "Error"], "answer": "45", "explanation": 'int("42") converts the string "42" to the integer 42. Then 42 + 3 = 45.'},
            {"question": "Which statement correctly creates a boolean variable?", "options": ['is_ready = "True"', "is_ready = true", "is_ready = True", 'is_ready = "yes"'], "answer": "is_ready = True", "explanation": "Boolean values in Python must be capitalized: True and False."}
        ],
        2: [
            {"question": 'What will print("A", "B", sep="-") output?', "options": ["A B", "A-B", "A - B", "AB"], "answer": "A-B", "explanation": 'The sep parameter replaces the default space separator. sep="-" joins the items with a hyphen.'},
            {"question": "What does input() do when the program reaches it?", "options": ["Prints a message", "Waits for the user to type and press Enter", "Exits the program", "Reads a file"], "answer": "Waits for the user to type and press Enter", "explanation": "input() pauses the program and waits for user input. It returns whatever the user typed as a string."},
            {"question": "What is the output of print(2 + 3 * 4)?", "options": ["20", "14", "24", "9"], "answer": "14", "explanation": "PEMDAS: multiplication first. 3 * 4 = 12, then 2 + 12 = 14."},
            {"question": "Which f-string produces 'My name is Alice'?", "options": ['f"My name is {name}"', "f'My name is {name}'", 'f"My name is name"', 'print("My name is {name}")'], "answer": 'f"My name is {name}"', "explanation": "f-strings use the f prefix and {} to embed variables."},
            {"question": "What happens with int(input('Age: ')) if the user types 'twenty'?", "options": ["Returns 20", "Returns None", "Raises ValueError", "Returns 0"], "answer": "Raises ValueError", "explanation": "int() cannot convert non-numeric strings to integers."}
        ],
        3: [
            {"question": "What is the result of 10 % 3?", "options": ["3", "1", "0", "3.33"], "answer": "1", "explanation": "The modulo (%) operator returns the remainder. 10 ÷ 3 = 3 remainder 1."},
            {"question": "Which operator checks if two values are equal?", "options": ["=", "==", "!=", "==="], "answer": "==", "explanation": "== is the equality comparison operator. A single = is for assignment."},
            {"question": "What is the result of (2 + 3) * 4?", "options": ["14", "20", "24", "9"], "answer": "20", "explanation": "Parentheses have the highest precedence. (2 + 3) = 5, then 5 * 4 = 20."},
            {"question": "What does the expression not (10 > 5) return?", "options": ["True", "False", "10", "None"], "answer": "False", "explanation": "10 > 5 is True. The not operator reverses it: not True = False."},
            {"question": "Which operator raises a number to a power?", "options": ["^", "**", "pow", "^^"], "answer": "**", "explanation": "The ** operator is used for exponentiation in Python: 2 ** 3 = 8."}
        ],
        4: [
            {"question": "What does an if statement do when its condition is False?", "options": ["Runs the indented block", "Skips the indented block", "Shows an error", "Asks the user"], "answer": "Skips the indented block", "explanation": "When the if condition is False, the indented block is skipped."},
            {"question": "Which keyword is used for 'else if' in Python?", "options": ["elsif", "elseif", "elif", "else if"], "answer": "elif", "explanation": "Python uses elif (short for else if) to chain additional conditions."},
            {"question": "What will this print? x = 5; if x > 10: print('Big') else: print('Small')", "options": ["Big", "Small", "Nothing", "Error"], "answer": "Small", "explanation": "x = 5, and 5 is not greater than 10, so the else block runs."},
            {"question": "Which of these values is considered Falsy in Python?", "options": ["1", '"False"', "0", "[1, 2, 3]"], "answer": "0", "explanation": "0 (integer zero) is falsy. All non-zero numbers and non-empty strings/lists are truthy."},
            {"question": "What is proper indentation in Python?", "options": ["2 spaces", "4 spaces (standard)", "8 spaces", "Tabs only"], "answer": "4 spaces (standard)", "explanation": "Python's standard indentation is 4 spaces. Consistent indentation is critical."}
        ],
        5: [
            {"question": "What does range(4) generate?", "options": ["1, 2, 3, 4", "0, 1, 2, 3", "0, 1, 2, 3, 4", "1, 2, 3"], "answer": "0, 1, 2, 3", "explanation": "range(4) generates numbers from 0 up to but not including 4: 0, 1, 2, 3."},
            {"question": "How many times will this loop run? for i in range(2, 6):", "options": ["2", "4", "5", "6"], "answer": "4", "explanation": "range(2, 6) gives 2, 3, 4, 5 — that's 4 numbers."},
            {"question": "What does range(0, 10, 3) generate?", "options": ["0, 3, 6, 9", "0, 3, 6", "3, 6, 9", "0, 3, 6, 9, 12"], "answer": "0, 3, 6, 9", "explanation": "range(0, 10, 3) gives: 0, 3, 6, 9. It stops before 10."},
            {"question": "What does the inner loop in nested loops do?", "options": ["Runs once total", "Runs once for each outer loop iteration", "Runs completely for EACH outer iteration", "Only runs if outer loop is True"], "answer": "Runs completely for EACH outer iteration", "explanation": "The inner loop runs its FULL cycle for each iteration of the outer loop."},
            {"question": "What is the output of: for i in range(3): print(i)", "options": ["1 2 3", "0 1 2", "0 1 2 3", "1 2"], "answer": "0 1 2", "explanation": "range(3) gives 0, 1, 2. Each value is printed on its own line."}
        ],
        6: [
            {"question": "When does a while loop stop?", "options": ["After running once", "When the condition becomes False", "When it reaches 10 iterations", "It never stops"], "answer": "When the condition becomes False", "explanation": "A while loop continues as long as its condition is True. It stops when the condition becomes False."},
            {"question": "What happens if the condition in a while loop never becomes False?", "options": ["The loop runs once", "The program crashes immediately", "Infinite loop — runs forever", "Python automatically stops it"], "answer": "Infinite loop — runs forever", "explanation": "If the condition never becomes False, the loop runs forever (infinite loop). Press Ctrl+C to stop."},
            {"question": "What does the break statement do?", "options": ["Skips the current iteration", "Exits the loop immediately", "Restarts the loop", "Pauses the loop"], "answer": "Exits the loop immediately", "explanation": "break immediately terminates the loop and execution continues after the loop."},
            {"question": "What does the continue statement do?", "options": ["Exits the loop", "Skips to the next iteration", "Repeats the current iteration", "Stops the program"], "answer": "Skips to the next iteration", "explanation": "continue skips the rest of the current iteration and moves to the next one."},
            {"question": "Which loop is safer when you know the number of iterations?", "options": ["while loop", "for loop", "Both are equally safe", "Neither"], "answer": "for loop", "explanation": "for loops are safer because they have a built-in limit. while loops can become infinite."}
        ],
        7: [
            {"question": "What is the index of the first element in a list?", "options": ["1", "0", "-1", "First"], "answer": "0", "explanation": "Python uses zero-based indexing. The first element is at index 0."},
            {"question": "What does fruits[-1] give you?", "options": ["The first element", "An error", "The last element", "The second-to-last element"], "answer": "The last element", "explanation": "Negative indices count from the end. -1 is the last element."},
            {"question": "What does [1, 2, 3, 4, 5][1:4] return?", "options": ["[1, 2, 3]", "[2, 3, 4]", "[2, 3, 4, 5]", "[1, 2, 3, 4]"], "answer": "[2, 3, 4]", "explanation": "Slicing [1:4] starts at index 1 and goes up to (not including) index 4."},
            {"question": "Which method adds an item to the end of a list?", "options": ["add()", "insert()", "append()", "push()"], "answer": "append()", "explanation": "append(item) adds the item to the end of the list."},
            {"question": "What does [3, 1, 2].sort() do?", "options": ["Returns [1, 2, 3]", "Sorts the list in place to [1, 2, 3]", "Creates a new sorted list", "Returns None"], "answer": "Sorts the list in place to [1, 2, 3]", "explanation": "sort() sorts the list in-place, modifying the original list."}
        ],
        8: [
            {"question": "Which of the following creates a tuple?", "options": ["[1, 2, 3]", "{1, 2, 3}", "(1, 2, 3)", "<1, 2, 3>"], "answer": "(1, 2, 3)", "explanation": "Tuples are created with parentheses ()."},
            {"question": "Can you change an element in a tuple after creation?", "options": ["Yes, using tuple[0] = value", "No, tuples are immutable", "Yes, using append()", "Only if it's a number"], "answer": "No, tuples are immutable", "explanation": "Tuples cannot be modified after creation."},
            {"question": "If a = {1, 2, 3} and b = {3, 4, 5}, what is a | b?", "options": ["{3}", "{1, 2, 3, 4, 5}", "{1, 2, 4, 5}", "{1, 2, 3, 3, 4, 5}"], "answer": "{1, 2, 3, 4, 5}", "explanation": "The | operator performs union — all unique items from both sets."},
            {"question": "What does {1, 2, 3, 2, 1} evaluate to?", "options": ["{1, 2, 3, 2, 1}", "{1, 2, 3}", "[1, 2, 3, 2, 1]", "Error"], "answer": "{1, 2, 3}", "explanation": "Sets automatically remove duplicates."},
            {"question": "What is a primary use of sets?", "options": ["Ordered storage", "Removing duplicates", "Fast indexed access", "Mutable data"], "answer": "Removing duplicates", "explanation": "Sets are commonly used to remove duplicate values from collections."}
        ],
        9: [
            {"question": "Which creates a dictionary?", "options": ["{1, 2, 3}", '{"a": 1, "b": 2}', '["a": 1, "b": 2]', '("a": 1, "b": 2)'], "answer": '{"a": 1, "b": 2}', "explanation": "Dictionaries use curly braces with key-value pairs separated by colons."},
            {"question": 'How do you access the value for key "name" in a dictionary?', "options": ['dictionary(name)', 'dictionary["name"]', 'dictionary."name"', 'dictionary{"name"}'], "answer": 'dictionary["name"]', "explanation": 'Access dictionary values using square brackets with the key inside.'},
            {"question": "What happens if you try to access a key that doesn't exist?", "options": ["Returns None", "Raises KeyError", "Returns 0", "Creates the key"], "answer": "Raises KeyError", "explanation": "Accessing a non-existent key raises a KeyError. Use .get() to safely handle missing keys."},
            {"question": "Which method returns all key-value pairs as tuples?", "options": [".keys()", ".values()", ".items()", ".pairs()"], "answer": ".items()", "explanation": "The .items() method returns a view of (key, value) tuples that you can iterate through."},
            {"question": "How do you check if a key exists in a dictionary?", "options": ["exists(key)", "key in dict", "dict.has(key)", "dict.contains(key)"], "answer": "key in dict", "explanation": 'Use the in operator: "name" in student returns True if that key exists.'}
        ],
        10: [
            {"question": "What keyword is used to define a function in Python?", "options": ["function", "def", "define", "func"], "answer": "def", "explanation": "Python uses the def keyword to define functions."},
            {"question": "What does a function return if there is no return statement?", "options": ["0", "None", "Empty string", "Error"], "answer": "None", "explanation": "If a function doesn't have a return statement, Python automatically returns None."},
            {"question": "What is the output of: def add(a, b): return a + b; print(add(3, 4))", "options": ["34", "7", "(3, 4)", "Error"], "answer": "7", "explanation": "add(3, 4) returns 3 + 4 = 7."},
            {"question": "What are the values inside parentheses in a function definition called?", "options": ["Arguments", "Parameters", "Variables", "Keywords"], "answer": "Parameters", "explanation": "Parameters are the variables listed in the function definition. Arguments are the values passed when calling."},
            {"question": "What is the advantage of functions?", "options": ["Make code run faster", "Avoid repeating code", "Use less memory", "Automatically fix bugs"], "answer": "Avoid repeating code", "explanation": "Functions let you write code once and reuse it many times."}
        ],
        11: [
            {"question": 'What does "hello".upper() return?', "options": ["hello", "HELLO", "Hello", "Error"], "answer": "HELLO", "explanation": "The upper() method converts all characters in a string to uppercase."},
            {"question": "What does find() return if the substring is not found?", "options": ["0", "None", "-1", "False"], "answer": "-1", "explanation": "find() returns -1 when the substring is not found in the string."},
            {"question": 'What is the result of "a b c".split()?', "options": ['["a", "b", "c"]', '["a b c"]', '["a", "b", "c"]', '["abc"]'], "answer": '["a", "b", "c"]', "explanation": 'split() with no argument splits on any whitespace.'},
            {"question": "What does strip() do to a string?", "options": ["Removes all spaces", "Removes leading/trailing whitespace", "Converts to uppercase", "Reverses the string"], "answer": "Removes leading/trailing whitespace", "explanation": "strip() removes whitespace from both the beginning and end of a string."},
            {"question": 'How do you check if a string ends with ".py"?', "options": ['string.endswith(".py")', 'string.ends(".py")', 'string.last(".py")', 'string.finish(".py")'], "answer": 'string.endswith(".py")', "explanation": "endswith() returns True if the string ends with the specified substring."}
        ],
        12: [
            {"question": "What does open('file.txt', 'w') do?", "options": ["Opens file for reading", "Opens file for writing (creates/overwrites)", "Opens file for appending", "Deletes the file"], "answer": "Opens file for writing (creates/overwrites)", "explanation": "The 'w' mode opens a file for writing. If the file exists, it's overwritten. If not, it's created."},
            {"question": "What is the advantage of using 'with open()'?", "options": ["Faster file access", "Automatically closes the file", "Reads the entire file at once", "No need to specify mode"], "answer": "Automatically closes the file", "explanation": "The with statement automatically closes the file, even if an error occurs."},
            {"question": "Which mode adds content without deleting existing content?", "options": ["'r'", "'w'", "'a'", "'x'"], "answer": "'a'", "explanation": "Append mode ('a') adds content to the end of an existing file without overwriting."},
            {"question": "What does readlines() return?", "options": ["A single string", "A list of strings (one per line)", "A list of characters", "An integer"], "answer": "A list of strings (one per line)", "explanation": "readlines() returns a list where each element is one line from the file."},
            {"question": "What happens if you open a non-existent file in 'r' mode?", "options": ["Creates the file", "Returns empty string", "Raises FileNotFoundError", "Returns None"], "answer": "Raises FileNotFoundError", "explanation": "Opening a non-existent file in read mode raises a FileNotFoundError."}
        ],
        13: [
            {"question": "What is the goal of the mini project?", "options": ["Write one long program", "Apply all concepts learned", "Use only one feature", "Copy code from examples"], "answer": "Apply all concepts learned", "explanation": "The mini project is designed to apply everything you've learned in the course."},
            {"question": "Which of these is NOT a project option?", "options": ["Student Management System", "Expense Tracker", "Web Browser", "To-Do List"], "answer": "Web Browser", "explanation": "The project options are: Student Management System, Expense Tracker, Quiz Application, and To-Do List."},
            {"question": "How many functions minimum should your project have?", "options": ["1", "2", "3", "5"], "answer": "3", "explanation": "The project requires a minimum of 3 functions."},
            {"question": "Which data structure is required for the project?", "options": ["Only lists", "Only dictionaries", "A list or dictionary", "Only sets"], "answer": "A list or dictionary", "explanation": "The project must use at least one list or dictionary."},
            {"question": "What is a BONUS requirement for the project?", "options": ["GUI interface", "File handling", "Database", "Web API"], "answer": "File handling", "explanation": "Adding file handling (saving/loading data) is a bonus requirement."}
        ]
    }
    return quizzes.get(n, quizzes[0])

def generate_problems_json(n):
    problems = {
        0: [
            {"id": "hello_world", "title": "Hello World", "description": "Write a program that prints 'Hello, World!' to the screen. Then add a second print statement that prints your favorite hobby.", "difficulty": "easy", "starterCode": "# Print Hello, World!\nprint()\n\n# Print your favorite hobby\n", "solution": "print(\"Hello, World!\")\nprint(\"Coding\")", "testCases": [{"label": "Basic output", "input": "", "expectedOutput": "Hello, World!\nCoding"}]},
            {"id": "personal_info", "title": "Personal Info", "description": "Write a program that prints your name, age, and the city you live in — each on a separate line using three print() statements.", "difficulty": "easy", "starterCode": "# Print your personal info\nprint()\nprint()\nprint()\n", "solution": "print(\"Lakshanya\")\nprint(\"20\")\nprint(\"Chennai\")", "testCases": [{"label": "Three lines of info", "input": "", "expectedOutput": "Lakshanya\n20\nChennai"}]}
        ],
        1: [
            {"id": "personal_card", "title": "Personal Card", "description": "Create variables for your name, age, and favorite color. Print each on a separate line. Then update the age by adding 1 and print the new age.", "difficulty": "easy", "starterCode": "# Create variables\nname = \"\"\nage = \nfav_color = \"\"\n\n# Print them\n\n# Update age and print\n", "solution": "name = \"Lakshanya\"\nage = 20\nfav_color = \"Blue\"\nprint(name)\nprint(age)\nprint(fav_color)\nage = age + 1\nprint(age)", "testCases": [{"label": "Variables output", "input": "", "expectedOutput": "Lakshanya\n20\nBlue\n21"}]},
            {"id": "type_checker", "title": "Type Checker", "description": "Print the type of each of these values: 42, 3.14, 'Hello', True. Use the type() function.", "difficulty": "easy", "starterCode": "# Print the type of each value\nprint(type())\nprint(type())\nprint(type())\nprint(type())\n", "solution": "print(type(42))\nprint(type(3.14))\nprint(type(\"Hello\"))\nprint(type(True))", "testCases": [{"label": "Type output", "input": "", "expectedOutput": "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>"}]}
        ],
        2: [
            {"id": "greeting_card", "title": "Greeting Card", "description": "Ask the user for their name and age using input(). Print a greeting: 'Hello [name]! You are [age] years old. Welcome to Python!'", "difficulty": "easy", "starterCode": "# Get user info\nname = input(\"Enter your name: \")\nage = input(\"Enter your age: \")\n\n# Print greeting\n", "solution": "name = input(\"Enter your name: \")\nage = input(\"Enter your age: \")\nprint(f\"Hello {name}! You are {age} years old. Welcome to Python!\")", "testCases": [{"label": "With input Lakshanya 20", "input": "Lakshanya\n20", "expectedOutput": "Enter your name: Enter your age: Hello Lakshanya! You are 20 years old. Welcome to Python!"}]},
            {"id": "addition_calculator", "title": "Addition Calculator", "description": "Ask the user for two numbers. Convert them to integers. Print the sum in the format: '[num1] + [num2] = [sum]'", "difficulty": "easy", "starterCode": "num1 = int(input(\"First number: \"))\nnum2 = int(input(\"Second number: \"))\n\n# Calculate and print sum\n", "solution": "num1 = int(input(\"First number: \"))\nnum2 = int(input(\"Second number: \"))\nresult = num1 + num2\nprint(f\"{num1} + {num2} = {result}\")", "testCases": [{"label": "5 + 3", "input": "5\n3", "expectedOutput": "First number: Second number: 5 + 3 = 8"}]}
        ],
        3: [
            {"id": "average_calculator", "title": "Average Calculator", "description": "Ask the user for three test scores. Calculate the average and print it formatted to 2 decimal places.", "difficulty": "easy", "starterCode": "s1 = int(input(\"Score 1: \"))\ns2 = int(input(\"Score 2: \"))\ns3 = int(input(\"Score 3: \"))\n\n# Calculate and print average\n", "solution": "s1 = int(input(\"Score 1: \"))\ns2 = int(input(\"Score 2: \"))\ns3 = int(input(\"Score 3: \"))\navg = (s1 + s2 + s3) / 3\nprint(f\"Average: {avg:.2f}\")", "testCases": [{"label": "Scores 80, 90, 85", "input": "80\n90\n85", "expectedOutput": "Score 1: Score 2: Score 3: Average: 85.00"}]},
            {"id": "even_odd_checker", "title": "Even or Odd", "description": "Ask the user for a number. Use the modulo operator to check if it's even or odd. Print 'Even' or 'Odd'.", "difficulty": "medium", "starterCode": "num = int(input(\"Enter a number: \"))\n\n# Check even or odd\n", "solution": "num = int(input(\"Enter a number: \"))\nif num % 2 == 0:\n    print(\"Even\")\nelse:\n    print(\"Odd\")", "testCases": [{"label": "Number 7", "input": "7", "expectedOutput": "Enter a number: Odd"}, {"label": "Number 10", "input": "10", "expectedOutput": "Enter a number: Even"}]}
        ],
        4: [
            {"id": "largest_of_three", "title": "Largest of Three", "description": "Ask the user for three numbers. Print the largest number among them using if-elif-else.", "difficulty": "medium", "starterCode": "a = int(input(\"First: \"))\nb = int(input(\"Second: \"))\nc = int(input(\"Third: \"))\n\n# Find and print the largest\n", "solution": "a = int(input(\"First: \"))\nb = int(input(\"Second: \"))\nc = int(input(\"Third: \"))\nif a >= b and a >= c:\n    print(f\"Largest: {a}\")\nelif b >= a and b >= c:\n    print(f\"Largest: {b}\")\nelse:\n    print(f\"Largest: {c}\")", "testCases": [{"label": "Numbers 5, 12, 7", "input": "5\n12\n7", "expectedOutput": "First: Second: Third: Largest: 12"}]},
            {"id": "leap_year", "title": "Leap Year Checker", "description": "Ask the user for a year. Determine if it's a leap year: divisible by 4 AND (not divisible by 100 OR divisible by 400).", "difficulty": "medium", "starterCode": "year = int(input(\"Enter year: \"))\n\n# Check leap year\n", "solution": "year = int(input(\"Enter year: \"))\nif year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):\n    print(\"Leap year\")\nelse:\n    print(\"Not a leap year\")", "testCases": [{"label": "Year 2024", "input": "2024", "expectedOutput": "Enter year: Leap year"}, {"label": "Year 2023", "input": "2023", "expectedOutput": "Enter year: Not a leap year"}]}
        ],
        5: [
            {"id": "sum_1_to_n", "title": "Sum from 1 to N", "description": "Ask for a number N. Use a for loop with range() to calculate the sum of all numbers from 1 to N. Print the result.", "difficulty": "easy", "starterCode": "n = int(input(\"Enter N: \"))\ntotal = 0\n\n# Use a for loop to sum 1 to N\n", "solution": "n = int(input(\"Enter N: \"))\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(f\"Sum: {total}\")", "testCases": [{"label": "N = 5", "input": "5", "expectedOutput": "Enter N: Sum: 15"}, {"label": "N = 10", "input": "10", "expectedOutput": "Enter N: Sum: 55"}]},
            {"id": "factorial", "title": "Factorial Calculator", "description": "Ask for a number N. Calculate N! (N factorial) using a for loop. N! = 1 * 2 * 3 * ... * N", "difficulty": "medium", "starterCode": "n = int(input(\"Enter N: \"))\nfact = 1\n\n# Calculate factorial\n", "solution": "n = int(input(\"Enter N: \"))\nfact = 1\nfor i in range(1, n + 1):\n    fact *= i\nprint(f\"Factorial: {fact}\")", "testCases": [{"label": "N = 5", "input": "5", "expectedOutput": "Enter N: Factorial: 120"}]}
        ],
        6: [
            {"id": "number_guessing", "title": "Number Guessing Game", "description": "Set a secret number (e.g., 7). Use a while loop to let the user guess. Keep asking until they get it right. Print 'Correct!' and stop.", "difficulty": "medium", "starterCode": "secret = 7\n\n# Guessing loop\n", "solution": "secret = 7\nwhile True:\n    guess = int(input(\"Guess: \"))\n    if guess == secret:\n        print(\"Correct!\")\n        break\n    else:\n        print(\"Wrong!\")", "testCases": [{"label": "Guesses 3, 7", "input": "3\n7", "expectedOutput": "Guess: Wrong!\nGuess: Correct!"}]},
            {"id": "count_digits", "title": "Count Digits", "description": "Ask for a positive integer. Count how many digits it has using a while loop. Print the count.", "difficulty": "medium", "starterCode": "num = int(input(\"Number: \"))\ncount = 0\n\n# Count digits using while loop\n", "solution": "num = int(input(\"Number: \"))\ncount = 0\nwhile num > 0:\n    num //= 10\n    count += 1\nprint(f\"Digits: {count}\")", "testCases": [{"label": "Number 12345", "input": "12345", "expectedOutput": "Number: Digits: 5"}]}
        ],
        7: [
            {"id": "marks_manager", "title": "Marks Manager", "description": "Create a list of 5 marks. Add a new mark, remove the lowest mark, sort the list, and print the average.", "difficulty": "medium", "starterCode": "marks = [78, 92, 85, 63, 88]\n\n# Add 95\n# Remove lowest\n# Sort and print average\n", "solution": "marks = [78, 92, 85, 63, 88]\nmarks.append(95)\nmarks.remove(min(marks))\nmarks.sort()\nprint(f\"Sorted: {marks}\")\nprint(f\"Average: {sum(marks)//len(marks)}\")", "testCases": [{"label": "Marks output", "input": "", "expectedOutput": "Sorted: [78, 85, 88, 92, 95]\nAverage: 87"}]},
            {"id": "list_reversal", "title": "List Reversal", "description": "Create a list of 5 numbers. Reverse it using slicing and print both the original and reversed lists.", "difficulty": "easy", "starterCode": "nums = [1, 2, 3, 4, 5]\n\n# Reverse and print\n", "solution": "nums = [1, 2, 3, 4, 5]\nreversed_nums = nums[::-1]\nprint(f\"Original: {nums}\")\nprint(f\"Reversed: {reversed_nums}\")", "testCases": [{"label": "List reversal", "input": "", "expectedOutput": "Original: [1, 2, 3, 4, 5]\nReversed: [5, 4, 3, 2, 1]"}]}
        ],
        8: [
            {"id": "unique_sorter", "title": "Unique Sorter", "description": "Given a list with duplicates [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5], remove duplicates using a set and sort the result.", "difficulty": "easy", "starterCode": "nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]\n\n# Remove duplicates and sort\n", "solution": "nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]\nunique = sorted(set(nums))\nprint(f\"Unique: {unique}\")", "testCases": [{"label": "Unique sort", "input": "", "expectedOutput": "Unique: [1, 2, 3, 4, 5, 6, 9]"}]},
            {"id": "tuple_operations", "title": "Tuple Operations", "description": "Create a tuple with coordinates (x, y, z). Unpack it into three variables. Swap x and z using tuple unpacking. Print the result.", "difficulty": "easy", "starterCode": "coords = (10, 20, 30)\nx, y, z = coords\n\n# Swap x and z and print\n", "solution": "coords = (10, 20, 30)\nx, y, z = coords\nx, z = z, x\nprint(f\"x={x}, y={y}, z={z}\")", "testCases": [{"label": "Swapped coordinates", "input": "", "expectedOutput": "x=30, y=20, z=10"}]}
        ],
        9: [
            {"id": "student_grades", "title": "Student Grades", "description": "Create a dictionary with student names as keys and their grades as values. Add a new student, update an existing grade, and print each student with their grade.", "difficulty": "easy", "starterCode": "grades = {\"Alice\": 85, \"Bob\": 92, \"Charlie\": 78}\n\n# Add Diana with grade 88\n# Update Bob to 95\n# Print all\n", "solution": "grades = {\"Alice\": 85, \"Bob\": 92, \"Charlie\": 78}\ngrades[\"Diana\"] = 88\ngrades[\"Bob\"] = 95\nfor name, grade in grades.items():\n    print(f\"{name}: {grade}\")", "testCases": [{"label": "Grades output", "input": "", "expectedOutput": "Alice: 85\nBob: 95\nCharlie: 78\nDiana: 88"}]},
            {"id": "word_frequency", "title": "Word Frequency", "description": "Count how many times each word appears in the sentence 'the cat and the dog and the bird'. Use a dictionary.", "difficulty": "medium", "starterCode": "sentence = \"the cat and the dog and the bird\"\nwords = sentence.split()\ncounts = {}\n\n# Count word frequencies\n", "solution": "sentence = \"the cat and the dog and the bird\"\nwords = sentence.split()\ncounts = {}\nfor word in words:\n    if word in counts:\n        counts[word] += 1\n    else:\n        counts[word] = 1\nprint(counts)", "testCases": [{"label": "Word frequencies", "input": "", "expectedOutput": "{'the': 3, 'cat': 1, 'and': 2, 'dog': 1, 'bird': 1}"}]}
        ],
        10: [
            {"id": "area_calculator", "title": "Area Calculator", "description": "Define functions for area of rectangle, circle, and triangle. Call each with sample values and print the results.", "difficulty": "easy", "starterCode": "def rectangle_area(l, w):\n    return l * w\n\ndef circle_area(r):\n    return 3.14 * r * r\n\ndef triangle_area(b, h):\n    return 0.5 * b * h\n\n# Test each function\n", "solution": "def rectangle_area(l, w):\n    return l * w\n\ndef circle_area(r):\n    return 3.14 * r * r\n\ndef triangle_area(b, h):\n    return 0.5 * b * h\n\nprint(f\"Rectangle 5x3: {rectangle_area(5, 3)}\")\nprint(f\"Circle r=4: {circle_area(4)}\")\nprint(f\"Triangle b=6,h=3: {triangle_area(6, 3)}\")", "testCases": [{"label": "Area outputs", "input": "", "expectedOutput": "Rectangle 5x3: 15\nCircle r=4: 50.24\nTriangle b=6,h=3: 9.0"}]},
            {"id": "temperature_converter", "title": "Temperature Converter", "description": "Define celsius_to_fahrenheit(c) and fahrenheit_to_celsius(f) functions. Test both with sample values.", "difficulty": "easy", "starterCode": "def celsius_to_fahrenheit(c):\n    return (c * 9/5) + 32\n\ndef fahrenheit_to_celsius(f):\n    return (f - 32) * 5/9\n\n# Test both\n", "solution": "def c_to_f(c):\n    return (c * 9/5) + 32\n\ndef f_to_c(f):\n    return (f - 32) * 5/9\n\nprint(f\"0C = {c_to_f(0)}F\")\nprint(f\"100C = {c_to_f(100)}F\")\nprint(f\"32F = {f_to_c(32)}C\")\nprint(f\"212F = {f_to_c(212)}C\")", "testCases": [{"label": "Temperature conversions", "input": "", "expectedOutput": "0C = 32.0F\n100C = 212.0F\n32F = 0.0C\n212F = 100.0C"}]}
        ],
        11: [
            {"id": "palindrome", "title": "Palindrome Checker", "description": "Ask the user for a word. Check if it's a palindrome (reads same forward and backward). Ignore case.", "difficulty": "medium", "starterCode": "word = input(\"Enter a word: \")\n\n# Check palindrome\n", "solution": "word = input(\"Enter a word: \")\ncleaned = word.lower().strip()\nif cleaned == cleaned[::-1]:\n    print(\"Palindrome\")\nelse:\n    print(\"Not a palindrome\")", "testCases": [{"label": "Racecar", "input": "Racecar", "expectedOutput": "Enter a word: Palindrome"}, {"label": "Python", "input": "Python", "expectedOutput": "Enter a word: Not a palindrome"}]},
            {"id": "email_extractor", "title": "Email Extractor", "description": "Given 'Name: Alice, Email: alice@example.com; Name: Bob, Email: bob@test.com', extract all email addresses.", "difficulty": "medium", "starterCode": "data = \"Name: Alice, Email: alice@example.com; Name: Bob, Email: bob@test.com\"\n\n# Extract and print emails\n", "solution": "data = \"Name: Alice, Email: alice@example.com; Name: Bob, Email: bob@test.com\"\nentries = data.split(\"; \")\nfor entry in entries:\n    parts = entry.split(\", \")\n    email = parts[1].split(\": \")[1]\n    print(email)", "testCases": [{"label": "Email output", "input": "", "expectedOutput": "alice@example.com\nbob@test.com"}]}
        ],
        12: [
            {"id": "notes_app", "title": "Notes App", "description": "Ask the user for 3 notes. Write them to 'notes.txt' (one per line). Then read the file and display each note with a line number.", "difficulty": "medium", "starterCode": "# Get 3 notes\nn1 = input(\"Note 1: \")\nn2 = input(\"Note 2: \")\nn3 = input(\"Note 3: \")\n\n# Write to file\n\n# Read and display\n", "solution": "n1 = input(\"Note 1: \")\nn2 = input(\"Note 2: \")\nn3 = input(\"Note 3: \")\n\nwith open(\"notes.txt\", \"w\") as f:\n    f.write(n1 + \"\\n\")\n    f.write(n2 + \"\\n\")\n    f.write(n3 + \"\\n\")\n\nwith open(\"notes.txt\", \"r\") as f:\n    for i, line in enumerate(f, 1):\n        print(f\"{i}. {line}\", end=\"\")", "testCases": [{"label": "Adding notes", "input": "Learn Python\nPractice daily\nBuild projects", "expectedOutput": "Note 1: Note 2: Note 3: 1. Learn Python\n2. Practice daily\n3. Build projects\n"}]},
            {"id": "file_copy", "title": "File Copy", "description": "Read all lines from 'source.txt' (create it first) and write them to 'copy.txt' with line numbers. Print the contents of copy.txt.", "difficulty": "medium", "starterCode": "# Create source file\nwith open(\"source.txt\", \"w\") as f:\n    f.write(\"Line A\\nLine B\\nLine C\\n\")\n\n# Read and copy with numbers\n", "solution": "with open(\"source.txt\", \"w\") as f:\n    f.write(\"Line A\\nLine B\\nLine C\\n\")\n\nwith open(\"source.txt\", \"r\") as f:\n    lines = f.readlines()\n\nwith open(\"copy.txt\", \"w\") as f:\n    for i, line in enumerate(lines, 1):\n        f.write(f\"{i}: {line}\")\n\nwith open(\"copy.txt\", \"r\") as f:\n    print(f.read())", "testCases": [{"label": "Copied with numbers", "input": "", "expectedOutput": "1: Line A\n2: Line B\n3: Line C\n"}]}
        ],
        13: [
            {"id": "mini_project_setup", "title": "Mini Project: Plan Your App", "description": "Write a Python program that prints a menu with 4 project options. Let the user pick one (1-4). Print a confirmation message: 'You selected: [Project Name]'", "difficulty": "medium", "starterCode": "print(\"=== Choose Your Project ===\")\nprint(\"1. Student Management System\")\nprint(\"2. Expense Tracker\")\nprint(\"3. Quiz Application\")\nprint(\"4. To-Do List\")\n\nchoice = int(input(\"Enter choice (1-4): \"))\n\n# Print confirmation\n", "solution": "print(\"=== Choose Your Project ===\")\nprint(\"1. Student Management System\")\nprint(\"2. Expense Tracker\")\nprint(\"3. Quiz Application\")\nprint(\"4. To-Do List\")\n\nchoice = int(input(\"Enter choice (1-4): \"))\nprojects = [\"\", \"Student Management System\", \"Expense Tracker\", \"Quiz Application\", \"To-Do List\"]\nprint(f\"You selected: {projects[choice]}\")", "testCases": [{"label": "Pick option 3", "input": "3", "expectedOutput": "=== Choose Your Project ===\n1. Student Management System\n2. Expense Tracker\n3. Quiz Application\n4. To-Do List\nEnter choice (1-4): You selected: Quiz Application"}]}
        ]
    }
    return problems.get(n, problems[0])

# ── Emoji cleanup ─────────────────────────────────────────────────────────────
import unicodedata

def _strip_emojis(obj):
    if isinstance(obj, str):
        result = []
        for ch in obj:
            cp = ord(ch)
            is_emoji = (0x1F300 <= cp <= 0x1FAFF) or (0x2600 <= cp <= 0x27BF) or (0x2700 <= cp <= 0x27BF) or (0xFE00 <= cp <= 0xFE0F) or (0x200D == cp) or (0x1F000 <= cp <= 0x1F02F)
            if not is_emoji:
                result.append(ch)
        return ''.join(result).strip()
    elif isinstance(obj, dict):
        return {k: _strip_emojis(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_strip_emojis(item) for item in obj]
    return obj

# ── Write all files ─────────────────────────────────────────────────────────
for lect in LECTURES:
    n = lect["number"]
    dir_path = os.path.join(BASE, f"lecture_{n}")
    os.makedirs(dir_path, exist_ok=True)

    # Write lesson.json
    with open(os.path.join(dir_path, "lesson.json"), "w") as f:
        json.dump(_strip_emojis(generate_lesson_json(lect)), f, indent=2, ensure_ascii=False)

    # Write quiz.json
    with open(os.path.join(dir_path, "quiz.json"), "w") as f:
        json.dump(_strip_emojis(generate_quiz_json(n)), f, indent=2, ensure_ascii=False)

    # Write problems.json
    with open(os.path.join(dir_path, "problems.json"), "w") as f:
        json.dump(_strip_emojis(generate_problems_json(n)), f, indent=2, ensure_ascii=False)

    print(f"  ✓ Lecture {n}: {lect['title']}")

print("\n✓ All files generated successfully!")
