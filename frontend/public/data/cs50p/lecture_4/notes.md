# Lecture 4: Libraries

## Overview
In this lecture, we learn how to use external libraries and modules to extend Python's capabilities. Libraries provide pre-written code that we can import and use in our programs.

## Key Concepts

### 1. Importing Modules
Python has built-in modules and third-party libraries we can import.

**Import entire module:**
```python
import math
print(math.sqrt(16))  # 4.0
```

**Import specific function:**
```python
from math import sqrt
print(sqrt(16))  # 4.0
```

**Import with alias:**
```python
import math as m
print(m.sqrt(16))  # 4.0
```

**Import everything (not recommended):**
```python
from math import *
```

### 2. Useful Built-in Modules

**`random` module - Generate random numbers:**
```python
import random

print(random.randint(1, 10))  # Random int between 1-10
print(random.choice([1, 2, 3]))  # Random choice from list
print(random.shuffle([1, 2, 3]))  # Shuffle a list
```

**`math` module - Mathematical functions:**
```python
import math

print(math.sqrt(16))  # Square root
print(math.ceil(3.2))  # Round up
print(math.floor(3.9))  # Round down
print(math.pi)  # Pi constant
```

**`datetime` module - Working with dates and times:**
```python
from datetime import datetime

now = datetime.now()
print(now.year)
print(now.month)
print(now.day)

# Parse a date string
date_str = "2024-01-15"
date_obj = datetime.strptime(date_str, "%Y-%m-%d")
```

### 3. Third-Party Libraries
Libraries that aren't built-in but can be installed.

**Installing libraries with pip:**
```bash
pip install requests
pip install emoji
pip install pandas
```

**Using requests library:**
```python
import requests

response = requests.get("https://api.example.com/data")
data = response.json()  # Parse JSON response
```

### 4. Working with JSON
JSON (JavaScript Object Notation) is a common data format.

**JSON file example:**
```json
{
  "name": "Alice",
  "age": 20,
  "courses": ["CS50", "Python"]
}
```

**Parse JSON:**
```python
import json

# Read from file
with open("data.json") as f:
    data = json.load(f)
    print(data["name"])

# Parse JSON string
json_str = '{"name": "Alice", "age": 20}'
data = json.loads(json_str)

# Convert to JSON string
data = {"name": "Alice", "age": 20}
json_str = json.dumps(data)

# Write to file
with open("output.json", "w") as f:
    json.dump(data, f)
```

### 5. CSV Files
CSV (Comma-Separated Values) files store tabular data.

**Using csv module:**
```python
import csv

# Read CSV
with open("data.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["age"])

# Write CSV
data = [
    {"name": "Alice", "age": 20},
    {"name": "Bob", "age": 25}
]
with open("output.csv", "w") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
    writer.writeheader()
    writer.writerows(data)
```

### 6. sys Module
Access command-line arguments and program information.

**`sys.argv` - Command-line arguments:**
```python
import sys

# program.py arg1 arg2
for arg in sys.argv:
    print(arg)
```

Output:
```
program.py
arg1
arg2
```

### 7. os Module
Interact with the operating system and file system.

```python
import os

# Check if file exists
if os.path.exists("data.txt"):
    print("File exists")

# List directory contents
files = os.listdir(".")
for file in files:
    print(file)

# Get current directory
print(os.getcwd())

# Create directory
os.makedirs("new_folder", exist_ok=True)
```

### 8. Requests Library
Make HTTP requests to web APIs.

```python
import requests

# Make GET request
response = requests.get("https://api.github.com/users/github")
data = response.json()
print(data["login"])

# Check status
if response.status_code == 200:
    print("Success!")
else:
    print(f"Error: {response.status_code}")
```

## Common Pitfalls

### ❌ Pitfall 1: Forgetting to Install Package
```python
import pandas  # ModuleNotFoundError if not installed
```

✅ **Correct:**
```bash
pip install pandas
```

### ❌ Pitfall 2: Incorrect Import Syntax
```python
# WRONG: This doesn't work
import math.sqrt
result = sqrt(16)
```

✅ **Correct:**
```python
from math import sqrt
result = sqrt(16)
# OR
import math
result = math.sqrt(16)
```

### ❌ Pitfall 3: JSON Parse Errors
```python
# WRONG: Forgetting to open the file
data = json.load("data.json")  # Error!
```

✅ **Correct:**
```python
with open("data.json") as f:
    data = json.load(f)
```

### ❌ Pitfall 4: Not Handling API Errors
```python
# WRONG: Assumes API always succeeds
response = requests.get(url)
data = response.json()  # May crash if status != 200
```

✅ **Correct:**
```python
try:
    response = requests.get(url)
    response.raise_for_status()  # Raise error if status != 200
    data = response.json()
except requests.exceptions.RequestException as e:
    print(f"API Error: {e}")
```

## Summary
- **Modules** are files containing Python code that can be imported
- **`import`** brings modules into your program
- **Third-party libraries** are installed via pip
- **JSON** is a common format for storing and exchanging data
- **CSV** files store tabular data
- **requests** library makes HTTP requests
- **sys** and **os** modules interact with the system

## Practice Problems
1. Write a program that fetches weather data from a public API and displays the current temperature
2. Write a program that reads a CSV file and converts it to JSON
3. Write a program that generates random numbers and calculates their average
