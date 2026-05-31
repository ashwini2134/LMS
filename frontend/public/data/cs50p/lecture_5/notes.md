# Lecture 5: Unit Tests

## Overview
In this lecture, we learn how to write tests for our code to ensure it works correctly. Unit tests verify that individual functions and methods work as expected.

## Key Concepts

### 1. Why Write Tests?
- Catch bugs early
- Ensure code works as expected
- Document expected behavior
- Make refactoring safer
- Improve code quality

### 2. unittest Module
Python's built-in testing framework.

**Basic structure:**
```python
import unittest

def square(x):
    return x ** 2

class TestSquare(unittest.TestCase):
    def test_positive(self):
        self.assertEqual(square(3), 9)

    def test_zero(self):
        self.assertEqual(square(0), 0)

    def test_negative(self):
        self.assertEqual(square(-3), 9)

if __name__ == "__main__":
    unittest.main()
```

### 3. Common Assertions

**`assertEqual(a, b)` - Check if equal:**
```python
self.assertEqual(2 + 2, 4)
```

**`assertNotEqual(a, b)` - Check if not equal:**
```python
self.assertNotEqual(1, 2)
```

**`assertTrue(condition)` - Check if true:**
```python
self.assertTrue(5 > 3)
```

**`assertFalse(condition)` - Check if false:**
```python
self.assertFalse(2 > 5)
```

**`assertIn(item, container)` - Check if item in container:**
```python
self.assertIn("a", "abc")
```

**`assertIsNone(value)` - Check if None:**
```python
self.assertIsNone(None)
```

**`assertRaises(exception, function)` - Check if exception raised:**
```python
with self.assertRaises(ValueError):
    int("not a number")
```

### 4. Test Naming Conventions
Test methods should start with `test_` and have descriptive names.

```python
class TestCalculator(unittest.TestCase):
    def test_addition_positive_numbers(self):
        pass

    def test_addition_negative_numbers(self):
        pass

    def test_division_by_zero_raises_error(self):
        pass
```

### 5. setUp and tearDown
Set up before each test and clean up after.

```python
class TestDatabase(unittest.TestCase):
    def setUp(self):
        # Run before each test
        self.db = create_connection()

    def tearDown(self):
        # Run after each test
        self.db.close()

    def test_insert(self):
        result = self.db.insert("test data")
        self.assertTrue(result)
```

### 6. Testing Exceptions
Verify that functions raise the correct exceptions.

```python
class TestValidation(unittest.TestCase):
    def test_invalid_email_raises_error(self):
        with self.assertRaises(ValueError):
            validate_email("not an email")

    def test_negative_age_raises_error(self):
        with self.assertRaises(ValueError):
            age = -5
            if age < 0:
                raise ValueError("Age must be positive")
```

### 7. Testing Edge Cases
Cover boundary conditions and special cases.

```python
class TestLength(unittest.TestCase):
    def test_empty_string(self):
        self.assertEqual(len(""), 0)

    def test_single_character(self):
        self.assertEqual(len("a"), 1)

    def test_long_string(self):
        self.assertEqual(len("a" * 1000), 1000)
```

### 8. Test Organization
Organize related tests in separate classes.

```python
import unittest

class TestStringMethods(unittest.TestCase):
    def test_upper(self):
        self.assertEqual("hello".upper(), "HELLO")

    def test_split(self):
        self.assertEqual("hello world".split(), ["hello", "world"])

class TestNumericMethods(unittest.TestCase):
    def test_abs(self):
        self.assertEqual(abs(-5), 5)

    def test_max(self):
        self.assertEqual(max([1, 2, 3]), 3)

if __name__ == "__main__":
    unittest.main()
```

### 9. Running Tests
Run tests from the command line.

```bash
# Run all tests
python -m unittest

# Run specific test file
python -m unittest test_calculator.py

# Run specific test class
python -m unittest test_calculator.TestCalculator

# Run specific test method
python -m unittest test_calculator.TestCalculator.test_addition

# Verbose output
python -m unittest -v
```

### 10. Test-Driven Development (TDD)
Write tests before writing code.

1. Write a failing test
2. Write minimal code to pass the test
3. Refactor to improve quality

```python
# Write this test first
class TestGrade(unittest.TestCase):
    def test_passing_grade(self):
        self.assertEqual(get_grade(85), "B")

# Then write the function
def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    else:
        return "C"
```

## Common Pitfalls

### ❌ Pitfall 1: Not Testing Edge Cases
```python
# WRONG: Only tests happy path
def test_divide(self):
    self.assertEqual(divide(10, 2), 5)
```

✅ **Correct:**
```python
def test_divide_positive(self):
    self.assertEqual(divide(10, 2), 5)

def test_divide_by_zero(self):
    with self.assertRaises(ZeroDivisionError):
        divide(10, 0)

def test_divide_floats(self):
    self.assertAlmostEqual(divide(10, 3), 3.333, places=2)
```

### ❌ Pitfall 2: Testing Implementation, Not Behavior
```python
# WRONG: Tests internal details
def test_uses_list(self):
    self.assertIsInstance(get_items(), list)
```

✅ **Correct:**
```python
def test_returns_items(self):
    self.assertEqual(get_items(), [1, 2, 3])
```

### ❌ Pitfall 3: Not Testing Error Cases
```python
# WRONG: Doesn't test error handling
def test_login(self):
    self.assertTrue(login("user", "correct_password"))
```

✅ **Correct:**
```python
def test_login_correct_password(self):
    self.assertTrue(login("user", "correct_password"))

def test_login_wrong_password(self):
    self.assertFalse(login("user", "wrong_password"))

def test_login_nonexistent_user(self):
    self.assertFalse(login("nonexistent", "password"))
```

### ❌ Pitfall 4: Test Interdependency
```python
# WRONG: Tests depend on each other
class TestData(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = []

    def test_1_add_item(self):
        self.data.append(1)
        self.assertEqual(len(self.data), 1)

    def test_2_verify_item_exists(self):
        # Fails if test_1 doesn't run first
        self.assertEqual(self.data[0], 1)
```

✅ **Correct:**
```python
def test_add_item(self):
    data = []
    data.append(1)
    self.assertEqual(len(data), 1)
```

## Summary
- **Unit tests** verify that functions work correctly
- **unittest.TestCase** is Python's testing framework
- **Assertions** check expected behavior
- **Edge cases** are important to test
- **Test naming** should be descriptive
- **setUp/tearDown** initialize and clean up tests
- **Run tests** frequently during development

## Practice Problems
1. Write a function and comprehensive unit tests for checking if a string is a palindrome
2. Write tests for a function that validates email addresses
3. Write tests for a calculator that handles multiple operations
