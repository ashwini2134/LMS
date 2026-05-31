# Lecture 8: Object-Oriented Programming

## Overview
In this lecture, we learn how to organize code using classes and objects. Object-Oriented Programming (OOP) helps structure large programs by grouping related data and functions together.

## Key Concepts

### 1. Classes and Objects
A class is a blueprint for creating objects.

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

# Create an object
person = Person("Alice", 20)
print(person.name)  # Alice
```

### 2. Constructor (`__init__`)
The `__init__` method initializes an object when created.

```python
class Student:
    def __init__(self, name, gpa):
        self.name = name
        self.gpa = gpa

student = Student("Bob", 3.5)
```

### 3. Methods
Functions defined inside a class.

```python
class Calculator:
    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b

calc = Calculator()
result = calc.add(5, 3)  # 8
```

### 4. The `self` Parameter
Refers to the object itself. Always the first parameter in methods.

```python
class Dog:
    def __init__(self, name):
        self.name = name  # self.name is an attribute

    def speak(self):
        print(f"{self.name} says woof!")

dog = Dog("Rex")
dog.speak()  # Rex says woof!
```

### 5. Dunder Methods (Magic Methods)

**`__str__()` - String representation:**
```python
class Person:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"Person({self.name})"

p = Person("Alice")
print(p)  # Person(Alice)
```

**`__repr__()` - Developer representation:**
```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

p = Point(3, 4)
print(repr(p))  # Point(3, 4)
```

**`__eq__()` - Equality comparison:**
```python
class Student:
    def __init__(self, name, id):
        self.name = name
        self.id = id

    def __eq__(self, other):
        return self.id == other.id

s1 = Student("Alice", 1)
s2 = Student("Alice", 1)
print(s1 == s2)  # True
```

**`__len__()` - Length:**
```python
class Team:
    def __init__(self, members):
        self.members = members

    def __len__(self):
        return len(self.members)

team = Team(["Alice", "Bob", "Charlie"])
print(len(team))  # 3
```

### 6. Properties
Use `@property` decorator to define getters.

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value <= 0:
            raise ValueError("Radius must be positive")
        self._radius = value

    @property
    def area(self):
        return 3.14 * self._radius ** 2

c = Circle(5)
print(c.area)  # 78.5
c.radius = 10  # Uses setter
```

### 7. Class Variables
Shared across all instances.

```python
class Student:
    count = 0  # Class variable

    def __init__(self, name):
        self.name = name  # Instance variable
        Student.count += 1

s1 = Student("Alice")
s2 = Student("Bob")
print(Student.count)  # 2
```

### 8. Inheritance
A class can inherit from another class.

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(f"{self.name} makes a sound")

class Dog(Animal):
    def speak(self):
        print(f"{self.name} barks")

dog = Dog("Rex")
dog.speak()  # Rex barks
```

**Calling parent method with `super()`:**
```python
class Vehicle:
    def __init__(self, make, model):
        self.make = make
        self.model = model

class Car(Vehicle):
    def __init__(self, make, model, doors):
        super().__init__(make, model)
        self.doors = doors
```

### 9. Polymorphism
Different classes can have methods with the same name.

```python
class Cat:
    def speak(self):
        return "Meow"

class Dog:
    def speak(self):
        return "Woof"

def animal_sound(animal):
    print(animal.speak())

animal_sound(Cat())  # Meow
animal_sound(Dog())  # Woof
```

### 10. Encapsulation
Hide internal details with private attributes.

```python
class BankAccount:
    def __init__(self, balance):
        self._balance = balance  # Private by convention

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount

    def get_balance(self):
        return self._balance

account = BankAccount(100)
account.deposit(50)
print(account.get_balance())  # 150
```

## Common Pitfalls

### ❌ Pitfall 1: Forgetting `self` Parameter
```python
# WRONG: Method without self
class Dog:
    def bark(self):
        print("Woof!")

dog = Dog()
dog.bark()  # Works

# But this is confusing:
def not_a_method():  # Not in class
    print("Not a method")
```

✅ **Correct:**
```python
class Dog:
    def bark(self):  # Always include self
        print("Woof!")
```

### ❌ Pitfall 2: Not Initializing Attributes in `__init__`
```python
# WRONG: Attribute doesn't exist until later
class Person:
    def set_name(self, name):
        self.name = name

p = Person()
print(p.name)  # AttributeError!
```

✅ **Correct:**
```python
class Person:
    def __init__(self, name):
        self.name = name
```

### ❌ Pitfall 3: Using Class Variables Wrong
```python
# WRONG: Modifying class variable from instance
class Counter:
    count = 0

    def increment(self):
        self.count += 1  # Creates instance variable, not modifying class variable

c1 = Counter()
c1.increment()
c2 = Counter()
print(c2.count)  # 0, not 1!
```

✅ **Correct:**
```python
class Counter:
    count = 0

    def increment(self):
        Counter.count += 1  # Modifies class variable

c1 = Counter()
c1.increment()
c2 = Counter()
print(c2.count)  # 1
```

### ❌ Pitfall 4: Mutable Default Arguments
```python
# WRONG: List is shared across instances
class Inventory:
    def __init__(self, items=[]):
        self.items = items  # Same list for all instances!

i1 = Inventory()
i1.items.append("apple")
i2 = Inventory()
print(i2.items)  # ["apple"] — unexpected!
```

✅ **Correct:**
```python
class Inventory:
    def __init__(self, items=None):
        self.items = items if items else []
```

## Summary
- **Classes** define blueprints for objects
- **`__init__`** initializes objects
- **`self`** refers to the object instance
- **Dunder methods** like `__str__()` customize behavior
- **Properties** provide controlled access to attributes
- **Inheritance** allows code reuse
- **Polymorphism** allows different classes to share method names
- **Encapsulation** hides internal details

## Practice Problems
1. Create a Rectangle class with area() and perimeter() methods
2. Create a Shape class and inherit Circle and Square from it
3. Create an Employee class with salary tracking and raise() method
