import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addModule(
  trackTitle: string,
  moduleData: {
    title: string;
    description: string;
    orderIndex: number;
    content: string;
    quizzes: {
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }[];
  },
) {
  // Find the track
  const track = await prisma.track.findFirst({
    where: { title: trackTitle },
  });

  if (!track) {
    console.log(`Track not found: ${trackTitle}`);
    return;
  }

  // Check if module already exists
  const existing = await prisma.module.findFirst({
    where: { trackId: track.id, title: moduleData.title },
  });

  if (existing) {
    console.log(`Already exists — skipping: ${moduleData.title}`);
    return;
  }

  // Create the module with its quizzes
  await prisma.module.create({
    data: {
      trackId: track.id,
      title: moduleData.title,
      description: moduleData.description,
      orderIndex: moduleData.orderIndex,
      content: moduleData.content,
      quizzes: {
        create: moduleData.quizzes.map((q) => ({
          question: q.question,
          options: JSON.stringify(q.options),
          correct: q.correct,
          explanation: q.explanation,
        })),
      },
    },
  });

  console.log(`Created: ${moduleData.title}`);
}

async function main() {
  console.log("Adding new modules...");

  // ════════════════════════════════════════════════════════
  // PASTE NEW MODULES BELOW THIS LINE
  // Each module follows the addModule() pattern shown below
  // ════════════════════════════════════════════════════════

  await addModule("Python for Beginners", {
    title: "Control Flow — If Statements, Loops, and Logic",
    description:
      "Learn how to make decisions and repeat actions in Python using if/elif/else statements, for loops, while loops, and boolean logic — the core tools that bring programs to life.",
    orderIndex: 3,
    content: `## What Is Control Flow?

When you write a Python program, code normally runs line by line from top to bottom. **Control flow** is how you change that — making your program *decide* what to do, or *repeat* actions automatically. Think of it like a choose-your-own-adventure book: the story branches depending on your choices, and sometimes you loop back to the same page.

## If / Elif / Else — Making Decisions

An **if statement** lets your program ask a question and act on the answer.

\`\`\`python
temperature = 30

if temperature > 25:
    print("It's hot outside!")
elif temperature > 15:
    print("It's a nice day.")
else:
    print("Bring a jacket.")
\`\`\`

- **if** checks the first condition. If it's true, that block runs and the rest is skipped.
- **elif** (short for "else if") checks a second condition — only reached if the first was false.
- **else** is the fallback — it runs when *none* of the above conditions were true.

You can have as many \`elif\` blocks as you need, but only one \`if\` and one \`else\` per chain.

## Boolean Logic — True, False, and Comparisons

Every condition in an if statement evaluates to either **True** or **False** — that's called a **boolean** value. Python gives you several comparison operators: \`==\` (equal to), \`!=\` (not equal to), \`>\` / \`<\` (greater / less than), and \`>=\` / \`<=\` (greater or equal / less or equal).

You can also combine conditions with **and**, **or**, and **not**:

\`\`\`python
age = 20
has_id = True

if age >= 18 and has_id:
    print("Entry allowed.")
else:
    print("Sorry, you cannot enter.")
\`\`\`

Use **and** when both conditions must be True, **or** when at least one must be True, and **not** to flip a boolean value.

## For Loops — Repeating a Fixed Number of Times

A **for loop** repeats a block of code once for each item in a sequence. The most common use is with \`range()\`, which generates a sequence of numbers.

\`\`\`python
for i in range(5):
    print("Step", i)
\`\`\`

This prints Step 0 through Step 4 — five times total. You can also loop directly over a list:

\`\`\`python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print("I like", fruit)
\`\`\`

Each time the loop runs, the variable \`fruit\` automatically holds the next item from the list.

## While Loops — Repeating Until a Condition Changes

A **while loop** keeps running as long as its condition stays True. It's useful when you don't know in advance how many repetitions you need.

\`\`\`python
count = 0

while count < 3:
    print("Counting:", count)
    count = count + 1
\`\`\`

This prints 0, 1, then 2 — and stops when \`count\` reaches 3. **Important:** always make sure the condition will eventually become False, or your loop will run forever — this is called an **infinite loop** and is one of the most common beginner mistakes.

## Putting It Together

Control flow is the backbone of almost every program. A quiz app checks your answer with **if/else**, counts questions with a **for loop**, and keeps asking until you quit with a **while loop**. Master these three tools and you can write programs that genuinely *think* and *react*.`,
    quizzes: [
      {
        question:
          "What does the `elif` keyword do in a Python if-statement chain?",
        options: [
          "It ends the if-statement and starts a new one",
          "It checks a second condition only if the first condition was False",
          "It always runs, regardless of the if condition",
          "It repeats the if condition in a loop",
        ],
        correct: 1,
        explanation:
          "`elif` is only evaluated when the preceding `if` (or `elif`) condition was False, allowing multiple distinct conditions to be checked in sequence.",
      },
      {
        question:
          "What will this code print?\n\nx = 10\nif x > 20:\n    print('A')\nelif x > 5:\n    print('B')\nelse:\n    print('C')",
        options: ["A", "A and B", "B", "C"],
        correct: 2,
        explanation:
          "x = 10 is not greater than 20 so the first branch is skipped; it is greater than 5 so the `elif` branch runs and prints 'B'.",
      },
      {
        question:
          "How many times will `print('Hello')` run?\n\nfor i in range(4):\n    print('Hello')",
        options: ["3", "4", "5", "1"],
        correct: 1,
        explanation:
          "`range(4)` generates the sequence 0, 1, 2, 3 — four values — so the loop body executes exactly four times.",
      },
      {
        question: "Which expression evaluates to True when `age = 16`?",
        options: [
          "age >= 18 and age < 30",
          "age == 18 or age == 21",
          "not (age < 18)",
          "age > 10 and age < 18",
        ],
        correct: 3,
        explanation:
          "16 is greater than 10 AND less than 18, so both sides of the `and` are True, making the whole expression True.",
      },
      {
        question:
          "What happens if a `while` loop's condition never becomes False?",
        options: [
          "Python automatically exits after 100 repetitions",
          "The loop causes a syntax error before running",
          "The program runs forever — an infinite loop",
          "The else block runs instead",
        ],
        correct: 2,
        explanation:
          "If the while condition stays True indefinitely, Python has no built-in stopping point and will keep executing the loop body until the program is forcibly terminated.",
      },
    ],
  });
  await addModule("Python for Beginners", {
    title: "Functions — Writing Reusable Code",
    description:
      "Learn how to define and call your own functions in Python, pass in data with parameters, get results back with return values, and understand why reusable code is a cornerstone of good programming.",
    orderIndex: 4,
    content: `## What Is a Function?

Imagine you had to write instructions for making a cup of tea every single time someone wanted one. That would be exhausting. Instead, you'd write the instructions once, give them a name — "make tea" — and just refer to that name whenever you need it. That's exactly what a **function** is in Python: a named, reusable block of code that you write once and can run as many times as you like.

## Defining a Function with \`def\`

To create a function in Python, you use the \`def\` keyword, followed by a name, parentheses, and a colon. The code inside must be indented.

\`\`\`python
def greet():
    print("Hello, welcome to Python!")
\`\`\`

Defining a function doesn't run it — it just saves the instructions. To actually execute it, you **call** it by writing its name followed by parentheses:

\`\`\`python
greet()
greet()
greet()
\`\`\`

This prints the greeting three times without you having to rewrite the \`print\` line each time.

## Parameters and Arguments

Functions become far more powerful when you can pass data into them. A **parameter** is a variable you declare inside the function's parentheses — it acts as a placeholder. An **argument** is the actual value you supply when you call the function.

\`\`\`python
def greet(name):
    print("Hello,", name)

greet("Alice")
greet("Bob")
\`\`\`

Here, \`name\` is the parameter and \`"Alice"\` / \`"Bob"\` are the arguments. The same function now works for any name you give it.

You can also define multiple parameters:

\`\`\`python
def add(a, b):
    print(a + b)

add(3, 5)   # prints 8
add(10, 20) # prints 30
\`\`\`

## Return Values

So far our functions just print things. But often you want a function to **compute a result and hand it back** to the rest of your program. You do this with the \`return\` keyword.

\`\`\`python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)        # prints 8
print(add(10, 20))   # prints 30
\`\`\`

Once Python hits \`return\`, the function immediately stops and sends the value back to wherever it was called. You can store that value in a variable, use it in a calculation, or pass it straight into another function.

## Default Parameter Values

You can give a parameter a default value so the function still works even if the caller doesn't supply that argument:

\`\`\`python
def greet(name="stranger"):
    print("Hello,", name)

greet("Alice")   # prints: Hello, Alice
greet()          # prints: Hello, stranger
\`\`\`

## Why Reusable Code Matters

Without functions, every time you needed the same logic you'd copy and paste it. That creates three big problems: your code gets long and hard to read, fixing a bug means hunting down every copy, and small differences between copies cause subtle errors.

Functions solve all three. You write the logic once, give it a meaningful name, and call it wherever you need it. If something needs to change, you update one place and every call benefits instantly.

This principle — writing code once and reusing it — is one of the most important habits in programming. Professional codebases are essentially large collections of well-named, well-organised functions working together. Learning to think in functions now will make every future topic, from data structures to web development, significantly easier to understand.`,
    quizzes: [
      {
        question: "What keyword do you use to define a function in Python?",
        options: ["func", "define", "def", "function"],
        correct: 2,
        explanation:
          "Python uses the `def` keyword to declare a function, followed by the function name and parentheses.",
      },
      {
        question:
          "What is the difference between a parameter and an argument?",
        options: [
          "They are two different names for the same thing",
          "A parameter is the placeholder in the function definition; an argument is the actual value passed when calling it",
          "An argument is the placeholder in the function definition; a parameter is the actual value passed when calling it",
          "Parameters are only used with `return`, arguments are used with `print`",
        ],
        correct: 1,
        explanation:
          "A parameter is the variable name declared in the `def` line, while an argument is the concrete value you supply at the call site.",
      },
      {
        question:
          "What does the `return` keyword do inside a function?",
        options: [
          "It prints the result to the screen",
          "It restarts the function from the beginning",
          "It stops the function and sends a value back to the caller",
          "It defines a new variable inside the function",
        ],
        correct: 2,
        explanation:
          "`return` immediately exits the function and passes the specified value back to wherever the function was called, allowing the result to be stored or used further.",
      },
      {
        question:
          "What will this code output?\n\ndef multiply(x, y=2):\n    return x * y\n\nprint(multiply(5))",
        options: ["5", "2", "10", "Error — missing argument"],
        correct: 2,
        explanation:
          "Since `y` has a default value of 2, calling `multiply(5)` uses x=5 and y=2, returning 5 * 2 = 10.",
      },
      {
        question:
          "Which of the following is the best reason to use functions in your code?",
        options: [
          "Functions make the program run faster by skipping lines",
          "Functions allow you to write logic once and reuse it, making code shorter and easier to maintain",
          "Functions are required by Python — you cannot write a program without them",
          "Functions prevent variables from being created inside a program",
        ],
        correct: 1,
        explanation:
          "The core benefit of functions is reusability — write the logic once, call it anywhere, and update it in a single place if anything changes.",
      },
    ],
  })
  await addModule("Python for Beginners", {
    title: "Lists and Collections — Storing Multiple Values",
    description:
      "Learn how to store and manage multiple values in Python using lists, access items by index, use built-in list methods like append and remove, and loop through a list with a for loop.",
    orderIndex: 5,
    content: `## The Problem with Single Variables

So far, every variable you've seen holds exactly one value — a number, a string, a boolean. But what if you need to store a whole class of student names? Or the prices of every item in a shopping cart? Creating a separate variable for each one would be impractical and messy. Python solves this with **lists**.

## What Is a List?

A list is an ordered collection of values stored under a single variable name. You create one using square brackets, with each item separated by a comma:

\`\`\`python
fruits = ["apple", "banana", "cherry"]
scores = [88, 92, 75, 100, 64]
mixed  = ["Alice", 21, True]
\`\`\`

Lists can hold any data type — strings, numbers, booleans, or even a mix. The order is preserved exactly as you write it.

## Accessing Items by Index

Every item in a list has a numbered position called an **index**, starting at **0**. To retrieve an item, write the list name followed by the index in square brackets:

\`\`\`python
fruits = ["apple", "banana", "cherry"]

print(fruits[0])   # apple
print(fruits[1])   # banana
print(fruits[2])   # cherry
\`\`\`

Python also supports **negative indexing** — \`-1\` always refers to the last item, \`-2\` to the second-last, and so on:

\`\`\`python
print(fruits[-1])  # cherry
print(fruits[-2])  # banana
\`\`\`

Trying to access an index that doesn't exist (e.g. \`fruits[5]\` on a 3-item list) will cause an **IndexError**, so always be mindful of your list's length.

## Common List Methods

Python gives you a set of built-in **methods** — actions you can call directly on a list using dot notation.

**Adding items:**
\`\`\`python
fruits.append("mango")
print(fruits)  # ["apple", "banana", "cherry", "mango"]
\`\`\`
\`append()\` adds one item to the **end** of the list.

**Removing items:**
\`\`\`python
fruits.remove("banana")
print(fruits)  # ["apple", "cherry", "mango"]
\`\`\`
\`remove()\` deletes the **first occurrence** of the value you specify. If the value doesn't exist, Python raises an error.

**Inserting at a position:**
\`\`\`python
fruits.insert(1, "grape")
print(fruits)  # ["apple", "grape", "cherry", "mango"]
\`\`\`
\`insert(index, value)\` places the new item at the given index, shifting everything else to the right.

**Checking the length:**
\`\`\`python
print(len(fruits))  # 4
\`\`\`
\`len()\` returns the total number of items in the list — essential whenever you need to know how big a list is before working with it.

## Iterating Over a List with a For Loop

One of the most common things you'll do with a list is go through every item one by one. A **for loop** handles this cleanly:

\`\`\`python
scores = [88, 92, 75, 100, 64]

for score in scores:
    print("Score:", score)
\`\`\`

On each iteration, the variable \`score\` holds the next item from the list automatically. You can also use \`range(len())\` if you need the index alongside the value:

\`\`\`python
for i in range(len(fruits)):
    print(i, fruits[i])
\`\`\`

## Why Lists Matter

Lists are the foundation of almost every real-world program. A contact list, a leaderboard, a shopping cart, a set of quiz questions — all of these are lists under the hood. Once you're comfortable creating, modifying, and looping through lists, you'll have the tools to build programs that work with data at any scale.`,
    quizzes: [
      {
        question:
          "Given `colors = ['red', 'green', 'blue']`, what does `colors[1]` return?",
        options: ["'red'", "'green'", "'blue'", "An IndexError"],
        correct: 1,
        explanation:
          "List indexing starts at 0, so index 1 refers to the second item in the list, which is 'green'.",
      },
      {
        question:
          "Which method adds a new item to the end of an existing list?",
        options: ["insert()", "add()", "append()", "push()"],
        correct: 2,
        explanation:
          "`append()` is Python's built-in method for adding a single item to the end of a list without affecting any other items.",
      },
      {
        question:
          "What will `len(['a', 'b', 'c', 'd'])` return?",
        options: ["3", "4", "5", "0"],
        correct: 1,
        explanation:
          "`len()` counts the total number of items in the list. The list has four elements — 'a', 'b', 'c', and 'd' — so it returns 4.",
      },
      {
        question:
          "What will this code print?\n\nitems = ['x', 'y', 'z']\nprint(items[-1])",
        options: ["'x'", "'y'", "'z'", "An IndexError"],
        correct: 2,
        explanation:
          "Negative indexing counts from the end of the list, so -1 always refers to the last item, which is 'z'.",
      },
      {
        question:
          "What does `remove()` do if the value you specify does not exist in the list?",
        options: [
          "It does nothing and silently skips",
          "It removes the item at index 0 instead",
          "It raises a ValueError",
          "It removes the last item in the list",
        ],
        correct: 2,
        explanation:
          "If the specified value is not found, Python raises a `ValueError` — so it's good practice to check whether an item exists before calling `remove()`.",
      },
    ],
  })
  await addModule("Python for Beginners", {
    title: "Dictionaries — Storing Key-Value Data",
    description:
      "Learn how to store and retrieve data using named keys with Python dictionaries, update and add entries, loop through keys and values, and know when a dictionary is the right tool over a list.",
    orderIndex: 6,
    content: `## The Limits of Lists

Lists are great when you have an ordered collection of similar items — a row of scores, a queue of names. But imagine storing a student's profile: their name, age, course, and GPA. In a list you'd have to remember that index 0 is the name, index 1 is the age, and so on. That's fragile and hard to read. Python's **dictionary** solves this by letting you label every piece of data with a meaningful name.

## What Is a Dictionary?

A dictionary stores data as **key-value pairs**. Instead of a numbered position, each value has a descriptive **key** you choose yourself. You create a dictionary with curly braces:

\`\`\`python
student = {
    "name": "Alice",
    "age": 20,
    "course": "Computer Science",
    "gpa": 3.8
}
\`\`\`

Each entry is written as \`key: value\`, separated by commas. Keys are almost always strings, and values can be any data type — numbers, strings, booleans, even other lists or dictionaries.

## Accessing Values

To retrieve a value, write the dictionary name followed by the key in square brackets:

\`\`\`python
print(student["name"])    # Alice
print(student["gpa"])     # 3.8
\`\`\`

If you use a key that doesn't exist, Python raises a **KeyError**. A safer alternative is the \`.get()\` method, which returns \`None\` instead of crashing:

\`\`\`python
print(student.get("grade"))     # None
print(student.get("grade", "N/A"))  # N/A
\`\`\`

The second argument to \`.get()\` is an optional default value returned when the key is missing.

## Adding and Updating Values

Dictionaries are **mutable** — you can change them after creation. Assigning to an existing key updates it; assigning to a new key creates it:

\`\`\`python
student["gpa"] = 3.9          # update existing value
student["year"] = 2            # add a new key-value pair

print(student["gpa"])          # 3.9
print(student["year"])         # 2
\`\`\`

To remove an entry entirely, use the \`del\` keyword:

\`\`\`python
del student["year"]
\`\`\`

## Looping Through a Dictionary

You can iterate over a dictionary in several ways depending on what you need.

**Loop through keys only (default):**
\`\`\`python
for key in student:
    print(key)
\`\`\`

**Loop through values only:**
\`\`\`python
for value in student.values():
    print(value)
\`\`\`

**Loop through both keys and values together:**
\`\`\`python
for key, value in student.items():
    print(key, ":", value)
\`\`\`

The \`.items()\` method is the most commonly used — it gives you both pieces of information on every iteration, which is usually what you need.

## Dictionary vs List — When to Use Which

The choice comes down to one question: **does the order and position of the data matter, or does the label matter?**

Use a **list** when you have a sequence of similar items where position is meaningful — exam scores, a queue of tasks, a playlist.

Use a **dictionary** when each piece of data has a distinct identity and you want to look it up by name — a user profile, a product catalogue entry, configuration settings.

A practical rule of thumb: if you find yourself writing comments like \`# index 0 is the name, index 2 is the age\` to keep track of a list, that data belongs in a dictionary.

## Why Dictionaries Matter

Dictionaries are one of the most widely used data structures in real-world Python. Web APIs return data as dictionaries (called JSON), databases map column names to values, and configuration files are structured as key-value pairs. Getting comfortable with dictionaries now means you'll be ready to work with real data the moment you move beyond the basics.`,
    quizzes: [
      {
        question:
          "How do you access the value associated with the key `'age'` in a dictionary called `person`?",
        options: [
          "person(age)",
          "person.age",
          "person['age']",
          "person->age",
        ],
        correct: 2,
        explanation:
          "Dictionary values are accessed using square bracket notation with the key name as a string, i.e. `person['age']`.",
      },
      {
        question:
          "What happens if you assign a value to a key that already exists in a dictionary?",
        options: [
          "Python raises a KeyError",
          "A duplicate entry is created alongside the original",
          "The existing value is overwritten with the new one",
          "Python ignores the assignment silently",
        ],
        correct: 2,
        explanation:
          "Dictionaries do not allow duplicate keys — assigning to an existing key simply replaces its current value with the new one.",
      },
      {
        question:
          "What does the `.get()` method return when the specified key does not exist in the dictionary?",
        options: [
          "It raises a KeyError",
          "It returns 0",
          "It returns an empty string",
          "It returns None by default",
        ],
        correct: 3,
        explanation:
          "Unlike square bracket access, `.get()` returns `None` when the key is missing (or a custom default if you provide one), avoiding a KeyError crash.",
      },
      {
        question:
          "Which method lets you loop through both keys and values of a dictionary at the same time?",
        options: [".keys()", ".values()", ".items()", ".pairs()"],
        correct: 2,
        explanation:
          "`.items()` returns each entry as a (key, value) tuple, allowing you to unpack both in a single `for` loop with `for key, value in dict.items()`.",
      },
      {
        question:
          "A student record stores a name, age, and GPA under labelled fields. Which data structure is most appropriate?",
        options: [
          "A list, because lists can store multiple values",
          "A dictionary, because each value has a distinct label and is looked up by name",
          "A list, because the data is ordered by importance",
          "A dictionary is only suitable for numeric data",
        ],
        correct: 1,
        explanation:
          "When each piece of data has a meaningful name and is accessed by that label rather than by position, a dictionary is the right choice over a list.",
      },
    ],
  })
  await addModule("Python for Beginners", {
    title: "Working with Files — Reading and Writing Data",
    description:
      "Learn how to make your Python programs interact with the file system — opening, reading, and writing text files using open(), read(), readlines(), write(), and the with statement for safe file handling.",
    orderIndex: 7,
    content: `## Why File Handling Matters

Every program you've written so far forgets everything the moment it stops running. Variables live in memory — when the program ends, they disappear. **File handling** is how you give your program a lasting memory. Whether it's saving a user's high score, reading a list of names from a spreadsheet, or logging errors for later review, files are how data survives beyond a single run.

## Opening a File with \`open()\`

Before you can read from or write to a file, you need to open it. Python's built-in \`open()\` function takes two main arguments: the **filename** and the **mode**.

\`\`\`python
f = open("notes.txt", "r")
\`\`\`

The mode tells Python what you intend to do with the file:

- \`"r"\` — **read** an existing file (default if you omit the mode)
- \`"w"\` — **write** to a file, creating it if it doesn't exist and erasing it if it does
- \`"a"\` — **append** new content to the end of an existing file without erasing it
- \`"x"\` — **create** a new file, failing if it already exists

Choosing the wrong mode is a common mistake — opening with \`"w"\` when you meant \`"a"\` will silently wipe your file.

## Reading Files

Once a file is open in read mode, you have two main options.

**Read the entire file as one string:**
\`\`\`python
f = open("notes.txt", "r")
content = f.read()
print(content)
f.close()
\`\`\`

**Read line by line into a list:**
\`\`\`python
f = open("notes.txt", "r")
lines = f.readlines()
for line in lines:
    print(line)
f.close()
\`\`\`

\`read()\` is convenient when you want the whole file at once. \`readlines()\` is better when the file has structured rows — like a list of names or CSV data — and you want to process each line separately. Note that each line will include a \`\\n\` newline character at the end; you can strip it with \`line.strip()\`.

## Writing to Files

Opening a file in write mode and calling \`write()\` lets you save data permanently:

\`\`\`python
f = open("output.txt", "w")
f.write("Hello, file!\\n")
f.write("Second line.\\n")
f.close()
\`\`\`

Unlike \`print()\`, \`write()\` does not add a newline automatically — you must include \`\\n\` yourself wherever you want a line break. If you want to add to an existing file without overwriting it, use \`"a"\` (append) mode instead.

## Closing Files and the \`with\` Statement

Calling \`f.close()\` after you're done is important — it flushes any unwritten data and frees up the system resource. Forgetting to close a file can cause data loss or lock the file from other programs.

Python offers a cleaner, safer approach with the **\`with\` statement**, which closes the file automatically when the block ends — even if an error occurs:

\`\`\`python
with open("notes.txt", "r") as f:
    content = f.read()
    print(content)
# file is automatically closed here
\`\`\`

The \`with\` statement is the recommended way to handle files in Python. It eliminates the risk of forgetting \`close()\` and makes your code shorter and easier to read. Whenever you work with files, default to \`with\` — only fall back to manual \`open()\` and \`close()\` if you have a specific reason.

## Putting It Together

File handling bridges your Python programs to the real world. Reading a file lets you load data that was saved earlier or prepared by someone else. Writing to a file lets your program produce results that outlast the session. Combined with what you already know about loops and lists, you can now read a file of names, process each one, and write the results to a new file — a pattern that appears constantly in data processing, automation, and software development.`,
    quizzes: [
      {
        question:
          "Which mode should you use with `open()` to add new content to an existing file without erasing what is already there?",
        options: ['"r"', '"w"', '"a"', '"x"'],
        correct: 2,
        explanation:
          'Append mode `"a"` adds new content to the end of the file while preserving everything already in it, whereas `"w"` would overwrite the file from scratch.',
      },
      {
        question:
          "What is the key advantage of using a `with` statement when working with files?",
        options: [
          "It makes the file read faster",
          "It automatically closes the file when the block ends, even if an error occurs",
          "It allows you to open multiple files with a single line",
          "It converts the file content to a list automatically",
        ],
        correct: 1,
        explanation:
          "The `with` statement acts as a context manager — it guarantees the file is closed as soon as the indented block exits, preventing data loss or resource leaks.",
      },
      {
        question:
          "What does `readlines()` return when called on an open file?",
        options: [
          "A single string containing the entire file content",
          "The number of lines in the file",
          "A list where each element is one line from the file",
          "Only the first line of the file",
        ],
        correct: 2,
        explanation:
          "`readlines()` reads the entire file and returns it as a list of strings, one string per line, each typically ending with a `\\n` newline character.",
      },
      {
        question:
          "You run this code twice in a row:\n\nf = open('log.txt', 'w')\nf.write('Entry\\n')\nf.close()\n\nWhat does `log.txt` contain after the second run?",
        options: [
          "Two lines — 'Entry' written twice",
          "One line — 'Entry', because write mode overwrites the file each time",
          "An error, because the file already exists",
          "An empty file, because write mode clears without writing",
        ],
        correct: 1,
        explanation:
          'Opening a file in `"w"` mode erases all existing content before writing, so the second run replaces the first entry rather than appending to it.',
      },
      {
        question:
          "Why must you include `'\\n'` manually when using `write()`?",
        options: [
          "Because `write()` does not add a newline character automatically, unlike `print()`",
          "Because `\\n` is required syntax for all Python string operations",
          "Because files cannot store spaces, only newline characters",
          "Because `write()` only accepts single characters at a time",
        ],
        correct: 0,
        explanation:
          "`print()` automatically appends a newline at the end of its output, but `write()` writes exactly what you give it — no newline is added unless you explicitly include `\\n` in the string.",
      },
    ],
  })
  await addModule("Python for Beginners", {
    title: "Putting It All Together — Your First Real Python Program",
    description:
      "Apply everything you've learned — dictionaries, functions, loops, and file handling — to plan and build a complete student grade tracker that stores names and scores, calculates averages, and saves results to a file.",
    orderIndex: 8,
    content: `## From Exercises to Real Programs

Every concept you've learned so far — variables, control flow, functions, lists, dictionaries, and file handling — was a individual tool. Real programs are what happen when those tools work together. In this module you'll build a complete, working Python program from scratch: a **student grade tracker** that stores names and scores, calculates averages, and saves a report to a file.

The goal isn't just to produce working code. It's to practice the way programmers actually think: plan first, build in layers, and make deliberate decisions at each step.

## Step 1 — Plan Before You Type

Before writing a single line, ask: *what does this program need to do?*

1. Store student names and their list of scores
2. Calculate each student's average score
3. Print a summary to the screen
4. Save that summary to a text file

This gives us a clear checklist. We know we'll need a **dictionary** (names mapped to score lists), a **function** (to calculate averages), a **loop** (to process every student), and **file handling** (to save the report).

## Step 2 — Store the Data

A dictionary where each key is a student name and each value is a list of scores is the natural fit here:

\`\`\`python
grades = {
    "Alice": [88, 92, 79, 95],
    "Bob":   [70, 65, 80, 74],
    "Carol": [95, 98, 100, 92]
}
\`\`\`

We chose a dictionary over a list because each dataset belongs to a named student — label matters more than position.

## Step 3 — Write a Function to Calculate the Average

Rather than repeating the calculation for every student, we write it once as a function:

\`\`\`python
def calculate_average(scores):
    return sum(scores) / len(scores)
\`\`\`

\`sum()\` adds all the numbers in a list. \`len()\` counts how many there are. Dividing one by the other gives the mean. Wrapping this in a function means we can call it cleanly for every student without rewriting the logic.

## Step 4 — Loop Through Every Student

Now we combine the dictionary and the function inside a loop to produce a result for each student:

\`\`\`python
for name, scores in grades.items():
    avg = calculate_average(scores)
    print(f"{name}: {avg:.1f}")
\`\`\`

The \`f"..."\` syntax is called an **f-string** — it lets you embed variables directly inside a string. The \`:.1f\` part formats the number to one decimal place, keeping the output clean and readable.

## Step 5 — Save the Report to a File

Finally, we write the same results to a text file so the report persists after the program ends:

\`\`\`python
with open("grade_report.txt", "w") as f:
    f.write("Student Grade Report\\n")
    f.write("=" * 24 + "\\n")
    for name, scores in grades.items():
        avg = calculate_average(scores)
        f.write(f"{name}: {avg:.1f}\\n")
\`\`\`

We use \`"w"\` mode because we want a fresh report every run. The \`with\` statement ensures the file closes safely. The \`"=" * 24\` is a quick trick — multiplying a string by a number repeats it, producing a clean divider line.

## The Complete Program

\`\`\`python
grades = {
    "Alice": [88, 92, 79, 95],
    "Bob":   [70, 65, 80, 74],
    "Carol": [95, 98, 100, 92]
}

def calculate_average(scores):
    return sum(scores) / len(scores)

with open("grade_report.txt", "w") as f:
    f.write("Student Grade Report\\n")
    f.write("=" * 24 + "\\n")
    for name, scores in grades.items():
        avg = calculate_average(scores)
        line = f"{name}: {avg:.1f}"
        print(line)
        f.write(line + "\\n")
\`\`\`

Twenty lines. No module imports. No advanced concepts. Just the fundamentals working together.

## What You've Proven

This program is small, but it's real. It takes structured input, processes it with logic, and produces a persistent output — the same pattern used in data pipelines, reporting tools, and backend systems at any scale. The concepts don't change as programs grow larger; the programs just have more of them.`,
    quizzes: [
      {
        question:
          "Why is a dictionary used to store student grades instead of a plain list in this program?",
        options: [
          "Because dictionaries are faster than lists in Python",
          "Because each set of scores belongs to a named student, making label-based lookup more meaningful than positional indexing",
          "Because lists cannot store other lists inside them",
          "Because dictionaries automatically sort the data alphabetically",
        ],
        correct: 1,
        explanation:
          "When data has a natural label — like a student's name — a dictionary makes the structure self-documenting and avoids the fragility of remembering which index corresponds to which student.",
      },
      {
        question:
          "What does `sum(scores) / len(scores)` calculate?",
        options: [
          "The highest score in the list",
          "The total number of scores multiplied by the first score",
          "The arithmetic mean (average) of all scores in the list",
          "The difference between the largest and smallest score",
        ],
        correct: 2,
        explanation:
          "`sum()` adds all values in the list and `len()` counts how many there are — dividing the total by the count gives the arithmetic mean, which is the average.",
      },
      {
        question:
          "What does the `:.1f` format specifier do inside an f-string?",
        options: [
          "It converts the number to an integer by removing the decimal",
          "It formats the number to exactly one decimal place",
          "It multiplies the number by 1.0 before printing",
          "It left-aligns the number in a field of width 1",
        ],
        correct: 1,
        explanation:
          "In Python f-strings, `:.1f` is a format code meaning 'fixed-point notation with 1 digit after the decimal point', keeping output consistent and readable.",
      },
      {
        question:
          "The program opens `grade_report.txt` in `'w'` mode on every run. What is the consequence of this?",
        options: [
          "Each run appends a new report below the previous one",
          "The file is locked after the first run and cannot be written again",
          "Each run overwrites the file with a fresh report, discarding the previous one",
          "Python raises an error if the file already exists",
        ],
        correct: 2,
        explanation:
          "Write mode `'w'` erases all existing content each time the file is opened, so every run of the program produces a clean, current report rather than accumulating old ones.",
      },
      {
        question:
          "What is the result of `'=' * 24` in Python?",
        options: [
          "The number 24 multiplied by the ASCII value of '='",
          "A syntax error — strings cannot be multiplied",
          "The integer 24 converted to the string '24='",
          "A string of 24 equals signs: '========================'",
        ],
        correct: 3,
        explanation:
          "Python's string repetition operator `*` repeats a string a given number of times, so `'=' * 24` produces a string of exactly 24 equals signs — a convenient way to draw a divider line.",
      },
    ],
  })
  await addModule("Productivity and Learning Systems", {
    title: "The Science of Spaced Repetition",
    description:
      "Understand why you forget information and how spaced repetition systematically fights back — using the forgetting curve, optimal review intervals, and a practical schedule you can follow without any special software.",
    orderIndex: 2,
    content: `## Why You Forget Almost Everything

You study hard for a lecture, understand the material, and feel confident. Three days later, you can barely recall half of it. A week later, most of it is gone. This isn't a personal failing — it's a predictable biological process, and understanding it is the first step to defeating it.

In the 1880s, German psychologist Hermann Ebbinghaus conducted experiments on his own memory and plotted what he found as the **forgetting curve**: a graph showing that memory retention drops rapidly after initial learning, then levels off. Without any review, you forget roughly 50% of new information within a day, and up to 70–80% within a week. The curve is steep, but it has one crucial property — it flattens every time you successfully recall the information.

## What Spaced Repetition Does

**Spaced repetition** is a study technique that exploits the forgetting curve by scheduling reviews at the exact moments your memory is starting to fade. Instead of reviewing material every day (wasteful — the memory is still strong) or never reviewing it at all (fatal — the memory disappears), you review it just before you would forget it.

Each successful review does two things: it restores your retention back toward 100%, and it makes the forgetting curve shallower for that piece of information going forward. In practical terms, this means the gaps between reviews can grow progressively longer. Something you just learned needs review tomorrow. Something you've reviewed four times successfully might not need another review for a month.

This is why spaced repetition is dramatically more efficient than massed practice — the colloquial "cramming." Cramming concentrates all your study into one session, which produces strong short-term recall but almost no long-term retention. Spaced repetition distributes the same total study time across weeks, producing retention that lasts for months or years.

## The Optimal Review Intervals

Research into spaced repetition suggests a general pattern for new information that you want to retain long-term:

- **First review:** 1 day after initial learning
- **Second review:** 3 days after the first review
- **Third review:** 1 week after the second review
- **Fourth review:** 2 weeks after the third review
- **Fifth review:** 1 month after the fourth review

These intervals are not rigid rules — they are starting points. If you struggle to recall something during a review, shorten the next interval. If recall is effortless, you can safely extend it. The principle is consistent: space the reviews out, and let successful recall be the signal to increase the gap.

## Applying Spaced Repetition Without Software

You do not need an app to use spaced repetition. A simple paper-based system works well for most students.

**The index card method:** Write one concept per card — question on the front, answer on the back. Organise cards into five labelled sections or boxes: *Today, 3 Days, 1 Week, 2 Weeks, 1 Month*. When you answer a card correctly, move it to the next box. When you answer incorrectly, move it back to the *Today* box. Each study session, you only review the cards due in that day's box.

**The calendar method:** After each lecture, write the topic in your calendar on the review dates — tomorrow, in 3 days, in a week, in two weeks. When the date arrives, spend 10 minutes actively recalling the material before checking your notes.

The key word in both methods is **active** — you must try to recall the information before looking at the answer. Passive re-reading does not trigger the memory strengthening that makes spaced repetition work.

## Why This Changes How You Study

Most students treat studying as a single event before an exam. Spaced repetition reframes it as an ongoing, low-effort maintenance process. Ten minutes of active recall spread across five sessions over a month requires less total effort than two hours of cramming — and produces retention that survives well past the exam. Start applying review schedules from the first week of semester, and by the time exams arrive, most of the work is already done.`,
    quizzes: [
      {
        question:
          "What does the forgetting curve describe?",
        options: [
          "The relationship between study time and exam grades",
          "The rate at which memory retention drops after initial learning",
          "The number of repetitions needed to memorise a new word",
          "The difference in retention between visual and verbal learners",
        ],
        correct: 1,
        explanation:
          "The forgetting curve, plotted by Ebbinghaus, shows that memory retention declines rapidly after learning and then levels off — with roughly 50% forgotten within a day if no review occurs.",
      },
      {
        question:
          "What happens to the forgetting curve each time you successfully recall a piece of information?",
        options: [
          "It resets to the original steep slope as if you just learned it",
          "It disappears entirely and the information is permanently memorised",
          "It becomes shallower, meaning retention declines more slowly afterward",
          "It steepens, making the next review more urgent",
        ],
        correct: 2,
        explanation:
          "Each successful retrieval flattens the forgetting curve for that item, which is why spaced repetition progressively extends the intervals between reviews — the memory becomes more durable with each successful recall.",
      },
      {
        question:
          "Why is cramming less effective than spaced repetition for long-term retention?",
        options: [
          "Cramming uses more total study hours than spaced repetition",
          "Cramming only works for visual learners",
          "Cramming concentrates all study into one session, producing strong short-term but poor long-term retention",
          "Cramming prevents the formation of new memories due to cognitive overload",
        ],
        correct: 2,
        explanation:
          "Massed practice (cramming) floods short-term memory and produces high immediate recall, but without spaced reviews the information follows the forgetting curve and is largely lost within days.",
      },
      {
        question:
          "According to the suggested review schedule, when should you conduct your second review of new material?",
        options: [
          "The same day, immediately after the first review",
          "1 day after the initial learning session",
          "3 days after the first review",
          "1 week after the initial learning session",
        ],
        correct: 2,
        explanation:
          "The recommended schedule places the second review 3 days after the first review (which itself occurs 1 day after initial learning), giving the memory time to weaken slightly before being reinforced.",
      },
      {
        question:
          "In the index card box method, what should you do with a card you answer incorrectly during a review session?",
        options: [
          "Remove it from the system and rewrite it from scratch",
          "Move it back to the Today box so it is reviewed again soon",
          "Move it forward two boxes to increase the challenge",
          "Leave it in its current box and try again next session",
        ],
        correct: 1,
        explanation:
          "A wrong answer signals that the memory has faded too much — moving the card back to the Today box shortens the interval and schedules an immediate re-review, mimicking the adaptive logic of spaced repetition software.",
      },
    ],
  })
await addModule("Productivity and Learning Systems", {
    title: "The Science of Spaced Repetition",
    description:
      "Understand why you forget information and how spaced repetition systematically fights back — using the forgetting curve, optimal review intervals, and a practical schedule you can follow without any special software.",
    orderIndex: 2,
    content: `## Why You Forget Almost Everything

You study hard for a lecture, understand the material, and feel confident. Three days later, you can barely recall half of it. A week later, most of it is gone. This isn't a personal failing — it's a predictable biological process, and understanding it is the first step to defeating it.

In the 1880s, German psychologist Hermann Ebbinghaus conducted experiments on his own memory and plotted what he found as the **forgetting curve**: a graph showing that memory retention drops rapidly after initial learning, then levels off. Without any review, you forget roughly 50% of new information within a day, and up to 70–80% within a week. The curve is steep, but it has one crucial property — it flattens every time you successfully recall the information.

## What Spaced Repetition Does

**Spaced repetition** is a study technique that exploits the forgetting curve by scheduling reviews at the exact moments your memory is starting to fade. Instead of reviewing material every day (wasteful — the memory is still strong) or never reviewing it at all (fatal — the memory disappears), you review it just before you would forget it.

Each successful review does two things: it restores your retention back toward 100%, and it makes the forgetting curve shallower for that piece of information going forward. In practical terms, this means the gaps between reviews can grow progressively longer. Something you just learned needs review tomorrow. Something you've reviewed four times successfully might not need another review for a month.

This is why spaced repetition is dramatically more efficient than massed practice — the colloquial "cramming." Cramming concentrates all your study into one session, which produces strong short-term recall but almost no long-term retention. Spaced repetition distributes the same total study time across weeks, producing retention that lasts for months or years.

## The Optimal Review Intervals

Research into spaced repetition suggests a general pattern for new information that you want to retain long-term:

- **First review:** 1 day after initial learning
- **Second review:** 3 days after the first review
- **Third review:** 1 week after the second review
- **Fourth review:** 2 weeks after the third review
- **Fifth review:** 1 month after the fourth review

These intervals are not rigid rules — they are starting points. If you struggle to recall something during a review, shorten the next interval. If recall is effortless, you can safely extend it. The principle is consistent: space the reviews out, and let successful recall be the signal to increase the gap.

## Applying Spaced Repetition Without Software

You do not need an app to use spaced repetition. A simple paper-based system works well for most students.

**The index card method:** Write one concept per card — question on the front, answer on the back. Organise cards into five labelled sections or boxes: *Today, 3 Days, 1 Week, 2 Weeks, 1 Month*. When you answer a card correctly, move it to the next box. When you answer incorrectly, move it back to the *Today* box. Each study session, you only review the cards due in that day's box.

**The calendar method:** After each lecture, write the topic in your calendar on the review dates — tomorrow, in 3 days, in a week, in two weeks. When the date arrives, spend 10 minutes actively recalling the material before checking your notes.

The key word in both methods is **active** — you must try to recall the information before looking at the answer. Passive re-reading does not trigger the memory strengthening that makes spaced repetition work.

## Why This Changes How You Study

Most students treat studying as a single event before an exam. Spaced repetition reframes it as an ongoing, low-effort maintenance process. Ten minutes of active recall spread across five sessions over a month requires less total effort than two hours of cramming — and produces retention that survives well past the exam. Start applying review schedules from the first week of semester, and by the time exams arrive, most of the work is already done.`,
    quizzes: [
      {
        question:
          "What does the forgetting curve describe?",
        options: [
          "The relationship between study time and exam grades",
          "The rate at which memory retention drops after initial learning",
          "The number of repetitions needed to memorise a new word",
          "The difference in retention between visual and verbal learners",
        ],
        correct: 1,
        explanation:
          "The forgetting curve, plotted by Ebbinghaus, shows that memory retention declines rapidly after learning and then levels off — with roughly 50% forgotten within a day if no review occurs.",
      },
      {
        question:
          "What happens to the forgetting curve each time you successfully recall a piece of information?",
        options: [
          "It resets to the original steep slope as if you just learned it",
          "It disappears entirely and the information is permanently memorised",
          "It becomes shallower, meaning retention declines more slowly afterward",
          "It steepens, making the next review more urgent",
        ],
        correct: 2,
        explanation:
          "Each successful retrieval flattens the forgetting curve for that item, which is why spaced repetition progressively extends the intervals between reviews — the memory becomes more durable with each successful recall.",
      },
      {
        question:
          "Why is cramming less effective than spaced repetition for long-term retention?",
        options: [
          "Cramming uses more total study hours than spaced repetition",
          "Cramming only works for visual learners",
          "Cramming concentrates all study into one session, producing strong short-term but poor long-term retention",
          "Cramming prevents the formation of new memories due to cognitive overload",
        ],
        correct: 2,
        explanation:
          "Massed practice (cramming) floods short-term memory and produces high immediate recall, but without spaced reviews the information follows the forgetting curve and is largely lost within days.",
      },
      {
        question:
          "According to the suggested review schedule, when should you conduct your second review of new material?",
        options: [
          "The same day, immediately after the first review",
          "1 day after the initial learning session",
          "3 days after the first review",
          "1 week after the initial learning session",
        ],
        correct: 2,
        explanation:
          "The recommended schedule places the second review 3 days after the first review (which itself occurs 1 day after initial learning), giving the memory time to weaken slightly before being reinforced.",
      },
      {
        question:
          "In the index card box method, what should you do with a card you answer incorrectly during a review session?",
        options: [
          "Remove it from the system and rewrite it from scratch",
          "Move it back to the Today box so it is reviewed again soon",
          "Move it forward two boxes to increase the challenge",
          "Leave it in its current box and try again next session",
        ],
        correct: 1,
        explanation:
          "A wrong answer signals that the memory has faded too much — moving the card back to the Today box shortens the interval and schedules an immediate re-review, mimicking the adaptive logic of spaced repetition software.",
      },
    ],
  })
  await addModule("Productivity and Learning Systems", {
    title: "Procrastination — Understanding and Overcoming It",
    description:
      "Discover what procrastination really is at a psychological level, why willpower fails as a solution, how task aversion and emotional regulation drive delay, and three evidence-based strategies that reliably reduce it.",
    orderIndex: 4,
    content: `## What Procrastination Actually Is

Most people think procrastination is a time management problem — a failure to prioritise, schedule, or discipline yourself. This framing leads directly to bad solutions: more to-do lists, tighter schedules, stern self-talk. None of them work reliably, because they misdiagnose the problem.

Procrastination is not a time management problem. It is an **emotion regulation problem**. Research by psychologist Fuschia Sirois and others has consistently shown that procrastination is driven by the desire to avoid negative feelings associated with a task — boredom, anxiety, self-doubt, frustration, or fear of failure. When you delay starting an essay, you are not failing to manage your time. You are successfully — if temporarily — managing your discomfort.

The immediate relief of switching to something easier is real and reinforcing. The cost of that relief is paid later, with interest, in the form of deadline panic and compounded stress.

## Why Willpower Is Not the Solution

The instinctive response to procrastination is to try harder — to force yourself through the discomfort using sheer willpower. This occasionally works in the short term, but it is not a reliable strategy for two reasons.

First, willpower is a **depleting resource**. The more decisions and self-regulatory efforts you make throughout the day, the less capacity you have for the next one. Trying to override task aversion with willpower is drawing from a limited account that other demands are already spending.

Second, willpower does nothing to address the **source** of the problem. If a task triggers anxiety, forcing yourself to sit in front of it while anxious does not reduce the anxiety — it can reinforce the association between the task and discomfort. The next time the task appears, the aversion may be even stronger.

## Task Aversion and Emotional Regulation

The mechanism behind procrastination is straightforward: the brain registers a task as unpleasant, generates a negative emotional signal, and you respond by moving toward something that feels better. This is not laziness — it is the brain doing exactly what it is designed to do, which is move away from discomfort and toward relief.

The factor that best predicts whether someone procrastinates on a task is not how difficult it is or how long it takes — it is how **aversive** it feels. Unpleasant tasks get delayed regardless of their importance. Enjoyable tasks get done regardless of their urgency.

This means the most effective interventions don't target effort or time — they target the emotional experience of starting.

## Three Evidence-Based Strategies

**1. The Two-Minute Start**
The hardest part of any aversive task is the transition into it. Commit only to working on the task for two minutes — not the whole task, just the beginning. Open the document. Write one sentence. Read one paragraph. The two-minute limit removes the psychological weight of the full task, and in most cases momentum takes over once you have started. This works because task aversion is strongest before you begin and typically weakens once engagement is underway.

**2. Shrink the Task Until It Feels Unthreatening**
Vague, large tasks generate the most aversion because the brain cannot identify a clear starting point. "Write my assignment" is threatening. "Write the first sentence of my introduction" is not. Break any procrastinated task into the smallest possible concrete next action — not a project, not a goal, but a single physical behaviour that takes less than five minutes. The specificity removes ambiguity, and the smallness removes the emotional charge.

**3. Self-Compassion Over Self-Criticism**
Research by Kristin Neff and Michael Inzlicht demonstrates that self-criticism after procrastinating makes future procrastination more likely, not less. Guilt and shame increase the negative emotion associated with the task, strengthening the very aversion that caused the delay. Self-compassion — acknowledging that avoidance is a normal human response without harsh judgment — breaks this cycle. Students who forgave themselves for procrastinating on one exam were significantly less likely to procrastinate on the next one. Treating yourself with the same understanding you would offer a friend is not an excuse for poor behaviour; it is a proven mechanism for improving it.

## The Practical Takeaway

Procrastination is not a character flaw to be conquered by force. It is a predictable emotional response to be managed with the right tools. Reduce the aversion at the start, shrink the task to its smallest concrete form, and respond to setbacks with self-compassion rather than self-criticism. These three adjustments address the actual mechanism — and that is why they work when willpower alone does not.`,
    quizzes: [
      {
        question:
          "According to psychological research, procrastination is best classified as which type of problem?",
        options: [
          "A time management problem caused by poor scheduling",
          "An emotion regulation problem driven by the desire to avoid negative feelings",
          "A cognitive problem caused by difficulty understanding tasks",
          "A motivational problem caused by not caring about outcomes",
        ],
        correct: 1,
        explanation:
          "Research by Sirois and others reframes procrastination as an emotion regulation problem — people delay tasks primarily to escape the discomfort those tasks trigger, not because they fail to manage their time.",
      },
      {
        question:
          "Why is relying on willpower an unreliable long-term strategy for overcoming procrastination?",
        options: [
          "Because willpower only works for physical tasks, not mental ones",
          "Because willpower is a depleting resource and does not address the emotional source of the avoidance",
          "Because using willpower increases anxiety and makes tasks harder to start",
          "Because willpower is only effective when combined with external rewards",
        ],
        correct: 1,
        explanation:
          "Willpower depletes with use throughout the day and treats only the symptom — it overrides the discomfort temporarily but does nothing to reduce the underlying task aversion that caused the delay.",
      },
      {
        question:
          "According to the module, what factor best predicts whether someone will procrastinate on a task?",
        options: [
          "How long the task is estimated to take",
          "How important the task is to their final grade",
          "How aversive — unpleasant or uncomfortable — the task feels",
          "How recently they completed a similar task",
        ],
        correct: 2,
        explanation:
          "Task aversion is the strongest predictor of procrastination — unpleasant tasks get delayed regardless of their importance or urgency, while enjoyable tasks get completed regardless of their deadlines.",
      },
      {
        question:
          "What is the core mechanism behind the Two-Minute Start strategy?",
        options: [
          "It trains the brain to associate tasks with short bursts of reward",
          "It removes the psychological weight of the full task by committing only to beginning, allowing momentum to take over",
          "It works by making the brain believe the task is already complete",
          "It eliminates distractions by restricting all other activity to two minutes",
        ],
        correct: 1,
        explanation:
          "Task aversion peaks before starting and typically fades once engagement begins — committing only to a two-minute start bypasses the emotional barrier of the full task, and momentum usually carries the work forward.",
      },
      {
        question:
          "What did research by Neff and Inzlicht find about self-criticism following procrastination?",
        options: [
          "It motivates students to work harder on the next task to compensate",
          "It has no measurable effect on future procrastination behaviour",
          "It increases task aversion and makes future procrastination more likely",
          "It is only harmful when combined with external pressure from others",
        ],
        correct: 2,
        explanation:
          "Self-criticism after procrastinating amplifies the negative emotions tied to the task, strengthening the very aversion that caused the delay — whereas self-compassion breaks the cycle and reduces subsequent procrastination.",
      },
    ],
  })
  await addModule("Productivity and Learning Systems", {
    title: "Goal Setting That Produces Results",
    description:
      "Learn why vague goals fail, how to distinguish outcome goals from process goals, how to write goals that are specific and time-bound, and how to link daily actions to long-term outcomes so your motivation stays consistent.",
    orderIndex: 5,
    content: `## Why Vague Goals Fail

At the start of every semester, most students set goals. "I want to do better this year." "I'm going to study more." "I'll get my assignments done early." These feel meaningful in the moment — and fail almost immediately in practice.

The problem is not the intention. The problem is the absence of any information the brain can act on. A vague goal like "study more" cannot be executed because it contains no answer to the questions that actually matter: more than what? Starting when? For how long? On which subject? Without those answers, the goal is not a plan — it is a wish. And wishes do not produce behaviour.

Research on goal setting consistently shows that specificity is the single most important quality of an actionable goal. A goal your brain cannot picture in concrete terms is a goal your brain cannot pursue.

## Outcome Goals vs Process Goals

Before writing better goals, it helps to understand what type of goal you are actually setting.

An **outcome goal** describes a result you want to achieve — a destination. "Pass my statistics exam with a B or higher." "Submit all assignments before their deadlines this semester." Outcome goals are motivating because they give you something meaningful to aim for, but they have a critical weakness: you cannot directly control outcomes. Exam results depend on the paper you're given, the marking scheme, how you feel on the day. Staring at an outcome goal when the outcome feels out of reach is a reliable way to disengage.

A **process goal** describes a behaviour you will perform — a daily or weekly action entirely within your control. "Review my statistics notes for 20 minutes every Tuesday and Thursday." "Draft each assignment at least three days before the deadline." Process goals keep you focused on what you can actually do, regardless of what the outcome turns out to be.

The most effective goal systems use both in combination: outcome goals to set the direction and sustain meaning, process goals to determine what you actually do each day.

## Writing Goals That Are Specific and Time-Bound

A well-formed goal answers five questions: **What** exactly will you do? **How much** or for how long? **When** will you do it? **Where** will you do it? And **by when** does it need to be achieved?

Compare these two versions of the same goal:

**Vague:** "I want to get better at essay writing."

**Specific and time-bound:** "I will write one practice essay introduction every Sunday morning at 9am for the next four weeks, and ask my tutor for feedback on at least two of them by Week 6."

The second version is actionable because every ambiguity has been resolved. There is no decision to make when Sunday morning arrives — the plan is already complete. This is the same principle as implementation intentions from the previous module: the situation triggers the behaviour automatically.

When setting time-bound goals, distinguish between a **deadline** (the date the outcome must be achieved) and a **review date** (an earlier checkpoint to assess whether your process is working). Review dates prevent the common trap of discovering too late that your approach was not producing results.

## Connecting Daily Actions to Long-Term Outcomes

Motivation tends to be high when a goal is new and low when progress is slow or invisible. The gap between daily actions and long-term outcomes is where most people disengage — the work feels disconnected from the reward.

The solution is to make the connection between process and outcome explicit and visible. One practical method is **implementation mapping**: draw a simple chain from your daily action to its immediate result, to its medium-term effect, to the long-term outcome you care about.

For example: *Review notes for 20 minutes → Material stays fresh in memory → Less cramming before exams → Higher exam performance → Stronger academic record → Access to opportunities I want after graduation.*

Writing this chain down and keeping it visible serves two functions. It reminds you why the small daily action is not trivial. And it makes the logic of the goal transparent — so if motivation drops, you can identify exactly where the chain feels weak and address it directly rather than simply pushing harder.

## Goals as a System, Not an Event

Goal setting is not something you do once at the start of the semester. It is a recurring practice: set specific goals, track your process, review whether it is working, and adjust. Students who treat goal setting as a system consistently outperform those who treat it as a one-time declaration of intent. The goal itself matters far less than the habit of returning to it.`,
    quizzes: [
      {
        question:
          "Why do vague goals like 'study more' reliably fail to produce behaviour change?",
        options: [
          "Because they are not written down and therefore not binding",
          "Because they lack the concrete specifics the brain needs to translate intention into action",
          "Because they focus on outcomes rather than processes",
          "Because they are too easy to achieve and provide no challenge",
        ],
        correct: 1,
        explanation:
          "Vague goals fail because they contain no actionable information — without answers to what, when, how much, and where, the brain has no concrete behaviour to execute.",
      },
      {
        question:
          "What is the key weakness of relying solely on outcome goals?",
        options: [
          "They are too specific and leave no room for adjustment",
          "They focus on daily behaviour rather than long-term direction",
          "Outcomes are not fully within your control, so they can cause disengagement when progress feels uncertain",
          "They require more time to write than process goals",
        ],
        correct: 2,
        explanation:
          "Outcome goals describe results that depend on factors beyond your control — exam conditions, marking schemes, external circumstances — so anchoring motivation entirely to outcomes makes it fragile.",
      },
      {
        question:
          "Which of the following is an example of a well-formed process goal?",
        options: [
          "Get a distinction in my end-of-year exams",
          "Do better at time management this semester",
          "Review my biology notes for 25 minutes every Monday and Wednesday evening",
          "Finish all my coursework before the holidays",
        ],
        correct: 2,
        explanation:
          "A process goal specifies a concrete, controllable behaviour with clear frequency and duration — 'review biology notes for 25 minutes every Monday and Wednesday evening' answers what, how long, and when.",
      },
      {
        question:
          "What is the purpose of setting a review date separate from a deadline?",
        options: [
          "To create an earlier submission target that replaces the official deadline",
          "To provide a checkpoint for assessing whether your current process is working before it is too late to adjust",
          "To schedule a rest period before the final push toward the deadline",
          "To remind yourself of the outcome goal so motivation stays high",
        ],
        correct: 1,
        explanation:
          "A review date is an intermediate checkpoint — earlier than the deadline — that lets you evaluate whether your process is producing the results you need and adjust your approach while there is still time.",
      },
      {
        question:
          "What is the purpose of implementation mapping in the context of goal setting?",
        options: [
          "To break a large goal into smaller sub-goals with individual deadlines",
          "To identify which tasks can be delegated and which must be done personally",
          "To make the connection between daily actions and long-term outcomes explicit, sustaining motivation when progress feels invisible",
          "To replace outcome goals with a purely process-based approach",
        ],
        correct: 2,
        explanation:
          "Implementation mapping draws a visible chain from small daily actions to long-term outcomes, preventing disengagement by keeping the meaning behind routine behaviour clear and accessible.",
      },
    ],
  })
  await addModule("Productivity and Learning Systems", {
    title: "Managing Focus and Eliminating Distraction",
    description:
      "Understand how attention works and depletes, why task-switching is more costly than it feels, how to design your environment to reduce distraction, and how to build deep focus sessions into a realistic student schedule.",
    orderIndex: 6,
    content: `## How Attention Works — and Why It Runs Out

Focus is not a personality trait. It is a cognitive resource — finite, depletable, and recoverable. The prefrontal cortex, the part of your brain responsible for sustained concentration and complex thinking, consumes significant metabolic energy. The longer you hold focused attention on demanding work, the more that energy is spent, and the harder it becomes to maintain the same quality of thought.

This is why studying for six hours straight rarely produces six hours' worth of useful work. Attention degrades gradually — after 45 to 90 minutes of intense focus, most people experience a measurable drop in performance even if they don't notice it subjectively. Pushing through this depletion doesn't recover your focus; it depletes it further. Scheduled rest does.

Understanding attention as a resource changes how you approach a study session. The question shifts from "how long can I sit here?" to "how do I protect and restore my attention so each hour is actually productive?"

## The Hidden Cost of Task-Switching

Modern student life is full of interruptions — notifications, messages, background noise, open tabs. Each one carries a cost that is far larger than it appears.

When you switch from one task to another — even briefly checking a message mid-paragraph — your brain does not instantly transfer its full attention. Research by cognitive psychologist David Meyer shows that task-switching creates **attention residue**: a portion of your cognitive focus remains stuck on the previous task even after you have nominally moved on. The more complex the interrupted task, the larger and longer-lasting the residue.

The practical consequence is striking. A task that would take 25 minutes of uninterrupted focus can easily take 45 to 60 minutes when performed in a distracted, interrupted state — and the quality of output is lower. Every interruption is not just a brief pause; it is a partial reset of the concentration you spent time building.

Multitasking — the belief that you can genuinely perform two cognitively demanding tasks simultaneously — is largely a myth for complex mental work. What feels like multitasking is rapid task-switching, and it carries the same residue costs at an accelerated rate.

## Environment Design — Remove Distraction Before It Appears

Willpower-based approaches to distraction ("I'll just resist checking my phone") fail for the same reason willpower fails against procrastination — they rely on an unreliable resource applied to a recurring problem. A far more effective strategy is **environment design**: structuring your physical and digital surroundings so that distraction is harder to access than focused work.

Practical environment design for students:

**Phone:** The most reliable strategy is physical distance. A phone in another room reduces usage far more than a phone face-down on the desk. App blockers (such as Freedom or Cold Turkey) remove the option to access distracting sites during a session — removing the decision entirely rather than requiring ongoing self-control.

**Workspace:** A dedicated study space conditions your brain over time to associate that environment with focus. It does not need to be elaborate — a specific chair at a specific desk works. Avoid studying in the same place you relax or sleep, as those associations compete with the focus response.

**Auditory environment:** For many people, consistent low-level background sound (ambient noise, lo-fi music without lyrics, white noise) outperforms silence and unpredictable noise alike. Lyrics activate the language-processing areas your reading and writing depend on, introducing a subtle but real interference. Experiment to find what works for your tasks and your brain.

**Preparation ritual:** A short, consistent sequence before each session — making a drink, writing down the one task you are starting with, silencing notifications — trains your brain to shift into focus mode. The ritual becomes a cue, and cues are powerful.

## Building Deep Focus Sessions Into a Student Schedule

Deep focus — the state of sustained, uninterrupted concentration on a cognitively demanding task — does not happen accidentally. It requires deliberate protection.

A practical framework for students is the **90-60-30 structure**: 90 minutes of deep focus, 60 minutes of lighter tasks or recovery, 30 minutes of rest or physical movement. This cycle aligns with the brain's natural ultradian rhythm and prevents the compounding depletion of back-to-back intense sessions.

You do not need multiple deep focus sessions per day. Research by Cal Newport and others suggests that two to four hours of genuine deep focus per day is sufficient to produce significant academic output — more than most students achieve across entire days of distracted study.

Protect your best hours. Most people have a peak cognitive window — typically mid-morning for early risers, late morning or early afternoon for others. Schedule your hardest, most important work during this window and reserve administrative tasks, emails, and light revision for the lower-energy periods that follow.

## Focus Is Built, Not Found

Students often wait to feel focused before starting difficult work. This reverses the correct order. Focus is not a prerequisite for starting — it is the product of starting under the right conditions. Design the environment, protect the time, begin the work, and the focus follows.`,
    quizzes: [
      {
        question:
          "Why does studying for six hours straight rarely produce six hours of useful work?",
        options: [
          "Because the brain switches to long-term memory storage after two hours, blocking new learning",
          "Because attention is a finite cognitive resource that degrades with sustained use, reducing output quality over time",
          "Because studying the same subject for too long causes interference between memories",
          "Because motivation drops after the first hour and cannot be restored without sleep",
        ],
        correct: 1,
        explanation:
          "Attention is a depletable resource — sustained focus consumes metabolic energy, and after 45 to 90 minutes of intense work, performance measurably declines even when students feel they are still concentrating.",
      },
      {
        question:
          "What is 'attention residue' as described in the context of task-switching?",
        options: [
          "The portion of a task that remains incomplete after a study session ends",
          "The background mental noise created by a cluttered study environment",
          "The cognitive focus that stays partially stuck on a previous task after switching to a new one",
          "The mental fatigue that builds up after a full day of lectures",
        ],
        correct: 2,
        explanation:
          "Attention residue, identified by researcher David Meyer, refers to the portion of cognitive focus that lingers on an interrupted task even after nominally moving on — reducing the quality of attention available for the new task.",
      },
      {
        question:
          "Why is environment design a more reliable strategy against distraction than relying on willpower?",
        options: [
          "Because environment design trains focus over time through classical conditioning",
          "Because willpower only works for physical distractions, not digital ones",
          "Because environment design removes the need for repeated decisions by making distraction structurally harder to access",
          "Because willpower requires motivation, which is unavailable during difficult tasks",
        ],
        correct: 2,
        explanation:
          "Willpower is a depleting resource that must be reapplied every time temptation appears — environment design removes the temptation structurally, eliminating the decision entirely rather than requiring ongoing self-control.",
      },
      {
        question:
          "According to the module, why should you avoid studying with music that has lyrics?",
        options: [
          "Because lyrics increase heart rate, which reduces concentration on complex tasks",
          "Because lyrics activate the same language-processing areas used for reading and writing, creating subtle cognitive interference",
          "Because music with lyrics is too emotionally engaging and triggers mind-wandering",
          "Because the rhythm of lyrics disrupts the brain's natural focus cycle",
        ],
        correct: 1,
        explanation:
          "Language processing is a shared cognitive resource — lyrics and reading or writing compete for the same mental machinery, introducing interference that degrades performance on verbal tasks even when it goes unnoticed.",
      },
      {
        question:
          "What does the module suggest about the relationship between feeling focused and starting work?",
        options: [
          "You should wait until you feel focused, as starting without it produces low-quality output",
          "Feeling focused is a sign that your environment is well-designed and work can begin",
          "Focus is not a prerequisite for starting — it is produced by starting under the right conditions",
          "Feeling unfocused is a signal to rest before attempting demanding tasks",
        ],
        correct: 2,
        explanation:
          "The module explicitly reverses the common assumption — focus is not a precondition that must exist before work begins, but rather an outcome that emerges from beginning work in a well-designed environment.",
      },
    ],
  })
  await addModule("Productivity and Learning Systems", {
    title: "Designing Your Personal Learning System",
    description:
      "Bring together everything from the previous modules — goal setting, routine building, spaced repetition, procrastination management, and distraction control — into one coherent, personalised weekly learning system that fits your actual life.",
    orderIndex: 7,
    content: `## From Individual Tools to a Complete System

Every module in this track has given you a tool. You now understand how memory decays and how spaced repetition fights it. You know why routines fail and how habit stacking fixes them. You can write specific, time-bound goals and link daily actions to long-term outcomes. You understand procrastination as an emotional response and focus as a depletable resource.

Tools are only useful when they work together. A spaced repetition schedule means nothing if you never protect time to use it. A distraction-free environment means nothing if you don't know what to work on when you sit down. A goal means nothing if there is no routine built around it. This module is about integration — designing a single, coherent personal learning system that makes all the tools function as one.

## Step 1 — Establish Your Outcomes for the Semester

Begin at the highest level. Before designing any routine or schedule, answer one question clearly: *what does a successful semester look like for you, in concrete terms?*

Write two to four outcome goals — specific, time-bound, and meaningful. Not "do well in my subjects" but "achieve a credit average or above across all three units by the end of semester." Not "keep up with readings" but "complete all required readings within 48 hours of each lecture."

These outcome goals become the fixed reference point for every decision you make below them. When choosing how to spend a study session, the question is always: does this action serve one of these outcomes?

## Step 2 — Build Your Weekly Process Architecture

With outcomes defined, design the process layer — the recurring weekly actions that will produce those outcomes over time.

Map your actual week first. Identify every fixed commitment: lectures, tutorials, part-time work, sport, social obligations. What remains is your discretionary time — and it is almost certainly less than you think. Work with what is real, not what is ideal.

Inside your discretionary time, assign three types of sessions:

**Deep focus blocks** (60–90 minutes): For demanding cognitive work — essay drafting, problem sets, learning new material. Protect these during your peak cognitive window. Aim for two to three per week at minimum.

**Review sessions** (20–30 minutes): For spaced repetition — revisiting material from previous lectures on the schedule established in Module 2. These can sit in lower-energy slots and require no peak attention.

**Weekly planning session** (30 minutes): Once per week — Sunday evening or Monday morning — to review what you achieved, check your outcome goals, and set your process intentions for the coming week. This session is the maintenance engine of the whole system.

## Step 3 — Apply Environment Design to Each Session Type

Each session type has different environmental requirements. Deep focus blocks demand full distraction elimination — phone in another room, site blockers active, a workspace associated only with focused work. Review sessions are less demanding but still benefit from a quiet, consistent location. Your weekly planning session works best with your calendar, notes, and goals visible simultaneously.

Design the environment for each session in advance, not in the moment. Deciding where and how to study while already sitting down is a decision that drains the same attention you are trying to protect.

## Step 4 — Install Recovery Mechanisms

No system survives contact with a real semester unchanged. Illness, deadlines, social obligations, and motivational valleys will disrupt your routine. The question is not whether this will happen — it is whether your system survives it.

Build in two explicit recovery mechanisms. First, a **minimum viable session**: a version of each habit so small it cannot reasonably be skipped — five minutes of review notes, one paragraph drafted, the planning session reduced to a single list. This preserves the habit chain through difficult weeks. Second, a **fortnightly review**: every two weeks, spend 15 minutes asking three questions — what is working, what is not, and what one adjustment would most improve the system. Systems that are never reviewed slowly drift out of alignment with reality.

## Step 5 — Start Small, Then Expand

The most common mistake in system design is building the ideal version first. Start with the minimum viable system: one deep focus block per week, three spaced review sessions, and one weekly planning session. Run it for two weeks. Then add. A system you actually use beats a perfect system you abandon in week three.

## Your System Is a Living Document

A personal learning system is not a fixed schedule — it is a responsive framework. Your outcomes, your available time, your energy patterns, and your subjects will all change across a semester and across a degree. The students who learn well over time are not those who find the perfect system once; they are those who build the habit of designing, running, reviewing, and improving their system continuously. That habit — the meta-skill of learning how to learn — is what this entire track has been building toward.`,
    quizzes: [
      {
        question:
          "According to the module, what is the purpose of establishing outcome goals before designing a weekly routine?",
        options: [
          "To ensure all study sessions are equal in length and difficulty",
          "To provide a fixed reference point so every process decision can be evaluated against what actually matters",
          "To replace process goals with more motivating long-term targets",
          "To calculate exactly how many study hours are needed per subject",
        ],
        correct: 1,
        explanation:
          "Outcome goals serve as the fixed reference point for the entire system — every session, habit, and decision is evaluated against whether it serves one of those defined outcomes, keeping effort aligned with what matters.",
      },
      {
        question:
          "Why does the module recommend mapping your actual week before designing your routine, rather than your ideal week?",
        options: [
          "Because ideal weeks are too unpredictable to plan around effectively",
          "Because fixed commitments like lectures and work leave less discretionary time than students typically assume, and a realistic plan is more likely to be followed",
          "Because studying during fixed commitments is more efficient than using discretionary time",
          "Because the ideal week template is provided in the weekly planning session instead",
        ],
        correct: 1,
        explanation:
          "Routines built around ideal conditions fail when real life intervenes — mapping actual fixed commitments first reveals the true amount of available time and produces a plan that can be sustained rather than one that collapses at the first disruption.",
      },
      {
        question:
          "What distinguishes a deep focus block from a review session in the weekly process architecture?",
        options: [
          "Deep focus blocks use spaced repetition; review sessions use active recall",
          "Deep focus blocks are scheduled daily; review sessions are scheduled weekly",
          "Deep focus blocks require peak cognitive energy for demanding new work; review sessions are lower-intensity and suited to off-peak time slots",
          "Deep focus blocks are used for group study; review sessions are for independent work",
        ],
        correct: 2,
        explanation:
          "Deep focus blocks are reserved for cognitively demanding work — drafting, problem-solving, learning new material — and require your peak attention window, while review sessions revisit existing material and can sit in lower-energy periods.",
      },
      {
        question:
          "What is the function of a 'minimum viable session' as a recovery mechanism?",
        options: [
          "To replace full study sessions during exam periods when time is limited",
          "To preserve the habit chain during difficult weeks by reducing each session to its smallest possible form rather than skipping it entirely",
          "To serve as an introductory session when starting a new topic for the first time",
          "To act as a reward after completing a full deep focus block",
        ],
        correct: 1,
        explanation:
          "A minimum viable session — five minutes of review, one paragraph drafted — keeps the habit alive through illness, disruption, or low motivation, preventing a single hard week from breaking the routine entirely.",
      },
      {
        question:
          "What does the module identify as the meta-skill that this entire track has been building toward?",
        options: [
          "The ability to memorise large volumes of information quickly using spaced repetition",
          "The discipline to follow a fixed study schedule without deviation across a full semester",
          "The habit of continuously designing, running, reviewing, and improving your own learning system",
          "The skill of writing specific, time-bound goals and sharing them with an accountability partner",
        ],
        correct: 2,
        explanation:
          "The module frames the ultimate goal of the track as developing the meta-skill of learning how to learn — the ongoing practice of building, evaluating, and refining a personal system, which compounds in value across an entire degree.",
      },
    ],
  })
  await addModule("Data Literacy and Critical Thinking", {
    title: "How to Read Charts and Graphs Critically",
    description:
      "Learn to identify the most common chart types and what they are suited for, recognise the techniques that make charts misleading, and apply three critical questions before accepting any visual data as trustworthy.",
    orderIndex: 2,
    content: `## Why Charts Are Not Neutral

A chart feels objective. Numbers are displayed, a visual shape emerges, and the conclusion seems obvious. This feeling of objectivity is precisely what makes charts one of the most powerful tools for misleading an audience. Every chart involves dozens of design decisions — what to include, what to exclude, where to start the axis, which time period to show — and each decision shapes what the viewer concludes. Reading charts critically means understanding that a chart is always an argument, not just a picture of data.

## The Three Common Chart Types

**Bar charts** display data as rectangular bars, with the height or length of each bar representing a value. They are best suited for comparing distinct categories — sales across different products, scores across different students, population across different cities. The key assumption of a bar chart is that the categories are meaningfully separate and that size comparisons between bars are valid.

**Line charts** display data as points connected by a continuous line, typically with time on the horizontal axis. They are best suited for showing change or trends over time — how temperature varies across a year, how a company's revenue has grown over a decade. The continuous line implies continuity between data points, so line charts should only be used when the data itself is continuous or sequential.

**Pie charts** display data as slices of a circle, where each slice's size represents its proportion of the whole. They are best suited for showing how a total is divided among a small number of categories — and only when those categories are mutually exclusive and genuinely add up to 100%. Pie charts become unreliable with more than five or six slices, as the human eye is poor at comparing angles and areas accurately.

## How Charts Mislead

Understanding the common deception techniques is as important as understanding the chart types themselves.

**Truncated axes** are the most widespread form of chart manipulation. A bar chart or line chart normally starts its vertical axis at zero. When the axis is cut — starting at 80% instead of 0%, for example — small differences between values are visually amplified into dramatic gaps. A change from 81% to 84% on a truncated axis can be made to look as significant as a change from 0% to 100% on a full axis. Always check where the axis begins.

**Cherry-picked time ranges** exploit the fact that any trend can be made to look positive or negative depending on which portion of the timeline is shown. A stock price that has fallen 40% over five years can still be presented with a line chart showing only the last three months — during which it happened to rise. When a line chart is shown, always ask: why does the data start here, and what happened before?

**Misleading scale and size comparisons** appear frequently in pictorial charts and bubble charts, where two-dimensional images are used to represent one-dimensional values. If one figure is twice the value of another, the temptation is to double the height of the image — but doubling the height of a two-dimensional figure quadruples its area, making the difference look four times as large as it actually is.

**Omitted context** is perhaps the subtlest technique. A chart showing that crime in a city rose 50% last year is alarming — unless the baseline was so low that the absolute increase amounted to twelve incidents. Percentages without absolute numbers, and absolute numbers without baselines, are both incomplete.

## Three Questions to Ask Before Trusting Any Chart

These three questions will catch the majority of misleading charts before they influence your conclusions:

**1. Where does the axis start?** If a bar or line chart does not start at zero, ask whether the visual impression of difference is proportional to the actual numerical difference.

**2. What is not shown?** Every chart is a selection. Ask what data was available that did not make it into the visualisation — the longer time range, the comparison group, the absolute numbers behind the percentages.

**3. Who made this chart and why?** A chart produced by a company to promote its own product, a political party to support its own policy, or a lobby group to advance its own cause has an interested author. Interested authors make design choices that serve their argument. That does not make the chart wrong — but it makes scrutiny essential.

## Charts as Arguments

Every chart is making a case. The designer has chosen what to show, how to frame it, and what conclusion to make easy to reach. Your job as a critical reader is to separate the data from the design — to ask what the numbers actually say when stripped of the visual choices made around them. That habit, applied consistently, is what distinguishes a data-literate reader from one who is easily persuaded by a well-made graphic.`,
    quizzes: [
      {
        question:
          "Which chart type is most appropriate for showing how a single quantity changes continuously over time?",
        options: [
          "A pie chart, because it shows proportional relationships clearly",
          "A bar chart, because it allows direct size comparisons between values",
          "A line chart, because it represents continuous sequential change with a connected line",
          "A pictorial chart, because images are easier to interpret than abstract lines",
        ],
        correct: 2,
        explanation:
          "Line charts are designed for continuous or sequential data — the connected line implies continuity between points, making them the natural choice for trends over time such as temperature, revenue, or population change.",
      },
      {
        question:
          "A bar chart shows customer satisfaction scores ranging from 79% to 84%, but the vertical axis starts at 78% rather than 0%. What is the effect of this design choice?",
        options: [
          "It makes the chart easier to read by zooming in on the relevant range",
          "It visually amplifies small differences between bars, making them appear far more dramatic than the actual numerical gap",
          "It has no effect on interpretation because the numbers are still labelled correctly",
          "It corrects for the fact that satisfaction scores below 78% are not possible",
        ],
        correct: 1,
        explanation:
          "A truncated axis compresses the baseline, causing visually small differences to appear large — a 5-percentage-point gap looks enormous on a truncated axis but is barely visible when the axis starts at zero.",
      },
      {
        question:
          "A news article shows a line chart of a politician's approval rating rising steadily over six months. What critical question should you ask first?",
        options: [
          "Whether the line chart should have been a bar chart instead",
          "Whether the approval rating is measured as a percentage or an absolute number",
          "What happened before the six-month window shown, and why that start date was chosen",
          "Whether the chart includes a legend identifying the data source",
        ],
        correct: 2,
        explanation:
          "Cherry-picked time ranges can make any trend appear positive or negative — asking why the data starts at a particular point reveals whether the selected window is representative or deliberately chosen to support a specific narrative.",
      },
      {
        question:
          "Why do pie charts become unreliable when they contain more than five or six slices?",
        options: [
          "Because pie charts can only represent data that adds up to exactly 100%",
          "Because the human eye is poor at accurately comparing angles and areas, making small differences between slices impossible to judge reliably",
          "Because too many slices cause the chart software to round values incorrectly",
          "Because pie charts are only valid for categorical data, and more than six categories is too many",
        ],
        correct: 1,
        explanation:
          "Unlike bar length, which the eye can compare accurately, angles and areas in a pie chart are difficult to judge — with many slices, viewers cannot reliably determine which is larger, making the chart effectively unreadable for precise comparison.",
      },
      {
        question:
          "A chart shows that a city's homicide rate increased by 100% last year. What critical piece of context is missing before this statistic can be meaningfully interpreted?",
        options: [
          "The chart type used to display the data",
          "The name of the city and the year the data was collected",
          "The absolute baseline number — a 100% increase from 2 incidents is very different from a 100% increase from 200",
          "Whether the data was collected by the government or a private organisation",
        ],
        correct: 2,
        explanation:
          "Percentages without absolute baselines are incomplete — a 100% increase sounds alarming but is meaningless without knowing the starting value, since doubling from 2 to 4 incidents is very different from doubling from 200 to 400.",
      },
    ],
  })
  await addModule("Data Literacy and Critical Thinking", {
    title: "Misleading Statistics — How Numbers Lie",
    description:
      "Learn to see through misleading statistical claims by understanding the difference between absolute and relative risk, how skewed distributions make averages deceptive, why sample size determines how much a result means, and how to identify numbers that sound impressive but say very little.",
    orderIndex: 3,
    content: `## Numbers Are Not Self-Interpreting

Statistics feel authoritative. A percentage, a study result, or a risk figure carries an air of precision that plain language does not. But a number without context is not information — it is raw material that can be shaped into almost any conclusion the presenter wants. The techniques for doing this are not complicated; they are consistent and learnable. Once you know them, you will encounter them everywhere.

## Absolute vs Relative Risk — The Most Common Statistical Trick

Imagine a headline: *"New drug cuts cancer risk by 50%."* That sounds transformative. But 50% of what?

If the baseline risk of developing the cancer in question is 2 in 1000 people, a 50% reduction brings it to 1 in 1000. The **relative risk reduction** is 50% — dramatic and headline-worthy. The **absolute risk reduction** is 0.1 percentage points — one fewer person per thousand. Both numbers describe the same drug. Only one of them tells you whether the drug is likely to matter to you personally.

Relative risk figures are almost always larger and more impressive than absolute ones, which is why they appear in advertisements, press releases, and political speeches. The question to ask whenever you see a percentage change in risk is: *what was the baseline, and how large is the absolute difference?* A 50% reduction in a tiny risk is a small absolute change. A 10% reduction in a large risk may be enormous.

## How Averages Mislead

The word "average" is used loosely to describe three different calculations — mean, median, and mode — and the choice between them can completely change the story.

Consider income in a small company with ten employees. Nine earn $40,000 per year and one executive earns $400,000. The **mean** (total divided by number of people) is $76,000 — a figure that describes no actual employee's experience. The **median** (the middle value when sorted) is $40,000 — a far more representative picture of what a typical employee earns.

When a distribution is **skewed** — pulled sharply in one direction by extreme values — the mean is dragged toward the outliers while the median remains near the centre. Income, wealth, house prices, and social media follower counts are all heavily right-skewed. Claims about "average" in these domains almost always use the mean, producing a figure inflated by the extremes. Whenever you see an average in a domain likely to contain outliers, ask which average was used and whether the median would tell a different story.

## Why Sample Size Determines How Much a Result Means

A study finds that people who drink green tea have a 30% lower rate of a particular illness. Before updating your shopping list, ask: how many people were in the study?

A result from 40 participants is not comparable to a result from 40,000. Small samples produce **unstable estimates** — their results vary enormously by chance, and a finding that looks significant in a small sample frequently disappears when the study is repeated with more people. The formal measure of this is the **confidence interval**: the range of values within which the true effect is likely to fall. Large samples produce narrow confidence intervals (precise estimates); small samples produce wide ones (uncertain estimates).

The practical rule is straightforward: the more dramatic and surprising a finding, and the smaller the sample it comes from, the more sceptical you should be. Genuinely robust effects tend to emerge from large, well-designed studies and replicate consistently across independent research teams.

## Statistics That Sound Impressive but Mean Very Little

Some statistical claims are technically accurate but structurally empty — designed to create an impression without providing meaningful information.

**"Nine out of ten dentists recommend..."** — recommend compared to what alternative? How were the dentists selected? Was the question leading? Without methodology, this tells you nothing about the product.

**"Up to 40% more effective"** — "up to" is doing enormous work here. A range that tops out at 40% could have a typical result of 2%. "Up to" claims describe best-case scenarios, not typical ones.

**"Linked to a significant increase in risk"** — "linked to" signals correlation, not causation. The increase may be statistically significant while being too small to matter practically. And statistical significance is not the same as real-world importance: with a large enough sample, trivially small differences become statistically significant.

**"Studies show..."** — which studies? How many? Published where? Conducted by whom? A single study showing anything is not a scientific consensus; it is one data point. Treat "studies show" claims the same way you treat anonymous sources — potentially interesting, insufficient on their own.

## The Habit of Asking One More Question

You do not need a statistics degree to navigate misleading numbers. You need one consistent habit: always ask for the context the headline leaves out. What was the baseline? Which average? How large was the sample? What does "significant" actually mean here? That single habit — asking what is missing rather than accepting what is presented — is what separates a data-literate thinker from one who is easily led by impressive-sounding numbers.`,
    quizzes: [
      {
        question:
          "A supplement company claims their product 'reduces your risk of illness by 40%.' The baseline risk without the supplement is 5 in 1,000. What is the absolute risk reduction?",
        options: [
          "40 percentage points",
          "2 percentage points",
          "0.2 percentage points",
          "5 percentage points",
        ],
        correct: 2,
        explanation:
          "A 40% relative reduction of a 0.5% baseline risk (5 in 1,000) equals a 0.2 percentage point absolute reduction — from 0.5% to 0.3%. The relative figure sounds dramatic; the absolute figure reveals the practical impact is very small.",
      },
      {
        question:
          "In a heavily right-skewed distribution such as household income, why does the mean typically overstate what a 'typical' person earns?",
        options: [
          "Because the mean is calculated incorrectly when extreme values are present",
          "Because the mean is dragged upward by a small number of very high earners, making it unrepresentative of most people's experience",
          "Because income data is always collected from the wealthiest households first",
          "Because right-skewed distributions always have a mean equal to the highest value",
        ],
        correct: 1,
        explanation:
          "In a right-skewed distribution, extreme high values pull the mean upward while the majority of values cluster much lower — the median, which sits at the middle of the sorted distribution, gives a far more representative picture of the typical experience.",
      },
      {
        question:
          "A study of 35 participants finds that a new teaching method improves test scores by 25%. Why should this result be treated with caution?",
        options: [
          "Because a 25% improvement is too large to be credible",
          "Because small samples produce unstable estimates with wide confidence intervals, and the result may not replicate in a larger study",
          "Because teaching method studies are inherently unreliable regardless of sample size",
          "Because the improvement should have been measured in absolute points, not percentages",
        ],
        correct: 1,
        explanation:
          "Small samples produce highly variable results — a finding from 35 participants could easily be a chance occurrence. Robust effects require large samples, narrow confidence intervals, and independent replication before they can be trusted.",
      },
      {
        question:
          "An advertisement claims a product is 'up to 60% more effective' than the leading competitor. What is the critical problem with this claim?",
        options: [
          "The claim uses relative rather than absolute figures",
          "'Up to' describes only the best-case scenario, so typical results could be far lower — even close to zero",
          "Effectiveness comparisons are only valid when conducted by independent researchers",
          "The claim does not specify which competitor was used as the comparison",
        ],
        correct: 1,
        explanation:
          "'Up to' claims define a ceiling, not a typical outcome — a product that is 60% more effective in one rare scenario but 1% more effective on average can truthfully advertise 'up to 60%', making the claim misleading without being technically false.",
      },
      {
        question:
          "A news headline states: 'Coffee consumption linked to improved memory.' What is the most important limitation signalled by the word 'linked'?",
        options: [
          "The study was too small to produce reliable results",
          "'Linked' indicates correlation only — it does not establish that coffee causes the memory improvement",
          "The finding applies only to the specific type of coffee tested in the study",
          "'Linked' means the finding was statistically significant but not practically meaningful",
        ],
        correct: 1,
        explanation:
          "'Linked to' and 'associated with' signal correlation — two things that tend to occur together — but do not establish causation. Coffee drinkers may differ from non-coffee drinkers in many other ways that explain the memory difference.",
      },
    ],
  })
  await addModule("Data Literacy and Critical Thinking", {
    title: "Correlation vs Causation — The Most Misunderstood Concept in Data",
    description:
      "Understand what correlation really means, why it does not imply causation, how confounding variables produce false causal impressions, and how to evaluate causation claims responsibly using real-world examples.",
    orderIndex: 4,
    content: `## The Most Expensive Confusion in Data Thinking

Researchers once found a near-perfect statistical correlation between the number of Nicolas Cage films released per year and the number of people who drowned in swimming pools. Both rose and fell together with remarkable consistency across multiple years. Nobody seriously concluded that Nicolas Cage films cause drownings — the example is absurd enough to make the logic obvious.

But the same logical error, in less absurd form, drives billions of dollars of misguided business decisions, flawed medical advice, and bad public policy every year. The confusion between correlation and causation is not rare or unsophisticated — it is the default error of human reasoning when patterns appear in data. Understanding it clearly is one of the most practically valuable things a data-literate person can do.

## What Correlation Actually Means

Two variables are **correlated** when they tend to change together. A positive correlation means they rise and fall in the same direction — ice cream sales and drowning rates both increase in summer. A negative correlation means one rises as the other falls — hours of sleep and frequency of illness tend to move in opposite directions.

Correlation is measured by a **correlation coefficient**, typically ranging from -1 to +1. A coefficient near +1 means a strong positive relationship; near -1 means a strong negative one; near 0 means no consistent relationship. Importantly, correlation is a mathematical description of a pattern in data. It carries no information about why that pattern exists.

## Why Correlation Does Not Imply Causation

Finding a correlation tells you that two things move together. It tells you nothing about the mechanism. There are four possible explanations for any correlation:

**A causes B.** Smoking correlates with lung cancer because smoking genuinely causes cellular damage that leads to cancer. This is the causal explanation — but it required decades of controlled research to establish, not just the observation of a correlation.

**B causes A.** The causal arrow runs the other way. Studies once found that hospitalised patients had worse health outcomes than non-hospitalised people — not because hospitals cause illness, but because sick people go to hospital. The illness caused the hospitalisation, not vice versa.

**A third variable C causes both.** This is the confounding variable problem, and it is the most common source of false causal conclusions. Ice cream sales and drowning rates correlate strongly — not because ice cream causes drowning, but because hot weather causes both. Remove the summer months and the correlation largely disappears.

**The correlation is pure coincidence.** With enough variables in a dataset, some will correlate by chance alone. The Nicolas Cage example falls here. In large datasets especially, spurious correlations are statistically inevitable.

## Confounding Variables — The Hidden Explanation

A **confounding variable** is a third factor that causes or influences both of the variables you are observing, producing a correlation between them that has nothing to do with any direct relationship.

A classic example: research found that children with larger shoe sizes had better reading ability. The tempting causal conclusion — bigger feet help you read — is obviously wrong. The confounder is age. Older children have larger feet and better reading ability. Age causes both. Remove the age effect and the shoe size correlation disappears entirely.

Identifying confounders requires asking one persistent question: *is there something else — unmeasured or uncontrolled — that could plausibly cause both of these things to move together?* In nutrition research, lifestyle confounders are rampant — people who eat more vegetables also tend to exercise more, sleep better, and smoke less. Attributing health outcomes to the vegetables alone, without controlling for these other factors, produces correlations that masquerade as causation.

## How to Think About Causation Responsibly

Establishing genuine causation is harder than finding a correlation, and the gold standard for doing so is the **randomised controlled trial (RCT)**: randomly assign participants to a treatment group and a control group, apply only the variable of interest to the treatment group, and compare outcomes. Random assignment neutralises confounders by distributing them evenly across both groups — any difference in outcome can then be attributed to the treatment with confidence.

When RCTs are not available — as is often the case in social science, nutrition, and economics, where you cannot randomly assign people to poverty or a diet for years — causation must be argued through a combination of converging evidence, theoretical mechanism, dose-response relationships, and the elimination of plausible confounders. This is harder and messier, and the conclusions are held with appropriately less certainty.

A practical framework for evaluating any causal claim: first, confirm the correlation is real and replicable. Second, ask whether a plausible confounding variable could explain it. Third, ask whether there is a credible mechanism — a biological, psychological, or social process by which A could actually produce B. Fourth, ask whether the effect appears in controlled or experimental conditions, not just observational data. A claim that survives all four questions is worth taking seriously. Most do not survive the second.

## The Takeaway

Correlation is a signal worth investigating. It is not an answer. When you see a headline claiming that X causes Y, the habit to build is immediate scepticism about the causal arrow — not cynicism that dismisses the finding, but disciplined curiosity about what else might explain the pattern. That habit, applied consistently, will make you a more reliable thinker than most people who encounter data.`,
    quizzes: [
      {
        question:
          "Two variables have a correlation coefficient of +0.92. What does this tell you?",
        options: [
          "One variable is almost certainly causing the other to increase",
          "The two variables have a strong positive relationship — they tend to rise and fall together — but the cause of that relationship is not established",
          "The relationship is strong enough to be used for prediction but too weak to imply causation",
          "The variables are identical and measuring the same underlying phenomenon",
        ],
        correct: 1,
        explanation:
          "A correlation coefficient describes the strength and direction of a statistical relationship only — a high coefficient confirms the variables move together consistently but carries no information about why, leaving causation entirely unresolved.",
      },
      {
        question:
          "A study finds that people who carry lighters are more likely to develop lung cancer. What is the most likely explanation?",
        options: [
          "Carrying a lighter directly causes lung cancer through chemical exposure",
          "People with lung cancer are more likely to need a lighter for medical equipment",
          "Smoking is a confounding variable — it causes both the likelihood of carrying a lighter and the development of lung cancer",
          "The correlation is coincidental and disappears when a larger sample is used",
        ],
        correct: 2,
        explanation:
          "Smoking is the confounder here — it causes people to carry lighters and independently causes lung cancer, producing a correlation between lighter-carrying and cancer that has no direct causal basis.",
      },
      {
        question:
          "Why is a randomised controlled trial considered the gold standard for establishing causation?",
        options: [
          "Because it uses larger sample sizes than observational studies",
          "Because random assignment distributes confounding variables evenly across groups, so any outcome difference can be attributed to the treatment",
          "Because it measures correlation coefficients more precisely than other study designs",
          "Because participants in RCTs are more representative of the general population",
        ],
        correct: 1,
        explanation:
          "Random assignment is the critical feature — by distributing known and unknown confounders evenly across treatment and control groups, it isolates the effect of the variable being tested and allows genuine causal inference.",
      },
      {
        question:
          "Research shows that countries with higher chocolate consumption per capita win more Nobel Prizes per capita. What is the most data-literate interpretation?",
        options: [
          "Chocolate consumption improves cognitive function and creativity, leading to Nobel Prize-winning work",
          "Nobel Prize winners tend to celebrate with chocolate, so the prizes cause the consumption",
          "A confounding variable — such as national wealth, which funds both chocolate consumption and research institutions — likely explains both",
          "The correlation coefficient must be near zero because the claim is implausible",
        ],
        correct: 2,
        explanation:
          "National wealth is the classic confounder here — wealthier countries can afford more chocolate per capita and also fund the universities, research institutions, and scientific culture that produce Nobel laureates, causing both variables to rise together.",
      },
      {
        question:
          "Which of the following questions is most useful for evaluating whether a correlation reflects genuine causation?",
        options: [
          "How large is the correlation coefficient between the two variables?",
          "Is there a plausible confounding variable that could cause both things to move together?",
          "Was the correlation reported in a peer-reviewed journal?",
          "How many years of data were used to calculate the correlation?",
        ],
        correct: 1,
        explanation:
          "Identifying a plausible confounder is the most powerful initial test of a causal claim — if a third variable can credibly explain why both variables move together, the direct causal interpretation collapses regardless of how strong the correlation is.",
      },
    ],
  })
  await addModule("Data Literacy and Critical Thinking", {
    title: "Evaluating Data Sources — Who Collected This and Why",
    description:
      "Learn how to assess the credibility of data sources, distinguish peer-reviewed research from opinion, understand how funding and incentives shape findings, and apply a practical checklist to any data claim you encounter.",
    orderIndex: 5,
    content: `## Data Does Not Arrive Without an Author

Every dataset, study, statistic, and chart was produced by someone, for a reason, using a method they chose, and reported in a way they designed. None of those decisions are neutral. A data claim is not just a number — it is the end product of a chain of human choices, and the credibility of the claim depends heavily on who made those choices and what their interests were.

This does not mean all data is equally suspect or that cynicism is the correct response. It means that evaluating a data source is a necessary step before accepting its conclusions — the same step you would apply to any other argument.

## What Makes a Source Credible

Credibility in data sources rests on four pillars.

**Methodology transparency** means the source explains how the data was collected — who was sampled, how measurements were taken, what was included and excluded, and how the analysis was performed. A credible source does not just report conclusions; it shows its work. If you cannot find a description of the method, you cannot evaluate whether the conclusion follows from it.

**Independence** means the organisation or researcher collecting the data does not have a financial or institutional stake in a particular outcome. Government statistical agencies, academic research institutions, and established international bodies such as the World Health Organization generally have stronger independence than industry-funded research groups or advocacy organisations.

**Replication and consensus** means the finding has been confirmed by multiple independent research teams using different methods and populations. A single study, however well-designed, is a starting point. A finding that appears consistently across many independent studies is substantially more reliable.

**Publication and peer review** means the research has been submitted to scrutiny by independent experts in the field before being published. Peer review is imperfect — it does not catch all errors, and it can be slow — but it represents a systematic check that is absent from press releases, blog posts, social media claims, and industry white papers.

## Peer-Reviewed Research vs Opinion

The distinction between peer-reviewed research and opinion is one of the most important in data literacy, and it is frequently obscured.

A **peer-reviewed study** reports original data collection or analysis, describes the methodology in detail, has been evaluated by independent experts, and is published in an academic journal. It makes claims bounded by its data and acknowledges its limitations.

An **opinion piece, commentary, or editorial** — even one written by a credentialed expert and published in a reputable outlet — is an argued position, not a data report. It may cite studies selectively, interpret evidence in a particular direction, and reach conclusions that go beyond what the underlying data supports. Expert opinion is valuable, but it is not the same category of evidence as original peer-reviewed research.

Many sources occupy ambiguous territory: think-tank reports, industry white papers, government-commissioned reviews, and non-profit research publications. These are not automatically unreliable, but they require additional scrutiny — particularly of who funded them and what conclusion would have served the funder's interests.

## How Funding and Incentives Shape Findings

The relationship between funding source and research outcome is one of the most documented phenomena in the sociology of science. Studies funded by the sugar industry were significantly more likely to find that fat, not sugar, was responsible for cardiovascular disease. Pharmaceutical company-funded drug trials are more likely to report positive results than independently funded trials of the same drugs. Tobacco industry research consistently found no causal link between smoking and cancer long after independent research had established one clearly.

This is not always deliberate fraud. Funding shapes research in subtler ways: which questions get asked, which outcomes get measured, which results get written up and submitted for publication, and which get filed away. Researchers with an interested funder are not immune to unconscious motivated reasoning — the tendency to find the answer you are looking for more convincing than the one you were not expecting.

The practical implication is simple: when evaluating a study, locate the funding disclosure — reputable journals require it — and ask whether the funder had a commercial or ideological stake in the result. A finding that favours the funder's interests is not automatically wrong, but it warrants corroboration from independent sources before being trusted fully.

## A Practical Checklist for Evaluating Any Data Claim

Apply these six questions to any significant data claim before accepting it:

**1. Who collected this data?** Is the source an independent research institution, a government agency, an industry group, or an anonymous website?

**2. How was it collected?** Is the methodology described clearly enough to evaluate? Was the sample representative? Were the measurements valid?

**3. Who funded it?** Does the funder have a financial or ideological interest in the outcome? Is the funding disclosed or obscured?

**4. Has it been peer-reviewed?** Is this original research published in an academic journal, or a press release, white paper, or opinion piece?

**5. Has it been replicated?** Does this finding appear consistently across independent studies, or is this a single result?

**6. What do independent experts say?** Do researchers with no stake in the outcome regard this finding as credible and consistent with the broader evidence base?

A claim that answers these questions satisfactorily is worth engaging with seriously. A claim that cannot answer them deserves significant scepticism regardless of how confidently it is presented.`,
    quizzes: [
      {
        question:
          "What is the most important feature that distinguishes a peer-reviewed study from an expert opinion piece?",
        options: [
          "Peer-reviewed studies are written by more qualified researchers than opinion pieces",
          "Peer-reviewed studies report original data with transparent methodology evaluated by independent experts, while opinion pieces are argued positions that may go beyond the underlying evidence",
          "Opinion pieces are published faster and are therefore more current than peer-reviewed research",
          "Peer-reviewed studies are only published by government institutions, while opinion pieces appear in commercial outlets",
        ],
        correct: 1,
        explanation:
          "The defining difference is the combination of original data, transparent methodology, and independent expert evaluation — opinion pieces, even by credentialed experts, are argued positions rather than data reports and do not undergo the same systematic scrutiny.",
      },
      {
        question:
          "A pharmaceutical company publishes a study showing their new drug is highly effective. The study's methodology appears sound. What additional step is most important before accepting this finding?",
        options: [
          "Check whether the drug has received government approval in at least one country",
          "Confirm that the study was conducted within the last five years",
          "Locate the funding disclosure and seek independent replication, since industry-funded trials are more likely to report favourable outcomes",
          "Verify that the study used a large enough sample to produce a significant correlation",
        ],
        correct: 2,
        explanation:
          "Industry-funded research consistently shows higher rates of favourable findings than independently funded research on the same interventions — funding disclosure and independent replication are the essential checks before trusting a commercially interested result.",
      },
      {
        question:
          "Which of the following data sources would generally warrant the most scrutiny before being cited in an academic argument?",
        options: [
          "A study published in a peer-reviewed public health journal with independent funding",
          "A report from a national government statistical agency",
          "A white paper published by an industry lobby group without methodology disclosure",
          "A meta-analysis of fifty independent studies conducted by an academic research team",
        ],
        correct: 2,
        explanation:
          "An industry lobby group has an institutional interest in a particular finding, and the absence of methodology disclosure means the claim cannot be independently evaluated — both factors make it the least credible source in this list.",
      },
      {
        question:
          "A single well-designed study finds that a particular diet reduces the risk of heart disease by 30%. What is the most data-literate response?",
        options: [
          "Accept the finding because the study was well-designed and the effect size is large",
          "Reject the finding because nutrition research is inherently unreliable",
          "Treat it as a promising starting point and look for independent replication before drawing firm conclusions",
          "Accept the finding only if it was funded by a government health agency",
        ],
        correct: 2,
        explanation:
          "A single study, however well-designed, is a starting point rather than a conclusion — robust findings replicate consistently across independent research teams, and a 30% effect in one study could reflect chance, confounding, or publication bias until confirmed elsewhere.",
      },
      {
        question:
          "According to the practical checklist in the module, what does asking 'has it been replicated?' help you assess?",
        options: [
          "Whether the original researchers made arithmetic errors in their analysis",
          "Whether the finding appears consistently across independent studies rather than being a single isolated result",
          "Whether the study sample was large enough to produce statistically significant results",
          "Whether the methodology has been approved by a regulatory authority",
        ],
        correct: 1,
        explanation:
          "Replication across independent studies using different methods and populations is one of the strongest indicators of a robust finding — a result that has not been replicated could reflect chance, methodological quirks, or publication bias specific to the original study.",
      },
    ],
  })
  await addModule("Data Literacy and Critical Thinking", {
    title: "Making Decisions with Imperfect Data",
    description:
      "Learn why perfect data never arrives, how to make sound decisions under uncertainty, when available data is trustworthy enough to act on, and how to apply a simple framework for data-driven choices in everyday academic and personal life.",
    orderIndex: 6,
    content: `## The Myth of Complete Information

There is a version of data literacy that leads to paralysis. You learn about misleading statistics, confounding variables, funding bias, and unreliable samples — and the natural response is to trust nothing and decide nothing until the evidence is beyond doubt. This response feels rigorous. It is actually a form of avoidance, and it carries its own costs.

Perfect data does not exist. Every dataset has gaps, every study has limitations, every sample has selection pressures, and every measurement introduces some error. The real world does not pause while you wait for a cleaner dataset. Waiting for certainty before acting is not a neutral choice — it is a decision to maintain the status quo, with all the consequences that brings. A doctor who refuses to treat a patient until every test is complete has made a decision. An investor who holds cash until the market is predictable has made a decision. A student who delays choosing a research direction until every option is evaluated has made a decision.

The question is never whether to decide under uncertainty. The question is how to decide well.

## How to Make Reasonable Decisions Under Uncertainty

Good decisions under uncertainty share a common structure. They do not require certainty — they require that the evidence be weighed honestly and that the stakes be understood clearly.

**Calibrate your confidence to the quality of the evidence.** A conclusion supported by multiple independent replicated studies warrants more confidence than a conclusion from a single survey. A pattern that appears consistently across different methods and populations is more reliable than one that appears only under specific conditions. Match how strongly you hold your conclusion to how strong the evidence actually is — neither dismissing weak evidence entirely nor treating it as proof.

**Consider the cost of each type of error.** In any decision under uncertainty, there are two ways to be wrong: acting when you should not have (a false positive), and not acting when you should have (a false negative). The right threshold for action depends on which error is more costly in your specific situation. A medical screening test for a serious but treatable disease should have a low threshold for a positive result — missing a case is catastrophic, and a false alarm is merely inconvenient. Conversely, a decision with irreversible consequences should require stronger evidence before commitment.

**Make your reasoning explicit.** When deciding under uncertainty, write down — even briefly — what evidence you are relying on, what assumptions you are making, and what would change your mind. This discipline does two things: it prevents post-hoc rationalisation, where you construct reasons for a decision you made on other grounds, and it creates a record you can return to and update as new information arrives.

## When to Trust Your Data — and When to Question It

Not all uncertainty is equal. Some data is imperfect but directionally reliable; some is so flawed that acting on it is worse than acting on nothing.

**Trust your data more when:** the source is independent and transparent about methodology; the finding has been replicated across multiple studies; the sample is large and representative; the effect size is substantial rather than marginal; and the result is consistent with a plausible mechanism.

**Question your data more when:** a single study supports the claim; the funder has a stake in the outcome; the sample is small or self-selected; the effect is only statistically significant but practically tiny; or the claim contradicts a large body of established evidence without a compelling explanation for why.

The practical skill is not choosing between trusting and distrusting data — it is adjusting how much weight you give a piece of evidence based on the conditions under which it was produced.

## A Simple Decision Framework for Data-Driven Choices

When facing a decision that involves data, apply this four-step framework:

**Step 1 — Define the decision clearly.** What exactly are you deciding, and what are the realistic options? Ambiguous decisions produce ambiguous reasoning.

**Step 2 — Identify the evidence.** What data exists that is relevant to this decision? Apply the source evaluation checklist from the previous module. How strong and independent is it?

**Step 3 — Assess the stakes.** What are the consequences of each type of error — acting incorrectly versus not acting when you should? High-stakes, irreversible decisions require stronger evidence than low-stakes, reversible ones.

**Step 4 — Decide and document.** Make the best decision the available evidence supports, record your reasoning briefly, and identify what new information would cause you to revise it. Set a point in the future to review whether the decision is holding up.

## Imperfect Data Is the Only Kind There Is

Data literacy is not about finding perfect information — it is about extracting the best possible signal from imperfect information and making decisions that are proportionate to what the evidence can actually support. The goal is not certainty; it is calibrated confidence. That distinction — between demanding proof before acting and acting thoughtfully on the best available evidence — separates effective thinkers from those who are either reckless or permanently stuck.`,
    quizzes: [
      {
        question:
          "Why does the module argue that waiting for perfect data before making a decision is not a neutral choice?",
        options: [
          "Because data quality improves faster when decisions are made quickly",
          "Because waiting is itself a decision to maintain the status quo, which carries its own consequences",
          "Because perfect data eventually becomes outdated before it can be acted on",
          "Because decision-makers who wait lose credibility with their peers",
        ],
        correct: 1,
        explanation:
          "Inaction is a form of action — choosing to wait maintains whatever situation currently exists, with all its consequences, making it a decision in itself rather than a neutral pause before a real decision.",
      },
      {
        question:
          "A medical screening test for a serious but treatable illness has some false positive results. According to the module's framework, what does this suggest about the appropriate detection threshold?",
        options: [
          "The threshold should be raised to eliminate false positives, since unnecessary treatment is harmful",
          "The threshold should be kept low, because missing a genuine case is far more costly than an unnecessary follow-up",
          "The threshold should match the base rate of the illness in the general population",
          "The threshold is irrelevant if the test has been peer-reviewed and validated",
        ],
        correct: 1,
        explanation:
          "When the cost of a false negative — missing a serious treatable illness — is much higher than the cost of a false positive — an unnecessary but correctable alarm — the decision framework calls for a lower threshold for action.",
      },
      {
        question:
          "According to the module, which of the following should increase your confidence in a data finding?",
        options: [
          "The finding was published in a widely read mainstream news outlet",
          "The effect is statistically significant in a single large study funded by an interested party",
          "The finding has been replicated across multiple independent studies with a transparent methodology",
          "The claim is consistent with the intuitions of the person presenting it",
        ],
        correct: 2,
        explanation:
          "Independent replication across multiple studies with transparent methodology is one of the strongest indicators of a reliable finding — it reduces the probability that the result reflects chance, bias, or methodological quirks specific to one research team.",
      },
      {
        question:
          "What is the purpose of making your reasoning explicit when deciding under uncertainty?",
        options: [
          "To satisfy external reviewers who may later evaluate the decision",
          "To prevent post-hoc rationalisation and create a record that can be updated as new information arrives",
          "To ensure the decision follows a standardised format recognised across disciplines",
          "To slow down the decision-making process so that all options are fully explored",
        ],
        correct: 1,
        explanation:
          "Writing down the evidence, assumptions, and conditions for revision prevents the common error of constructing reasons after the fact to justify a decision made on different grounds — and produces a document that can be genuinely revisited when circumstances change.",
      },
      {
        question:
          "A student is deciding whether to change their study strategy based on one self-help article citing a single unpublished study. According to the framework, what should they do?",
        options: [
          "Implement the strategy immediately, since any evidence is better than none",
          "Reject the strategy entirely, since single unpublished studies are never reliable",
          "Treat it as a low-confidence signal, seek corroborating evidence from independent sources, and consider the cost of trying a low-stakes adjustment",
          "Wait until a peer-reviewed meta-analysis confirms the finding before making any change",
        ],
        correct: 2,
        explanation:
          "A single unpublished study warrants low but not zero weight — the appropriate response is calibrated scepticism, not dismissal or full acceptance. For a low-stakes reversible decision like adjusting a study habit, the threshold for a trial is reasonably low while stronger evidence is sought.",
      },
    ],
  })
  await addModule("Data Literacy and Critical Thinking", {
    title: "Putting It All Together — Analysing a Real Data Claim",
    description:
      "Apply every concept from this track — source evaluation, chart reading, statistical interpretation, and causal reasoning — to walk through a realistic data claim step by step and reach a well-reasoned final judgment.",
    orderIndex: 7,
    content: `## From Individual Skills to a Complete Analysis

You now have a full toolkit. You can read charts critically and spot truncated axes. You can distinguish relative risk from absolute risk and identify when an average conceals more than it reveals. You know that correlation does not imply causation and that confounding variables are often hiding in plain sight. You can evaluate a source by asking who collected the data, who funded it, and whether it has been independently replicated. And you know how to make a decision when the evidence is imperfect but a judgment is still required.

The final skill is integration — applying all of these tools in sequence to a single claim, without losing the thread between steps. This module walks through exactly that, using a realistic example of the kind of data claim you will encounter regularly in university, in the media, and in professional life.

## The Claim

A nutrition company publishes the following on its website, accompanied by a bar chart:

*"A new study shows that students who take our DailyFocus supplement scored 34% higher on concentration tests than students who did not. The bar chart below shows the dramatic improvement in focus scores. Thousands of students are already experiencing the benefits."*

Work through this claim using every layer of analysis the track has equipped you with.

## Layer 1 — Evaluate the Source

The first question is always: who produced this, and why? This claim appears on the nutrition company's own website — the same company that sells the supplement being studied. That is the strongest possible conflict of interest: the funder, the researcher, and the publisher are all the same entity with a direct commercial interest in a positive result.

There is no mention of peer review, no journal citation, no independent institution involved. The methodology is not described — we do not know who the participants were, how they were selected, how many there were, how "concentration tests" were defined or administered, or whether there was a control group.

At this stage, the source alone warrants substantial scepticism. A credible extraordinary claim requires credible methodology. None is visible here.

## Layer 2 — Read the Chart Critically

Before accepting the bar chart's visual impression, ask the three critical questions from Module 2. Where does the axis start? If the vertical axis begins at, say, 60 rather than 0, a difference between scores of 68 and 72 can be made to look as dramatic as a difference between 0 and 100. The claim uses the word "dramatic" — that word is doing work the numbers may not support.

What is not shown? There is no error bar, no confidence interval, no representation of how much individual scores varied. A mean score can look impressive while hiding the fact that results were wildly inconsistent across participants. And the time range is unspecified — were scores measured immediately after taking the supplement, or over weeks?

Who made this chart? The company selling the supplement. Every design choice serves the argument being made.

## Layer 3 — Interpret the Statistics

The headline figure is a 34% improvement in concentration test scores. Apply the relative versus absolute distinction immediately. What were the baseline scores? If students without the supplement scored an average of 50 out of 100, a 34% improvement would represent roughly 17 additional points — a meaningful absolute difference. If the baseline was 94 out of 100, a 34% relative improvement is mathematically impossible. Without the baseline, the percentage is uninterpretable.

The sample is described only as producing data for a "new study" — no size is given. A 34% effect in a sample of 20 participants in a single unblinded study is a very different claim from the same effect in a randomised controlled trial of 2,000.

## Layer 4 — Assess Causation

Even if we accept the correlation — students who took the supplement scored higher — the causal question remains open. Was this a randomised controlled trial, where participants were randomly assigned to supplement and placebo groups? If not, the students who chose to take a supplement may differ systematically from those who did not: they may be more motivated, more health-conscious, better rested, or better nourished generally. Any of these factors could cause both supplement-taking and higher test scores, producing a correlation with no causal link to the product.

Without random assignment and a blinded placebo control, the 34% difference cannot be attributed to the supplement. It describes a correlation between two groups that were probably not comparable to begin with.

## Layer 5 — Final Judgment

Applying the decision framework from Module 6: the source is conflicted and non-transparent; the chart is potentially misleading; the statistic is uninterpretable without the baseline; the sample size is unknown; and there is no evidence of random assignment, peer review, or independent replication.

The appropriate judgment is not that the supplement definitely does not work — it is that this claim provides no credible evidence that it does. The five-layer analysis has not found a flaw in the data; it has found an absence of trustworthy data altogether.

The action-relevant conclusion: do not act on this claim. If the question matters enough to investigate further, search for independent peer-reviewed research on the active ingredients, not the company's own publications.

## Analysis as a Habit

This five-layer process — source, chart, statistics, causation, judgment — sounds laborious when written out in full. With practice, it becomes rapid and automatic. Most claims collapse at Layer 1 or Layer 2, and the full analysis is rarely needed. The value of knowing all five layers is not that you apply them exhaustively every time — it is that nothing important slips past you when it counts.`,
    quizzes: [
      {
        question:
          "In the supplement example, why does the source of the claim — the company's own website — immediately warrant scepticism before any other analysis is performed?",
        options: [
          "Because company websites are not permitted to publish scientific research",
          "Because the funder, researcher, and publisher share the same commercial interest in a positive result, creating the strongest possible conflict of interest",
          "Because nutrition companies are required to publish only peer-reviewed data",
          "Because websites cannot display charts with sufficient accuracy for scientific claims",
        ],
        correct: 1,
        explanation:
          "When the entity funding the research, conducting it, and publishing it is the same organisation that profits from a positive result, every layer of independent scrutiny is absent — this is the strongest possible conflict of interest and the first reason to withhold confidence.",
      },
      {
        question:
          "The bar chart accompanying the claim is described as showing a 'dramatic improvement.' What is the first chart-reading question to ask?",
        options: [
          "Whether the chart uses a pie or bar format, since pie charts are less reliable",
          "Whether the data has been peer-reviewed before being displayed visually",
          "Where the vertical axis starts — a truncated axis can make small numerical differences appear visually dramatic",
          "Whether the chart includes a legend identifying the supplement brand",
        ],
        correct: 2,
        explanation:
          "The word 'dramatic' is a signal to check the axis — a truncated axis that starts above zero compresses the baseline and visually amplifies small differences into large-looking gaps, creating an impression disproportionate to the actual numerical change.",
      },
      {
        question:
          "The claim states students scored '34% higher' on concentration tests. Why is this figure uninterpretable without additional information?",
        options: [
          "Because percentage improvements are only valid for physical measurements, not cognitive tests",
          "Because the baseline score is not provided, making it impossible to calculate the absolute difference or assess whether the change is meaningful",
          "Because 34% is too large an effect size to be credible in a nutrition study",
          "Because the figure should have been expressed as a correlation coefficient rather than a percentage",
        ],
        correct: 1,
        explanation:
          "A relative percentage change is meaningless without the baseline — 34% of a score near the ceiling is mathematically and practically different from 34% of a low baseline score, and without the starting value the statistic cannot be evaluated.",
      },
      {
        question:
          "Why can the 34% score difference not be attributed to the supplement without evidence of random assignment?",
        options: [
          "Because random assignment is only required when the sample size exceeds 100 participants",
          "Because students who chose to take the supplement may differ from those who did not in ways that independently affect concentration scores, making the groups incomparable",
          "Because concentration tests are subjective measures that require blinding regardless of group assignment",
          "Because the supplement would need to be tested against multiple placebos to isolate its effect",
        ],
        correct: 1,
        explanation:
          "Without random assignment, the supplement group and the non-supplement group may differ systematically — in motivation, sleep, diet, or health awareness — and any of these confounders could explain the score difference independently of the supplement.",
      },
      {
        question:
          "After completing all five layers of analysis on the supplement claim, what is the most data-literate final judgment?",
        options: [
          "The supplement definitely does not work because no credible evidence supports it",
          "The supplement probably works because a 34% improvement is too large to be explained by confounding alone",
          "This claim provides no credible evidence that the supplement works, and acting on it is not warranted without independent peer-reviewed research",
          "The claim is plausible enough to act on because some evidence is always better than none",
        ],
        correct: 2,
        explanation:
          "The five-layer analysis reveals an absence of trustworthy evidence — not proof of ineffectiveness, but a complete lack of credible support. The appropriate conclusion is to withhold judgment and seek independent peer-reviewed research rather than acting on a conflicted, unverified claim.",
      },
    ],
  })
  await addModule("Academic Research and Writing Skills", {
    title: "Finding and Evaluating Academic Sources",
    description:
      "Learn where to find credible academic sources using Google Scholar and university databases, understand the difference between primary and secondary sources, evaluate credibility using a structured framework, and know when your research is sufficient to begin writing.",
    orderIndex: 2,
    content: `## Why Source Quality Determines Argument Quality

An essay is only as strong as the evidence it rests on. A well-structured argument built on unreliable sources is not a good essay — it is a well-organised mistake. Before you can write convincingly about any academic topic, you need to know where to find credible evidence, how to distinguish strong sources from weak ones, and how to judge when you have gathered enough to make your case.

## Where to Find Academic Sources

**Google Scholar** (scholar.google.com) is the most accessible starting point for most students. It indexes peer-reviewed journal articles, theses, books, and conference papers across virtually every discipline. Each result shows how many times a paper has been cited by other researchers — a rough but useful indicator of influence. Google Scholar is free and requires no login, though accessing full-text articles may require your university login for paywall content.

**University library databases** are the more powerful tool. Most universities subscribe to databases such as JSTOR, EBSCOhost, ProQuest, PubMed (for health sciences), PsycINFO (for psychology), and Scopus. These databases allow advanced filtering by date, publication type, peer-review status, and subject area — giving you far more control over search results than a general web search. Your university library website will list which databases you have access to and often provides guides for using them effectively.

**Reference chaining** is an underused technique: find one strong, relevant paper, then examine its reference list. The sources it cites are almost by definition relevant to your topic, and following those citations leads you quickly into the core literature of a field.

Avoid using general websites, Wikipedia, news articles, or blog posts as primary academic sources. These can be useful for orientation and background understanding, but they do not constitute academic evidence in a university argument.

## Primary vs Secondary Sources

A **primary source** is original material — the direct evidence or first-hand account from which knowledge is drawn. In the sciences, a primary source is the original research paper reporting a study's methodology and findings. In history, it might be a letter, treaty, or government document from the period being studied. In literature, it is the text itself.

A **secondary source** interprets, analyses, or synthesises primary sources. A journal article reviewing twenty studies on a topic is a secondary source. A textbook chapter summarising a field's research history is a secondary source. Secondary sources are valuable for understanding how a field interprets evidence, but they should not replace engagement with the primary research when precision matters.

In most university essays, you are expected to engage with both — secondary sources to situate your argument in the existing conversation, primary sources to ground your claims in direct evidence.

## Evaluating Credibility — The CRAAP Test

The **CRAAP test** is a structured framework for evaluating any source, particularly useful when a source falls outside the clear peer-reviewed category. The acronym stands for:

**Currency** — When was this published or last updated? In fast-moving fields like medicine or technology, a source from ten years ago may be significantly outdated. In humanities disciplines, older foundational texts may still be highly relevant.

**Relevance** — Does this source actually address your research question? A tangentially related paper that you are stretching to fit your argument is not a relevant source — it is a distraction.

**Authority** — Who wrote this, and what are their credentials? Is the author affiliated with a recognised research institution? Is the publication a peer-reviewed journal or an unreviewed platform?

**Accuracy** — Is the information supported by evidence and citations? Does it acknowledge limitations? Is it consistent with what other credible sources say on the topic?

**Purpose** — Why was this created? Is it to inform and report research findings, or to persuade, sell, or advocate for a particular position? Sources with an explicit agenda require additional scrutiny.

No single criterion disqualifies a source automatically, but a source that scores poorly on multiple dimensions should be treated with significant caution.

## How to Know When You Have Enough Sources

A common student error is either under-researching — grabbing the first five results and starting to write — or over-researching — reading indefinitely to delay the discomfort of drafting. Neither produces a strong essay.

You have sufficient sources when three conditions are met. First, **saturation**: new sources you find are largely citing the same key papers and making the same core arguments you have already encountered. Second, **coverage**: you have sources that address each major aspect of your argument, not just one angle. Third, **quality over quantity**: you have a smaller number of directly relevant, credible sources rather than a large number of loosely related ones. Ten strong, directly relevant sources will support a better essay than thirty marginal ones.

When you reach saturation and your key arguments are each supported by at least two independent credible sources, you are ready to write.`,
    quizzes: [
      {
        question:
          "What does the citation count displayed in Google Scholar results indicate?",
        options: [
          "The number of times the article has been downloaded from the internet",
          "The quality score assigned by Google's peer-review algorithm",
          "How many other researchers have referenced this paper in their own work — a rough indicator of influence",
          "The number of authors who contributed to the paper",
        ],
        correct: 2,
        explanation:
          "Citation count reflects how many subsequent academic works have referenced a paper — highly cited papers have influenced the field significantly, making citation count a useful but imperfect proxy for a source's academic relevance and impact.",
      },
      {
        question:
          "A student is writing an essay on the psychological effects of social media and finds a well-written blog post by a marketing consultant summarising recent studies. How should this source be used?",
        options: [
          "As a primary academic source, since it cites peer-reviewed research",
          "As background orientation only — the original peer-reviewed studies it references should be found and cited instead",
          "As a secondary source equivalent to a journal review article",
          "It should not be read at all, since non-academic sources contain no useful information",
        ],
        correct: 1,
        explanation:
          "A blog post, however well-written, does not constitute academic evidence — but it can point you toward the primary research it references, which should be located, evaluated, and cited directly in your essay.",
      },
      {
        question:
          "Which of the following is an example of a primary source for a psychology essay on memory?",
        options: [
          "A textbook chapter summarising fifty years of memory research",
          "A Wikipedia article about the multi-store model of memory",
          "The original 1968 journal article by Atkinson and Shiffrin reporting their memory model research",
          "A review article evaluating competing theories of memory storage",
        ],
        correct: 2,
        explanation:
          "A primary source is the original research report — the paper in which Atkinson and Shiffrin first presented their findings. Textbook chapters, Wikipedia articles, and review articles are all secondary sources that interpret or summarise primary research.",
      },
      {
        question:
          "Using the CRAAP test, which criterion is most relevant when evaluating whether a medical research article from 2008 is appropriate to cite in a 2025 essay?",
        options: [
          "Purpose — medical research is often funded by pharmaceutical companies",
          "Relevance — older articles are less likely to address current research questions",
          "Currency — in a fast-moving field like medicine, findings from 2008 may have been superseded or contradicted by more recent research",
          "Authority — researchers from 2008 may not have held the same credentials as current academics",
        ],
        correct: 2,
        explanation:
          "Currency is the most directly relevant criterion here — medical knowledge evolves rapidly, and a 2008 study may have been updated, challenged, or replaced by subsequent research, making it important to verify whether the findings still represent the current evidence base.",
      },
      {
        question:
          "According to the module, what does 'saturation' mean in the context of knowing when you have done enough research?",
        options: [
          "You have read every source available on your topic regardless of relevance",
          "You have found at least thirty sources covering multiple disciplines",
          "New sources you find are largely referencing the same key papers and repeating the same core arguments you have already encountered",
          "You have spent a minimum of ten hours searching before beginning to write",
        ],
        correct: 2,
        explanation:
          "Saturation occurs when the research process stops yielding genuinely new information — when new sources consistently cite the same foundational papers and repeat arguments you have already mapped, you have likely covered the core literature sufficiently to begin writing.",
      },
    ],
  })
  await addModule("Academic Research and Writing Skills", {
    title: "Building a Strong Academic Argument",
    description:
      "Learn what distinguishes an academic argument from personal opinion, how to structure claims with evidence and reasoning, how to connect sources to your own point rather than just quoting them, and how to identify and fix the most common weaknesses in student arguments.",
    orderIndex: 3,
    content: `## Opinion vs Argument — What Is the Difference?

Everyone has opinions. Academic writing requires something more demanding: a structured argument. The difference is not about confidence or passion — it is about the relationship between the claim you are making and the evidence you are using to support it.

An opinion is a position held on the basis of feeling, intuition, or personal experience: "I think social media is bad for young people." An academic argument makes a specific, contestable claim and supports it with evidence that has been reasoned through: "Longitudinal studies suggest that passive social media consumption — scrolling without posting — is more strongly associated with reduced wellbeing in adolescents than active engagement, though this relationship is moderated by pre-existing social comparison tendencies."

The academic version is harder to write, but it does something the opinion cannot: it tells the reader exactly what is being claimed, on what basis, and under what conditions. It invites scrutiny rather than agreement, and it can be evaluated, challenged, and built upon by other researchers.

## The Claim-Evidence-Reasoning Structure

The fundamental unit of academic argument is a three-part structure: **claim**, **evidence**, and **reasoning**. Every paragraph that advances your argument should contain all three, though not necessarily in a rigid sequence.

**The claim** is your point — a specific, arguable statement that your paragraph will support. It should not be a fact everyone accepts, and it should not be so broad that no evidence could adequately support it.

**The evidence** is the support — a finding, datum, example, or quotation from a credible source that is relevant to the claim. Evidence on its own does not make an argument; it is raw material.

**The reasoning** is the bridge — the explanation of why and how the evidence supports the claim. This is the part most students omit, and its absence is the most common reason a paragraph fails to persuade.

A worked example:

*Claim:* Retrieval practice produces more durable long-term memory than re-reading.
*Evidence:* Roediger and Karpicke (2006) found that students who completed retrieval practice tests retained significantly more information one week later than those who re-read the material.
*Reasoning:* This suggests that the act of recalling information from memory — rather than passively re-exposing oneself to it — strengthens the memory trace in ways that predict long-term retention, making retrieval a more efficient study strategy than review.

Notice that the reasoning does not simply restate the evidence. It interprets it, explains the mechanism, and connects it back to the claim explicitly.

## Connecting Evidence to Your Point

A recurring weakness in student essays is what might be called the "quote dump" — inserting a quotation or paraphrased finding and then moving on, leaving the reader to infer the connection themselves. This is not argument; it is decoration.

Every piece of evidence you introduce should be followed by your analysis of it. Ask yourself three questions after placing any evidence in your essay: What does this show? Why does this matter for my claim? What does this add that the previous evidence did not?

Use your own voice to do this work. Phrases like "This indicates that...", "What this suggests is...", and "This is significant because..." are signals that you are performing the reasoning your reader needs to follow your argument rather than simply presenting data and hoping the point is obvious.

Paraphrasing is generally preferable to direct quotation in academic writing, because it demonstrates that you have understood the source rather than merely copied it. Reserve direct quotation for cases where the specific wording of the original is itself significant — a precise definition, a theoretical formulation, or a phrase whose meaning would change if paraphrased.

## Common Weaknesses in Student Arguments

**Asserting without evidencing.** Making strong claims without any supporting source is the most elementary error. Every contestable claim requires a citation.

**Evidencing without reasoning.** Placing a citation after a claim without explaining what it shows or why it matters. The citation becomes a gesture toward evidence rather than an actual argument.

**Over-quoting.** Filling paragraphs with long block quotations gives the impression of research but demonstrates no understanding. Your analysis of sources is what is being assessed, not your ability to copy them.

**Failing to acknowledge counter-evidence.** A one-sided argument that ignores contradicting evidence is weaker than one that addresses it. Acknowledging that the evidence is mixed, and explaining why your interpretation is nonetheless more persuasive, demonstrates a level of intellectual sophistication that one-sided arguments cannot.

**Paragraph sprawl.** A paragraph that advances three separate claims supports none of them adequately. Each paragraph should have one central claim, supported and reasoned through completely, before the essay moves on.

## Argument as Intellectual Responsibility

Building a strong academic argument is not just a writing skill — it is an intellectual commitment to honesty. It means claiming only what your evidence can support, acknowledging the limits of that evidence, and making your reasoning visible so others can evaluate it. Essays that do this well do not just earn better marks — they contribute something genuine to the conversation they are part of.`,
    quizzes: [
      {
        question:
          "What is the key difference between an academic argument and a personal opinion?",
        options: [
          "An academic argument is written in formal language while an opinion uses informal language",
          "An academic argument makes a specific contestable claim supported by evidence and explicit reasoning, while an opinion rests on feeling or personal experience",
          "An academic argument must be at least 1000 words to distinguish it from a short opinion",
          "An opinion becomes an academic argument once it is supported by a single citation",
        ],
        correct: 1,
        explanation:
          "The distinction is structural and epistemic — an academic argument specifies exactly what is claimed, on what evidential basis, and through what reasoning, making it open to scrutiny and evaluation in a way a personal opinion is not.",
      },
      {
        question:
          "In the claim-evidence-reasoning structure, what role does the reasoning component play?",
        options: [
          "It introduces the topic of the paragraph before the claim is stated",
          "It summarises the evidence in simpler language for the reader",
          "It restates the claim using different wording to reinforce the point",
          "It explains how and why the evidence supports the claim, bridging the two rather than leaving the connection implicit",
        ],
        correct: 3,
        explanation:
          "Reasoning is the analytical bridge between evidence and claim — it explains the mechanism, interprets the significance, and makes explicit the logical connection that the reader needs to follow the argument, rather than leaving them to infer it.",
      },
      {
        question:
          "A student writes: 'Social media has been shown to harm mental health (Smith, 2021).' What is the primary weakness of this sentence as an academic argument?",
        options: [
          "The citation format is incorrect and should include the full journal title",
          "The claim is too specific and would benefit from a broader scope",
          "The evidence is present but there is no reasoning explaining what Smith found or why it supports the claim",
          "The sentence uses passive voice, which is not acceptable in academic writing",
        ],
        correct: 2,
        explanation:
          "The sentence drops a citation without explaining what Smith's study found, how it was conducted, or why it supports the specific claim being made — evidence without reasoning is the most common structural weakness in student academic writing.",
      },
      {
        question:
          "When is it most appropriate to use a direct quotation rather than paraphrasing a source?",
        options: [
          "Whenever the source is particularly long and summarising it would take too many words",
          "When the specific wording of the original is itself significant — such as a precise definition or theoretical formulation whose meaning would change if reworded",
          "For every piece of evidence, since direct quotations demonstrate more thorough research than paraphrasing",
          "Only when the source is a primary document such as a historical text or legal statute",
        ],
        correct: 1,
        explanation:
          "Paraphrasing demonstrates understanding and integrates evidence more fluidly into your own argument — direct quotation should be reserved for cases where the exact wording matters, such as a key definition, a theoretical claim, or a phrase whose specific phrasing is the subject of analysis.",
      },
      {
        question:
          "Why does acknowledging counter-evidence strengthen rather than weaken an academic argument?",
        options: [
          "It increases the word count and demonstrates that more research was conducted",
          "It signals to the examiner that the student has read a broader range of sources",
          "Addressing contradicting evidence and explaining why your interpretation is nonetheless more persuasive demonstrates intellectual rigour and makes your argument harder to dismiss",
          "It satisfies the requirement for balance that all academic essays must meet",
        ],
        correct: 2,
        explanation:
          "An argument that ignores contradicting evidence appears selective and fragile — one that confronts counter-evidence and explains why it does not undermine the central claim demonstrates genuine engagement with the complexity of the evidence and produces a more persuasive, intellectually honest case.",
      },
    ],
  })
  await addModule("Academic Research and Writing Skills", {
    title: "Understanding and Avoiding Plagiarism",
    description:
      "Learn what plagiarism is and why universities treat it seriously, how to quote, paraphrase, and summarise correctly, how citation works in principle, and how to avoid the accidental plagiarism mistakes that catch most students off guard.",
    orderIndex: 4,
    content: `## What Plagiarism Is — and Why It Matters

Plagiarism is presenting someone else's words, ideas, data, or creative work as your own without appropriate acknowledgment. It encompasses a wide range of behaviours — from copying a paragraph verbatim without quotation marks, to paraphrasing a source too closely, to submitting work written by someone else entirely, to reusing your own previously submitted work without disclosure.

Universities treat plagiarism seriously for reasons that go beyond rule enforcement. Academic knowledge is built on attribution — the system of citations that allows every claim to be traced back to its origin, evaluated for credibility, and built upon by subsequent researchers. When that attribution is falsified or omitted, the integrity of the entire system is compromised. For the individual student, plagiarism also undermines the purpose of assessment: the point of writing an essay is to develop and demonstrate your own thinking, and submitting someone else's thinking defeats that purpose entirely regardless of whether you are caught.

Most plagiarism at university is not deliberate fraud. It is the product of poor note-taking habits, misunderstanding what citation requires, or confusion about the difference between quoting, paraphrasing, and summarising. Understanding these distinctions is the most practical defence against accidental academic misconduct.

## Quoting, Paraphrasing, and Summarising

These three techniques are not interchangeable. Each has a specific use and a specific set of requirements.

**Quoting** means reproducing an author's exact words, enclosed in quotation marks, with a citation. Use direct quotation when the specific wording is significant — a precise definition, a theoretical formulation, or a phrase whose meaning would be altered by rewording. Quote sparingly. An essay dense with quotations demonstrates copying, not understanding.

\`\`\`
Original: "Memory consolidation occurs primarily during slow-wave sleep."
Quoted: According to Walker (2017), "memory consolidation occurs primarily during slow-wave sleep" (p. 43).
\`\`\`

**Paraphrasing** means restating a specific idea from a source in your own words and sentence structure, with a citation. Paraphrasing is not synonym substitution — replacing a few words while keeping the original sentence structure is still plagiarism. A genuine paraphrase reconstructs the idea from your understanding of it.

\`\`\`
Original: "Memory consolidation occurs primarily during slow-wave sleep."
Poor paraphrase (still plagiarism): Memory solidification happens mainly during slow-wave sleep (Walker, 2017).
Strong paraphrase: Walker (2017) argues that the process by which memories become stable and durable is concentrated in the deep, non-REM stages of the sleep cycle.
\`\`\`

**Summarising** means condensing the main point or argument of a larger passage or entire source into a brief overview in your own words, with a citation. Summaries cover more ground than paraphrases and are used to represent the general thrust of a source rather than a specific claim within it.

In all three cases, a citation is required. The common misconception that only direct quotations need citations is one of the most dangerous misunderstandings in academic writing. If the idea came from someone else, it needs a citation — regardless of how thoroughly you have reworded it.

## How Citation Works in Principle

Citation systems vary by discipline — APA is common in social sciences, Harvard in many humanities, Vancouver in medicine, Chicago in history — but all citation systems serve the same two functions: they give credit to the original source, and they give the reader enough information to locate that source themselves.

Every citation has two components that must both be present. The **in-text citation** appears within your writing at the point where you use the source — typically the author's surname and year of publication. The **reference list entry** appears at the end of your document and provides the full details: author, title, publication, year, and where applicable the URL or DOI.

Check your university's style guide or your unit outline for the required citation format in each subject. The specific formatting varies, but the principle — attribute every borrowed idea, in the text and in the reference list — is universal.

## Common Accidental Plagiarism Mistakes

**Copy-paste note-taking.** When researching, students often paste source text directly into their notes without marking it as a quotation. Later, when writing, they use that text assuming it was their own summary. Solution: always mark copied text clearly in your notes with quotation marks and the source, or only write notes in your own words from the start.

**Paraphrasing too closely.** Changing a few words while preserving the sentence structure and sequence of ideas of the original is still plagiarism, even with a citation. Solution: read the source, close it, wait a moment, then write the idea in your own words from memory.

**Forgetting to cite a paraphrase.** Believing that a citation is only required for direct quotation. Solution: apply a simple rule — if you would not have written that sentence without reading that source, it needs a citation.

**Mosaic plagiarism.** Weaving together phrases from multiple sources without quotation marks, creating text that appears original but is assembled from others' language. Solution: every phrase that is not your own language requires either quotation marks or genuine paraphrase.

**Inadequate citation.** Citing a source in the reference list but not in the text at the point of use, or vice versa. Both components are always required.

## Attribution as Intellectual Honesty

Proper citation is not bureaucratic box-ticking. It is the written expression of intellectual honesty — an acknowledgment that your thinking has been shaped by others, and a signpost that allows your reader to engage with those sources directly. Students who cite well are not demonstrating that they needed other people's ideas; they are demonstrating that they know how to use them.`,
    quizzes: [
      {
        question:
          "A student reads a source, then rewords each sentence by replacing key words with synonyms while keeping the same sentence structure and sequence of ideas. They include a citation. Is this plagiarism?",
        options: [
          "No — because they have changed the words and included a citation",
          "No — because synonym substitution with a citation satisfies paraphrasing requirements",
          "Yes — because genuine paraphrase requires reconstructing the idea in your own sentence structure, not just substituting words in the original structure",
          "Yes — but only if the source is a peer-reviewed journal article",
        ],
        correct: 2,
        explanation:
          "Synonym substitution that preserves the original sentence structure is a form of plagiarism known as close paraphrasing — a genuine paraphrase requires that you reconstruct the idea from your own understanding, producing a sentence that reflects your voice and structure rather than the source's.",
      },
      {
        question:
          "When is a citation required in academic writing?",
        options: [
          "Only when using a direct quotation with the source's exact words",
          "Only when the source is a peer-reviewed journal article",
          "Whenever an idea, finding, argument, or piece of data originated from another source — regardless of whether it is quoted or paraphrased",
          "Only when the information could not be considered general knowledge",
        ],
        correct: 2,
        explanation:
          "The obligation to cite is triggered by the origin of the idea, not the form in which it appears — paraphrased ideas, summarised arguments, and specific data all require citation just as direct quotations do, because all represent intellectual content that belongs to another author.",
      },
      {
        question:
          "What is 'mosaic plagiarism'?",
        options: [
          "Submitting the same essay to two different units without disclosure",
          "Weaving together phrases and sentences from multiple sources without quotation marks to create text that appears original",
          "Citing a source in the reference list but failing to include an in-text citation",
          "Using images or diagrams from sources without attribution",
        ],
        correct: 1,
        explanation:
          "Mosaic plagiarism assembles unacknowledged language from multiple sources into what superficially appears to be original writing — because no single source is copied in full, it can escape simple plagiarism detection while still misrepresenting others' language as the student's own.",
      },
      {
        question:
          "What is the most reliable note-taking practice to prevent accidental plagiarism during research?",
        options: [
          "Copy source text faithfully into notes and add a citation at the end of the note",
          "Only take notes from sources that are freely available online",
          "Mark all copied text clearly with quotation marks and source details in your notes, or write notes exclusively in your own words from the moment of reading",
          "Limit note-taking to a maximum of three sources per essay to reduce the risk of confusion",
        ],
        correct: 2,
        explanation:
          "The most common pathway to accidental plagiarism is copy-pasted research notes that are later mistaken for the student's own writing — clearly marking all copied text at the point of note-taking, or writing only in your own words from the start, eliminates this risk entirely.",
      },
      {
        question:
          "A student's essay includes a full reference list entry for every source used, but no in-text citations appear within the body of the essay. What is the problem?",
        options: [
          "There is no problem — a complete reference list satisfies citation requirements",
          "The reference list entries need to include page numbers to be complete",
          "Both components of citation are required — in-text citations at the point of use and reference list entries — and the absence of in-text citations means the reader cannot identify which claims are attributed to which sources",
          "Reference lists are only required in certain citation styles and may not be applicable to this student's discipline",
        ],
        correct: 2,
        explanation:
          "Citation has two inseparable components — the in-text citation identifies where in your argument a specific source is being used, while the reference list provides the full details to locate it. A reference list without in-text citations leaves the reader unable to determine which ideas belong to which source.",
      },
    ],
  })
  await addModule("Academic Research and Writing Skills", {
    title: "Writing a Literature Review",
    description:
      "Understand what a literature review is and why it matters, how to organise sources thematically rather than as a list of summaries, how to identify a genuine research gap, and how to write the gap statement that connects existing literature to your own work.",
    orderIndex: 5,
    content: `## What a Literature Review Is — and Is Not

A literature review is one of the most commonly misunderstood pieces of academic writing. Many students approach it as a sequence of source summaries — paragraph one describes Smith (2019), paragraph two describes Jones (2021), paragraph three describes Brown (2022) — and produce something that reads like an annotated bibliography rather than an academic argument.

A literature review is not a collection of summaries. It is a **critical synthesis** of existing research on a topic, written to establish what is known, how different researchers have approached the question, where they agree and disagree, and — crucially — what remains unknown, contested, or underexplored. Its purpose is not to prove that you have read widely. Its purpose is to position your own research within the existing conversation and justify why that research needs to exist.

## Organising Thematically, Not Source by Source

The structural shift that transforms a list of summaries into a genuine literature review is organising by **theme or argument** rather than by source. Instead of dedicating a paragraph to each paper you have read, you identify the major patterns, debates, and threads that run across the literature and organise your writing around those.

A practical approach: after reading your sources, identify three to five recurring themes, tensions, or findings that appear across multiple papers. These become the organisational pillars of your review. Under each theme, you bring together the relevant sources — agreeing, disagreeing, qualifying each other — and discuss them in relation to the theme rather than in isolation.

For example, a literature review on the effects of sleep deprivation might be organised around three themes: cognitive performance effects, emotional regulation effects, and the role of individual differences in vulnerability. Under each theme, multiple studies are discussed together, with the review tracing points of consensus, disagreement, and methodological variation. No single paper takes a paragraph to itself unless it is foundational enough to warrant that focus.

This structure signals to your reader — and your examiner — that you have understood the literature, not merely read it. The difference in academic quality between a source-by-source and a thematic review is substantial.

## Synthesising Rather Than Summarising

Within each thematic section, your writing should synthesise rather than summarise. Synthesis means drawing out the relationships between sources — where they converge, where they conflict, and what the pattern of evidence suggests when viewed together.

Phrases that signal synthesis: "Taken together, these studies suggest...", "While Smith (2019) found X, Jones (2021) challenges this by arguing Y, and the discrepancy may be explained by...", "A consistent finding across multiple studies is..., though this pattern is complicated by research showing..."

Phrases that signal mere summary and should be used sparingly: "Smith (2019) found that...", "According to Jones (2021)...", "Brown (2022) argues that..." — these are useful when introducing a specific finding, but a paragraph consisting entirely of such sentences is a list of summaries, not a synthesis.

## Identifying a Research Gap

A research gap is a space in the existing literature where something important has not been adequately addressed. Identifying a genuine gap is what gives your own research its justification — it answers the implicit question your reader is always asking: why does this study need to exist?

Gaps take several forms. A **population gap** exists when a phenomenon has been studied in one group but not in another — many psychological studies have been conducted exclusively on Western university students, leaving questions about whether findings apply elsewhere. A **methodological gap** exists when existing research has relied on the same design or measure in ways that limit what can be concluded. A **theoretical gap** exists when competing theories have not been adequately tested against each other. A **recency gap** exists when the literature is dominated by older studies and more recent developments have not yet been examined.

To identify the gap, read the limitations sections of your sources carefully — researchers typically acknowledge what their own work does not address. Look for disagreements between studies that have not been resolved. Notice if a particular variable, population, or context is absent from the conversation.

## Writing the Gap Statement

The gap statement is the sentence or short paragraph that names the gap explicitly and connects it to the research you are about to present. It is typically the final movement of a literature review, and it performs two functions: it closes the review by crystallising what is missing, and it opens the research by explaining why your study addresses something that matters.

A strong gap statement follows this logic: existing research has established X and Y, but Z remains unexamined — this study addresses Z by...

For example: *While substantial research has documented the cognitive effects of sleep deprivation in laboratory conditions, the effects of naturally occurring, cumulative sleep restriction on academic performance in real-world student populations remain poorly understood. This study addresses that gap by...*

The gap statement is the hinge between the literature and your own work. Write it last, after you have synthesised everything else, and make it specific enough that the reader understands exactly what space your research is stepping into.`,
    quizzes: [
      {
        question:
          "What is the fundamental difference between a literature review and an annotated bibliography?",
        options: [
          "A literature review uses more sources and is therefore longer than an annotated bibliography",
          "An annotated bibliography summarises each source separately, while a literature review critically synthesises sources around themes, debates, and patterns to position new research",
          "A literature review only includes peer-reviewed sources, while an annotated bibliography can include any source type",
          "An annotated bibliography is written before research begins, while a literature review is written after data collection",
        ],
        correct: 1,
        explanation:
          "The defining distinction is structural and analytical — an annotated bibliography describes each source in isolation, while a literature review synthesises across sources to reveal patterns, tensions, and gaps that justify new research.",
      },
      {
        question:
          "Why is thematic organisation preferable to source-by-source organisation in a literature review?",
        options: [
          "It reduces the total number of citations needed and makes the review easier to write",
          "It allows the writer to exclude sources that contradict their argument",
          "Organising by theme demonstrates understanding of the literature as a whole — the relationships between ideas — rather than just familiarity with individual papers",
          "Examiners require thematic organisation as a formatting standard in most universities",
        ],
        correct: 2,
        explanation:
          "Thematic organisation groups sources by the ideas and patterns they share, revealing how the field of knowledge is structured — this demonstrates genuine understanding of the literature, whereas source-by-source organisation only demonstrates that the papers were read.",
      },
      {
        question:
          "Which of the following sentences best exemplifies synthesis rather than summary?",
        options: [
          "Smith (2019) found that stress negatively affects academic performance.",
          "According to Jones (2021), sleep quality mediates the relationship between stress and performance.",
          "While Smith (2019) and Jones (2021) both document a negative relationship between stress and performance, they differ on the mechanism — Smith emphasises cortisol elevation while Jones identifies sleep disruption as the primary pathway.",
          "Brown (2022) reviewed previous studies on stress and concluded that more research is needed.",
        ],
        correct: 2,
        explanation:
          "Synthesis draws out the relationship between sources — agreement, disagreement, and what the pattern means — rather than reporting each source's findings separately. The third option explicitly compares two sources on a specific point of divergence, which is the defining move of synthesis.",
      },
      {
        question:
          "A student notices that most studies on digital learning tools have been conducted with undergraduate students in North America. What type of research gap does this represent?",
        options: [
          "A theoretical gap — competing theories have not been tested against each other",
          "A methodological gap — existing studies have used flawed research designs",
          "A recency gap — the studies are too old to reflect current technology",
          "A population gap — the phenomenon has been studied in one group but findings may not generalise to other populations or regions",
        ],
        correct: 3,
        explanation:
          "When existing research has focused on a specific population and it is unclear whether findings apply elsewhere, this constitutes a population gap — the research question has been addressed, but only for a narrow slice of the relevant population.",
      },
      {
        question:
          "Where in a literature review does the gap statement typically appear, and what two functions does it serve?",
        options: [
          "At the beginning, to explain why the topic was chosen and outline the structure of the review",
          "Throughout the review, repeated under each thematic section to reinforce the argument",
          "At the end, to close the review by naming what is missing and open the research section by explaining what the current study addresses",
          "In a separate section after the reference list, to avoid interrupting the flow of the synthesis",
        ],
        correct: 2,
        explanation:
          "The gap statement is the hinge between the literature review and the research — positioned at the end of the review, it crystallises what remains unaddressed in the existing literature and immediately connects that absence to the study being introduced.",
      },
    ],
  })
  await addModule("Academic Research and Writing Skills", {
    title: "Academic Writing Style — Clarity, Precision, and Tone",
    description:
      "Learn what distinguishes academic writing from casual writing, how to write precisely without unnecessary complexity, when and how to use hedging language, and how to fix the most common style mistakes students make — with before and after examples.",
    orderIndex: 6,
    content: `## What Academic Writing Actually Is

There is a widespread misconception that academic writing means long sentences, obscure vocabulary, and a tone of deliberate complexity. This misconception produces essays that are difficult to read, imprecise in their claims, and less persuasive than their simpler counterparts.

Academic writing is not defined by complexity. It is defined by **precision, evidence-grounding, and appropriate epistemic humility**. A well-written academic sentence says exactly what it means, no more and no less, on the basis of evidence, with appropriate acknowledgment of uncertainty. That can be achieved in plain language. In fact, it is achieved more reliably in plain language than in inflated prose, because vague and convoluted sentences conceal imprecision rather than eliminating it.

The real distinction between academic and casual writing is not vocabulary size — it is the relationship between claims and evidence, the specificity of language, and the disciplined avoidance of overstatement.

## Precision Without Unnecessary Complexity

Precision means using words that match your meaning as exactly as possible. It does not mean using longer or rarer words. "Utilise" does not mean anything different from "use." "Commence" is not more precise than "begin." Substituting common words with formal-sounding equivalents produces a tone of academic performance without improving the quality of the thought.

Precision problems in student writing most often take the form of vague nouns and imprecise verbs. Consider the difference:

**Vague:** "Society has issues with how young people use technology."
**Precise:** "Adolescents' increasing use of smartphones during evening hours has been associated with delayed sleep onset and reduced sleep duration."

The precise version specifies the population (adolescents), the behaviour (smartphone use during evening hours), and the outcomes (delayed sleep onset, reduced sleep duration). The vague version could mean almost anything and supports no argument.

Apply this test to your own sentences: could someone disagree with what you have written, or is it too vague to be contestable? If it cannot be disagreed with, it is probably not saying anything specific enough to be useful.

## The Role of Hedging Language

**Hedging** is the use of language that signals appropriate uncertainty about a claim. It is not weakness — it is intellectual honesty, and it is a required feature of academic writing because most empirical claims are probabilistic rather than absolute.

Compare: "Sleep deprivation causes poor academic performance" versus "Sleep deprivation has been associated with reduced academic performance across several longitudinal studies."

The first version asserts a universal causal relationship that the evidence rarely supports with certainty. The second version accurately represents what the research shows — a consistent association established through a particular type of study — without overclaiming.

Common hedging expressions: *suggests, indicates, appears to, is associated with, may, tends to, the evidence implies, findings point toward, this is consistent with.* These are not filler phrases — they carry specific epistemic meaning. Using them accurately is a mark of scholarly maturity.

The error to avoid is double hedging — stacking so many qualifiers that the sentence says nothing: "It could perhaps be suggested that there might possibly be some relationship..." One appropriate hedge is precise. Multiple hedges signal either extreme uncertainty or a failure to commit to a position you actually hold.

## Common Style Mistakes — Before and After

**Mistake 1: Casual register**
Before: "Loads of studies show that sleep is really important for memory."
After: "A substantial body of research indicates that adequate sleep plays a significant role in memory consolidation."

The revision removes informal intensifiers ("loads," "really") and replaces them with language that specifies degree without relying on colloquial emphasis.

**Mistake 2: Vague claims masquerading as statements**
Before: "Mental health is a big problem for students these days."
After: "Rates of anxiety and depression among university students have increased significantly over the past decade, with recent surveys suggesting that one in four students experiences a diagnosable mental health condition during their degree."
The revision makes a specific, evidenced claim rather than a general observation.

**Mistake 3: Inflated vocabulary hiding weak ideas**
Before: "The utilisation of multifarious pedagogical methodologies facilitated the amelioration of educational outcomes."
After: "Using a variety of teaching methods improved student learning outcomes."
Simpler language exposes whether the idea itself is sound. In this case, it is — and it reads far better.

**Mistake 4: First-person overclaiming**
Before: "I believe that social media is destroying democracy."
After: "Some scholars argue that algorithmic amplification of divisive content on social media platforms may contribute to political polarisation."
Academic writing attributes positions to evidence and authors, not to personal belief. Reserve first-person constructions for describing your own analytical moves ("This essay argues that...") rather than your opinions.

**Mistake 5: Sentence sprawl**
Before: "There are many different factors that have been identified by researchers as potentially contributing to the complex phenomenon of student burnout, which is a multifaceted issue that affects many students."
After: "Researchers have identified several contributing factors to student burnout, including workload, sleep deprivation, and perceived lack of control."
Every word should earn its place. Sentences that delay their meaning with padding reduce clarity and signal to the reader that precision is not a priority.

## Clarity as an Ethical Commitment

Writing clearly is not just a stylistic preference — it is a commitment to your reader. Academic arguments are addressed to people whose time is valuable and whose understanding matters. An argument buried in inflated prose may protect the writer from scrutiny, but it fails the reader and, ultimately, fails the intellectual project the writing is meant to serve.`,
    quizzes: [
      {
        question:
          "Which of the following best describes what makes writing 'academic' rather than just formal?",
        options: [
          "Using long sentences, technical vocabulary, and avoiding the first person entirely",
          "Writing in a passive voice throughout to avoid any suggestion of personal involvement",
          "Making claims that are precisely worded, grounded in evidence, and appropriately qualified to reflect the actual strength of the evidence",
          "Ensuring every paragraph contains at least three citations from peer-reviewed sources",
        ],
        correct: 2,
        explanation:
          "Academic writing is defined by the relationship between claims and evidence, the specificity of language, and epistemic honesty — not by surface features like sentence length, passive voice, or citation density.",
      },
      {
        question:
          "A student rewrites 'use' as 'utilise' and 'begin' as 'commence' throughout their essay. What does this achieve?",
        options: [
          "It improves precision by using more specific terminology for academic contexts",
          "It signals subject-specific vocabulary that examiners expect in formal writing",
          "It adds a tone of academic performance without improving the precision or quality of the underlying ideas",
          "It satisfies the requirement for formal register that all university essays must meet",
        ],
        correct: 2,
        explanation:
          "'Utilise' and 'use' are functionally synonymous in most contexts — substituting the longer form creates the appearance of formality without adding meaning, which is precisely the kind of inflation that obscures rather than improves academic writing.",
      },
      {
        question:
          "What is the purpose of hedging language in an academic claim?",
        options: [
          "To make the writer appear less confident so that criticism is less likely",
          "To signal appropriate epistemic uncertainty — accurately representing the strength and limits of the evidence rather than overclaiming",
          "To reduce word count by replacing definitive statements with shorter qualified ones",
          "To avoid making claims that could be directly tested or falsified",
        ],
        correct: 1,
        explanation:
          "Hedging is a mark of scholarly precision — it calibrates the strength of a claim to match the strength of the evidence, which is an intellectual requirement in empirical fields where most findings are probabilistic rather than absolute.",
      },
      {
        question:
          "Which revision best corrects the following sentence: 'I believe that social media is ruining society'?",
        options: [
          "'I strongly believe that social media is ruining society, as many people would agree.'",
          "'It is believed by this author that social media is having negative societal effects.'",
          "'Research suggests that certain features of social media platforms, such as algorithmic content amplification, may contribute to measurable negative social outcomes.'",
          "'Social media is clearly ruining society, which is why this essay will examine its effects.'",
        ],
        correct: 2,
        explanation:
          "The revision removes personal belief framing, specifies which features of social media are implicated, uses appropriate hedging ('may contribute'), and grounds the claim in a researchable mechanism — all of which make it a precise, evidenceable academic statement rather than an opinion.",
      },
      {
        question:
          "What is wrong with the following sentence and how should it be revised?\n\n'There are many different factors that researchers have identified as contributing to the complex and multifaceted phenomenon of academic burnout, which is something that affects a significant number of students.'",
        options: [
          "It uses passive voice, which should be replaced with active constructions throughout",
          "It is too short and needs additional detail about which researchers identified these factors",
          "It delays its meaning with padding and repetition — it can be revised to 'Researchers have identified several factors contributing to academic burnout, a condition affecting a significant proportion of students'",
          "It uses hedging language inappropriately — 'have identified' should be replaced with a stronger assertion",
        ],
        correct: 2,
        explanation:
          "The original sentence uses filler phrases ('many different,' 'complex and multifaceted,' 'something that') that delay meaning without adding information — the revision preserves the content while eliminating the padding, making the sentence more direct and easier to read.",
      },
    ],
  })
  await addModule("Academic Research and Writing Skills", {
    title: "Putting It All Together — Write a Short Research Summary",
    description:
      "Apply every skill from this track to write a complete 300-word academic research summary — choosing a focused topic, locating and evaluating a source, extracting the core argument, and producing structured academic prose with the correct tone, precision, and citation awareness.",
    orderIndex: 7,
    content: `## From Individual Skills to a Complete Piece of Writing

Every module in this track has given you one layer of the academic writing process. You know how to find and evaluate credible sources, construct a claim-evidence-reasoning argument, avoid plagiarism through proper quotation and paraphrase, synthesise rather than summarise, and write with precision and appropriate hedging. This final module brings all of those layers together into one coherent task: writing a short but complete academic research summary.

A 300-word summary is a demanding format precisely because it is short. Every sentence must carry weight. There is no room for vague claims, redundant phrasing, or padding. Done well, a 300-word academic summary demonstrates more skill than a padded 1500-word essay, because it requires genuine understanding rather than volume.

## Step 1 — Choose a Focused Topic

Do not begin with a broad subject. "Climate change," "mental health," or "artificial intelligence" are categories, not topics. A focused topic is a specific question or phenomenon within a category that a single source can meaningfully address.

Useful narrowing questions: What aspect? In which population? Under what conditions? With what outcome?

**Too broad:** The effects of exercise on mental health.
**Focused:** The effect of aerobic exercise frequency on self-reported anxiety symptoms in university students.

A focused topic makes source selection easier, because you are looking for something specific rather than browsing a vast field.

## Step 2 — Find and Evaluate One Source

Using Google Scholar or your university database, search for a peer-reviewed article that addresses your focused topic directly. Apply the evaluation checklist from Module 2: check the author's institutional affiliation, confirm the journal is peer-reviewed, note the publication year, and identify the funding source if disclosed.

Read the abstract carefully first. The abstract tells you whether the article is genuinely relevant before you invest time in the full paper. Once you have confirmed relevance, read the introduction, results, and conclusion — you do not need to understand every methodological detail to extract the core argument accurately.

## Step 3 — Extract the Core Argument

Before writing a word of your summary, identify four things in the source:

**The research question:** What was the study trying to find out?
**The method in brief:** How was it investigated? (survey, experiment, analysis of existing data)
**The key finding:** What did the results show?
**The main conclusion or implication:** What does this mean, and what does the author claim follows from it?

Write these four points in your own words as brief notes — not copied from the source. This is your raw material. The summary is built from this understanding, not from the source's own sentences.

## Step 4 — Write the Summary

A 300-word academic research summary has three parts.

**Opening (approximately 60 words):** Introduce the topic and source. Name the author, year, and the research question the study addresses. Establish why this question matters in one sentence.

\`\`\`
Cheng et al. (2023) investigate the relationship between aerobic exercise frequency
and self-reported anxiety symptoms among full-time university students, a population
in which anxiety prevalence has risen sharply over the past decade. The study responds
to a gap in existing research, which has predominantly examined exercise effects in
clinical rather than non-clinical student populations.
\`\`\`

**Body (approximately 180 words):** Describe the method briefly, report the key findings with appropriate hedging, and explain the reasoning that connects findings to conclusions. Use paraphrase throughout — your voice, their ideas, a citation.

\`\`\`
Using a longitudinal survey design across one semester, the authors tracked self-reported
anxiety scores and exercise frequency in 412 undergraduate students. Their findings
suggest that students who engaged in aerobic exercise three or more times per week
reported significantly lower anxiety levels at semester's end compared with those who
exercised once a week or less. Notably, the association was stronger among students
who reported high baseline academic stress, indicating that exercise frequency may be
particularly protective in high-pressure periods. The authors argue that the mechanism
is likely bidirectional — reduced anxiety facilitates more consistent exercise, which in
turn further reduces anxiety — though the cross-sectional nature of some measures
limits causal inference.
\`\`\`

**Closing (approximately 60 words):** State the implications and limitations honestly. What does this study contribute? What does it not resolve?

\`\`\`
These findings contribute to a growing body of evidence supporting exercise as a
low-cost, accessible mental health intervention for student populations. However, the
reliance on self-reported measures and a single-institution sample limits the
generalisability of the conclusions. Independent replication across diverse student
populations would strengthen the evidence base considerably.
\`\`\`

## What the Finished Summary Demonstrates

Read the three sections together and notice what each module has contributed. The source was found and evaluated (Module 2). The claim-evidence-reasoning structure holds each paragraph together (Module 3). The ideas are paraphrased with citations rather than copied (Module 4). The writing synthesises rather than just describes (Module 5). The language is precise, hedged, and free of padding (Module 6).

A 300-word summary is small. What it represents — a complete, disciplined, evidence-grounded academic writing process — is not. Every longer piece of academic writing you will produce is built from exactly these same components, repeated and expanded. Master the small version and the large version becomes a matter of scale, not of kind.`,
    quizzes: [
      {
        question:
          "Why is a focused, narrow topic preferable to a broad subject when writing a short research summary?",
        options: [
          "Narrow topics are easier to find sources for because fewer papers exist on them",
          "A focused topic allows a single source to address the question meaningfully and gives the summary a specific, evidenceable claim rather than a general observation",
          "Broad topics require multiple sources, which exceeds the scope of a 300-word summary",
          "Examiners penalise broad topics because they suggest the student has not read enough",
        ],
        correct: 1,
        explanation:
          "A focused topic defines a specific question that a single peer-reviewed source can address directly — this makes source selection purposeful and ensures the summary has a concrete, arguable claim rather than a vague overview of a large field.",
      },
      {
        question:
          "Before writing the summary, the module recommends extracting four things from the source in your own words. Which of the following is NOT one of the four?",
        options: [
          "The research question the study addresses",
          "The method used to investigate the question",
          "The names and qualifications of every author listed on the paper",
          "The key finding and the main conclusion or implication",
        ],
        correct: 2,
        explanation:
          "The four pre-writing extraction points are the research question, method, key finding, and main conclusion — author credentials are evaluated during source assessment but are not part of the argument extraction process used to build the summary.",
      },
      {
        question:
          "In the example opening paragraph, what function does the final sentence serve — 'The study responds to a gap in existing research, which has predominantly examined exercise effects in clinical rather than non-clinical student populations'?",
        options: [
          "It provides the citation for the source being summarised",
          "It identifies the population gap in the existing literature that justifies the study, connecting it to the skills developed in the literature review module",
          "It hedges the author's claim by acknowledging that previous research may have reached different conclusions",
          "It transitions from the opening to the body by previewing the three main findings",
        ],
        correct: 1,
        explanation:
          "This sentence performs the gap-identification function from Module 5 — it situates the study within existing literature by naming what previous research has not addressed, which justifies why the study needed to be conducted and why it is worth summarising.",
      },
      {
        question:
          "The body paragraph includes the phrase 'the cross-sectional nature of some measures limits causal inference.' What academic writing principle does this sentence demonstrate?",
        options: [
          "Hedging the opening claim so the summary does not appear overconfident",
          "Providing methodological detail to show the source was read thoroughly",
          "Acknowledging a limitation of the study honestly rather than presenting its findings as more definitive than the evidence supports",
          "Introducing a counter-argument that will be resolved in the closing paragraph",
        ],
        correct: 2,
        explanation:
          "Acknowledging limitations is a mark of intellectual honesty and epistemic precision — presenting findings without noting methodological constraints would overclaim what the evidence supports, which violates the standards of academic argument established in Module 3 and Module 6.",
      },
      {
        question:
          "The closing paragraph states that 'independent replication across diverse student populations would strengthen the evidence base considerably.' Why is this an academically appropriate way to end a summary?",
        options: [
          "It demonstrates that the student disagrees with the source's conclusions",
          "It satisfies the word count by adding a sentence that does not require a citation",
          "It models calibrated confidence — acknowledging what the study contributes while honestly identifying what remains unresolved and what further evidence would be needed",
          "It signals to the reader that the student intends to conduct their own follow-up research",
        ],
        correct: 2,
        explanation:
          "Ending with an honest assessment of what the evidence does and does not establish — and what would be needed to extend it — demonstrates the data-literate, epistemically calibrated approach that all the modules in this track have built toward, closing the summary with intellectual honesty rather than false certainty.",
      },
    ],
  })
  await addModule('Productivity and Learning Systems', {
  title: 'Building a Weekly Learning Routine That Actually Sticks',
  description: 'Learn why most routines fail and how to design a realistic weekly learning schedule that survives contact with real life.',
  orderIndex: 3,
  content: `## Why Most Routines Fail Within Two Weeks

Almost everyone has started a new routine with genuine enthusiasm and abandoned it within two weeks. This is not a willpower problem. It is a design problem. Most routines fail because they are built for an ideal version of your life — not the actual one.

The most common mistake is making the routine too ambitious too quickly. Someone who has never exercised decides to work out every day. Someone who rarely reads decides to read for an hour every night. These routines feel motivating to plan but exhausting to maintain. When one session gets missed, the whole system collapses.

## Habit Stacking — Attaching New Habits to Existing Ones

The most reliable way to build a new routine is to attach it to something you already do automatically. This is called habit stacking. The formula is simple: after I do X, I will do Y.

Examples that work well for learning:
- After I make my morning coffee, I will review my learning notes for 10 minutes
- After I sit down at my desk, I will open my learning platform before anything else
- After dinner, I will spend 20 minutes on one module

The existing habit acts as a trigger. You do not need to remember to start — the trigger does it for you.

## Implementation Intentions — Being Specific About When and Where

Research by psychologist Peter Gollwitzer shows that people who specify exactly when and where they will perform a behaviour are significantly more likely to follow through than those who just intend to do it.

Vague intention: "I will study more this week."
Implementation intention: "I will study in the library on Monday, Wednesday, and Friday from 4pm to 5pm."

The difference sounds small. The effect is large. Being specific removes the daily decision of when to start — and it is that decision that most often leads to postponement.

## How to Recover From a Broken Streak

Missing one session does not ruin a routine. Missing two in a row is where habits die. Research by Phillippa Lally at University College London found that missing a single occasion had no measurable impact on long-term habit formation — but allowing a gap to become a pattern did.

The rule is simple: never miss twice. If you miss Monday, Thursday becomes non-negotiable. Keep the streak alive even with a reduced version of the habit — five minutes instead of thirty still counts. The goal is to maintain the identity of someone who shows up, not to achieve a perfect record.

## Designing Your Weekly Learning Schedule

A realistic weekly learning schedule has three properties: it fits your actual week, not your ideal week; it specifies exactly when and where sessions happen; and it has a recovery plan for when sessions get missed.

Start with two or three sessions per week, not seven. Build consistency first. Increase frequency only after the routine feels automatic — which typically takes four to eight weeks of consistent practice.`,
  quizzes: [
    {
      question: 'Why do most new routines fail within two weeks?',
      options: [
        'People lack willpower and motivation',
        'The routines are designed for an ideal life rather than real life and are too ambitious too quickly',
        'Two weeks is not enough time to form any habit',
        'People forget to track their progress'
      ],
      correct: 1,
      explanation: 'Most routines fail because of poor design — they are built for ideal conditions and set the bar too high from the start, making them unsustainable when real life intervenes.'
    },
    {
      question: 'What is habit stacking?',
      options: [
        'Doing multiple habits at exactly the same time',
        'Writing a list of all the habits you want to build',
        'Attaching a new habit to an existing automatic behaviour as a trigger',
        'Tracking habits using a stacking chart'
      ],
      correct: 2,
      explanation: 'Habit stacking uses an existing automatic behaviour as a trigger for the new habit. The formula is: after I do X, I will do Y. This removes the need to remember to start.'
    },
    {
      question: 'What did Peter Gollwitzer\'s research show about implementation intentions?',
      options: [
        'General intentions are more flexible and therefore more effective',
        'People who specify exactly when and where they will act are significantly more likely to follow through',
        'Morning routines are more effective than evening routines',
        'Writing habits down is more important than scheduling them'
      ],
      correct: 1,
      explanation: 'Gollwitzer\'s research showed that specifying the exact time and place for a behaviour dramatically increases follow-through compared to vague intentions, because it removes the daily decision of when to start.'
    },
    {
      question: 'According to the research on habit formation, what is the most damaging pattern?',
      options: [
        'Missing a single session occasionally',
        'Studying for less time than planned',
        'Allowing a missed session to become two missed sessions in a row',
        'Changing the time of your study session'
      ],
      correct: 2,
      explanation: 'Research by Phillippa Lally found that missing one session has no measurable impact on long-term habit formation. The danger is missing twice in a row, which is where habits break down permanently.'
    },
    {
      question: 'What is the recommended approach when starting a new weekly learning routine?',
      options: [
        'Study every day to build maximum momentum as quickly as possible',
        'Start with two or three sessions per week and build consistency before increasing frequency',
        'Study for as long as possible in each session to compensate for missed days',
        'Plan seven sessions per week but only complete the ones that feel natural'
      ],
      correct: 1,
      explanation: 'Starting with two or three sessions per week builds the consistency and identity of a learner before adding frequency. Trying to do too much too soon is the primary reason routines fail.'
    }
  ]
})
await addModule('JavaScript for Beginners', {
  title: 'What is JavaScript and How the Web Works',
  description: 'Understand what JavaScript is, why it exists, and how HTML, CSS, and JavaScript work together to create everything you see and interact with on the web.',
  orderIndex: 1,
  content: `## The Web Is a Three-Layer Cake

Before you write a single line of JavaScript, you need to understand where it lives and why it exists. The web is built from three technologies that each handle a completely different job, and JavaScript's role only makes sense once you understand the other two.

Think of a web page like a house. **HTML** is the structure — the walls, floors, roof, and rooms. It defines what exists on the page: headings, paragraphs, buttons, images, forms. Without HTML, there is nothing to look at. But a house made of bare concrete and timber is not particularly pleasant to live in.

**CSS** is the interior design — the paint, the furniture, the lighting. It controls how HTML elements look: colours, fonts, sizes, spacing, layout. CSS makes the page beautiful, but it is entirely passive. CSS cannot respond to you. It cannot say "when the user clicks this button, change the colour." It just sits there looking nice.

**JavaScript** is the electricity — the thing that makes the house actually do things. The lights that turn on when you walk into a room. The thermostat that responds to your input. The security system that reacts to events. JavaScript is the only one of the three languages that can make a web page respond, change, and behave dynamically in real time.

This is the crucial insight: HTML and CSS produce static pages. JavaScript is what makes them alive.

## A Brief History — Why JavaScript Exists

In 1995, a developer named Brendan Eich was working at Netscape and was given ten days to create a programming language for the web browser. The result was JavaScript — a language designed specifically to run inside browsers and make web pages interactive.

It was not a perfect language at birth. It was rushed, and it has quirks that still cause confusion today. But it had one enormous advantage: it shipped with Netscape Navigator, which was the dominant browser of the era. Because it was already there, in millions of browsers, it became the standard. Every major browser eventually added support for it.

Today, JavaScript is the only programming language that runs natively in every web browser on earth. That is not a small thing. It means that any JavaScript you write can be executed by anyone with a browser — no installation required, no compilation step, nothing. You write the code, they open the page, the code runs. That accessibility is why JavaScript became, and remains, the most widely used programming language in the world.

Beyond browsers, JavaScript now runs on servers (via Node.js), on mobile devices, on desktop applications, and on embedded systems. But its home — the thing it was born to do — is the browser, and that is where you are going to start.

## How a Web Page Actually Loads

When you type a URL into your browser and press Enter, a sequence of events unfolds that most people never think about. Understanding this sequence explains exactly where your JavaScript fits into the picture.

**Step 1 — DNS Lookup.** Your browser takes the domain name (like \`google.com\`) and looks up its corresponding IP address — the numerical address of the actual server that hosts the page. This is like looking up a phone number in a directory.

**Step 2 — HTTP Request.** Your browser sends a request to that server over the internet using a protocol called HTTP (or HTTPS, the secure version). It is essentially asking: "Please send me the files for this page."

**Step 3 — Server Response.** The server receives the request and responds by sending back files — typically starting with an HTML file.

**Step 4 — Parsing HTML.** Your browser reads the HTML file from top to bottom. As it encounters references to CSS files and JavaScript files, it fetches those too. As it reads the HTML, it builds a data structure in memory called the **DOM** — the Document Object Model — which is a tree-like representation of every element on the page.

**Step 5 — Applying CSS.** The browser applies the CSS rules to the DOM elements, calculating how everything should look.

**Step 6 — Executing JavaScript.** The browser runs any JavaScript that is linked or embedded in the page. This JavaScript can read and modify the DOM, respond to user actions, fetch more data from servers, and fundamentally change anything about the page.

**Step 7 — Rendering.** The browser paints the final result onto your screen.

The key takeaway is that JavaScript runs after the page structure exists. It has access to the entire HTML structure through the DOM, and it can modify anything about it — add elements, remove them, change their content, change their styles, show or hide them — all in response to what the user does.

## Your First JavaScript — Three Ways to Run It

You do not need to install anything to start writing JavaScript. Your browser already has a JavaScript engine built in. Let's look at three ways to run JavaScript, starting from the simplest.

**Method 1: The Browser Console**

Every major browser has developer tools with a JavaScript console. In Chrome or Firefox, press F12 (or Cmd+Option+I on Mac), then click the Console tab. You can type JavaScript directly here and it runs immediately.

Try typing this:

\`\`\`javascript
console.log("Hello, JavaScript!")
\`\`\`

Press Enter. You should see your message appear. \`console.log()\` is JavaScript's way of printing output — it is the equivalent of Python's \`print()\`. You will use it constantly for testing and debugging.

**Method 2: A Script Tag in HTML**

The standard way to add JavaScript to a web page is with a \`<script>\` tag in your HTML file. Create a file called \`index.html\` and add this:

\`\`\`javascript
<!DOCTYPE html>
<html>
  <head>
    <title>My First JavaScript Page</title>
  </head>
  <body>
    <h1>Hello World</h1>

    <script>
      console.log("JavaScript is running!")
      alert("Welcome to my page!")
    </script>
  </body>
</html>
\`\`\`

Open this file in your browser. You will see the alert pop up, and the console message will appear in your developer tools. Notice that the \`<script>\` tag is placed at the bottom of the \`<body>\`. This is important — it ensures the HTML is fully loaded before JavaScript tries to interact with it.

**Method 3: An External JavaScript File**

For real projects, you keep JavaScript in a separate \`.js\` file and link it from your HTML. This keeps your code organised and means the same JavaScript can be used across multiple pages.

Create \`script.js\`:

\`\`\`javascript
console.log("This is from an external file!")
\`\`\`

Then in your \`index.html\`, replace the inline script with:

\`\`\`javascript
<script src="script.js"></script>
\`\`\`

This is the approach you will use for almost every real project. It keeps concerns separated: HTML for structure, CSS for style, JavaScript for behaviour.

## JavaScript vs Python — Key Differences for Beginners

Since you already know some Python, the most helpful thing is to map what you know onto what is different. JavaScript and Python are more similar than different in their fundamentals — both have variables, functions, loops, and conditionals — but the syntax has some important differences.

**Semicolons.** JavaScript traditionally ends statements with a semicolon (\`;\`). In practice, modern JavaScript has a feature called automatic semicolon insertion that often lets you omit them, but many developers still include them for clarity. You will see both styles.

\`\`\`javascript
console.log("With semicolon");
console.log("Without semicolon")
\`\`\`

**Curly braces instead of indentation.** Python uses indentation to define blocks of code. JavaScript uses curly braces \`{}\`. Indentation in JavaScript is a style choice for readability, not a syntactic requirement.

\`\`\`javascript
// Python uses indentation
// if x > 0:
//     print("positive")

// JavaScript uses curly braces
if (x > 0) {
  console.log("positive")
}
\`\`\`

**\`let\` and \`const\` instead of just variable names.** In Python, you create a variable by just writing its name. In JavaScript, you use keywords to declare variables. We will cover this in detail in the next module.

\`\`\`javascript
// Python: name = "Alice"
// JavaScript:
let name = "Alice"
const PI = 3.14159
\`\`\`

**Comments.** Python uses \`#\` for single-line comments. JavaScript uses \`//\` for single-line comments and \`/* */\` for multi-line comments.

\`\`\`javascript
// This is a single-line comment

/*
  This is a
  multi-line comment
*/
\`\`\`

## What JavaScript Can Do — The Big Picture

You have learned where JavaScript lives and how it loads. Before diving into syntax, it helps to have a mental picture of what JavaScript is actually capable of, so you know what you are working toward.

**DOM Manipulation.** JavaScript can read and change anything on the page — update text, change colours, show or hide elements, add new elements, remove existing ones. When you click a "dark mode" button and the whole page changes colour scheme, that is JavaScript.

**Event Handling.** JavaScript can respond to anything the user does — clicks, key presses, mouse movements, form submissions, scrolling. This is the foundation of interactive interfaces.

**Data Fetching.** JavaScript can communicate with servers in the background — fetching new data and updating the page without a full reload. This is how social media feeds update, how search suggestions appear, and how maps load new tiles as you scroll.

**Form Validation.** JavaScript can check whether a user has filled in a form correctly before it is submitted — highlighting empty required fields, checking email formats, ensuring passwords meet requirements.

**Animations and Visual Effects.** JavaScript can move elements around the page, trigger CSS transitions, create canvas-based graphics, and build full game engines.

**Local Storage.** JavaScript can save data in the user's browser — so a to-do list app can remember your tasks even after you close the tab.

You are not going to build all of these things in this module. But by the time you finish this track, you will have touched most of them. Every concept you learn — variables, functions, conditions, loops, arrays, objects — builds toward these real capabilities.

## The JavaScript Engine — What Actually Runs Your Code

One more piece of context that will make you a better JavaScript developer: understanding, at a high level, what happens when your JavaScript code runs.

Every browser contains a JavaScript engine — a program specifically designed to read JavaScript and execute it. Chrome uses an engine called V8. Firefox uses SpiderMonkey. Safari uses JavaScriptCore. These engines are extraordinarily sophisticated pieces of software that have been optimised over decades to run JavaScript as fast as possible.

When your browser encounters a \`<script>\` tag, the JavaScript engine takes over. It reads your code, parses it to understand its structure, compiles it to lower-level instructions that the computer can execute directly, and then runs those instructions.

This process is largely invisible to you as a developer. But it has one important implication: JavaScript is a **single-threaded** language, meaning it does one thing at a time. It cannot genuinely do two things simultaneously in the same thread. This is why JavaScript has a very particular way of handling things that take time — like fetching data from a server — called asynchronous programming. You will encounter this concept later in your JavaScript journey.

For now, the key point is that your code runs in the browser, one line at a time, from top to bottom (with the branching and looping you will learn about in later modules). The browser is your runtime environment, the console is your output window, and the developer tools are your debugging headquarters.

## Setting Up Your Development Environment

You do not need anything fancy to write JavaScript. Here is the minimal setup that will serve you well through this entire track:

**A text editor.** Visual Studio Code is the industry standard and it is free. It has excellent JavaScript support, syntax highlighting, and extensions that make your life much easier. Download it from code.visualstudio.com.

**A browser with developer tools.** Chrome or Firefox are both excellent. You will use the developer tools constantly — F12 is your new best friend.

**A local file structure.** For each project, create a folder containing an \`index.html\` and a \`script.js\`. That is genuinely all you need to start.

You do not need a server for most of what you will learn in this track. You can open your HTML file directly in the browser by double-clicking it, and JavaScript will run. Some advanced features (like fetching data from APIs) require a local server, but there are simple tools like the VS Code Live Server extension that handle this when you need it.

## Where You Are Going

This first module has given you the conceptual foundation: what JavaScript is, where it came from, how the web loads pages, where JavaScript fits in that process, and what it is capable of. You have written your first line of JavaScript and you have seen the three ways to run it.

From here, the track moves from concepts to code. The next module covers variables and data types — the building blocks of any JavaScript program. Then functions, control flow, arrays, objects, the DOM, events, and finally a complete mini-application that brings everything together.

Every module builds on the previous one. The concepts are not isolated — they combine. By the end of this track, you will not just know JavaScript syntax. You will understand how to think in JavaScript, which is a different and more valuable thing.

The web is the most accessible platform in human history. JavaScript is the language that makes it interactive. You are in exactly the right place to start learning it.`,
  quizzes: [
    {
      question: 'What is the primary role of JavaScript in a web page, compared to HTML and CSS?',
      options: [
        'JavaScript defines the structure and content of the page',
        'JavaScript controls the visual appearance, colours, and layout',
        'JavaScript makes the page dynamic and interactive, responding to user actions and changing content in real time',
        'JavaScript handles the communication between the browser and the DNS server'
      ],
      correct: 2,
      explanation: 'HTML provides structure, CSS provides styling, and JavaScript provides behaviour — it is the only one of the three that can respond to user actions and modify the page dynamically after it has loaded.'
    },
    {
      question: 'Why is the <script> tag typically placed at the bottom of the <body> in an HTML file?',
      options: [
        'Because JavaScript files are larger than HTML files and browsers load them last automatically',
        'Because placing it at the bottom ensures the HTML elements exist in the DOM before JavaScript tries to interact with them',
        'Because the browser\'s CSS engine must finish before the JavaScript engine can start',
        'Because script tags at the top of the page are ignored by modern browsers'
      ],
      correct: 1,
      explanation: 'JavaScript often needs to access and manipulate HTML elements — if the script runs before those elements have been parsed and added to the DOM, the elements will not exist yet and the code will fail.'
    },
    {
      question: 'Which of the following correctly describes how JavaScript differs from Python in defining code blocks?',
      options: [
        'JavaScript uses indentation to define code blocks, just like Python',
        'JavaScript uses square brackets [] to define code blocks',
        'JavaScript uses curly braces {} to define code blocks, while Python uses indentation',
        'JavaScript does not support code blocks — all code runs sequentially at the top level'
      ],
      correct: 2,
      explanation: 'Python relies on mandatory indentation to define the scope of blocks like if-statements and loops, while JavaScript uses curly braces — indentation in JavaScript is purely a stylistic convention for readability.'
    },
    {
      question: 'What is the DOM in the context of how browsers process web pages?',
      options: [
        'A security protocol that browsers use to verify the authenticity of JavaScript files',
        'A tree-like data structure the browser builds in memory that represents every element on the page, which JavaScript can read and modify',
        'The browser\'s internal engine that compiles and executes JavaScript code',
        'A standardised file format for storing web page content offline'
      ],
      correct: 1,
      explanation: 'When a browser parses HTML, it builds the Document Object Model — a structured, in-memory representation of every element — which JavaScript can then traverse, read, and modify to change what the user sees.'
    },
    {
      question: 'What does console.log() do in JavaScript?',
      options: [
        'It displays a pop-up alert dialog to the user',
        'It saves output to a log file on the server',
        'It sends data to an external monitoring service',
        'It prints output to the browser\'s developer tools console, used primarily for testing and debugging'
      ],
      correct: 3,
      explanation: 'console.log() is JavaScript\'s equivalent of Python\'s print() — it outputs values to the browser\'s console, which is visible in developer tools and is the primary tool developers use to inspect values and debug their code.'
    }
  ]
})

await addModule('JavaScript for Beginners', {
  title: 'Variables, Data Types, and the Console',
  description: 'Learn how to store and work with data in JavaScript using let, const, and var, understand the core data types, and master the console as your primary debugging tool.',
  orderIndex: 2,
  content: `## Data Is the Raw Material of Every Program

Every program, no matter how complex, is ultimately about data. It takes data in, transforms it, and produces data out. Before you can write any meaningful JavaScript, you need to understand how JavaScript stores and represents data.

In Python, you created a variable by simply writing its name: \`name = "Alice"\`. JavaScript is slightly more explicit — you use a keyword to declare that you are creating a variable. This explicitness is actually useful, because it prevents accidental creation of variables and makes your intentions clear to anyone reading the code.

JavaScript gives you three keywords for declaring variables: \`var\`, \`let\`, and \`const\`. Understanding the difference between them is one of the first things that trips up JavaScript beginners, so let's address it directly.

## var, let, and const — What's the Difference?

**\`var\`** is the original way to declare variables in JavaScript. It has been in the language since the beginning. However, \`var\` has some genuinely confusing behaviours related to scope — the area of the program where the variable can be accessed — that have caused countless bugs over the years. Modern JavaScript development largely avoids \`var\` in favour of \`let\` and \`const\`. You will see \`var\` in older code and tutorials, so you need to know it exists, but you should not use it in new code.

\`\`\`javascript
var oldWay = "This still works, but avoid it"
\`\`\`

**\`let\`** is the modern way to declare a variable whose value will change over time. You use \`let\` when you know you will need to reassign the variable later.

\`\`\`javascript
let score = 0
score = 10       // reassigning is fine with let
score = score + 5
console.log(score) // 15
\`\`\`

**\`const\`** declares a variable whose binding cannot be reassigned. Once you assign a value to a \`const\`, you cannot point that name at a different value. Use \`const\` by default — only reach for \`let\` when you know the variable needs to change.

\`\`\`javascript
const PI = 3.14159
const siteName = "ALDSS"

PI = 3  // TypeError! Cannot reassign a const
\`\`\`

Why use \`const\` by default? Because it makes your code easier to reason about. When you see a \`const\`, you immediately know that value will not change throughout its scope. When you see a \`let\`, you know to look for where it gets reassigned. This distinction carries information.

A practical rule: **start with \`const\`. Change to \`let\` only when you need to reassign.** You will find that most variables in well-written JavaScript are \`const\`.

One important nuance: \`const\` prevents reassignment of the binding, but for objects and arrays it does not prevent mutation of the contents. We will revisit this in the arrays and objects module.

## JavaScript's Core Data Types

JavaScript has several built-in data types. Understanding them is foundational because different types support different operations, and JavaScript's type system has some specific behaviours you need to know.

### Strings

A string is a sequence of characters — text. You can create strings with single quotes, double quotes, or backticks. All three work, but each has a common use case.

\`\`\`javascript
const firstName = "Alice"
const lastName = 'Smith'
const greeting = \`Hello, \${firstName}!\`  // template literal
\`\`\`

The backtick version is called a **template literal**, and it is one of the most useful features in modern JavaScript. The \`\${}\` syntax lets you embed expressions directly inside the string — no string concatenation required. This is similar to Python's f-strings.

\`\`\`javascript
const age = 20
const message = \`\${firstName} is \${age} years old.\`
console.log(message) // "Alice is 20 years old."
\`\`\`

Strings have a \`length\` property and many useful methods:

\`\`\`javascript
const word = "JavaScript"
console.log(word.length)           // 10
console.log(word.toUpperCase())    // "JAVASCRIPT"
console.log(word.toLowerCase())    // "javascript"
console.log(word.includes("Script")) // true
console.log(word.slice(0, 4))     // "Java"
console.log(word.replace("Java", "Type")) // "TypeScript"
\`\`\`

### Numbers

JavaScript has just one number type — it handles both integers and decimals. There is no separate \`int\` and \`float\` as in Python.

\`\`\`javascript
const count = 42
const price = 9.99
const temperature = -5

console.log(10 + 3)   // 13
console.log(10 - 3)   // 7
console.log(10 * 3)   // 30
console.log(10 / 3)   // 3.3333...
console.log(10 % 3)   // 1  (remainder/modulo)
console.log(10 ** 3)  // 1000 (exponentiation)
\`\`\`

JavaScript has a built-in \`Math\` object with useful functions:

\`\`\`javascript
console.log(Math.round(4.7))   // 5
console.log(Math.floor(4.7))   // 4
console.log(Math.ceil(4.2))    // 5
console.log(Math.max(3, 7, 2)) // 7
console.log(Math.min(3, 7, 2)) // 2
console.log(Math.abs(-10))     // 10
console.log(Math.random())     // random decimal between 0 and 1
\`\`\`

There are two special number values worth knowing: \`Infinity\` (the result of dividing by zero, for example) and \`NaN\` — "Not a Number" — which appears when a mathematical operation fails, such as trying to do arithmetic with a non-numeric string.

\`\`\`javascript
console.log(10 / 0)        // Infinity
console.log("hello" * 2)   // NaN
console.log(isNaN("hello")) // true
\`\`\`

### Booleans

Booleans are the same as in Python — \`true\` or \`false\` (note: lowercase in JavaScript, unlike Python's capitalised \`True\` and \`False\`).

\`\`\`javascript
const isLoggedIn = true
const hasPermission = false

console.log(10 > 5)     // true
console.log(10 === 5)   // false
console.log(10 !== 5)   // true
\`\`\`

Notice \`===\` for equality comparison. JavaScript has two equality operators and the difference matters enormously.

\`==\` (loose equality) compares values after attempting type conversion. This leads to surprising results:

\`\`\`javascript
console.log(5 == "5")   // true (!) — JavaScript converts the string to a number
console.log(0 == false) // true (!) — JavaScript converts both to the same type
\`\`\`

\`===\` (strict equality) compares both value AND type with no conversion:

\`\`\`javascript
console.log(5 === "5")   // false — different types
console.log(0 === false) // false — different types
console.log(5 === 5)     // true
\`\`\`

**Always use \`===\` and \`!==\`.** The loose equality operators (\`==\` and \`!=\`) exist for historical reasons and are a common source of bugs. Strict equality is always more predictable.

### null and undefined

JavaScript has two ways of representing "nothing", and understanding the difference prevents a lot of confusion.

**\`undefined\`** is what JavaScript uses when something has no value yet. If you declare a variable without assigning it, it is \`undefined\`. If you call a function that does not explicitly return anything, the result is \`undefined\`. It is JavaScript's built-in default for "not yet assigned."

\`\`\`javascript
let something
console.log(something) // undefined

function doNothing() {}
console.log(doNothing()) // undefined
\`\`\`

**\`null\`** is an intentional absence of value. You write it explicitly to say "this variable has no value right now, and that is deliberate." It is the programmer's signal, not JavaScript's default.

\`\`\`javascript
let selectedUser = null  // no user selected yet
// later...
selectedUser = { name: "Alice" }
\`\`\`

The practical rule: you will rarely write \`undefined\` yourself. You will see it appear as a result of operations. You write \`null\` intentionally to represent "empty" or "not yet set."

### typeof — Checking a Variable's Type

JavaScript gives you the \`typeof\` operator to check what type a value is. This is particularly useful for debugging.

\`\`\`javascript
console.log(typeof "hello")     // "string"
console.log(typeof 42)          // "number"
console.log(typeof true)        // "boolean"
console.log(typeof undefined)   // "undefined"
console.log(typeof null)        // "object" — a famous JavaScript bug!
console.log(typeof {})          // "object"
console.log(typeof [])          // "object"
console.log(typeof function(){}) // "function"
\`\`\`

Note that \`typeof null\` returns \`"object"\` — this is a well-known bug from JavaScript's early days that has never been fixed for backward compatibility reasons. Just know it exists.

## Type Coercion — JavaScript's Most Notorious Feature

JavaScript will automatically convert values from one type to another in certain situations. This is called **type coercion**, and it is the source of some of JavaScript's most surprising behaviours.

The most common place this appears is with the \`+\` operator. When you use \`+\` with a string and a number, JavaScript converts the number to a string and concatenates:

\`\`\`javascript
console.log("5" + 3)    // "53" — not 8!
console.log("5" - 3)    // 2 — subtraction has no string version, so converts "5" to 5
console.log("5" * 3)    // 15
\`\`\`

This is why \`===\` is important — strict equality avoids coercion entirely. And this is why you should be careful about the types you are working with, particularly when getting values from user input (which is always a string, even if the user typed a number).

To explicitly convert between types:

\`\`\`javascript
// String to Number
const input = "42"
const num = Number(input)      // 42
const num2 = parseInt(input)   // 42 (for integers)
const num3 = parseFloat("3.14") // 3.14

// Number to String
const n = 42
const str = String(n)          // "42"
const str2 = n.toString()      // "42"

// To Boolean
const bool1 = Boolean(0)       // false
const bool2 = Boolean("")      // false
const bool3 = Boolean("hello") // true
const bool4 = Boolean(42)      // true
\`\`\`

## Mastering the Console

The browser console is your most important tool as a JavaScript developer. It is not just for \`console.log\`. Let's look at everything it can do.

**console.log()** — the workhorse. Use it to inspect values at any point in your code.

\`\`\`javascript
const user = "Alice"
const score = 95
console.log(user, score)  // you can log multiple values at once
console.log("Score:", score)  // label your output for clarity
\`\`\`

**console.error()** — displays output in red with an error icon. Use for error messages.

\`\`\`javascript
console.error("Something went wrong!")
\`\`\`

**console.warn()** — displays output in yellow. Use for warnings.

\`\`\`javascript
console.warn("This approach is deprecated")
\`\`\`

**console.table()** — displays arrays and objects as a formatted table. Extremely useful for inspecting structured data.

\`\`\`javascript
const students = [
  { name: "Alice", score: 95 },
  { name: "Bob", score: 82 },
  { name: "Carol", score: 91 }
]
console.table(students)
\`\`\`

**console.group() and console.groupEnd()** — group related log messages together.

\`\`\`javascript
console.group("User Details")
console.log("Name: Alice")
console.log("Age: 20")
console.groupEnd()
\`\`\`

**console.time() and console.timeEnd()** — measure how long something takes to run.

\`\`\`javascript
console.time("loop")
for (let i = 0; i < 100000; i++) {}
console.timeEnd("loop")
\`\`\`

Beyond logging, the console lets you:
- Run arbitrary JavaScript expressions by typing them directly
- Inspect JavaScript errors that appear in red (click them to see the exact file and line number)
- Navigate to the Sources tab to step through your code line by line with the debugger

Developing a habit of using the console actively — logging values to understand what your code is doing, reading errors carefully, using the debugger — will make you a dramatically better developer faster than almost anything else.

## Variable Scope — Where Variables Live

Scope defines where in your code a variable can be accessed. JavaScript has three levels of scope: global, function, and block.

A variable declared at the top level — outside any function or block — is **global**. It can be accessed anywhere in your program. In browser JavaScript, global variables become properties of the \`window\` object.

\`\`\`javascript
const appName = "ALDSS"  // global scope

function greet() {
  console.log(appName)  // can access global variable
}
greet() // "ALDSS"
\`\`\`

A variable declared with \`let\` or \`const\` inside curly braces has **block scope** — it only exists within those braces.

\`\`\`javascript
{
  let blockVariable = "I'm inside a block"
  console.log(blockVariable) // works fine
}
console.log(blockVariable) // ReferenceError! Not accessible here
\`\`\`

This applies to if-statements, loops, and functions — any pair of curly braces creates a new block scope for \`let\` and \`const\`.

\`\`\`javascript
if (true) {
  let message = "inside if"
  console.log(message) // "inside if"
}
console.log(message) // ReferenceError!
\`\`\`

This is one of the reasons \`var\` is problematic — \`var\` is function-scoped, not block-scoped, so \`var\` inside an if-block leaks out into the surrounding function. \`let\` and \`const\` do not have this problem.

## Putting It Together — A Simple Program

Let's combine what you have learned into a small, concrete program that uses multiple variable types, string manipulation, and console output:

\`\`\`javascript
// Student grade calculator
const studentName = "Alice Johnson"
const scores = [88, 92, 79, 95, 84]

// Calculate average using reduce (we'll cover arrays properly later)
const total = 88 + 92 + 79 + 95 + 84
const average = total / scores.length

// Build a grade letter
let grade
if (average >= 90) {
  grade = "A"
} else if (average >= 80) {
  grade = "B"
} else if (average >= 70) {
  grade = "C"
} else {
  grade = "F"
}

// Display results
console.log(\`Student: \${studentName}\`)
console.log(\`Average Score: \${average.toFixed(1)}\`)
console.log(\`Grade: \${grade}\`)
console.log(\`Pass/Fail: \${average >= 50 ? "PASS" : "FAIL"}\`)
\`\`\`

Notice \`average.toFixed(1)\` — this is a number method that rounds the number to one decimal place and returns it as a string, perfect for display purposes.

The last line uses something called a **ternary operator** — \`condition ? valueIfTrue : valueIfFalse\` — a compact way to write a simple if/else. You will see this everywhere in JavaScript.

## The Building Blocks Are Ready

You now have a solid understanding of how JavaScript stores and represents data. You know the difference between \`let\`, \`const\`, and \`var\`. You understand strings, numbers, booleans, \`null\`, and \`undefined\`. You know why \`===\` is important and when type coercion can surprise you. And you have a proper relationship with the console as your primary tool for understanding what your code is doing.

These are the fundamental building blocks. Every program you write will use them. In the next module, you will learn about functions — the mechanism for organising your code into reusable, named pieces of logic that you can call whenever you need them.`,
  quizzes: [
    {
      question: 'What is the key difference between let and const in JavaScript?',
      options: [
        'let variables can hold any data type, while const can only hold numbers and strings',
        'const variables cannot be reassigned after their initial value is set, while let variables can be reassigned',
        'let creates a global variable, while const creates a block-scoped variable',
        'There is no practical difference — they are interchangeable in modern JavaScript'
      ],
      correct: 1,
      explanation: 'const prevents the variable binding from being reassigned to a different value — if you try to do so, JavaScript throws a TypeError — while let allows reassignment throughout its scope.'
    },
    {
      question: 'What will console.log("5" + 3) output, and why?',
      options: [
        '8, because JavaScript always converts strings to numbers for arithmetic',
        '"53", because the + operator with a string causes JavaScript to convert the number to a string and concatenate',
        'NaN, because you cannot use + between a string and a number',
        'An error, because the types are incompatible'
      ],
      correct: 1,
      explanation: 'When the + operator encounters a string operand, JavaScript performs string concatenation rather than numeric addition, converting the number 3 to the string "3" and joining it to "5" to produce "53".'
    },
    {
      question: 'Why should you use === instead of == for comparisons in JavaScript?',
      options: [
        'Because === is faster to execute than == in modern JavaScript engines',
        'Because == only works with numbers, while === works with all data types',
        'Because == performs type coercion before comparing, leading to surprising results like 5 == "5" being true, while === compares both value and type with no conversion',
        'Because === is required for comparing objects and arrays, while == only works for primitives'
      ],
      correct: 2,
      explanation: 'Loose equality (==) converts operands to a common type before comparing, which produces counterintuitive results — strict equality (===) requires both the value and the type to match, making comparisons predictable and safe.'
    },
    {
      question: 'What is the difference between null and undefined in JavaScript?',
      options: [
        'They are identical — both represent the absence of a value and can be used interchangeably',
        'undefined means a variable was declared but not assigned a value (JavaScript\'s default); null is explicitly assigned by the programmer to intentionally represent "no value"',
        'null is JavaScript\'s default for unassigned variables; undefined is explicitly set by the programmer',
        'undefined only appears in function return values, while null only appears in variable declarations'
      ],
      correct: 1,
      explanation: 'undefined is JavaScript\'s automatic default when a variable has no value — you will see it appear as a result of operations; null is an intentional programmer signal meaning "this is deliberately empty right now."'
    },
    {
      question: 'What does a template literal (backtick string) allow you to do that regular quoted strings do not?',
      options: [
        'Store strings that span multiple lines and embed JavaScript expressions directly inside the string using ${} syntax',
        'Create strings that cannot be accidentally modified, making them safer than single or double-quoted strings',
        'Apply CSS styling directly to the string when it is displayed in the browser',
        'Access individual characters of the string using array-style indexing'
      ],
      correct: 0,
      explanation: 'Template literals use backticks and support two features regular strings lack: multi-line strings (without needing escape characters) and string interpolation via ${expression}, which evaluates the expression and embeds its result directly in the string.'
    }
  ]
})

await addModule('JavaScript for Beginners', {
  title: 'Functions — Writing Reusable Logic',
  description: 'Learn how to define and call functions in JavaScript, understand different function syntaxes, work with parameters and return values, and write code that is organised, reusable, and easy to reason about.',
  orderIndex: 3,
  content: `## Why Functions Exist

Imagine you are building a quiz application. Every time a user answers a question, you need to check their answer, update their score, and display a message. Without functions, you would write the same logic every time an answer is submitted. That is not just tedious — it is dangerous. If you need to change how scoring works, you have to find every place you wrote that logic and change each one. Miss one, and your app behaves inconsistently.

Functions solve this by giving you a way to write logic once, give it a name, and call it as many times as you need from anywhere in your code. Change the function, and every place that calls it automatically gets the updated behaviour.

But functions are more than just a copy-paste avoidance tool. They are the primary way you organise and structure JavaScript programs. They allow you to break complex problems into smaller, named pieces. They make your code readable — a well-named function communicates intent immediately. They are the building blocks from which everything more complex is assembled.

You already know what functions are from Python. In this module, you will learn that JavaScript functions have several different syntaxes, each with subtly different behaviours, and understanding when to use each one is an important part of writing idiomatic JavaScript.

## Declaring Functions — The Classic Way

The most straightforward way to create a function in JavaScript is a **function declaration**. The syntax uses the \`function\` keyword, followed by a name, parameters in parentheses, and the function body in curly braces.

\`\`\`javascript
function greet(name) {
  const message = \`Hello, \${name}!\`
  return message
}

const result = greet("Alice")
console.log(result) // "Hello, Alice!"
\`\`\`

This is essentially the same pattern you know from Python's \`def\`, just with different syntax. Let's unpack the parts:

- \`function\` — the keyword that tells JavaScript you are defining a function
- \`greet\` — the name you give the function (use verbs or verb phrases: \`calculateScore\`, \`validateEmail\`, \`showMessage\`)
- \`(name)\` — the parameter list — the inputs the function expects
- \`{ ... }\` — the function body — the code that runs when the function is called
- \`return\` — sends a value back to whoever called the function

Function declarations have a special property called **hoisting**: JavaScript moves the function definition to the top of its scope before any code runs. This means you can call a function declaration before it appears in your file:

\`\`\`javascript
console.log(add(2, 3)) // 5 — works even though add is defined below

function add(a, b) {
  return a + b
}
\`\`\`

This works, but it is generally better practice to define functions before using them — relying on hoisting makes code harder to read.

## Function Expressions — Functions as Values

One of the most important ideas in JavaScript is that **functions are values**. Just like a number or a string can be stored in a variable, so can a function. When you store a function in a variable, it is called a **function expression**.

\`\`\`javascript
const greet = function(name) {
  return \`Hello, \${name}!\`
}

console.log(greet("Bob")) // "Hello, Bob!"
\`\`\`

The function here has no name after the \`function\` keyword — it is an **anonymous function** assigned to the variable \`greet\`. The variable name becomes the way you call it.

Function expressions are NOT hoisted. This means you cannot call them before they are defined:

\`\`\`javascript
console.log(multiply(2, 3)) // ReferenceError!

const multiply = function(a, b) {
  return a * b
}
\`\`\`

Because functions are values, they can be passed as arguments to other functions, returned from functions, and stored in arrays or objects. This is a fundamental concept in JavaScript called **first-class functions**, and it enables a whole category of powerful programming patterns you will encounter as you progress.

## Arrow Functions — The Modern Syntax

ES6 (a major JavaScript update from 2015) introduced **arrow functions**, a shorter syntax for writing function expressions. Arrow functions have become the dominant style in modern JavaScript code, so you need to be very comfortable with them.

\`\`\`javascript
// Traditional function expression
const double = function(x) {
  return x * 2
}

// Arrow function — equivalent
const double = (x) => {
  return x * 2
}

// Shorter: when there's one parameter, parentheses are optional
const double = x => {
  return x * 2
}

// Even shorter: when the body is a single expression, you can omit the braces and return
const double = x => x * 2

console.log(double(5)) // 10
\`\`\`

These four versions all do exactly the same thing. The progression from verbose to concise is common in JavaScript — you start with the full form to understand what is happening, then use the shorter forms when they make the code clearer.

For functions with multiple parameters:

\`\`\`javascript
const add = (a, b) => a + b
const greet = (name, greeting) => \`\${greeting}, \${name}!\`

console.log(add(3, 4))           // 7
console.log(greet("Alice", "Hi")) // "Hi, Alice!"
\`\`\`

For functions with no parameters, use empty parentheses:

\`\`\`javascript
const sayHello = () => "Hello!"
console.log(sayHello()) // "Hello!"
\`\`\`

For multi-line arrow functions, keep the curly braces and explicit return:

\`\`\`javascript
const calculateGrade = score => {
  if (score >= 90) return "A"
  if (score >= 80) return "B"
  if (score >= 70) return "C"
  return "F"
}

console.log(calculateGrade(85)) // "B"
\`\`\`

Arrow functions have one important technical difference from regular functions: they do not have their own \`this\` binding. This matters in object-oriented JavaScript and event handling — we will address it in the events module. For now, the practical rule is: **use arrow functions for short, simple operations; use function declarations for functions that need a name and may use \`this\`**.

## Parameters, Arguments, and Defaults

**Parameters** are the names listed in the function definition. **Arguments** are the actual values passed when the function is called. You already know this distinction from Python — the names are the same in JavaScript.

\`\`\`javascript
function introduce(firstName, lastName, age) {
  return \`I'm \${firstName} \${lastName}, \${age} years old.\`
}

// firstName, lastName, age are parameters
// "Alice", "Smith", 20 are arguments
console.log(introduce("Alice", "Smith", 20))
\`\`\`

**Default parameters** allow you to specify a fallback value that is used when an argument is not provided:

\`\`\`javascript
function greet(name = "stranger", greeting = "Hello") {
  return \`\${greeting}, \${name}!\`
}

console.log(greet("Alice", "Hi"))  // "Hi, Alice!"
console.log(greet("Bob"))          // "Hello, Bob!"
console.log(greet())               // "Hello, stranger!"
\`\`\`

Default parameters make functions more flexible and reduce the need for defensive checks inside the function body.

**Rest parameters** allow a function to accept any number of arguments as an array:

\`\`\`javascript
function sum(...numbers) {
  let total = 0
  for (const n of numbers) {
    total += n
  }
  return total
}

console.log(sum(1, 2, 3))       // 6
console.log(sum(1, 2, 3, 4, 5)) // 15
\`\`\`

The \`...\` spread syntax before the parameter name collects all remaining arguments into an array. This is useful when you genuinely do not know how many arguments will be passed.

## Return Values — Getting Data Out

The \`return\` statement does two things: it specifies the value to send back to the caller, and it immediately exits the function. Any code after a \`return\` statement in the same block is unreachable.

\`\`\`javascript
function findMax(a, b) {
  if (a > b) {
    return a  // exits here if a > b
  }
  return b    // only reached if a <= b
}

console.log(findMax(7, 3))  // 7
console.log(findMax(3, 9))  // 9
\`\`\`

A function without an explicit \`return\` statement returns \`undefined\`:

\`\`\`javascript
function logMessage(message) {
  console.log(message)
  // no return statement
}

const result = logMessage("Hello")
console.log(result) // undefined
\`\`\`

Functions that produce a side effect (like logging, modifying the DOM, or saving data) often do not need to return a value. Functions that compute something almost always should return the result rather than logging it — logging inside a function makes it harder to test and reuse.

## Scope Inside Functions

Every function creates its own scope. Variables declared inside a function with \`let\` or \`const\` are local to that function and cannot be accessed from outside.

\`\`\`javascript
function calculateArea(width, height) {
  const area = width * height  // local to this function
  return area
}

console.log(calculateArea(5, 3)) // 15
console.log(area) // ReferenceError! area doesn't exist out here
\`\`\`

Functions can access variables from their outer scope — this is called **closure**, and it is one of JavaScript's most powerful features. A function remembers the variables from the scope where it was defined, even after that scope has closed.

\`\`\`javascript
function makeCounter() {
  let count = 0  // this variable is enclosed by the returned function

  return function() {
    count++
    return count
  }
}

const counter = makeCounter()
console.log(counter()) // 1
console.log(counter()) // 2
console.log(counter()) // 3

const counter2 = makeCounter()
console.log(counter2()) // 1 — fresh counter, own enclosed count variable
\`\`\`

This is closure in action. The inner function retains access to \`count\` even though \`makeCounter\` has returned. Each call to \`makeCounter\` creates a new, independent \`count\` variable. Closures are what make patterns like private variables and factory functions possible in JavaScript.

## Functions as Arguments — Higher-Order Functions

Because functions are values in JavaScript, you can pass them as arguments to other functions. A function that accepts another function as an argument (or returns a function) is called a **higher-order function**. This pattern is extremely common in JavaScript, particularly with arrays.

\`\`\`javascript
function applyOperation(numbers, operation) {
  const results = []
  for (const n of numbers) {
    results.push(operation(n))
  }
  return results
}

const double = x => x * 2
const square = x => x * x

const nums = [1, 2, 3, 4, 5]

console.log(applyOperation(nums, double)) // [2, 4, 6, 8, 10]
console.log(applyOperation(nums, square)) // [1, 4, 9, 16, 25]
\`\`\`

You can also pass functions inline without naming them:

\`\`\`javascript
console.log(applyOperation(nums, x => x + 10)) // [11, 12, 13, 14, 15]
\`\`\`

Built-in array methods like \`forEach\`, \`map\`, \`filter\`, and \`reduce\` all use this pattern — they take a function as an argument and apply it to each element. We will explore these in depth in the arrays module.

## Writing Good Functions — Practical Principles

Knowing the syntax is one thing. Writing functions that are genuinely useful and maintainable is another. Here are the principles that separate good functions from messy ones.

**One function, one job.** A function should do one thing. If you are writing a function and the name requires the word "and" — \`validateAndSaveUser\`, for example — that is a signal to split it into two functions.

**Name functions clearly.** Functions should be named with verbs that describe what they do. \`calculateTotal\`, \`validateEmail\`, \`showErrorMessage\`, \`fetchUserData\`. A function whose name immediately communicates its purpose makes the code that calls it readable without needing comments.

**Keep functions short.** A function that fits on one screen is much easier to understand than one that requires scrolling. If a function is getting long, it probably contains multiple distinct tasks that should be separated.

**Functions should be predictable.** Given the same inputs, a function should always produce the same output. Functions that depend on external state or produce different results depending on factors outside their parameters are harder to test and reason about.

**Return values, do not log them.** A function that computes something should return the result. The caller can decide whether to log it, display it, store it, or pass it somewhere else. A function that logs its own result is less reusable.

## A Complete Example

Let's put everything together in a realistic program — a simple grade calculator that uses multiple functions:

\`\`\`javascript
// Pure utility functions
const sum = (...nums) => nums.reduce((total, n) => total + n, 0)
const average = scores => sum(...scores) / scores.length

const getLetterGrade = score => {
  if (score >= 90) return { letter: "A", label: "Distinction" }
  if (score >= 80) return { letter: "B", label: "Credit" }
  if (score >= 70) return { letter: "C", label: "Pass" }
  if (score >= 50) return { letter: "D", label: "Marginal Pass" }
  return { letter: "F", label: "Fail" }
}

// Main reporting function
function generateReport(studentName, scores) {
  const avg = average(scores)
  const { letter, label } = getLetterGrade(avg)

  return {
    name: studentName,
    scores,
    average: avg.toFixed(1),
    grade: letter,
    result: label
  }
}

// Run it
const report = generateReport("Alice Johnson", [88, 92, 79, 95, 84])
console.table(report)
\`\`\`

Notice how each function has a single clear job. \`sum\` adds numbers. \`average\` calculates a mean. \`getLetterGrade\` maps a score to a grade. \`generateReport\` orchestrates the others. This decomposition makes each piece easy to understand, test, and modify independently.

## Functions Are the Heart of JavaScript

Everything in JavaScript eventually involves functions. Array methods are functions. Event handlers are functions. The callbacks you pass to asynchronous operations are functions. The components you build in frameworks like React are functions.

The time you invest in truly understanding functions — not just the syntax, but the concepts of scope, closures, first-class functions, and higher-order functions — will pay dividends for the entire rest of your JavaScript journey. These ideas are not advanced topics you can skip past. They are the foundation.

In the next module, you will learn about control flow — the conditions and loops that give your functions decision-making power and the ability to process data at scale.`,
  quizzes: [
    {
      question: 'What is the key difference between a function declaration and a function expression in JavaScript?',
      options: [
        'Function declarations can accept parameters, while function expressions cannot',
        'Function declarations are hoisted to the top of their scope and can be called before they appear in the code, while function expressions are not hoisted',
        'Function expressions use the function keyword, while function declarations use const or let',
        'Function declarations are only valid at the top level of a file, while function expressions can be nested inside other functions'
      ],
      correct: 1,
      explanation: 'Hoisting moves function declarations to the top of their scope before execution, allowing them to be called before they appear in the source code — function expressions are not hoisted and will throw a ReferenceError if called before they are defined.'
    },
    {
      question: 'What will the following arrow function return? const multiply = (a, b) => a * b',
      options: [
        'undefined, because there is no explicit return statement',
        'An error, because arrow functions require curly braces',
        'The product of a and b — arrow functions with a single expression body implicitly return that expression',
        'The string "a * b" because without return, the expression is treated as a string'
      ],
      correct: 2,
      explanation: 'When an arrow function body is a single expression without curly braces, JavaScript implicitly returns the value of that expression — this concise form is equivalent to writing { return a * b }.'
    },
    {
      question: 'What is a closure in JavaScript?',
      options: [
        'A syntax error that occurs when a function is missing its closing curly brace',
        'A function that has been assigned to a variable using const or let',
        'A function that retains access to variables from its outer scope even after that outer scope has finished executing',
        'A method for preventing variables from being modified by functions outside their scope'
      ],
      correct: 2,
      explanation: 'Closure means that an inner function remembers and can access variables from the scope where it was defined — even after the outer function has returned — enabling patterns like private state and factory functions.'
    },
    {
      question: 'What does the rest parameter syntax (...numbers) do in a function definition?',
      options: [
        'It spreads an existing array into individual arguments when calling the function',
        'It marks the remaining parameters as optional, giving them a default value of undefined',
        'It collects all remaining arguments passed to the function into a single array called numbers',
        'It prevents the function from accepting more than the specified number of arguments'
      ],
      correct: 2,
      explanation: 'The rest parameter syntax (...paramName) collects all remaining arguments into an array, allowing a function to accept any number of arguments and work with them as a collection.'
    },
    {
      question: 'What does it mean that JavaScript functions are "first-class values"?',
      options: [
        'Functions defined with the function keyword have higher priority than arrow functions during execution',
        'Functions can be stored in variables, passed as arguments to other functions, and returned from functions — they are treated like any other value',
        'The first function defined in a file is given special privileges and runs before the rest of the code',
        'Functions declared with const are immutable and cannot be overwritten, making them first-class citizens'
      ],
      correct: 1,
      explanation: 'First-class functions means functions are treated as values in JavaScript — they can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures, enabling powerful patterns like higher-order functions and callbacks.'
    }
  ]
})

await addModule('JavaScript for Beginners', {
  title: 'Control Flow — Conditions and Loops',
  description: 'Learn how to make decisions in JavaScript with if/else, switch, and the ternary operator, and how to repeat operations efficiently with for, while, and the modern for...of and for...in loops.',
  orderIndex: 4,
  content: `## Making Programs That Think

A program that always does the same thing regardless of its inputs is not very useful. Real programs need to respond differently to different situations. When a user logs in, check whether their credentials are correct. When they submit a form, validate each field. When processing a list of students, calculate the grade for each one. This is what **control flow** enables — the ability to make decisions and repeat operations.

You already understand control flow from Python. The concepts are identical in JavaScript — conditionals and loops work the same way conceptually. The syntax differs, and JavaScript adds a few constructs that Python does not have in the same form. This module will move quickly through the familiar territory and spend more time on the JavaScript-specific features and idioms.

## if / else if / else — The Foundation of Decision-Making

The basic conditional structure in JavaScript works exactly like Python, with two syntax differences: conditions go in parentheses, and blocks go in curly braces.

\`\`\`javascript
const score = 78

if (score >= 90) {
  console.log("Grade: A")
} else if (score >= 80) {
  console.log("Grade: B")
} else if (score >= 70) {
  console.log("Grade: C")
} else if (score >= 50) {
  console.log("Grade: D")
} else {
  console.log("Grade: F")
}
// Output: "Grade: C"
\`\`\`

JavaScript evaluates conditions from top to bottom and executes the first block whose condition is true. Once a match is found, the rest of the chain is skipped.

**Comparison operators** in JavaScript:
- \`===\` strictly equal (same value and type)
- \`!==\` strictly not equal
- \`>\` greater than
- \`<\` less than
- \`>=\` greater than or equal
- \`<=\` less than or equal

**Logical operators** for combining conditions:
- \`&&\` AND — both conditions must be true
- \`||\` OR — at least one must be true
- \`!\` NOT — inverts a boolean

\`\`\`javascript
const age = 20
const hasID = true

if (age >= 18 && hasID) {
  console.log("Entry permitted")
}

const isWeekend = false
const isHoliday = true

if (isWeekend || isHoliday) {
  console.log("Day off!")
}

const isRaining = false
if (!isRaining) {
  console.log("Go outside!")
}
\`\`\`

## Truthy and Falsy — JavaScript's Implicit Booleans

JavaScript has a concept that Python shares but that is particularly prominent in JavaScript: **truthy** and **falsy** values. When a non-boolean value is used in a condition, JavaScript automatically converts it to a boolean. Values that convert to \`false\` are called **falsy**; everything else is **truthy**.

The falsy values in JavaScript are exactly six:
- \`false\`
- \`0\` (the number zero)
- \`""\` (an empty string)
- \`null\`
- \`undefined\`
- \`NaN\`

Every other value is truthy — non-zero numbers, non-empty strings, objects, arrays (even empty ones), functions.

\`\`\`javascript
const username = ""

if (username) {
  console.log(\`Hello, \${username}!\`)
} else {
  console.log("Please enter a username")
}
// Output: "Please enter a username" — empty string is falsy
\`\`\`

This is used constantly in JavaScript for checking whether a value exists or is meaningful. Instead of \`if (username !== null && username !== undefined && username !== "")\`, you can just write \`if (username)\`.

## The Ternary Operator — Inline Conditionals

For simple if/else that assigns a value based on a condition, the ternary operator provides a concise alternative:

\`\`\`javascript
const age = 20
const status = age >= 18 ? "adult" : "minor"
console.log(status) // "adult"
\`\`\`

The syntax is: \`condition ? valueIfTrue : valueIfFalse\`

Ternary operators are excellent for short, clear conditionals. They become harder to read when nested, so do not chain them deeply:

\`\`\`javascript
// Fine — simple ternary
const label = score >= 50 ? "Pass" : "Fail"

// Avoid — nested ternary is hard to read
const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F"
// Use if/else if for this instead
\`\`\`

## Short-Circuit Evaluation — || and && as Value Operators

In JavaScript, \`||\` and \`&&\` do not just return true or false — they return one of their operands. This enables two extremely common JavaScript patterns.

**The \`||\` default value pattern:** Returns the left side if it is truthy; otherwise returns the right side.

\`\`\`javascript
const userName = ""
const displayName = userName || "Guest"
console.log(displayName) // "Guest" — empty string is falsy, so || returns the right side

const userAge = 25
const displayAge = userAge || 0
console.log(displayAge) // 25 — 25 is truthy, so || returns the left side
\`\`\`

**The \`&&\` guard pattern:** Returns the left side if it is falsy (short-circuits); otherwise returns the right side.

\`\`\`javascript
const user = { name: "Alice" }

// Only access user.name if user exists
const name = user && user.name
console.log(name) // "Alice"

const noUser = null
const noName = noUser && noUser.name
console.log(noName) // null — short-circuits at noUser because null is falsy
\`\`\`

These patterns are everywhere in JavaScript code. The nullish coalescing operator \`??\` is a more specific version of \`||\` that only falls back when the left side is \`null\` or \`undefined\` (not for \`0\` or \`""\`):

\`\`\`javascript
const count = 0
console.log(count || 10)   // 10 — 0 is falsy
console.log(count ?? 10)   // 0 — ?? only falls back for null/undefined
\`\`\`

## The switch Statement

When you have a single variable or expression that you want to compare against many specific values, a \`switch\` statement can be cleaner than a long \`else if\` chain:

\`\`\`javascript
const day = "Monday"

switch (day) {
  case "Monday":
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
  case "Friday":
    console.log("Weekday")
    break
  case "Saturday":
  case "Sunday":
    console.log("Weekend")
    break
  default:
    console.log("Unknown day")
}
\`\`\`

Critical detail: the \`break\` statement at the end of each case is essential. Without it, JavaScript will "fall through" to the next case and execute that code too, even if its condition does not match. This fall-through behaviour is occasionally useful (as shown above with Monday-Friday all sharing the same output) but is usually a bug. Always include \`break\` unless you specifically intend fall-through.

The \`default\` case runs if no other case matches — it is the \`else\` of the switch statement.

## for Loops — Repeating with a Counter

The classic \`for\` loop in JavaScript uses three parts in its declaration: initialization, condition, and update.

\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(\`Iteration \${i}\`)
}
// 0, 1, 2, 3, 4
\`\`\`

Breaking this down:
- \`let i = 0\` — run once before the loop starts; creates the counter variable
- \`i < 5\` — checked before each iteration; if false, the loop stops
- \`i++\` — runs after each iteration; \`i++\` is shorthand for \`i = i + 1\`

For loops are most useful when you need the index, or when you need to loop a specific number of times:

\`\`\`javascript
const scores = [88, 92, 79, 95, 84]

for (let i = 0; i < scores.length; i++) {
  console.log(\`Score \${i + 1}: \${scores[i]}\`)
}
\`\`\`

You can also loop backwards or step by different increments:

\`\`\`javascript
// Countdown
for (let i = 10; i >= 0; i--) {
  console.log(i)
}

// Every other number
for (let i = 0; i <= 20; i += 2) {
  console.log(i) // 0, 2, 4, 6, ... 20
}
\`\`\`

## while Loops — Repeating While a Condition Holds

A \`while\` loop repeats as long as its condition is true. Use it when you do not know in advance how many iterations you need:

\`\`\`javascript
let attempts = 0
let correct = false

while (!correct && attempts < 3) {
  attempts++
  console.log(\`Attempt \${attempts}\`)
  // In a real program, you would check user input here
  if (attempts === 2) correct = true
}

console.log(correct ? "Correct!" : "Out of attempts")
\`\`\`

**Important:** always make sure the condition will eventually become false. If it never does, you have an infinite loop that will crash the browser tab.

The \`do...while\` loop is a variant that runs the body at least once before checking the condition:

\`\`\`javascript
let count = 0
do {
  console.log(\`Count: \${count}\`)
  count++
} while (count < 3)
// Always runs at least once, even if count starts at 3
\`\`\`

## for...of — The Modern Loop for Iterables

The \`for...of\` loop is the cleanest way to iterate over arrays, strings, and other iterable collections. It is the JavaScript equivalent of Python's \`for item in list\`:

\`\`\`javascript
const fruits = ["apple", "banana", "cherry"]

for (const fruit of fruits) {
  console.log(fruit)
}
// apple, banana, cherry
\`\`\`

Note \`const\` in the loop — since we are not modifying \`fruit\` inside the loop, we can use \`const\`. Use \`let\` only if you need to reassign the loop variable.

\`for...of\` also works on strings, iterating over each character:

\`\`\`javascript
const word = "hello"
for (const char of word) {
  console.log(char) // h, e, l, l, o
}
\`\`\`

When you need both the index and the value, use \`entries()\`:

\`\`\`javascript
const fruits = ["apple", "banana", "cherry"]

for (const [index, fruit] of fruits.entries()) {
  console.log(\`\${index}: \${fruit}\`)
}
// 0: apple, 1: banana, 2: cherry
\`\`\`

## for...in — Iterating Over Object Keys

While \`for...of\` works on arrays and iterables, \`for...in\` iterates over the **keys** of an object:

\`\`\`javascript
const student = {
  name: "Alice",
  age: 20,
  course: "Computer Science"
}

for (const key in student) {
  console.log(\`\${key}: \${student[key]}\`)
}
// name: Alice
// age: 20
// course: Computer Science
\`\`\`

A word of caution: \`for...in\` is designed for objects, not arrays. While it works on arrays (the keys are the index numbers), it can include inherited properties and the order is not guaranteed in all environments. For arrays, always use \`for...of\` or array methods.

## Breaking Out — break and continue

Two keywords let you control loop execution:

\`break\` exits the loop immediately:

\`\`\`javascript
const numbers = [3, 7, 12, 4, 19, 8]
let firstLarge

for (const num of numbers) {
  if (num > 10) {
    firstLarge = num
    break  // stop as soon as we find one
  }
}
console.log(firstLarge) // 12
\`\`\`

\`continue\` skips the rest of the current iteration and moves to the next:

\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue  // skip even numbers
  console.log(i)  // 1, 3, 5, 7, 9
}
\`\`\`

## Bringing It All Together — A Complete Example

Let's write a realistic program that uses multiple control flow constructs together:

\`\`\`javascript
const students = [
  { name: "Alice", scores: [88, 92, 79, 95, 84] },
  { name: "Bob", scores: [65, 70, 58, 72, 69] },
  { name: "Carol", scores: [95, 98, 100, 92, 96] },
  { name: "Dave", scores: [45, 52, 38, 61, 47] }
]

function average(scores) {
  const total = scores.reduce((sum, s) => sum + s, 0)
  return total / scores.length
}

function getGrade(avg) {
  if (avg >= 90) return "High Distinction"
  if (avg >= 80) return "Distinction"
  if (avg >= 70) return "Credit"
  if (avg >= 50) return "Pass"
  return "Fail"
}

console.log("=== Results Report ===")

for (const student of students) {
  const avg = average(student.scores)
  const grade = getGrade(avg)
  const status = avg >= 50 ? "✓ PASS" : "✗ FAIL"

  console.log(\`\${student.name}: \${avg.toFixed(1)} — \${grade} [\${status}]\`)
}

// Count passes and fails
let passes = 0
let fails = 0

for (const student of students) {
  if (average(student.scores) >= 50) {
    passes++
  } else {
    fails++
  }
}

console.log(\`\\nPassed: \${passes}/\${students.length}\`)
console.log(\`Failed: \${fails}/\${students.length}\`)
\`\`\`

This program combines everything: functions, loops, conditionals, template literals, and the ternary operator. Each piece does one thing, and they compose cleanly into a useful result.

## Control Flow Is the Logic Layer

Control flow is what turns a collection of data operations into a program that responds to the world. It is where the intelligence lives. Once you are comfortable with conditionals and loops, combined with the functions from the previous module, you can build programs that are genuinely useful.

The next module covers arrays and objects — the data structures you need to work with collections of information, which is what every real application does at its core.`,
  quizzes: [
    {
      question: 'Which of the following values is falsy in JavaScript?',
      options: [
        '[] (an empty array)',
        '"false" (the string containing the word false)',
        '0 (the number zero)',
        '{} (an empty object)'
      ],
      correct: 2,
      explanation: 'The six falsy values in JavaScript are false, 0, "" (empty string), null, undefined, and NaN — empty arrays and objects are truthy because they are objects that exist, even if they contain nothing.'
    },
    {
      question: 'What is the purpose of the break statement inside a switch case?',
      options: [
        'It ends the entire program execution when a matching case is found',
        'It prevents fall-through — without it, JavaScript continues executing the code in subsequent cases even if their conditions do not match',
        'It is required syntax for switch statements to compile correctly',
        'It re-evaluates the switch expression after each case to check if the value has changed'
      ],
      correct: 1,
      explanation: 'Without break, JavaScript falls through to the next case and executes its code regardless of whether that case\'s condition matches — break exits the switch statement after the matching case executes, which is almost always the intended behaviour.'
    },
    {
      question: 'What is the difference between for...of and for...in loops?',
      options: [
        'for...of iterates over the values of an iterable (like an array), while for...in iterates over the keys/property names of an object',
        'for...of only works on arrays, while for...in works on both arrays and objects',
        'for...in is faster than for...of for large collections',
        'for...of and for...in are interchangeable — both produce the same result for arrays and objects'
      ],
      correct: 0,
      explanation: 'for...of gives you each value from an iterable collection (array, string, Set, etc.), while for...in gives you each key (property name) from an object — using for...in on arrays gives you the index numbers as strings, which is usually not what you want.'
    },
    {
      question: 'What does the following expression return when count is 0? count ?? "empty"',
      options: [
        '"empty", because 0 is falsy and ?? falls back to the right side for any falsy value',
        '0, because ?? only falls back to the right side when the left side is null or undefined, not for 0',
        'undefined, because ?? requires both sides to be the same type',
        'An error, because ?? cannot be used with numeric values'
      ],
      correct: 1,
      explanation: 'The nullish coalescing operator (??) only falls back to the right side when the left side is null or undefined — unlike ||, it treats 0, false, and "" as meaningful values and returns them, making it more precise for default value patterns.'
    },
    {
      question: 'What does the continue keyword do inside a loop?',
      options: [
        'It exits the loop entirely, just like break',
        'It restarts the loop from the beginning, resetting the counter variable',
        'It skips the remainder of the current iteration and moves to the next iteration of the loop',
        'It pauses execution for one tick to allow the browser to render before continuing'
      ],
      correct: 2,
      explanation: 'continue skips the rest of the code in the current loop iteration and immediately starts the next one — unlike break which exits the loop entirely, continue just skips one pass through the loop body.'
    }
  ]
})

await addModule('JavaScript for Beginners', {
  title: 'Arrays and Objects — Working with Collections',
  description: 'Master JavaScript\'s two most important data structures — arrays for ordered lists and objects for structured data — including modern methods, destructuring, and the spread operator.',
  orderIndex: 5,
  content: `## The Need for Data Structures

Individual variables are fine for storing single values, but real programs work with collections — a list of students, a set of quiz questions, a user's profile data. JavaScript provides two fundamental data structures for this: **arrays** for ordered lists of things, and **objects** for named collections of related data. Together they underpin virtually every JavaScript program you will write.

You already know both of these from Python: arrays are JavaScript's equivalent of lists, and objects are similar to Python dictionaries. The syntax and some behaviours differ, but the core ideas are the same. This module goes deep on both, including the powerful modern JavaScript features — destructuring, spread, and the functional array methods — that make working with collections elegant and expressive.

## Arrays — Ordered Collections

An array is an ordered list of values. You create one with square brackets:

\`\`\`javascript
const fruits = ["apple", "banana", "cherry"]
const scores = [88, 92, 79, 95, 84]
const mixed = [1, "hello", true, null]  // arrays can hold any type
const empty = []
\`\`\`

### Accessing and Modifying Elements

Access elements by their zero-based index:

\`\`\`javascript
const fruits = ["apple", "banana", "cherry"]

console.log(fruits[0])  // "apple"
console.log(fruits[1])  // "banana"
console.log(fruits[2])  // "cherry"
console.log(fruits[3])  // undefined — out of bounds
\`\`\`

You can modify elements by assigning to an index:

\`\`\`javascript
fruits[1] = "mango"
console.log(fruits) // ["apple", "mango", "cherry"]
\`\`\`

Note: even though \`fruits\` is declared with \`const\`, you can modify its contents. \`const\` prevents reassigning the variable to a different array — it does not prevent mutation of the array itself.

### Essential Array Properties and Methods

**\`length\`** — the number of elements:

\`\`\`javascript
console.log(fruits.length) // 3
\`\`\`

**Adding and removing elements:**

\`\`\`javascript
const arr = [1, 2, 3]

arr.push(4)       // add to end → [1, 2, 3, 4]
arr.pop()         // remove from end → [1, 2, 3]
arr.unshift(0)    // add to beginning → [0, 1, 2, 3]
arr.shift()       // remove from beginning → [1, 2, 3]

// splice(startIndex, deleteCount, ...itemsToInsert)
arr.splice(1, 0, 99)   // insert 99 at index 1 → [1, 99, 2, 3]
arr.splice(1, 1)       // remove 1 element at index 1 → [1, 2, 3]
\`\`\`

**Finding elements:**

\`\`\`javascript
const nums = [10, 20, 30, 40, 50]

console.log(nums.indexOf(30))    // 2 — index of value, -1 if not found
console.log(nums.includes(40))   // true
\`\`\`

**Combining and slicing:**

\`\`\`javascript
const a = [1, 2, 3]
const b = [4, 5, 6]
const combined = a.concat(b)     // [1, 2, 3, 4, 5, 6]

const fruits = ["apple", "banana", "cherry", "date"]
const middle = fruits.slice(1, 3) // ["banana", "cherry"] — start inclusive, end exclusive
\`\`\`

**Joining and sorting:**

\`\`\`javascript
const words = ["JavaScript", "is", "fun"]
console.log(words.join(" "))   // "JavaScript is fun"
console.log(words.join(", "))  // "JavaScript, is, fun"

const nums = [3, 1, 4, 1, 5, 9, 2, 6]
nums.sort((a, b) => a - b)  // sort ascending
console.log(nums) // [1, 1, 2, 3, 4, 5, 6, 9]
\`\`\`

The \`sort\` callback requires explanation: when comparing two elements \`a\` and \`b\`, returning a negative number puts \`a\` before \`b\`, returning a positive number puts \`b\` before \`a\`, and returning 0 keeps them in the same order. So \`(a, b) => a - b\` sorts ascending and \`(a, b) => b - a\` sorts descending.

### The Functional Array Methods — The Most Important Part

Modern JavaScript provides a set of higher-order array methods that transform, filter, and aggregate data without requiring manual loops. These methods are central to how experienced JavaScript developers write code, and mastering them will make your code significantly more readable and expressive.

**\`forEach\`** — execute a function for each element (no return value):

\`\`\`javascript
const fruits = ["apple", "banana", "cherry"]

fruits.forEach(fruit => {
  console.log(\`I like \${fruit}\`)
})
\`\`\`

**\`map\`** — transform each element, return a new array of the same length:

\`\`\`javascript
const scores = [88, 92, 79, 95, 84]
const doubled = scores.map(score => score * 2)
console.log(doubled) // [176, 184, 158, 190, 168]

const names = ["alice", "bob", "carol"]
const capitalised = names.map(name => name[0].toUpperCase() + name.slice(1))
console.log(capitalised) // ["Alice", "Bob", "Carol"]
\`\`\`

**\`filter\`** — keep elements that pass a test, return a new (shorter) array:

\`\`\`javascript
const scores = [88, 92, 45, 79, 38, 95, 84, 52]
const passing = scores.filter(score => score >= 50)
console.log(passing) // [88, 92, 79, 95, 84, 52]

const words = ["apple", "banana", "apricot", "cherry", "avocado"]
const aWords = words.filter(word => word.startsWith("a"))
console.log(aWords) // ["apple", "apricot", "avocado"]
\`\`\`

**\`reduce\`** — accumulate all elements into a single value:

\`\`\`javascript
const scores = [88, 92, 79, 95, 84]
const total = scores.reduce((accumulator, current) => accumulator + current, 0)
console.log(total) // 438

// The 0 is the initial value of the accumulator
// Each iteration: accumulator + current becomes the new accumulator
\`\`\`

**\`find\`** — return the first element that passes a test (or undefined):

\`\`\`javascript
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" }
]

const user = users.find(u => u.id === 2)
console.log(user) // { id: 2, name: "Bob" }
\`\`\`

**\`findIndex\`** — return the index of the first matching element (or -1):

\`\`\`javascript
const scores = [88, 92, 45, 79, 95]
const firstFailIndex = scores.findIndex(s => s < 50)
console.log(firstFailIndex) // 2
\`\`\`

**\`some\`** and **\`every\`** — test conditions across elements:

\`\`\`javascript
const scores = [88, 92, 45, 79, 95]

console.log(scores.some(s => s < 50))   // true — at least one fails
console.log(scores.every(s => s >= 50)) // false — not all pass
console.log(scores.every(s => s > 0))   // true — all are positive
\`\`\`

**Chaining** — because \`map\` and \`filter\` return new arrays, you can chain these methods:

\`\`\`javascript
const students = [
  { name: "Alice", score: 88 },
  { name: "Bob", score: 45 },
  { name: "Carol", score: 92 },
  { name: "Dave", score: 38 }
]

const topStudentNames = students
  .filter(s => s.score >= 80)
  .map(s => s.name)

console.log(topStudentNames) // ["Alice", "Carol"]
\`\`\`

This chain first filters to only passing students, then maps to just their names. No mutation, no intermediate variables, and the intent reads clearly.

## Objects — Structured Named Data

An object stores data as **key-value pairs**. Each key is a string (or Symbol) that names a piece of data; the value can be anything.

\`\`\`javascript
const student = {
  name: "Alice Johnson",
  age: 20,
  course: "Computer Science",
  gpa: 3.8,
  isEnrolled: true
}
\`\`\`

### Accessing Object Properties

Two ways to access values:

\`\`\`javascript
// Dot notation — use when you know the key name
console.log(student.name)    // "Alice Johnson"
console.log(student.gpa)     // 3.8

// Bracket notation — use when the key is dynamic or contains spaces
const key = "course"
console.log(student[key])    // "Computer Science"
console.log(student["name"]) // "Alice Johnson"
\`\`\`

### Adding, Updating, and Deleting Properties

\`\`\`javascript
const person = { name: "Alice" }

person.age = 20          // add a new property
person.name = "Alice J"  // update existing property
delete person.age        // remove a property

console.log(person) // { name: "Alice J" }
\`\`\`

### Methods — Functions as Object Properties

When a function is stored as an object property, it is called a **method**:

\`\`\`javascript
const calculator = {
  value: 0,
  add(n) {
    this.value += n
    return this
  },
  subtract(n) {
    this.value -= n
    return this
  },
  result() {
    return this.value
  }
}

const answer = calculator.add(10).add(5).subtract(3).result()
console.log(answer) // 12
\`\`\`

The \`this\` keyword inside a method refers to the object itself, giving the method access to the object's other properties and methods.

### Useful Object Methods

\`\`\`javascript
const student = { name: "Alice", age: 20, course: "CS" }

// Get all keys
console.log(Object.keys(student))    // ["name", "age", "course"]

// Get all values
console.log(Object.values(student))  // ["Alice", 20, "CS"]

// Get all key-value pairs
console.log(Object.entries(student))
// [["name", "Alice"], ["age", 20], ["course", "CS"]]

// Check if a key exists
console.log("name" in student)  // true
console.log("gpa" in student)   // false
\`\`\`

\`Object.entries()\` combined with a \`for...of\` loop is the clean way to iterate over an object:

\`\`\`javascript
for (const [key, value] of Object.entries(student)) {
  console.log(\`\${key}: \${value}\`)
}
\`\`\`

## Destructuring — Extracting Values Concisely

**Destructuring** is one of the most useful modern JavaScript features. It lets you pull values out of arrays or objects into named variables in one clean statement.

**Array destructuring:**

\`\`\`javascript
const coordinates = [52.5, 13.4]
const [latitude, longitude] = coordinates
console.log(latitude)  // 52.5
console.log(longitude) // 13.4

// Skip elements with commas
const [first, , third] = [1, 2, 3]
console.log(first) // 1, third = 3

// Default values
const [x = 0, y = 0, z = 0] = [10, 20]
console.log(z) // 0 — default used
\`\`\`

**Object destructuring:**

\`\`\`javascript
const student = { name: "Alice", age: 20, course: "CS", gpa: 3.8 }

const { name, gpa } = student
console.log(name) // "Alice"
console.log(gpa)  // 3.8

// Rename while destructuring
const { name: studentName, gpa: gradePoint } = student
console.log(studentName) // "Alice"

// Default values
const { name: n, year = 1 } = student
console.log(year) // 1 — default used because year doesn't exist in student
\`\`\`

Destructuring in function parameters is particularly powerful:

\`\`\`javascript
function printStudent({ name, gpa, course = "Undeclared" }) {
  console.log(\`\${name} — \${course} — GPA: \${gpa}\`)
}

printStudent(student) // "Alice — CS — GPA: 3.8"
\`\`\`

## The Spread Operator — Expanding Collections

The spread operator (\`...\`) expands an array or object into its individual elements. It is one of the most versatile tools in modern JavaScript.

**Spreading arrays:**

\`\`\`javascript
const first = [1, 2, 3]
const second = [4, 5, 6]
const combined = [...first, ...second]  // [1, 2, 3, 4, 5, 6]

// Copy an array
const original = [1, 2, 3]
const copy = [...original]
copy.push(4)
console.log(original) // [1, 2, 3] — unchanged
console.log(copy)     // [1, 2, 3, 4]
\`\`\`

**Spreading objects:**

\`\`\`javascript
const defaults = { theme: "light", fontSize: 16, language: "en" }
const userPrefs = { theme: "dark", fontSize: 18 }

// Merge objects — later properties override earlier ones
const settings = { ...defaults, ...userPrefs }
console.log(settings)
// { theme: "dark", fontSize: 18, language: "en" }

// Add properties while spreading
const updatedStudent = { ...student, gpa: 3.9, graduated: true }
\`\`\`

The spread operator does **shallow copying** — nested objects are not deep-copied, they are still shared references. For deeply nested objects, you would need a different approach, but for most everyday operations spread is exactly what you need.

## Arrays of Objects — The Real-World Data Pattern

In almost every application, you will work with arrays of objects. This combination is the most common data pattern in JavaScript:

\`\`\`javascript
const students = [
  { id: 1, name: "Alice", scores: [88, 92, 79] },
  { id: 2, name: "Bob", scores: [65, 70, 58] },
  { id: 3, name: "Carol", scores: [95, 98, 100] }
]

// Find a student by id
const alice = students.find(s => s.id === 1)

// Get all names
const names = students.map(s => s.name)

// Calculate each student's average
const withAverages = students.map(s => ({
  ...s,
  average: s.scores.reduce((sum, n) => sum + n, 0) / s.scores.length
}))

// Find top scorer
const topScorer = withAverages.reduce((best, current) =>
  current.average > best.average ? current : best
)

console.log(\`Top scorer: \${topScorer.name} (\${topScorer.average.toFixed(1)})\`)
\`\`\`

This is the kind of data manipulation you will write constantly in real JavaScript applications. The functional array methods — \`map\`, \`filter\`, \`reduce\`, \`find\` — are the professional tools for this job.

## Data Structures Are the Foundation of Applications

Arrays and objects are not just syntax to memorise. They are the fundamental way you model the real world in code. A user is an object. A list of users is an array of objects. A quiz has questions (an array of objects, each with options (an array of strings) and an answer (a number)). An application's state is an object containing arrays of objects.

Once you have strong intuitions about when to reach for an array versus an object, and how to use the functional methods fluently, you will find that most programming problems decompose naturally into data structure operations. The next module will take this further by connecting these data structures to the web page itself — introducing the DOM and showing you how to display, update, and interact with data in the browser.`,
  quizzes: [
    {
      question: 'What is the difference between the map() and filter() array methods?',
      options: [
        'map() modifies the original array, while filter() creates a new one',
        'map() transforms each element and returns a new array of the same length, while filter() keeps only elements that pass a test and returns a shorter array',
        'filter() works on any data type, while map() only works on arrays of numbers',
        'map() and filter() do the same thing — they are aliases for each other in modern JavaScript'
      ],
      correct: 1,
      explanation: 'map() applies a transformation function to every element and returns a new array with the same number of elements; filter() applies a test function and returns a new array containing only the elements for which the test returned true, which may be shorter than the original.'
    },
    {
      question: 'What does the spread operator (...) do when used with an array?',
      options: [
        'It sorts the elements of the array in ascending order',
        'It converts the array into an object with numeric keys',
        'It expands the array into its individual elements, allowing arrays to be combined or copied without mutation',
        'It removes duplicate values from the array and returns unique elements only'
      ],
      correct: 2,
      explanation: 'The spread operator (...arr) expands an array\'s elements in place — this allows creating combined arrays ([...a, ...b]), copying arrays ([...original]), or passing array elements as individual function arguments.'
    },
    {
      question: 'What will the following code log? const { name, age = 25 } = { name: "Alice", score: 90 }',
      options: [
        'An error, because age does not exist in the object being destructured',
        'name = "Alice", age = undefined, because age is not in the source object',
        'name = "Alice", age = 25, because destructuring uses the default value when the key is not present',
        'name = "Alice", age = 90, because destructuring assigns the next available value'
      ],
      correct: 2,
      explanation: 'Object destructuring with default values uses the default when the key is absent or undefined in the source object — since age does not exist in the source, the default value of 25 is assigned.'
    },
    {
      question: 'How does the reduce() method work?',
      options: [
        'It removes the last element from an array and returns it, reducing the array\'s length by one',
        'It filters an array down to only the elements that match a condition, reducing its size',
        'It applies a function to each element and an accumulator, building up a single output value from all elements',
        'It reduces the memory usage of an array by compressing repeated values'
      ],
      correct: 2,
      explanation: 'reduce() takes a callback with an accumulator and current value — on each iteration, the callback combines the accumulator with the current element and returns the new accumulator, ultimately producing a single value such as a sum, count, or aggregated object.'
    },
    {
      question: 'Why is it possible to use const with an array and still modify the array\'s contents?',
      options: [
        'It is not possible — const prevents any modification of array contents',
        'const only applies to primitive values; for arrays and objects it behaves like let',
        'const prevents the variable binding from being reassigned to a different array, but does not prevent mutation of the array\'s contents through methods like push or pop',
        'const creates a frozen array only when explicitly initialised with Object.freeze()'
      ],
      correct: 2,
      explanation: 'const means the variable cannot be reassigned to point at a different array (arr = [] would throw), but the array itself remains mutable — you can add, remove, or change elements freely because that changes the array\'s contents, not the variable\'s binding.'
    }
  ]
})

await addModule('JavaScript for Beginners', {
  title: 'The DOM — Making Web Pages Interactive',
  description: 'Learn how JavaScript interacts with web pages through the Document Object Model — selecting elements, reading and changing content, modifying styles, and creating or removing elements dynamically.',
  orderIndex: 6,
  content: `## The Bridge Between JavaScript and the Web Page

Everything you have learned so far has been pure JavaScript logic — variables, functions, loops, arrays, objects. These are powerful tools, but on their own they do not affect anything the user can see. To make web pages interactive, you need a way for JavaScript to reach into the page and change it.

That bridge is the **Document Object Model**, universally known as the **DOM**.

When a browser loads an HTML file, it does not just display the raw text. It parses every HTML element and builds a tree-shaped data structure in memory that represents the entire page. Every heading, paragraph, button, image, and div becomes a **node** in this tree. The root of the tree is the \`document\` object — JavaScript's entry point into the page.

Understanding the DOM is what separates JavaScript from other general-purpose languages. Python can manipulate data, but it cannot natively reach into a web page and change a paragraph's text. JavaScript can — and the DOM is how.

## The DOM Tree

Imagine this HTML:

\`\`\`javascript
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1 id="title">Welcome</h1>
    <p class="intro">Hello, world!</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </body>
</html>
\`\`\`

The DOM represents this as a tree:

- \`document\`
  - \`html\`
    - \`head\`
      - \`title\` ("My Page")
    - \`body\`
      - \`h1\` ("Welcome") — has id "title"
      - \`p\` ("Hello, world!") — has class "intro"
      - \`ul\`
        - \`li\` ("Item 1")
        - \`li\` ("Item 2")

Each element is a **node**, and nodes have relationships: parents, children, and siblings. JavaScript can navigate this tree in any direction and modify any node.

## Selecting Elements — Finding What You Want to Change

Before you can modify an element, you need to find it. The DOM provides several methods for selecting elements, attached to the \`document\` object.

**\`getElementById\`** — select a single element by its \`id\` attribute. IDs should be unique on a page.

\`\`\`javascript
const title = document.getElementById("title")
console.log(title)  // <h1 id="title">Welcome</h1>
\`\`\`

**\`querySelector\`** — select the first element matching a CSS selector. This is the most flexible method and the one you will use most often.

\`\`\`javascript
// Select by ID
const title = document.querySelector("#title")

// Select by class
const intro = document.querySelector(".intro")

// Select by element type
const firstParagraph = document.querySelector("p")

// Select with compound selectors
const listItem = document.querySelector("ul li")

// Select by attribute
const input = document.querySelector("input[type='email']")
\`\`\`

**\`querySelectorAll\`** — select all elements matching a CSS selector, returning a NodeList.

\`\`\`javascript
const allListItems = document.querySelectorAll("li")
const allIntros = document.querySelectorAll(".intro")

// NodeList can be iterated with for...of
for (const item of allListItems) {
  console.log(item.textContent)
}

// Or converted to an array for full array method support
const itemsArray = Array.from(allListItems)
itemsArray.forEach(item => console.log(item.textContent))
\`\`\`

**\`getElementsByClassName\`** and **\`getElementsByTagName\`** exist but are older and less flexible than \`querySelector\`. Stick with \`querySelector\` and \`querySelectorAll\` for new code.

## Reading and Changing Content

Once you have selected an element, you can read and modify what it contains.

**\`textContent\`** — gets or sets the text content of an element, ignoring any HTML tags.

\`\`\`javascript
const heading = document.querySelector("h1")

// Read
console.log(heading.textContent) // "Welcome"

// Write
heading.textContent = "Hello, JavaScript!"
\`\`\`

**\`innerHTML\`** — gets or sets the HTML content inside an element. Unlike \`textContent\`, this can include HTML tags.

\`\`\`javascript
const container = document.querySelector(".container")

// Read
console.log(container.innerHTML) // returns the inner HTML as a string

// Write — can include HTML
container.innerHTML = "<strong>Bold text</strong> and <em>italic text</em>"
\`\`\`

**Important security note:** Never use \`innerHTML\` with content that comes from user input or external sources. If a user can control what gets inserted via \`innerHTML\`, they can inject malicious JavaScript — this is called **Cross-Site Scripting (XSS)**. For user-provided content, always use \`textContent\`.

**\`value\`** — for form inputs, this property gets or sets the current value:

\`\`\`javascript
const emailInput = document.querySelector("#email")
const enteredEmail = emailInput.value  // get what the user typed
emailInput.value = ""  // clear the input
\`\`\`

## Changing Styles

### Inline Styles

Every DOM element has a \`style\` property with sub-properties corresponding to CSS properties. Note: CSS property names with hyphens become camelCase in JavaScript (\`background-color\` → \`backgroundColor\`).

\`\`\`javascript
const heading = document.querySelector("h1")

heading.style.color = "navy"
heading.style.fontSize = "2.5rem"
heading.style.backgroundColor = "lightyellow"
heading.style.padding = "10px"
\`\`\`

Inline styles are powerful but can make your code messy. A cleaner approach is to pre-define classes in CSS and toggle them with JavaScript.

### Class Manipulation — The Better Approach

The \`classList\` property gives you a clean interface for working with CSS classes:

\`\`\`javascript
const button = document.querySelector(".btn")

button.classList.add("active")        // add a class
button.classList.remove("active")     // remove a class
button.classList.toggle("dark-mode")  // add if absent, remove if present
button.classList.contains("active")   // returns true/false
button.classList.replace("old", "new") // replace one class with another
\`\`\`

In your CSS file, you define what \`.active\`, \`.dark-mode\`, etc. look like. JavaScript only handles the adding and removing. This keeps styling in CSS and behaviour in JavaScript — the correct separation of concerns.

\`\`\`javascript
// In CSS:
// .hidden { display: none; }
// .highlight { background: yellow; border: 2px solid orange; }

const errorMessage = document.querySelector(".error")
const card = document.querySelector(".card")

errorMessage.classList.add("hidden")    // hide the error
card.classList.add("highlight")        // highlight the card
card.classList.toggle("highlighted")   // toggle based on current state
\`\`\`

## Reading and Changing Attributes

HTML attributes like \`src\`, \`href\`, \`alt\`, \`disabled\`, and \`data-*\` can be read and modified:

\`\`\`javascript
const link = document.querySelector("a")
const image = document.querySelector("img")
const input = document.querySelector("input")

// Reading attributes
console.log(link.getAttribute("href"))   // the URL
console.log(image.getAttribute("alt"))   // the alt text

// Setting attributes
link.setAttribute("href", "https://example.com")
image.setAttribute("src", "new-image.jpg")

// Shorthand for common attributes — direct property access
link.href = "https://example.com"
image.src = "photo.jpg"
image.alt = "A description"

// Boolean attributes
input.disabled = true    // disables the input
input.disabled = false   // re-enables it
\`\`\`

Custom \`data-*\` attributes are a clean way to store extra information in HTML elements:

\`\`\`javascript
// HTML: <button data-user-id="42" data-action="delete">Delete</button>
const btn = document.querySelector("button")
console.log(btn.dataset.userId)    // "42"
console.log(btn.dataset.action)    // "delete"
\`\`\`

## Creating and Inserting Elements

Beyond modifying existing elements, JavaScript can create entirely new ones and add them to the page.

**\`createElement\`** — create a new element:

\`\`\`javascript
const newParagraph = document.createElement("p")
newParagraph.textContent = "This paragraph was created by JavaScript!"
newParagraph.classList.add("dynamic-content")
\`\`\`

Creating an element does not add it to the page. You need to append it somewhere:

**\`appendChild\`** — add as the last child of an element:
\`\`\`javascript
const container = document.querySelector(".container")
container.appendChild(newParagraph)
\`\`\`

**\`prepend\`** — add as the first child:
\`\`\`javascript
container.prepend(newParagraph)
\`\`\`

**\`insertBefore\`** — insert before a specific child:
\`\`\`javascript
const referenceElement = document.querySelector(".reference")
container.insertBefore(newParagraph, referenceElement)
\`\`\`

**\`insertAdjacentHTML\`** — insert HTML relative to an element (useful for adding multiple elements at once):
\`\`\`javascript
container.insertAdjacentHTML("beforeend", "<p>New paragraph</p><p>Another one</p>")
// positions: "beforebegin", "afterbegin", "beforeend", "afterend"
\`\`\`

## Removing Elements

\`\`\`javascript
const elementToRemove = document.querySelector(".outdated")
elementToRemove.remove()  // removes itself from the DOM
\`\`\`

## A Complete DOM Example — Dynamic List

Let's build a small but complete example that ties together selecting, creating, modifying, and removing elements:

\`\`\`javascript
// HTML assumed:
// <ul id="task-list"></ul>
// <button id="add-btn">Add Task</button>
// <button id="clear-btn">Clear All</button>

const taskList = document.querySelector("#task-list")
const addBtn = document.querySelector("#add-btn")
const clearBtn = document.querySelector("#clear-btn")

const tasks = ["Learn JavaScript", "Build the DOM", "Create interactive pages"]

function renderTask(taskText) {
  // Create the list item
  const li = document.createElement("li")
  li.textContent = taskText

  // Create a delete button for this task
  const deleteBtn = document.createElement("button")
  deleteBtn.textContent = "✕"
  deleteBtn.style.marginLeft = "10px"

  // When delete is clicked, remove the list item
  deleteBtn.addEventListener("click", () => {
    li.remove()
  })

  li.appendChild(deleteBtn)
  taskList.appendChild(li)
}

function renderAllTasks() {
  taskList.innerHTML = ""  // clear first to avoid duplicates
  tasks.forEach(task => renderTask(task))
}

addBtn.addEventListener("click", () => {
  const newTask = \`Task \${tasks.length + 1}\`
  tasks.push(newTask)
  renderTask(newTask)
})

clearBtn.addEventListener("click", () => {
  tasks.length = 0       // empty the array
  taskList.innerHTML = "" // clear the DOM
})

// Initial render
renderAllTasks()
\`\`\`

This example uses \`addEventListener\` — the full event system is the subject of the next module. For now, notice how the DOM manipulation code is organised: there is a function for rendering one task (\`renderTask\`) and a function for rendering all (\`renderAllTasks\`). This separation makes the code easy to maintain and extend.

## Traversing the DOM

Sometimes you need to navigate from one element to its relatives in the tree:

\`\`\`javascript
const item = document.querySelector("li")

// Going up
console.log(item.parentElement)           // the <ul>
console.log(item.parentElement.parentElement) // the <div> containing the ul

// Going down
const list = document.querySelector("ul")
console.log(list.children)        // HTMLCollection of <li> children
console.log(list.firstElementChild) // first <li>
console.log(list.lastElementChild)  // last <li>

// Going sideways
console.log(item.nextElementSibling)     // next <li>
console.log(item.previousElementSibling) // previous <li>
\`\`\`

## The DOM Is Your Canvas

The DOM is what makes JavaScript feel like the language of the web. Every visual change you make to a web page — showing a message, updating a score, adding an item to a list, toggling dark mode — happens through DOM manipulation.

The pattern you will use repeatedly is: select elements when the page loads, then update them in response to events. The events part — what happens when a user clicks a button, types in an input, or submits a form — is the focus of the next module.`,
  quizzes: [
    {
      question: 'What is the DOM and why does JavaScript need it?',
      options: [
        'A programming language that browsers use to parse CSS files before applying them to HTML',
        'A tree-shaped data structure the browser builds from HTML, which JavaScript uses to read and modify the page\'s content and structure',
        'A security protocol that controls which JavaScript code is allowed to run in a browser',
        'A library that must be imported before JavaScript can interact with web page elements'
      ],
      correct: 1,
      explanation: 'The DOM is an in-memory tree representation of every HTML element on the page — JavaScript\'s document object is the entry point to this tree, allowing JavaScript to select, read, modify, create, and remove any element.'
    },
    {
      question: 'What is the key difference between querySelector() and querySelectorAll()?',
      options: [
        'querySelector() works with CSS selectors, while querySelectorAll() only works with element tag names',
        'querySelector() returns the first matching element, while querySelectorAll() returns a NodeList of all matching elements',
        'querySelectorAll() is faster than querySelector() and should always be used for performance',
        'querySelector() searches only inside the body, while querySelectorAll() searches the entire document including the head'
      ],
      correct: 1,
      explanation: 'querySelector() stops at the first match and returns that single element (or null if not found), while querySelectorAll() finds every matching element and returns them all as a NodeList that can be iterated.'
    },
    {
      question: 'Why should you use classList.add() and classList.remove() instead of directly setting element.style properties?',
      options: [
        'style properties are read-only and cannot be changed after the page loads',
        'classList methods are faster to execute than style changes in all browsers',
        'Using classList keeps styling in CSS files where it belongs, while JavaScript only handles the logic of when to add or remove classes — maintaining proper separation of concerns',
        'style properties only work on block-level elements, while classList works on all element types'
      ],
      correct: 2,
      explanation: 'Defining visual states in CSS classes and toggling those classes with JavaScript maintains separation of concerns — styles live in CSS, behaviour lives in JavaScript — making both easier to maintain and modify independently.'
    },
    {
      question: 'What is the security risk of using innerHTML with user-provided content?',
      options: [
        'innerHTML is slow and causes the page to re-render, making applications unresponsive',
        'innerHTML ignores CSS styles, so any HTML inserted will appear unstyled',
        'User-provided content inserted via innerHTML can contain malicious script tags, enabling Cross-Site Scripting (XSS) attacks',
        'innerHTML cannot handle special characters like quotes and apostrophes, causing rendering errors'
      ],
      correct: 2,
      explanation: 'innerHTML parses its content as HTML — if user-provided content contains a script tag or an event handler attribute, the browser will execute it, allowing attackers to run arbitrary JavaScript in your page (XSS). Use textContent for any user-provided data.'
    },
    {
      question: 'What does createElement() do, and what additional step is required after calling it?',
      options: [
        'createElement() creates an element and automatically appends it to the end of the document body',
        'createElement() creates a new DOM element in memory, but it must then be appended to an existing element in the DOM using appendChild(), prepend(), or similar methods before it appears on the page',
        'createElement() both creates an element and styles it, but requires setAttribute() to be called before it becomes interactive',
        'createElement() replaces an existing element with a new one of the specified type automatically'
      ],
      correct: 1,
      explanation: 'createElement() creates a new element node but does not attach it anywhere — it exists in memory but is not part of the visible page until you insert it into the DOM tree using methods like appendChild(), prepend(), or insertAdjacentHTML().'
    }
  ]
})

await addModule('JavaScript for Beginners', {
  title: 'Events and Event Listeners',
  description: 'Learn how to make web pages respond to user actions using event listeners, understand the event object, handle common events like clicks and keyboard input, and manage event propagation.',
  orderIndex: 7,
  content: `## Programs That Respond

So far, most of your JavaScript has run immediately when the page loads — it executes top to bottom and produces a result. But interactive applications are different. They wait. They wait for the user to click something, type something, submit a form, scroll the page, or resize the window. Then they respond.

This is the event-driven programming model, and it is the heart of interactive JavaScript. Instead of writing code that does things immediately, you write code that defines what should happen when specific things occur. The when is defined by **events**, and the responding code is called an **event handler** or **event listener**.

Events are happening constantly. Every time a user moves their mouse, the browser generates an event. Every key press, every scroll, every resize — events. JavaScript lets you listen for specific events on specific elements and run functions when those events occur.

## addEventListener — The Foundation

The primary way to attach an event handler in modern JavaScript is \`addEventListener()\`. You call it on a DOM element and pass two arguments: the event type as a string, and the function to run when that event occurs.

\`\`\`javascript
const button = document.querySelector("#my-button")

button.addEventListener("click", function() {
  console.log("Button was clicked!")
})
\`\`\`

The function passed as the second argument is called a **callback** — it is not called immediately, it is stored and called later when the event fires. This is the same first-class function concept from the functions module applied to events.

Using arrow functions — the modern style:

\`\`\`javascript
button.addEventListener("click", () => {
  console.log("Button was clicked!")
})
\`\`\`

You can also define the handler function separately and pass it by reference:

\`\`\`javascript
function handleClick() {
  console.log("Clicked!")
}

button.addEventListener("click", handleClick)

// Removing a listener requires the same function reference
button.removeEventListener("click", handleClick)
\`\`\`

This is important: you can only remove an event listener if you have a reference to the exact function that was added. Arrow functions defined inline cannot be removed because there is no reference to them.

## The Event Object

Every event handler callback automatically receives an **event object** as its first argument. This object contains detailed information about the event — what kind of event it was, which element triggered it, where the mouse was, which key was pressed, and much more.

\`\`\`javascript
button.addEventListener("click", event => {
  console.log(event.type)         // "click"
  console.log(event.target)       // the element that was clicked
  console.log(event.currentTarget) // the element the listener is attached to
  console.log(event.timeStamp)    // when the event occurred
  console.log(event.clientX, event.clientY) // mouse position
})
\`\`\`

**\`event.target\`** is particularly important — it is the specific element that triggered the event, which may be different from the element the listener is attached to (as we will see with event delegation).

## Common Events

JavaScript supports dozens of event types. Here are the ones you will use most often:

### Mouse Events

\`\`\`javascript
const box = document.querySelector(".box")

box.addEventListener("click", e => {
  console.log("Single click at", e.clientX, e.clientY)
})

box.addEventListener("dblclick", e => {
  console.log("Double click!")
})

box.addEventListener("mouseenter", e => {
  box.classList.add("hovered")
})

box.addEventListener("mouseleave", e => {
  box.classList.remove("hovered")
})

box.addEventListener("mousemove", e => {
  console.log("Mouse moving:", e.clientX, e.clientY)
})
\`\`\`

### Keyboard Events

Keyboard events are usually attached to the document (to catch any key press) or to specific input fields:

\`\`\`javascript
document.addEventListener("keydown", event => {
  console.log("Key pressed:", event.key)

  // Check specific keys
  if (event.key === "Enter") console.log("Enter pressed!")
  if (event.key === "Escape") console.log("Escape pressed!")
  if (event.key === "ArrowUp") console.log("Arrow up!")

  // Check modifier keys
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault()  // prevent browser save dialog
    console.log("Ctrl+S captured!")
  }
})

document.addEventListener("keyup", event => {
  console.log("Key released:", event.key)
})
\`\`\`

**\`event.key\`** gives you the actual key value as a string: \`"a"\`, \`"Enter"\`, \`"ArrowLeft"\`, \`"Shift"\`, etc. This is what you should use in modern code (as opposed to the older \`event.keyCode\` which used numeric codes).

### Form Events

\`\`\`javascript
const form = document.querySelector("form")
const emailInput = document.querySelector("#email")
const nameInput = document.querySelector("#name")

// Fires each time the input value changes
emailInput.addEventListener("input", event => {
  console.log("Current value:", event.target.value)
})

// Fires when the input loses focus
emailInput.addEventListener("blur", event => {
  if (!event.target.value.includes("@")) {
    console.log("Invalid email!")
  }
})

// Fires when the input gains focus
emailInput.addEventListener("focus", event => {
  event.target.classList.add("active")
})

// Fires when the form is submitted
form.addEventListener("submit", event => {
  event.preventDefault()  // CRITICAL — prevents page reload
  const email = emailInput.value
  const name = nameInput.value
  console.log(\`Submitted: \${name} — \${email}\`)
})
\`\`\`

\`event.preventDefault()\` is one of the most important lines you will write in JavaScript forms. By default, submitting a form causes the browser to reload the page. Calling \`preventDefault()\` stops that default behaviour so your JavaScript can handle the submission instead.

### Window and Document Events

\`\`\`javascript
// Fires when the DOM is fully loaded (but before images load)
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready — safe to select elements")
  // Your initialisation code goes here
})

// Fires when everything is loaded (including images)
window.addEventListener("load", () => {
  console.log("Everything loaded")
})

// Fires as the page is scrolled
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY
  if (scrolled > 300) {
    document.querySelector(".back-to-top").classList.add("visible")
  }
})

// Fires when the window is resized
window.addEventListener("resize", () => {
  console.log("Width:", window.innerWidth)
})
\`\`\`

The \`DOMContentLoaded\` event is particularly important. If your \`<script>\` tag is in the \`<head>\` rather than the bottom of the \`<body>\`, elements do not exist yet when your script runs. Wrapping your code in a \`DOMContentLoaded\` listener ensures the DOM is ready before you try to select elements.

## Event Propagation — Bubbling and Capturing

When you click an element, the event does not just fire on that element. It travels through the DOM tree in two phases: **capturing** (down from document to the target) and **bubbling** (back up from the target to the document). Understanding bubbling is essential because it affects how your listeners fire.

\`\`\`javascript
// HTML:
// <div class="outer">
//   <div class="inner">
//     <button>Click me</button>
//   </div>
// </div>

document.querySelector("button").addEventListener("click", e => {
  console.log("Button clicked")
})

document.querySelector(".inner").addEventListener("click", e => {
  console.log("Inner div")
})

document.querySelector(".outer").addEventListener("click", e => {
  console.log("Outer div")
})

// When the button is clicked, all three fire in order:
// "Button clicked"
// "Inner div"
// "Outer div"
\`\`\`

The click event fires on the button, then bubbles up to the inner div, then to the outer div. Every ancestor with a listener receives the event.

**\`event.stopPropagation()\`** prevents the event from bubbling further:

\`\`\`javascript
document.querySelector("button").addEventListener("click", e => {
  e.stopPropagation()  // stops here — inner and outer div listeners won't fire
  console.log("Button only")
})
\`\`\`

## Event Delegation — A Powerful Pattern

Bubbling is not just a complication to work around — it enables one of the most useful patterns in JavaScript: **event delegation**.

Instead of adding individual event listeners to many similar elements, you add one listener to their common parent. The listener uses \`event.target\` to determine which child was actually clicked.

\`\`\`javascript
// Without delegation: adding a listener to every list item
const items = document.querySelectorAll("li")
items.forEach(item => {
  item.addEventListener("click", e => {
    e.target.classList.toggle("completed")
  })
})
// Problem: items added later won't have listeners
\`\`\`

\`\`\`javascript
// With delegation: one listener on the parent
const taskList = document.querySelector("#task-list")

taskList.addEventListener("click", e => {
  // Only respond if the clicked element is an li
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("completed")
  }

  // Respond to a delete button inside an li
  if (e.target.classList.contains("delete-btn")) {
    e.target.parentElement.remove()
  }
})
\`\`\`

Event delegation has two major advantages: it uses one listener instead of many (more efficient), and it works for elements that are added to the DOM after the listener was set up (which breaks per-element listeners).

## A Complete Interactive Example — To-Do List

Let's build a complete to-do list that uses everything in this module:

\`\`\`javascript
// HTML assumed:
// <div id="app">
//   <form id="add-form">
//     <input id="task-input" type="text" placeholder="Add a task...">
//     <button type="submit">Add</button>
//   </form>
//   <ul id="task-list"></ul>
//   <p id="task-count">0 tasks</p>
// </div>

const form = document.querySelector("#add-form")
const input = document.querySelector("#task-input")
const taskList = document.querySelector("#task-list")
const taskCount = document.querySelector("#task-count")

let tasks = []

function updateCount() {
  const remaining = tasks.filter(t => !t.completed).length
  taskCount.textContent = \`\${remaining} task\${remaining !== 1 ? "s" : ""} remaining\`
}

function renderTasks() {
  taskList.innerHTML = ""

  tasks.forEach((task, index) => {
    const li = document.createElement("li")
    li.dataset.index = index

    const span = document.createElement("span")
    span.textContent = task.text
    if (task.completed) li.classList.add("completed")

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete"
    deleteBtn.classList.add("delete-btn")

    li.appendChild(span)
    li.appendChild(deleteBtn)
    taskList.appendChild(li)
  })

  updateCount()
}

// Add new task on form submit
form.addEventListener("submit", event => {
  event.preventDefault()
  const text = input.value.trim()
  if (!text) return  // ignore empty submissions

  tasks.push({ text, completed: false })
  input.value = ""
  renderTasks()
})

// Event delegation on the list
taskList.addEventListener("click", event => {
  const li = event.target.closest("li")
  if (!li) return

  const index = parseInt(li.dataset.index)

  if (event.target.classList.contains("delete-btn")) {
    tasks.splice(index, 1)
  } else {
    tasks[index].completed = !tasks[index].completed
  }

  renderTasks()
})

// Keyboard shortcut
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    input.value = ""
    input.blur()
  }
})

renderTasks()
\`\`\`

Notice \`event.target.closest("li")\` — the \`closest()\` method traverses up the DOM tree from the target element until it finds an element matching the selector. This handles the case where the user clicks on the span or button inside the li, not the li itself.

## Events Are the Entry Point to Interactivity

Every interaction in a web application — clicking, typing, submitting, scrolling — flows through events. The event-driven model is not just a feature of JavaScript; it is the fundamental programming model of the browser. Every framework you will encounter (React, Vue, Angular) is built on top of this same event system, even if it abstracts it with different syntax.

With events, DOM manipulation from the previous module, and the data structures from before that, you now have every piece needed to build complete interactive applications. The final module will prove it.`,
  quizzes: [
    {
      question: 'What is event.preventDefault() used for, and when is it essential?',
      options: [
        'It stops an event from firing on an element, preventing any handlers from running',
        'It cancels the event propagation so parent elements do not receive the event',
        'It prevents the browser\'s default behaviour for that event — such as stopping a form submission from reloading the page — allowing JavaScript to handle the action instead',
        'It disables the element that fired the event, preventing future interactions until re-enabled'
      ],
      correct: 2,
      explanation: 'Many browser events have built-in default behaviours — form submission reloads the page, clicking a link navigates away, right-clicking shows a context menu. event.preventDefault() cancels these defaults so JavaScript can provide alternative handling.'
    },
    {
      question: 'What is event bubbling?',
      options: [
        'The browser\'s process of checking all possible event listeners before deciding which element the event belongs to',
        'A technique for combining multiple event listeners into a single efficient handler',
        'After an event fires on an element, it propagates upward through its ancestor elements, triggering any matching event listeners on each parent',
        'The delay between when a user interaction occurs and when the JavaScript event handler executes'
      ],
      correct: 2,
      explanation: 'Event bubbling means that after an event fires on a target element, it travels up the DOM tree through each parent element — any of these ancestors with a listener for the same event type will also receive and process it.'
    },
    {
      question: 'What is event delegation and what problem does it solve?',
      options: [
        'Assigning event handling to a worker thread so the main thread remains responsive',
        'Attaching one event listener to a parent element instead of many listeners to individual children, using event.target to identify which child was interacted with — this works for dynamically added elements and is more efficient',
        'Delegating event handling to an external library like jQuery to simplify cross-browser compatibility',
        'A pattern where events are queued and processed in batch rather than immediately'
      ],
      correct: 1,
      explanation: 'Event delegation exploits bubbling by placing one listener on a parent — events from children bubble up to it, and event.target identifies the specific child that was interacted with. This is more efficient than per-element listeners and automatically handles elements added to the DOM after the listener was set up.'
    },
    {
      question: 'What is the difference between event.target and event.currentTarget?',
      options: [
        'event.target is the element the user intended to interact with, while event.currentTarget is the element the browser actually registered the click on',
        'event.target is the element that originally triggered the event; event.currentTarget is the element that the event listener is attached to — these differ during bubbling',
        'event.currentTarget changes during event propagation, while event.target stays fixed at the document root',
        'They are identical — both refer to the element that the event listener is attached to'
      ],
      correct: 1,
      explanation: 'event.target is always the element that originally triggered the event (e.g., a button inside a div), while event.currentTarget is the element the listener is attached to (e.g., the div) — during bubbling these are different elements, which is why event.target is essential for event delegation.'
    },
    {
      question: 'Why is it important to use the "input" event rather than "change" for real-time form validation?',
      options: [
        'The "change" event is deprecated and no longer supported in modern browsers',
        'The "input" event fires on every keystroke as the value changes, enabling real-time feedback, while "change" only fires when the element loses focus after a modification',
        'The "input" event works on all form elements, while "change" only works on checkboxes and radio buttons',
        'The "change" event requires event.preventDefault() to work correctly, while "input" does not'
      ],
      correct: 1,
      explanation: 'The "input" event fires immediately on every character typed or deleted, enabling live validation and character counts — "change" only fires when the input loses focus (blur) after being modified, which is too delayed for real-time feedback patterns.'
    }
  ]
})

await addModule('JavaScript for Beginners', {
  title: 'Putting It All Together — Build a Mini Interactive App',
  description: 'Apply every concept from this track to design and build a complete interactive quiz application — combining DOM manipulation, events, arrays, objects, functions, and control flow into a real working app.',
  orderIndex: 8,
  content: `## From Concepts to a Real Application

Every module in this track has given you a piece of the puzzle. Variables and data types gave you the raw material. Functions gave you organisation. Control flow gave you decision-making. Arrays and objects gave you the ability to model structured data. The DOM gave you the ability to reach into the page and change it. Events gave you the ability to respond to the user.

Now you put it all together.

This module walks you through building a complete interactive quiz application from scratch. It is small enough to finish in one session but substantial enough to demonstrate every major concept from this track working in concert. By the end, you will have a functioning app and — more importantly — a clear understanding of how all the pieces connect.

The quiz app will:
- Store a set of questions and answers in a data structure
- Display one question at a time with multiple-choice options
- Respond to user selections
- Track the score
- Show a results screen at the end
- Allow the user to restart

## Planning Before Coding

Experienced developers always plan before writing code. Jumping straight into implementation leads to tangled, hard-to-change code. A few minutes of design saves hours of refactoring.

**Questions to answer before starting:**

*What data do I need?* A list of questions. Each question has text, multiple options, and a correct answer index. This is clearly an array of objects.

*What state does the app have?* The current question index, the user's score, and whether the quiz is in progress or showing results. State is data that changes over time.

*What does the user interact with?* They click an option to answer. They click a button to restart. These are event listeners.

*What changes on the page?* The question text, the options, the score display, and which screen is visible. These are DOM manipulations.

Once you have clear answers to these questions, the code almost writes itself.

## The Data Structure

\`\`\`javascript
const questions = [
  {
    text: "What keyword do you use to declare a variable that cannot be reassigned?",
    options: ["var", "let", "const", "set"],
    correct: 2
  },
  {
    text: "Which method adds an element to the end of an array?",
    options: ["append()", "push()", "add()", "insert()"],
    correct: 1
  },
  {
    text: "What does === check in JavaScript?",
    options: [
      "Value only, ignoring type",
      "Type only, ignoring value",
      "Both value and type, with no coercion",
      "Whether two objects are the same reference"
    ],
    correct: 2
  },
  {
    text: "What does event.preventDefault() do?",
    options: [
      "Stops event bubbling to parent elements",
      "Removes the event listener from the element",
      "Cancels the browser's default behaviour for that event",
      "Prevents the event from firing on child elements"
    ],
    correct: 2
  },
  {
    text: "Which array method returns a new array of the same length with each element transformed?",
    options: ["filter()", "reduce()", "forEach()", "map()"],
    correct: 3
  }
]
\`\`\`

This is the foundation. All the app's logic flows from this data structure. Notice that the correct answer is stored as an index (0–3) matching the options array — this makes comparison straightforward.

## The Application State

State is the data that changes as the user interacts with the app. Track it in clearly named variables:

\`\`\`javascript
let currentQuestionIndex = 0
let score = 0
let answered = false  // prevent multiple answers per question
\`\`\`

These three variables represent everything the app needs to know about where it is at any moment. Good state design is minimal — store only what you truly need, and derive everything else from it.

## The HTML Structure

Before writing JavaScript, sketch the HTML. Good DOM manipulation starts with well-structured HTML:

\`\`\`javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JavaScript Quiz</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">

    <!-- Quiz Screen -->
    <div id="quiz-screen">
      <div id="progress">
        <span id="question-counter">Question 1 of 5</span>
        <span id="score-display">Score: 0</span>
      </div>

      <h2 id="question-text">Question goes here</h2>

      <div id="options-container">
        <!-- Options will be generated by JavaScript -->
      </div>

      <button id="next-btn" class="hidden">Next Question →</button>
    </div>

    <!-- Results Screen -->
    <div id="results-screen" class="hidden">
      <h2>Quiz Complete!</h2>
      <p id="final-score">You scored X out of 5</p>
      <p id="result-message">Message here</p>
      <button id="restart-btn">Try Again</button>
    </div>

  </div>
  <script src="script.js"></script>
</body>
</html>
\`\`\`

Notice the \`class="hidden"\` on elements that should not be visible initially. In your CSS, \`.hidden { display: none; }\` handles the visibility. JavaScript toggles this class — it does not manage styles directly.

## Selecting DOM Elements

At the top of your \`script.js\`, select all the elements you will need. Doing this once at the top is more efficient than re-selecting inside every function:

\`\`\`javascript
const quizScreen = document.querySelector("#quiz-screen")
const resultsScreen = document.querySelector("#results-screen")
const questionCounter = document.querySelector("#question-counter")
const scoreDisplay = document.querySelector("#score-display")
const questionText = document.querySelector("#question-text")
const optionsContainer = document.querySelector("#options-container")
const nextBtn = document.querySelector("#next-btn")
const finalScore = document.querySelector("#final-score")
const resultMessage = document.querySelector("#result-message")
const restartBtn = document.querySelector("#restart-btn")
\`\`\`

## Core Functions

Now the logic. Each function does one thing, named clearly:

**\`showQuestion\`** — display the current question:

\`\`\`javascript
function showQuestion() {
  const question = questions[currentQuestionIndex]
  answered = false

  // Update progress info
  questionCounter.textContent = \`Question \${currentQuestionIndex + 1} of \${questions.length}\`
  scoreDisplay.textContent = \`Score: \${score}\`

  // Update question text
  questionText.textContent = question.text

  // Generate option buttons
  optionsContainer.innerHTML = ""

  question.options.forEach((optionText, index) => {
    const button = document.createElement("button")
    button.textContent = optionText
    button.classList.add("option-btn")
    button.dataset.index = index
    optionsContainer.appendChild(button)
  })

  // Hide next button until an option is selected
  nextBtn.classList.add("hidden")
}
\`\`\`

**\`handleAnswer\`** — process a user's selection:

\`\`\`javascript
function handleAnswer(selectedIndex) {
  if (answered) return  // ignore clicks after already answering

  answered = true
  const question = questions[currentQuestionIndex]
  const isCorrect = selectedIndex === question.correct

  if (isCorrect) score++

  // Visual feedback on all options
  const optionButtons = optionsContainer.querySelectorAll(".option-btn")
  optionButtons.forEach((btn, index) => {
    btn.disabled = true  // prevent further clicks

    if (index === question.correct) {
      btn.classList.add("correct")
    } else if (index === selectedIndex && !isCorrect) {
      btn.classList.add("incorrect")
    }
  })

  // Update score display
  scoreDisplay.textContent = \`Score: \${score}\`

  // Show next button (or finish button on last question)
  nextBtn.textContent = currentQuestionIndex < questions.length - 1
    ? "Next Question →"
    : "See Results"
  nextBtn.classList.remove("hidden")
}
\`\`\`

**\`showResults\`** — display the final screen:

\`\`\`javascript
function showResults() {
  quizScreen.classList.add("hidden")
  resultsScreen.classList.remove("hidden")

  const percentage = Math.round((score / questions.length) * 100)
  finalScore.textContent = \`You scored \${score} out of \${questions.length} (\${percentage}%)\`

  let message
  if (percentage >= 80) {
    message = "Excellent work! You have a strong grasp of the fundamentals."
  } else if (percentage >= 60) {
    message = "Good effort! Review the modules on the topics you missed."
  } else {
    message = "Keep practising! Revisit the earlier modules and try again."
  }

  resultMessage.textContent = message
}
\`\`\`

**\`resetQuiz\`** — restart from the beginning:

\`\`\`javascript
function resetQuiz() {
  currentQuestionIndex = 0
  score = 0
  answered = false

  resultsScreen.classList.add("hidden")
  quizScreen.classList.remove("hidden")

  showQuestion()
}
\`\`\`

## Event Listeners — Wiring It All Together

With the functions defined, event listeners connect user actions to the logic:

\`\`\`javascript
// Event delegation on the options container
optionsContainer.addEventListener("click", event => {
  if (!event.target.classList.contains("option-btn")) return
  const selectedIndex = parseInt(event.target.dataset.index)
  handleAnswer(selectedIndex)
})

// Next button — advance or finish
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++

  if (currentQuestionIndex < questions.length) {
    showQuestion()
  } else {
    showResults()
  }
})

// Restart button
restartBtn.addEventListener("click", resetQuiz)

// Start the quiz
showQuestion()
\`\`\`

Notice event delegation on the options container — one listener handles all option buttons, including those created dynamically. The last line, \`showQuestion()\`, bootstraps the app by displaying the first question.

## The Complete script.js

Putting it all together:

\`\`\`javascript
// ====================================
// DATA
// ====================================
const questions = [
  {
    text: "What keyword declares a variable that cannot be reassigned?",
    options: ["var", "let", "const", "set"],
    correct: 2
  },
  {
    text: "Which method adds an element to the end of an array?",
    options: ["append()", "push()", "add()", "insert()"],
    correct: 1
  },
  {
    text: "What does === check?",
    options: [
      "Value only",
      "Type only",
      "Both value and type, no coercion",
      "Object reference equality"
    ],
    correct: 2
  },
  {
    text: "What does event.preventDefault() do?",
    options: [
      "Stops event bubbling",
      "Removes the listener",
      "Cancels the browser's default behaviour",
      "Prevents child events"
    ],
    correct: 2
  },
  {
    text: "Which array method transforms each element and returns a new array?",
    options: ["filter()", "reduce()", "forEach()", "map()"],
    correct: 3
  }
]

// ====================================
// STATE
// ====================================
let currentQuestionIndex = 0
let score = 0
let answered = false

// ====================================
// DOM REFERENCES
// ====================================
const quizScreen = document.querySelector("#quiz-screen")
const resultsScreen = document.querySelector("#results-screen")
const questionCounter = document.querySelector("#question-counter")
const scoreDisplay = document.querySelector("#score-display")
const questionText = document.querySelector("#question-text")
const optionsContainer = document.querySelector("#options-container")
const nextBtn = document.querySelector("#next-btn")
const finalScore = document.querySelector("#final-score")
const resultMessage = document.querySelector("#result-message")
const restartBtn = document.querySelector("#restart-btn")

// ====================================
// FUNCTIONS
// ====================================
function showQuestion() {
  const question = questions[currentQuestionIndex]
  answered = false

  questionCounter.textContent = \`Question \${currentQuestionIndex + 1} of \${questions.length}\`
  scoreDisplay.textContent = \`Score: \${score}\`
  questionText.textContent = question.text
  optionsContainer.innerHTML = ""
  nextBtn.classList.add("hidden")

  question.options.forEach((optionText, index) => {
    const btn = document.createElement("button")
    btn.textContent = optionText
    btn.classList.add("option-btn")
    btn.dataset.index = index
    optionsContainer.appendChild(btn)
  })
}

function handleAnswer(selectedIndex) {
  if (answered) return
  answered = true

  const question = questions[currentQuestionIndex]
  const isCorrect = selectedIndex === question.correct
  if (isCorrect) score++

  optionsContainer.querySelectorAll(".option-btn").forEach((btn, index) => {
    btn.disabled = true
    if (index === question.correct) btn.classList.add("correct")
    else if (index === selectedIndex) btn.classList.add("incorrect")
  })

  scoreDisplay.textContent = \`Score: \${score}\`
  nextBtn.textContent = currentQuestionIndex < questions.length - 1
    ? "Next Question →"
    : "See Results"
  nextBtn.classList.remove("hidden")
}

function showResults() {
  quizScreen.classList.add("hidden")
  resultsScreen.classList.remove("hidden")

  const pct = Math.round((score / questions.length) * 100)
  finalScore.textContent = \`You scored \${score} out of \${questions.length} (\${pct}%)\`
  resultMessage.textContent =
    pct >= 80 ? "Excellent! Strong grasp of the fundamentals." :
    pct >= 60 ? "Good effort! Review the topics you missed." :
    "Keep practising — revisit the earlier modules."
}

function resetQuiz() {
  currentQuestionIndex = 0
  score = 0
  answered = false
  resultsScreen.classList.add("hidden")
  quizScreen.classList.remove("hidden")
  showQuestion()
}

// ====================================
// EVENT LISTENERS
// ====================================
optionsContainer.addEventListener("click", event => {
  if (!event.target.classList.contains("option-btn")) return
  handleAnswer(parseInt(event.target.dataset.index))
})

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++
  currentQuestionIndex < questions.length ? showQuestion() : showResults()
})

restartBtn.addEventListener("click", resetQuiz)

// ====================================
// INITIALISE
// ====================================
showQuestion()
\`\`\`

## What Each Module Contributed

Look at the complete application and trace each concept back to where you learned it:

**Variables and data types** — \`currentQuestionIndex\`, \`score\`, \`answered\`, template literals throughout.

**Functions** — \`showQuestion\`, \`handleAnswer\`, \`showResults\`, \`resetQuiz\`. Each does one thing. They call each other. They are the backbone of the app.

**Control flow** — the \`if\` in \`handleAnswer\` checking \`answered\`. The ternary for \`nextBtn.textContent\`. The chained ternary for \`resultMessage\`.

**Arrays and objects** — the \`questions\` array of objects. \`forEach\` for rendering options. \`querySelectorAll\` returning a NodeList iterated with \`forEach\`.

**DOM manipulation** — selecting elements at the top. \`createElement\` for option buttons. \`classList\` for showing/hiding screens. \`textContent\` for updates. \`innerHTML = ""\` for clearing options.

**Events** — event delegation on the options container. \`addEventListener\` on the next and restart buttons. \`event.target\` to identify which option was clicked.

## The Pattern Behind Every JavaScript App

What you have built follows a pattern that scales to applications of any complexity:

1. **Data** — define your data structures
2. **State** — identify what changes over time
3. **Render functions** — functions that update the DOM to reflect current state
4. **Event handlers** — functions that update state and call render functions
5. **Initialise** — call the first render function to bootstrap the app

This is the fundamental architecture of interactive JavaScript. Modern frameworks like React are built on this same pattern — they add tooling and conventions, but the core loop is identical: state changes, the UI re-renders to reflect the new state.

## Where You Go From Here

You have completed the foundational layer of JavaScript. You understand the language, the browser environment, and the pattern for building interactive applications. The concepts in this track are not a starting point that you leave behind — they are the permanent foundation that everything else is built on.

From here, the natural next steps are:

**Asynchronous JavaScript** — \`fetch\`, \`Promises\`, and \`async/await\` for loading data from APIs. This is how real applications get their data.

**Modern tooling** — npm, build tools, and module systems that allow you to structure large applications across multiple files.

**A JavaScript framework** — React, Vue, or Svelte. These are libraries built on the exact concepts you have learned, providing tools for managing complex state and building component-based user interfaces.

**Node.js** — JavaScript on the server, enabling you to build APIs, command-line tools, and full-stack applications.

Each of these directions extends from exactly the foundation you have now. The language is the same. The concepts are the same. The problems are larger and the tools are more sophisticated, but the thinking is what you have been practising throughout this track.

You are not a JavaScript beginner anymore.`,
  quizzes: [
    {
      question: 'In the quiz application, why is state stored in separate variables (currentQuestionIndex, score, answered) rather than read from the DOM when needed?',
      options: [
        'Because reading from the DOM is not possible once event listeners are attached',
        'Because DOM elements cannot store numeric values — only strings',
        'Because keeping state in JavaScript variables makes it the single source of truth — the DOM reflects the state, not the other way around, making the app easier to reason about and modify',
        'Because DOM reads are asynchronous and would cause timing issues inside event handlers'
      ],
      correct: 2,
      explanation: 'The principle of a single source of truth means state lives in JavaScript, and the DOM is just a reflection of it — this prevents bugs where the displayed state and the actual state get out of sync, and makes operations like resetting the quiz straightforward.'
    },
    {
      question: 'Why is event delegation used on the options container rather than adding individual listeners to each option button?',
      options: [
        'Because option buttons have a different event model than other elements and require a parent listener',
        'Because the option buttons are created dynamically by JavaScript — they do not exist when the page loads, so per-element listeners set up at load time would miss them',
        'Because event delegation is required when buttons are inside a form element',
        'Because individual listeners on buttons cause memory leaks in modern browsers'
      ],
      correct: 1,
      explanation: 'Option buttons are created dynamically by showQuestion() each time a new question loads — event listeners set up at page load time on specific elements that do not yet exist would fail, but a listener on the stable parent container catches events from all dynamically created children via bubbling.'
    },
    {
      question: 'What architectural pattern does this application follow, and why does it scale to larger applications?',
      options: [
        'Model-View-Controller (MVC) — separating data into a model class, display into a view class, and interaction into a controller class',
        'Data → State → Render functions → Event handlers → Initialise — render functions update the DOM to reflect state, and event handlers update state then re-render',
        'Publish-Subscribe — components subscribe to events published by other components without direct dependencies',
        'Functional reactive programming — all state changes are expressed as streams of events processed by pure functions'
      ],
      correct: 1,
      explanation: 'The pattern — define data, track state separately, write render functions that update the DOM to reflect state, write event handlers that update state and trigger re-renders — is the foundational architecture of interactive JavaScript and the same pattern modern frameworks like React formalise and extend.'
    },
    {
      question: 'In the handleAnswer function, why is btn.disabled = true set on all option buttons after an answer is selected?',
      options: [
        'To improve performance by reducing the number of active event listeners',
        'Because the "answered" guard variable alone is not sufficient — disabled buttons cannot be clicked at all, providing a more reliable second layer of protection against double-answering',
        'Because disabled buttons are automatically styled differently by browsers, providing visual feedback without CSS',
        'It is required by the event delegation pattern — parent listeners ignore events from disabled children'
      ],
      correct: 1,
      explanation: 'The "answered" flag is a logical guard, but disabled buttons cannot be clicked at all — combining both provides defence in depth. It also gives the user a clear visual signal that the question has been answered and options are no longer interactive.'
    },
    {
      question: 'What is the significance of calling showQuestion() at the end of the script, after all functions and event listeners are defined?',
      options: [
        'It is required syntax — JavaScript will throw an error if functions are defined but not called',
        'It pre-renders the quiz so it is cached before the user interacts with it',
        'It bootstraps the application — triggering the first render to display the initial question, starting the app running after everything it depends on is set up',
        'It registers the showQuestion function with the browser\'s rendering engine for optimised scheduling'
      ],
      correct: 2,
      explanation: 'Calling showQuestion() at the end is the initialisation step that starts the app — defining functions and attaching listeners sets everything up, but nothing appears until this first call executes, which displays the first question and makes the app ready to use.'
    }
  ]
})
await addModule('React Development', {
  title: 'What is React and Why Does It Exist',
  description: 'Understand the problem React solves, how it differs from vanilla JavaScript DOM manipulation, and why the component-based, declarative model makes building complex UIs dramatically more manageable.',
  orderIndex: 1,
  content: `## The Problem React Was Built to Solve

Before you write a single line of React, you need to understand the problem it was designed to solve. Otherwise React feels like an arbitrary set of rules imposed on top of JavaScript. Once you see the problem clearly, React feels like an obvious solution.

Imagine you are building a social media feed. Each post has a like count, a comment count, a share button, and a user avatar. When someone likes a post, the like count increments, the button changes colour, and a notification badge updates somewhere else on the page. When they comment, the comment count updates, the comment list expands, and the input field clears.

In vanilla JavaScript, you would write code like this:

\`\`\`javascript
const likeBtn = document.querySelector(\`#like-btn-\${postId}\`)
const likeCount = document.querySelector(\`#like-count-\${postId}\`)
const notificationBadge = document.querySelector('#notification-badge')

likeBtn.addEventListener('click', () => {
  const current = parseInt(likeCount.textContent)
  likeCount.textContent = current + 1
  likeBtn.classList.add('liked')
  notificationBadge.textContent = parseInt(notificationBadge.textContent) + 1
  // update database...
  // update other places that show this like count...
  // handle the case where user un-likes...
})
\`\`\`

This works for one button. Now imagine a feed with fifty posts, each with its own like button, comment section, share menu, and bookmark button. Every time the data changes, you have to find the right DOM elements and update them manually. The data (the actual like count) lives somewhere in JavaScript, but the display of that data is scattered across dozens of DOM manipulation calls.

This is the core problem: **as an application grows, keeping the DOM in sync with the data becomes exponentially harder to manage.** You end up with spaghetti code where the state of the application is implicitly encoded in the DOM itself, bugs emerge because you forgot to update one of the seven places that shows a particular piece of data, and adding new features requires carefully threading through existing imperative logic.

Facebook built React in 2013 to solve exactly this problem. They had a massive, complex web application with exactly this kind of state-synchronisation nightmare, and they needed a better model.

## The React Mental Model — Declarative UI

React's solution is a complete inversion of how you think about building UIs. Instead of writing code that says **how to change the UI** (imperative), you write code that says **what the UI should look like** for a given state (declarative).

In vanilla JavaScript: "Find the like count element. Read its current value. Add one. Set the text content to the new value. Find the button. Add the 'liked' class."

In React: "When the like count is N and isLiked is true, render a button with the 'liked' class and the number N next to it."

You describe the desired end state. React figures out how to get there. When the data changes, you update the data — React automatically re-renders the UI to match.

This is the fundamental mental model of React: **UI is a function of state.**

\`\`\`javascript
UI = f(state)
\`\`\`

Give React the current state of your application, and it produces the UI. Change the state, React produces the new UI. You never manually reach into the DOM and change elements — you change the data, and React handles the rest.

## The Virtual DOM — How React Makes This Fast

The obvious concern with "re-render everything when data changes" is performance. If every data change causes the entire page to be redrawn, that sounds expensive. React solves this with the **Virtual DOM**.

The Virtual DOM is a lightweight JavaScript representation of the actual DOM — a tree of plain JavaScript objects that describes what the UI should look like. When your state changes, React:

1. Builds a new Virtual DOM tree representing the updated UI
2. Compares it to the previous Virtual DOM tree (this process is called **diffing**)
3. Calculates the minimal set of actual DOM changes needed
4. Applies only those specific changes to the real DOM

This means React does the expensive DOM manipulation as infrequently and minimally as possible, while you get to write simple declarative code without thinking about performance optimisation. In practice, React applications are fast because of this diffing process, not despite the "re-render everything" approach.

## Components — The Lego Blocks of React

The second major idea in React is **component-based architecture**. Instead of thinking about a page as one big HTML document, React encourages you to break the UI into small, self-contained, reusable pieces called components.

Think of a YouTube page. You can decompose it into components:
- A \`Header\` component (search bar, navigation, profile icon)
- A \`VideoGrid\` component
  - Many \`VideoCard\` components (each with thumbnail, title, channel name, view count)
- A \`Sidebar\` component
  - Many \`SidebarItem\` components

Each component owns its own logic and appearance. The \`VideoCard\` component knows how to display a video — give it the data for any video and it renders correctly. You can reuse the same component dozens of times with different data.

This is fundamentally different from traditional web development where you might have one HTML file, one CSS file, and one JavaScript file, with everything tangled together. React components bundle HTML structure, CSS-adjacent styling logic, and JavaScript behaviour into a single, cohesive unit.

## JSX — HTML in Your JavaScript

React introduces a syntax extension called **JSX** that lets you write what looks like HTML directly in your JavaScript files. This initially looks strange to everyone.

\`\`\`jsx
function Greeting() {
  const name = "Alice"
  return <h1>Hello, {name}!</h1>
}
\`\`\`

JSX is not HTML. It is syntactic sugar for function calls. The above is transformed by a build tool (Babel) into:

\`\`\`javascript
function Greeting() {
  const name = "Alice"
  return React.createElement('h1', null, \`Hello, \${name}!\`)
}
\`\`\`

JSX compiles to \`React.createElement\` calls, which create Virtual DOM objects. You never write \`React.createElement\` directly — JSX makes it readable and intuitive.

Key JSX rules that differ from HTML:
- Use \`className\` instead of \`class\` (class is a reserved word in JavaScript)
- Use \`htmlFor\` instead of \`for\` on labels
- All tags must be closed — \`<img />\` not \`<img>\`
- JavaScript expressions go inside curly braces \`{}\`
- A component must return a single root element (or a Fragment)

\`\`\`jsx
function UserCard({ name, age, isActive }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <span className={isActive ? 'active' : 'inactive'}>
        {isActive ? 'Online' : 'Offline'}
      </span>
    </div>
  )
}
\`\`\`

The curly braces are the bridge between JSX and JavaScript. Anything valid as a JavaScript expression can go inside them: variables, function calls, ternary operators, array methods. You cannot put statements (if/else, for loops) directly inside JSX — but you can use ternary operators and array methods, or compute values before the return statement.

## Setting Up a React Project

The fastest way to start a React project today is with **Vite**, a modern build tool that sets everything up for you:

\`\`\`javascript
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
\`\`\`

This creates a project structure:
\`\`\`
my-react-app/
  src/
    App.jsx        — your main App component
    main.jsx       — the entry point that mounts React
    index.css      — global styles
  index.html       — the HTML shell
  package.json
  vite.config.js
\`\`\`

Open \`src/main.jsx\` and you will see:

\`\`\`jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
\`\`\`

This is the entry point. React takes control of the \`<div id="root">\` in \`index.html\` and renders your entire application inside it. Everything from here is React components — you rarely touch the HTML file again.

## React vs Vanilla JavaScript — A Side-by-Side Example

Let's see the difference concretely. A counter that increments when a button is clicked:

**Vanilla JavaScript:**
\`\`\`javascript
// HTML: <div id="app"><p id="count">0</p><button id="btn">+</button></div>

let count = 0
const countEl = document.getElementById('count')
const btn = document.getElementById('btn')

btn.addEventListener('click', () => {
  count++
  countEl.textContent = count  // manual DOM sync
})
\`\`\`

**React:**
\`\`\`jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
\`\`\`

The React version is shorter, but more importantly it is structurally different. There is no manual DOM query, no manual DOM update. The UI is described in terms of what it should look like (show the \`count\` variable). When \`setCount\` is called with a new value, React re-renders the component automatically with the new count displayed. The data and the display are always in sync because React makes them inseparable.

## The React Ecosystem

React itself is a focused library — it handles rendering and component composition. It does not prescribe how you handle routing, data fetching, styling, or global state management. This gives you flexibility but requires choosing from a rich ecosystem of companion libraries:

**Routing:** React Router, TanStack Router
**State management:** Redux Toolkit, Zustand, Jotai
**Data fetching:** TanStack Query, SWR, RTK Query
**Styling:** CSS Modules, Styled Components, Tailwind CSS
**Full-stack frameworks:** Next.js (the dominant choice), Remix

You do not need any of these to learn React. This track focuses on core React — components, props, state, effects, events, and data fetching with the built-in tools. Once you understand core React, picking up any of these libraries becomes significantly easier because you understand the foundation they build on.

## Why React Dominates Frontend Development

React is not the only component-based UI library — Vue, Angular, Svelte, and Solid are all excellent alternatives. But React has maintained dominance for over a decade for several reasons:

**Ecosystem size.** React has the largest ecosystem of libraries, tutorials, and community resources of any frontend framework. Whatever problem you are solving, someone has built a React library for it.

**Job market.** React is by far the most requested skill in frontend developer job postings. Learning React means learning the skill that the industry most wants.

**Transferable concepts.** The concepts you learn in React — components, props, state, declarative rendering, one-way data flow — appear in every modern UI framework. Learning React thoroughly makes every other framework easier to understand.

**React Native.** The same mental model transfers to mobile development through React Native, letting you build iOS and Android applications with React skills.

## What You Are Going to Learn

This track covers the complete core of React in eight modules:

- **Module 2** — Components: writing functional components, composing them together
- **Module 3** — Props: passing data from parent to child, default props, prop types
- **Module 4** — State: \`useState\`, re-rendering, state patterns
- **Module 5** — Effects: \`useEffect\`, lifecycle, cleanup
- **Module 6** — Events and Forms: controlled inputs, form handling
- **Module 7** — Data Fetching: loading data from APIs, handling loading and error states
- **Module 8** — Complete App: everything working together in a real application

Each module builds directly on the previous one. By the end, you will be able to build complete, functional React applications from scratch and have the foundation to tackle frameworks like Next.js and the broader React ecosystem.

The most important shift to make right now is mental. Stop thinking in terms of "find this element and change it." Start thinking in terms of "given this data, what should the UI look like?" Make that shift, and React will start to feel intuitive.`,
  quizzes: [
    {
      question: 'What fundamental problem does React solve compared to vanilla JavaScript DOM manipulation?',
      options: [
        'React loads faster than vanilla JavaScript because it skips the parsing step',
        'React automatically keeps the UI in sync with the data by re-rendering components when state changes, eliminating manual DOM updates',
        'React prevents JavaScript errors by adding type checking to all components',
        'React solves the problem of JavaScript not being supported in older browsers'
      ],
      correct: 1,
      explanation: 'The core problem React solves is the synchronisation burden — in vanilla JavaScript, every data change requires manually finding and updating every affected DOM element, while React re-renders automatically when state changes so the UI always reflects the current data.'
    },
    {
      question: 'What does "declarative UI" mean in the context of React?',
      options: [
        'You declare all variables at the top of your file before using them in components',
        'You write code that describes what the UI should look like for a given state, rather than writing step-by-step instructions for how to change it',
        'You declare which components are public and which are private using special keywords',
        'You list all the events your component responds to in a declaration block before the return statement'
      ],
      correct: 1,
      explanation: 'Declarative UI means describing the desired end result — "when count is 5, show the number 5" — rather than issuing imperative commands like "find the element and set its text to 5"; React handles the transition from old state to new state automatically.'
    },
    {
      question: 'What is the Virtual DOM and why does React use it?',
      options: [
        'A virtual machine that runs JavaScript faster than the browser\'s built-in engine',
        'A copy of the DOM stored on a server that React synchronises with the browser',
        'A lightweight JavaScript representation of the UI that React uses to calculate the minimal set of real DOM changes needed when state updates',
        'A browser extension that visualises the component tree for debugging purposes'
      ],
      correct: 2,
      explanation: 'The Virtual DOM is a plain JavaScript object tree representing the UI — when state changes, React diffs the new Virtual DOM against the previous one and applies only the necessary changes to the real DOM, making re-renders efficient despite the declarative "describe everything" approach.'
    },
    {
      question: 'In JSX, why do you write className instead of class when adding CSS classes to elements?',
      options: [
        'className is the HTML5 standard attribute name that replaced class in modern web development',
        'React adds extra functionality to className that the standard class attribute does not support',
        'class is a reserved keyword in JavaScript, so JSX uses className to avoid a syntax conflict when writing HTML-like code in JavaScript files',
        'className is required because React components use a different rendering pipeline than standard HTML elements'
      ],
      correct: 2,
      explanation: 'JSX compiles to JavaScript, and class is a reserved keyword in JavaScript used for defining classes — to avoid the syntax conflict, JSX uses className which React then correctly maps to the class attribute in the actual DOM.'
    },
    {
      question: 'What happens in React when you call a state setter function like setCount?',
      options: [
        'React finds the specific DOM element displaying the count and updates only that element\'s text content',
        'React schedules a re-render of the component with the new state value, and updates the DOM to match the new output',
        'The state value updates immediately and all variables referencing it automatically reflect the new value',
        'React saves the new state to localStorage and reloads the component from scratch'
      ],
      correct: 1,
      explanation: 'Calling a state setter schedules a re-render — React re-runs the component function with the new state value, produces new JSX, diffs it against the previous output, and makes the minimal DOM updates needed to reflect the change.'
    }
  ]
})

await addModule('React Development', {
  title: 'Components — The Building Blocks of React',
  description: 'Learn how to write and compose React components, understand the rules of JSX, structure a component hierarchy, and think in components when approaching any UI design.',
  orderIndex: 2,
  content: `## What Is a Component?

A React component is a JavaScript function that returns JSX — a description of what a piece of the UI should look like. That is the complete definition. Everything in React is built from this simple foundation.

Before writing any code, the most important skill to develop is learning to look at a UI and see components. This is called "thinking in components," and it is the mental model that makes React feel natural.

Look at any web page — say, a product card on an e-commerce site. It has a product image, a product name, a price, a star rating, an "Add to Cart" button, and maybe a "Wishlist" button. Each of those could be its own component. The card itself is a component. A grid of cards is a component. The page is a component.

The rules for how to divide a UI into components are not strict, but a useful heuristic is the **single responsibility principle**: a component should ideally do one thing. If it is growing and doing many unrelated things, it should probably be split into smaller components.

## Your First Component

A React functional component is simply a function whose name starts with a capital letter and returns JSX:

\`\`\`jsx
function Greeting() {
  return <h1>Hello, React!</h1>
}
\`\`\`

That is a complete, valid React component. The capital letter is not optional — React distinguishes between HTML elements (lowercase: \`<div>\`, \`<p>\`) and React components (uppercase: \`<Greeting>\`, \`<UserCard>\`) by capitalisation. If you write a component name in lowercase, React treats it as an HTML tag and things will not work as expected.

To use a component, you write it in JSX like an HTML tag:

\`\`\`jsx
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
      <Greeting />
    </div>
  )
}
\`\`\`

This renders three \`Greeting\` components. Each one independently produces its \`<h1>\` output. Reusability is instant — write the component once, use it anywhere.

## JSX in Depth — The Rules

JSX looks like HTML but it compiles to JavaScript. Understanding its rules prevents the errors that trip up every beginner.

**Rule 1: Return a single root element.**

A component can only return one root-level element. If you want to return multiple elements, wrap them:

\`\`\`jsx
// Wrong — two sibling elements at the root
function Wrong() {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>
  )
}

// Right — wrapped in a div
function Right() {
  return (
    <div>
      <h1>Title</h1>
      <p>Paragraph</p>
    </div>
  )
}

// Also right — React Fragment (no extra DOM element)
function AlsoRight() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  )
}
\`\`\`

The empty \`<></>\` syntax is a **React Fragment** — it lets you group elements without adding an extra \`<div>\` to the DOM. Use it when you want to avoid unnecessary wrapper elements.

**Rule 2: All tags must be closed.**

\`\`\`jsx
// Wrong
<img src="photo.jpg">
<input type="text">
<br>

// Right
<img src="photo.jpg" />
<input type="text" />
<br />
\`\`\`

**Rule 3: JavaScript expressions go in curly braces.**

\`\`\`jsx
function ProductCard() {
  const name = "Wireless Headphones"
  const price = 79.99
  const discount = 0.1
  const finalPrice = price * (1 - discount)

  return (
    <div className="product-card">
      <h2>{name}</h2>
      <p>Original: \${price}</p>
      <p>Sale: \${finalPrice.toFixed(2)}</p>
      <p>You save: \${(price - finalPrice).toFixed(2)}</p>
    </div>
  )
}
\`\`\`

Anything that is a valid JavaScript expression can go inside \`{}\`: variables, arithmetic, function calls, ternary operators, template literals. You cannot put statements inside JSX — no \`if\` blocks, no \`for\` loops — but you can compute values before the return.

**Rule 4: Use className, htmlFor, and camelCase attributes.**

\`\`\`jsx
// HTML attributes that differ in JSX
<div class="container">              // Wrong
<div className="container">         // Right

<label for="email">Email</label>    // Wrong
<label htmlFor="email">Email</label> // Right

// Event handlers are camelCase
<button onclick={handleClick}>      // Wrong
<button onClick={handleClick}>      // Right

// Inline styles use objects with camelCase properties
<div style="background-color: red"> // Wrong
<div style={{ backgroundColor: 'red', fontSize: '16px' }}> // Right
\`\`\`

The double curly braces for inline styles are not special syntax — the outer \`{}\` says "here comes a JavaScript expression," and the inner \`{}\` is just a JavaScript object literal.

## Conditional Rendering

Showing or hiding parts of the UI based on conditions is extremely common. React gives you several patterns for this.

**Ternary operator — for if/else:**

\`\`\`jsx
function UserStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome back!</p>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  )
}
\`\`\`

**\`&&\` operator — for if only:**

\`\`\`jsx
function Notification({ hasMessages, count }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {hasMessages && <p>You have {count} new messages</p>}
    </div>
  )
}
\`\`\`

The \`&&\` pattern works because in JSX, \`false\`, \`null\`, and \`undefined\` render nothing. When \`hasMessages\` is false, the expression short-circuits and nothing is rendered. When it is true, the JSX after \`&&\` is rendered.

**Watch out for the \`&&\` gotcha with 0:**

\`\`\`jsx
// Bug! When count is 0, it renders "0" on the page
{count && <p>{count} items</p>}

// Fix: compare explicitly
{count > 0 && <p>{count} items</p>}
// Or use ternary
{count ? <p>{count} items</p> : null}
\`\`\`

Zero is falsy in JavaScript, but \`0\` is not \`false\` — JSX renders the number 0 rather than nothing. This is one of the most common beginner bugs.

**Computing conditionally before the return:**

\`\`\`jsx
function Alert({ type, message }) {
  let className
  let icon

  if (type === 'success') {
    className = 'alert-success'
    icon = '✓'
  } else if (type === 'error') {
    className = 'alert-error'
    icon = '✗'
  } else {
    className = 'alert-info'
    icon = 'ℹ'
  }

  return (
    <div className={className}>
      <span>{icon}</span>
      <p>{message}</p>
    </div>
  )
}
\`\`\`

For complex conditional logic, computing the values before the return is often cleaner than cramming it into JSX.

## Rendering Lists

Rendering a list of items from an array is one of the most common operations in React. You use JavaScript's \`map()\` method to transform an array of data into an array of JSX elements:

\`\`\`jsx
function FruitList() {
  const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']

  return (
    <ul>
      {fruits.map(fruit => (
        <li>{fruit}</li>
      ))}
    </ul>
  )
}
\`\`\`

This works, but React will warn you about a missing \`key\` prop. When rendering lists, each element needs a unique \`key\` prop that helps React track which items changed, were added, or were removed:

\`\`\`jsx
function FruitList() {
  const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']

  return (
    <ul>
      {fruits.map(fruit => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  )
}
\`\`\`

For real data with unique IDs, use the ID:

\`\`\`jsx
function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>\${product.price}</p>
        </div>
      ))}
    </div>
  )
}
\`\`\`

**Why keys matter:** Without keys, when the list changes, React re-renders all items. With keys, React knows exactly which item corresponds to which DOM element and can update only what changed. Keys must be unique among siblings, stable (not based on the array index if items can reorder), and string or number type.

Avoid using array index as a key when the list can be reordered or filtered:

\`\`\`jsx
// Problematic when list can change order
{items.map((item, index) => <li key={index}>{item}</li>)}

// Better — use a stable unique identifier
{items.map(item => <li key={item.id}>{item.name}</li>)}
\`\`\`

## Component Composition — Building UIs from Components

The real power of React components emerges when you compose them together. A complex UI is just components containing components containing components.

\`\`\`jsx
// Small, focused components
function Avatar({ src, alt, size = 'medium' }) {
  return (
    <img
      src={src}
      alt={alt}
      className={\`avatar avatar-\${size}\`}
    />
  )
}

function UserName({ name, isVerified }) {
  return (
    <span className="username">
      {name}
      {isVerified && <span className="verified-badge">✓</span>}
    </span>
  )
}

function FollowButton({ isFollowing, onFollow }) {
  return (
    <button
      className={isFollowing ? 'btn-following' : 'btn-follow'}
      onClick={onFollow}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}

// Compose them into a larger component
function UserCard({ user, isFollowing, onFollow }) {
  return (
    <div className="user-card">
      <Avatar src={user.avatarUrl} alt={user.name} size="large" />
      <div className="user-info">
        <UserName name={user.name} isVerified={user.isVerified} />
        <p className="bio">{user.bio}</p>
        <FollowButton isFollowing={isFollowing} onFollow={onFollow} />
      </div>
    </div>
  )
}

// Use many UserCards in a list
function UserList({ users, followingIds, onFollow }) {
  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          isFollowing={followingIds.includes(user.id)}
          onFollow={() => onFollow(user.id)}
        />
      ))}
    </div>
  )
}
\`\`\`

Notice how each component is small and focused. \`Avatar\` just renders an image. \`UserName\` renders the name with an optional verified badge. The composition is explicit and readable — you can look at \`UserCard\` and immediately understand it is made of an \`Avatar\`, some \`UserName\` and bio text, and a \`FollowButton\`.

## The children Prop — Wrapping Components

Sometimes you want a component to act as a wrapper or container, and you do not know ahead of time what content it will contain. React handles this with the special \`children\` prop:

\`\`\`jsx
function Card({ children, title }) {
  return (
    <div className="card">
      {title && <h2 className="card-title">{title}</h2>}
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}

// Use it by nesting content inside the tags
function App() {
  return (
    <div>
      <Card title="User Profile">
        <p>Name: Alice</p>
        <p>Age: 25</p>
        <button>Edit Profile</button>
      </Card>

      <Card title="Recent Activity">
        <ul>
          <li>Liked a post</li>
          <li>Followed a user</li>
        </ul>
      </Card>

      <Card>
        <p>A card with no title</p>
      </Card>
    </div>
  )
}
\`\`\`

Whatever you put between the opening and closing \`<Card>\` tags becomes the \`children\` prop inside the \`Card\` component. This pattern is how layout components, modals, drawers, tooltips, and most wrapper components in React are built.

## Organising Components Into Files

As your application grows, keeping all components in one file becomes unmanageable. The convention is one component per file, exported as the default export:

\`\`\`jsx
// src/components/Avatar.jsx
function Avatar({ src, alt, size = 'medium' }) {
  return (
    <img
      src={src}
      alt={alt}
      className={\`avatar avatar-\${size}\`}
    />
  )
}

export default Avatar
\`\`\`

\`\`\`jsx
// src/components/UserCard.jsx
import Avatar from './Avatar'
import UserName from './UserName'

function UserCard({ user }) {
  return (
    <div className="user-card">
      <Avatar src={user.avatarUrl} alt={user.name} />
      <UserName name={user.name} isVerified={user.isVerified} />
    </div>
  )
}

export default UserCard
\`\`\`

A standard folder structure for a React project:
\`\`\`
src/
  components/
    Avatar.jsx
    UserCard.jsx
    UserList.jsx
    Button.jsx
  pages/
    HomePage.jsx
    ProfilePage.jsx
  App.jsx
  main.jsx
\`\`\`

Components that are used across many pages live in \`components/\`. Components that represent whole pages live in \`pages/\`. \`App.jsx\` is typically the root component that ties the pages together.

## Thinking in Components — A Practical Exercise

When you encounter a new UI to build, practise this decomposition process:

1. **Draw boxes around sections of the UI.** Each box is a potential component.
2. **Name each box.** Good names are nouns that describe what they contain.
3. **Identify what varies.** Within a component, what data could change? That data will become props or state.
4. **Identify what is reused.** Any UI element that appears multiple times with different data is a component.
5. **Build bottom-up.** Start with the smallest, innermost components and compose them upward.

The discipline of thinking in components — before writing any code — is what separates React developers who produce maintainable code from those who produce a tangled mess. Components should feel like vocabulary. When you talk about your UI, you should be able to use the component names naturally: "the \`SearchBar\` inside the \`Header\` needs to update the \`ResultsList\`."

In the next module, you will learn how to pass data into components using props — the mechanism that makes your components dynamic and reusable rather than hardcoded.`,
  quizzes: [
    {
      question: 'Why must React component names start with a capital letter?',
      options: [
        'It is a JavaScript requirement — functions that return JSX must be capitalised for the compiler to process them correctly',
        'React distinguishes between HTML elements (lowercase) and React components (uppercase) by capitalisation — a lowercase name would be treated as an HTML tag',
        'Capital letters enable React\'s performance optimisation algorithm to identify which functions to cache',
        'It is a style convention only — lowercase component names work identically but are discouraged'
      ],
      correct: 1,
      explanation: 'React uses the capitalisation of JSX tag names to differentiate between built-in HTML elements like div and p (lowercase) and user-defined React components (uppercase) — writing a component name in lowercase causes React to look for an HTML element with that name rather than calling your function.'
    },
    {
      question: 'What is a React Fragment (<></>) and when should you use it?',
      options: [
        'A special component that renders its children with no wrapper element in the DOM, used when you need to return multiple sibling elements without adding an extra div',
        'A way to split your component into multiple files that React automatically reassembles',
        'A performance optimisation that prevents re-rendering of components that have not changed',
        'A placeholder component used during loading states before real content is available'
      ],
      correct: 0,
      explanation: 'A React Fragment groups multiple sibling JSX elements to satisfy the single-root-element rule without adding an extra DOM node — this is useful for avoiding unnecessary wrapper divs that could interfere with CSS layout like flexbox or grid.'
    },
    {
      question: 'Why can using array index as a key in a list cause bugs?',
      options: [
        'Array indices are numbers, but React requires keys to be strings',
        'Using index as a key causes React to re-render every list item on every update regardless of what changed',
        'When items are added, removed, or reordered, the index of each item changes, causing React to incorrectly associate DOM elements with the wrong data and produce broken or flickering UI',
        'Array indices start at 0 which React treats as falsy, so the first item never renders correctly'
      ],
      correct: 2,
      explanation: 'Keys are meant to be stable identifiers — if an item moves from position 0 to position 2, its index key changes from 0 to 2, causing React to think a new item appeared and the old one disappeared rather than recognising it as the same item that moved.'
    },
    {
      question: 'What does the children prop allow a React component to do?',
      options: [
        'It allows a component to render sub-components that it created internally',
        'It provides access to all child components in the component tree below the current component',
        'It allows content placed between a component\'s opening and closing tags to be rendered inside the component, enabling wrapper and layout components',
        'It gives the component access to its parent\'s state and props without prop drilling'
      ],
      correct: 2,
      explanation: 'The children prop contains whatever JSX is nested between a component\'s opening and closing tags — this enables wrapper patterns like Card, Modal, or Layout components that need to render arbitrary content inside a defined structure without knowing what that content will be in advance.'
    },
    {
      question: 'Why does the expression {count && <p>{count} items</p>} display "0" when count is 0, and how do you fix it?',
      options: [
        'It is a JSX bug that was fixed in React 18 — upgrading React resolves the issue automatically',
        'Zero is falsy in JavaScript but JSX renders the number 0 rather than nothing — fix it by using count > 0 && or a ternary expression instead',
        'The expression needs parentheses around count to coerce it to a boolean before the && operator evaluates',
        'JSX converts all falsy values to their string representations, so 0 becomes "0" — use Boolean(count) to fix it'
      ],
      correct: 1,
      explanation: 'The && operator returns the left operand if falsy — when count is 0, it returns 0, and React renders the number 0 as text rather than nothing; using count > 0 && or a ternary ensures a proper boolean comparison and renders nothing when count is zero.'
    }
  ]
})

await addModule('React Development', {
  title: 'Props — Passing Data Between Components',
  description: 'Learn how to use props to pass data from parent to child components, make components reusable with different data, set default prop values, destructure props cleanly, and understand the one-way data flow model.',
  orderIndex: 3,
  content: `## Props Are How Components Communicate

In the previous module you built components, but they were mostly self-contained — the data was hardcoded inside each component. That makes them rigid and not very useful. A \`UserCard\` component that only ever shows Alice's information is not a reusable component — it is a static template.

Props (short for properties) are the mechanism for making components dynamic and reusable. They are how a parent component passes data down to a child component. The child receives this data and uses it to determine what to render.

The mental model is simple: **props are arguments to your component function.** Just like a regular JavaScript function can take arguments and behave differently based on those arguments, a React component takes props and renders differently based on them.

\`\`\`javascript
// A regular function with arguments
function greet(name, age) {
  return \`Hello, I'm \${name} and I'm \${age} years old.\`
}

greet("Alice", 25)
greet("Bob", 30)
\`\`\`

\`\`\`jsx
// A React component with props — same idea
function UserCard(props) {
  return (
    <div>
      <p>Hello, I'm {props.name} and I'm {props.age} years old.</p>
    </div>
  )
}

<UserCard name="Alice" age={25} />
<UserCard name="Bob" age={30} />
\`\`\`

The \`UserCard\` component renders differently for each set of props. One component definition, infinite possible renderings. This is the power of props.

## Passing Props

Props are passed to a component like HTML attributes:

\`\`\`jsx
// Passing strings — no curly braces needed
<Button label="Click me" variant="primary" />

// Passing numbers — curly braces required
<Slider min={0} max={100} step={5} />

// Passing booleans
<Input disabled={true} required={false} />
// Shorthand for true — just the attribute name
<Input disabled required />

// Passing arrays
<List items={['apple', 'banana', 'cherry']} />

// Passing objects
<UserCard user={{ name: 'Alice', age: 25, role: 'admin' }} />

// Passing functions (event handlers)
<Button onClick={handleClick} />
<Button onClick={() => console.log('clicked')} />

// Passing JSX (as children)
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>
\`\`\`

The rule: anything that is not a plain string needs curly braces. Curly braces signal "evaluate this JavaScript expression."

## Receiving Props — Destructuring

Inside the component, props arrive as a single object. You can access them through the props parameter, but destructuring them is the standard modern approach:

\`\`\`jsx
// Verbose — accessing through props object
function Button(props) {
  return (
    <button
      className={\`btn btn-\${props.variant}\`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  )
}

// Cleaner — destructuring in the parameter
function Button({ label, variant, onClick, disabled }) {
  return (
    <button
      className={\`btn btn-\${props.variant}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
\`\`\`

Destructuring is almost universally preferred. It makes immediately clear what props a component expects, reduces repetitive \`props.\` prefixes, and makes the function signature itself serve as implicit documentation.

## Default Props

When a prop is not provided, its value is \`undefined\`. This can cause errors or ugly output. Default values solve this:

\`\`\`jsx
function Button({ label, variant = 'primary', size = 'medium', disabled = false, onClick }) {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

// All defaults used
<Button label="Save" />
// Renders: btn btn-primary btn-medium, not disabled

// Override some defaults
<Button label="Delete" variant="danger" size="small" />
\`\`\`

Default values in destructuring are the modern way to set prop defaults. They are equivalent to the older \`Button.defaultProps\` pattern which you may see in older codebases but should not use in new code.

## Props Are Read-Only — One-Way Data Flow

This is one of the most important rules in React, and understanding it prevents a whole category of bugs.

**Props are read-only. A component must never modify its own props.**

\`\`\`jsx
// Never do this
function BadComponent({ count }) {
  count = count + 1  // Wrong! Mutating props
  return <p>{count}</p>
}

// This is fine — compute new values from props
function GoodComponent({ count }) {
  const displayCount = count + 1  // derive, don't mutate
  return <p>{displayCount}</p>
}
\`\`\`

This rule enforces **one-way data flow**: data flows from parent to child through props, and only downward. A child component cannot change the data its parent gave it.

This might seem restrictive, but it is what makes React applications predictable and debuggable. If you look at a component and want to understand what data it is working with, you look at its props. The data comes from one place (the parent) and flows in one direction (downward). You can always trace where data comes from.

If a child needs to communicate something back to the parent — a button was clicked, a form was submitted, a value changed — it does so by calling a function that was passed as a prop. The child calls the function, the parent's function runs and can update state, which flows back down as new props. The data still flows down; the events flow up via callbacks.

## Passing Functions as Props — Lifting Events Up

This is the pattern for child-to-parent communication:

\`\`\`jsx
// Parent owns the data and the handler
function ShoppingCart() {
  const [items, setItems] = useState([
    { id: 1, name: 'Headphones', price: 79.99 },
    { id: 2, name: 'Mouse', price: 29.99 },
  ])

  function handleRemove(itemId) {
    setItems(items.filter(item => item.id !== itemId))
  }

  return (
    <div>
      <h1>Your Cart</h1>
      {items.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={handleRemove}
        />
      ))}
    </div>
  )
}

// Child receives the handler and calls it when needed
function CartItem({ item, onRemove }) {
  return (
    <div className="cart-item">
      <span>{item.name}</span>
      <span>\${item.price}</span>
      <button onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </div>
  )
}
\`\`\`

The \`ShoppingCart\` parent owns the \`items\` data and the \`handleRemove\` function. It passes \`handleRemove\` down to \`CartItem\` as \`onRemove\`. When the user clicks "Remove" in the \`CartItem\`, it calls \`onRemove(item.id)\`, which calls the parent's \`handleRemove\`, which updates the parent's state, which causes a re-render with the item gone.

Data flows down. Events flow up. This is React's data model in its entirety.

## Prop Naming Conventions

Good prop naming makes components self-documenting:

- **Boolean props:** use \`is\`, \`has\`, or \`can\` prefixes — \`isLoading\`, \`hasError\`, \`canEdit\`
- **Event handler props:** use \`on\` prefix — \`onClick\`, \`onSubmit\`, \`onChange\`, \`onClose\`
- **Data props:** use clear nouns — \`user\`, \`items\`, \`title\`, \`message\`
- **Render/slot props:** describe what goes there — \`header\`, \`footer\`, \`leftIcon\`

\`\`\`jsx
function Dialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <button onClick={onCancel}>{cancelLabel}</button>
          <button onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
\`\`\`

Reading the prop list tells you everything about this component: it is open or closed, has a title and message, two customisable button labels, and calls back on confirm or cancel.

## The Spread Operator with Props

When you have an object whose properties match the props of a component, you can spread it:

\`\`\`jsx
const buttonProps = {
  label: 'Submit',
  variant: 'primary',
  disabled: false,
  onClick: handleSubmit,
}

// Instead of listing each prop manually
<Button label={buttonProps.label} variant={buttonProps.variant} ... />

// Spread the object
<Button {...buttonProps} />
\`\`\`

This is useful when forwarding all props from a parent to a child:

\`\`\`jsx
function IconButton({ icon, ...rest }) {
  return (
    <button {...rest}>
      <img src={icon} alt="" />
      {rest.label}
    </button>
  )
}
\`\`\`

The \`...rest\` collects all props except \`icon\` and spreads them onto the \`<button>\`. This is the **rest and spread** pattern — very common for wrapper components that pass most props through to an underlying element.

## Prop Drilling — and When It Becomes a Problem

One-way data flow is great, but it creates a challenge as your component tree grows deeper. If a piece of data is needed by a component five levels deep, you have to pass it as a prop through every intermediate level — even the components in the middle do not need it. This is called **prop drilling**.

\`\`\`jsx
// Prop drilling — theme is passed through components that don't use it
function App() {
  const theme = 'dark'
  return <Layout theme={theme} />
}

function Layout({ theme }) {
  return <Sidebar theme={theme} />  // Layout doesn't use theme
}

function Sidebar({ theme }) {
  return <NavItem theme={theme} />  // Sidebar doesn't use theme
}

function NavItem({ theme }) {
  return <span className={theme}>Menu</span>  // Only NavItem uses theme
}
\`\`\`

Prop drilling is not always wrong — for shallow trees or data that is only two levels deep, it is perfectly fine. But when it goes several levels deep, it becomes painful to maintain. The solutions are React Context (for global data like themes and authentication) and state management libraries. These are beyond the scope of this module, but knowing prop drilling is the problem you are solving helps you understand why those tools exist.

## A Complete Props Example

Let's build a complete component system using everything in this module:

\`\`\`jsx
// Reusable Badge component
function Badge({ label, colour = 'blue', size = 'small' }) {
  return (
    <span className={\`badge badge-\${colour} badge-\${size}\`}>
      {label}
    </span>
  )
}

// Reusable StarRating component
function StarRating({ rating, maxStars = 5 }) {
  return (
    <div className="star-rating">
      {Array.from({ length: maxStars }, (_, i) => (
        <span key={i} className={i < rating ? 'star filled' : 'star empty'}>
          ★
        </span>
      ))}
      <span className="rating-text">({rating}/{maxStars})</span>
    </div>
  )
}

// Reusable ProductCard component
function ProductCard({ product, onAddToCart, onWishlist, isWishlisted = false }) {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.imageUrl} alt={product.name} />
        {product.isNew && <Badge label="NEW" colour="green" />}
        {product.discount > 0 && (
          <Badge label={\`-\${product.discount}%\`} colour="red" />
        )}
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <StarRating rating={product.rating} />
        <div className="price-row">
          {product.discount > 0 ? (
            <>
              <span className="original-price">\${product.price}</span>
              <span className="sale-price">
                \${(product.price * (1 - product.discount / 100)).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="price">\${product.price}</span>
          )}
        </div>
      </div>

      <div className="product-actions">
        <button onClick={() => onAddToCart(product.id)}>
          Add to Cart
        </button>
        <button
          className={isWishlisted ? 'wishlisted' : ''}
          onClick={() => onWishlist(product.id)}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
      </div>
    </div>
  )
}

// Usage
function ProductGrid({ products, wishlistedIds, onAddToCart, onWishlist }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlistedIds.includes(product.id)}
          onAddToCart={onAddToCart}
          onWishlist={onWishlist}
        />
      ))}
    </div>
  )
}
\`\`\`

This example demonstrates every prop concept in action: passing objects, booleans, functions, strings, and numbers as props; default values; event callback conventions; component composition; and one-way data flow with events lifted up via callbacks.

Props are the nervous system of a React application — they are how every component gets its data and how events propagate up the tree. Master props and you understand how React applications are wired together.`,
  quizzes: [
    {
      question: 'Why are props described as "read-only" in React?',
      options: [
        'Props are stored in a frozen object by React so any mutation attempt throws an error',
        'A component must not modify its own props because data flows in one direction — from parent to child — and mutating props would make the data source unpredictable and break the parent\'s expected state',
        'Props are read-only only when the component is a class component — functional components can modify their props freely',
        'React makes props read-only to improve rendering performance by preventing unnecessary re-renders'
      ],
      correct: 1,
      explanation: 'One-way data flow means a parent controls the data it passes to children — if a child could mutate props, the parent would have data it does not know about, making the application unpredictable and extremely difficult to debug.'
    },
    {
      question: 'How does a child component communicate back to a parent in React\'s one-way data flow model?',
      options: [
        'By directly modifying the parent\'s state using a special React API called useParent',
        'By emitting custom events that the parent listens for using addEventListener',
        'By calling a function that was passed down as a prop from the parent, which allows the parent to update its own state in response',
        'By storing data in a shared global variable that both parent and child can read and write'
      ],
      correct: 2,
      explanation: 'Data flows down via props, and events flow up via callback functions passed as props — the child calls the function, the parent\'s function runs and can update its state, and the updated state flows back down as new props.'
    },
    {
      question: 'What is the best way to set a default value for a prop in a modern React functional component?',
      options: [
        'Use ComponentName.defaultProps = {} below the component definition',
        'Use defaultProps as a special prop name inside the component\'s JSX return',
        'Use JavaScript default parameter values in the destructuring syntax of the component function',
        'Use React.memo() to wrap the component and provide defaults in the memo configuration'
      ],
      correct: 2,
      explanation: 'Default parameter values in destructuring — like function Button({ variant = "primary" }) — is the modern idiomatic approach that leverages standard JavaScript syntax, replacing the older ComponentName.defaultProps pattern.'
    },
    {
      question: 'What is "prop drilling" and when does it become a problem?',
      options: [
        'Passing too many props to a single component, making it too complex and hard to test',
        'Accessing props inside deeply nested JSX within a component, causing performance issues',
        'Passing data through many intermediate components that do not use the data themselves, just to get it to a deeply nested component that needs it',
        'Drilling down into a prop object with many levels of dot notation to access a deeply nested value'
      ],
      correct: 2,
      explanation: 'Prop drilling occurs when data must be passed through multiple intermediate components that have no use for it — these middle components just forward the prop — which makes the code fragile and hard to maintain as the tree grows deeper.'
    },
    {
      question: 'What does the spread operator do when used with props: <Button {...buttonProps} />?',
      options: [
        'It merges the buttonProps object with the Button component\'s existing default props',
        'It spreads all properties of the buttonProps object as individual props on the Button component, equivalent to writing each prop out manually',
        'It passes the entire buttonProps object as a single prop called "buttonProps" inside the component',
        'It creates a shallow copy of buttonProps and passes the copy to prevent the parent from accidentally modifying the data'
      ],
      correct: 1,
      explanation: 'The spread operator with JSX props expands an object\'s key-value pairs into individual prop assignments — <Button {...buttonProps} /> is exactly equivalent to listing each property as a separate prop like <Button label={buttonProps.label} variant={buttonProps.variant} /> and so on.'
    }
  ]
})

await addModule('React Development', {
  title: 'State and useState — Making Components Dynamic',
  description: 'Understand what state is, why it is different from regular variables, how useState works, how to update state correctly, and the common patterns for managing state in React components.',
  orderIndex: 4,
  content: `## Why Regular Variables Are Not Enough

You have learned that React re-renders a component when something changes. But what triggers that re-render? Props changing (when the parent re-renders with new props) is one trigger. But what about changes that happen inside the component itself — a user clicking a button, typing in an input, or a timer firing?

The naive solution would be to use a regular JavaScript variable:

\`\`\`jsx
function Counter() {
  let count = 0  // regular variable

  function increment() {
    count = count + 1
    console.log('count is now:', count)  // logs correctly!
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
\`\`\`

If you run this, you will notice that clicking the button does nothing — the number on screen stays at 0. But the console shows the count increasing. What is happening?

Two things explain this:

**First,** every time React renders a component, it calls the component function from scratch. \`count\` is initialised to \`0\` on every render. So even if you increment it, the next render starts fresh.

**Second,** changing a regular variable does not tell React that anything changed. React has no way to know it should re-render. Without a re-render, the JSX is not re-evaluated, and the screen never updates.

State is the solution to both problems. \`useState\` gives you a variable that:
1. **Persists between renders** — React remembers its value
2. **Triggers a re-render when changed** — telling React the UI needs to update

## Introducing useState

\`useState\` is a React Hook — a special function that lets you "hook into" React features from a functional component. You call it at the top of your component with an initial value, and it returns a pair: the current value, and a function to update it.

\`\`\`jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  //     ↑ current  ↑ setter   ↑ initial value

  function increment() {
    setCount(count + 1)
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  )
}
\`\`\`

Now clicking the button works. Let's trace what happens:

1. Component renders, \`count\` is \`0\`, button shows on screen
2. User clicks the button, \`increment\` runs, calls \`setCount(1)\`
3. React schedules a re-render with \`count = 1\`
4. Component function runs again, this time \`useState(0)\` returns \`[1, setCount]\` — React remembered the new value
5. The JSX reflects \`count = 1\`, screen updates to show 1

The naming convention \`[value, setValue]\` is universal — use descriptive names that reflect what the state holds:

\`\`\`jsx
const [isOpen, setIsOpen] = useState(false)
const [username, setUsername] = useState('')
const [items, setItems] = useState([])
const [user, setUser] = useState(null)
const [step, setStep] = useState(1)
\`\`\`

## The Functional Update Pattern

There is a subtle but important issue with updating state based on the current value. Consider:

\`\`\`jsx
// This can be buggy
function increment() {
  setCount(count + 1)
}
\`\`\`

The problem is that \`count\` is captured in the function's closure at the moment the function was created. If React batches multiple state updates (which it does in some situations), \`count\` might be stale by the time the setter runs.

The safe pattern for updates that depend on the previous value is the **functional update form** — pass a function to the setter instead of a value:

\`\`\`jsx
// Safe — React guarantees prevCount is the latest value
function increment() {
  setCount(prevCount => prevCount + 1)
}

function decrement() {
  setCount(prevCount => prevCount - 1)
}

function double() {
  setCount(prevCount => prevCount * 2)
}
\`\`\`

When you pass a function, React calls it with the guaranteed current state value as the argument. The returned value becomes the new state.

When should you use functional updates? When the new state depends on the old state. When you are setting state to a completely new value unrelated to the old one (like \`setIsOpen(true)\`), you do not need it.

## State with Objects

State can hold any JavaScript value — including objects. When state is an object, you must replace the entire object when updating — you cannot mutate it.

\`\`\`jsx
function ProfileForm() {
  const [user, setUser] = useState({
    name: 'Alice',
    email: 'alice@example.com',
    bio: '',
  })

  function updateName(newName) {
    // Wrong — mutating state directly
    user.name = newName
    setUser(user)  // React may not re-render because same object reference

    // Right — create a new object with spread
    setUser({ ...user, name: newName })
  }

  function updateEmail(newEmail) {
    setUser(prevUser => ({ ...prevUser, email: newEmail }))
  }

  return (
    <form>
      <input
        value={user.name}
        onChange={e => setUser({ ...user, name: e.target.value })}
      />
      <input
        value={user.email}
        onChange={e => setUser({ ...user, email: e.target.value })}
      />
      <textarea
        value={user.bio}
        onChange={e => setUser({ ...user, bio: e.target.value })}
      />
    </form>
  )
}
\`\`\`

The spread operator \`{ ...user, name: newName }\` creates a new object with all existing properties plus the updated one. React compares object references — if you mutate an existing object and pass it to the setter, React sees the same reference and may skip the re-render.

## State with Arrays

Arrays in state also require creating new arrays rather than mutating the existing one:

\`\`\`jsx
function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Learn React', done: false },
    { id: 2, text: 'Build something', done: false },
  ])

  // Adding an item — spread existing and add new
  function addTask(text) {
    const newTask = {
      id: Date.now(),  // simple unique ID
      text,
      done: false,
    }
    setTasks([...tasks, newTask])
  }

  // Removing an item — filter to exclude
  function removeTask(id) {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // Updating an item — map and replace
  function toggleTask(id) {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ))
  }

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
            {task.text}
          </span>
          <button onClick={() => toggleTask(task.id)}>Toggle</button>
          <button onClick={() => removeTask(task.id)}>Delete</button>
        </div>
      ))}
      <button onClick={() => addTask('New task')}>Add Task</button>
    </div>
  )
}
\`\`\`

The three key patterns for array state:
- **Add:** \`[...existing, newItem]\`
- **Remove:** \`existing.filter(item => item.id !== targetId)\`
- **Update:** \`existing.map(item => item.id === targetId ? updatedItem : item)\`

Never use \`push\`, \`pop\`, \`splice\`, or \`sort\` directly on state arrays — these mutate the original array. Always produce a new one.

## Multiple State Variables vs One Object

A common question is whether to use many \`useState\` calls or one big state object. The answer in modern React is generally: **use multiple state variables for unrelated pieces of state, and objects for state that changes together.**

\`\`\`jsx
// Multiple variables — good when data is unrelated
function SearchPage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  // ...
}

// One object — good when fields always update together
function ModalState() {
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  })

  function openModal(title, message, type = 'info') {
    setModal({ isOpen: true, title, message, type })
  }

  function closeModal() {
    setModal(prev => ({ ...prev, isOpen: false }))
  }
}
\`\`\`

The heuristic: if two pieces of state always change together, group them. If they are independent, keep them separate.

## Lifting State Up

State should live in the component that needs it. When multiple components need the same piece of state, move it to their closest common ancestor — this is called **lifting state up**.

\`\`\`jsx
// Before lifting — each component has its own counter (independent)
function CounterA() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>A: {count}</button>
}

function CounterB() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>B: {count}</button>
}
// A and B have independent counts

// After lifting — parent owns the state, shares with children
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Total: {count}</p>
      <CounterA count={count} onIncrement={() => setCount(c => c + 1)} />
      <CounterB count={count} onIncrement={() => setCount(c => c + 1)} />
    </div>
  )
}
// Now A and B share the same count
\`\`\`

Lifting state is a fundamental React pattern. When you find yourself needing two components to be in sync, lift the state to their common ancestor.

## Derived State — Compute, Don't Store

A common mistake is storing values in state that can be computed from other state. This leads to synchronisation bugs.

\`\`\`jsx
// Anti-pattern — derived state
function CartComponent() {
  const [items, setItems] = useState([...])
  const [total, setTotal] = useState(0)  // Wrong! Derived from items

  function addItem(item) {
    const newItems = [...items, item]
    setItems(newItems)
    setTotal(newItems.reduce((sum, i) => sum + i.price, 0))  // Easy to forget
  }
}

// Better — compute from source of truth
function CartComponent() {
  const [items, setItems] = useState([...])

  // Computed on every render — always accurate
  const total = items.reduce((sum, item) => sum + item.price, 0)
  const itemCount = items.length
  const hasItems = items.length > 0

  function addItem(item) {
    setItems([...items, item])  // Only update the source; rest computes automatically
  }
}
\`\`\`

If a value can be derived from existing state or props, do not put it in state — compute it during render. This is simpler, less error-prone, and always accurate.

## A Complete useState Example — Shopping Cart

\`\`\`jsx
import { useState } from 'react'

const PRODUCTS = [
  { id: 1, name: 'React T-Shirt', price: 25 },
  { id: 2, name: 'JavaScript Mug', price: 15 },
  { id: 3, name: 'Node.js Hoodie', price: 45 },
]

function ShoppingApp() {
  const [cartItems, setCartItems] = useState([])
  const [lastAdded, setLastAdded] = useState(null)

  // Derived state — no separate useState
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  function addToCart(product) {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setLastAdded(product.name)
  }

  function removeFromCart(productId) {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  return (
    <div className="app">
      <header>
        <h1>Dev Store</h1>
        <span className="cart-count">{cartCount} items — \${cartTotal.toFixed(2)}</span>
      </header>

      {lastAdded && <p className="toast">Added {lastAdded} to cart!</p>}

      <div className="products">
        {PRODUCTS.map(product => (
          <div key={product.id} className="product">
            <h3>{product.name}</h3>
            <p>\${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <span>{item.name} × {item.quantity}</span>
              <span>\${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item.id)}>×</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
\`\`\`

This example demonstrates multiple state variables, functional updates, object state, array state patterns, and derived state working together in a realistic application.

State is the heart of React's dynamism. Once you truly understand that the UI is a direct reflection of state — that changing state triggers a re-render that reflects the new state — React's behaviour becomes entirely predictable.`,
  quizzes: [
    {
      question: 'Why does changing a regular JavaScript variable inside a React component not update what the user sees on screen?',
      options: [
        'React blocks variable mutations inside components for security reasons',
        'JavaScript variables inside functions are immutable and cannot be changed',
        'Changing a regular variable does not tell React anything changed, so no re-render is scheduled, and the screen never updates with the new value',
        'Regular variables are reset to their initial values after each render cycle'
      ],
      correct: 2,
      explanation: 'React only re-renders a component when state or props change — a regular variable mutation is invisible to React, so no re-render is triggered and the JSX is never re-evaluated, leaving the screen stuck at the old value.'
    },
    {
      question: 'When updating state that depends on the previous value, why should you use the functional update form setCount(prev => prev + 1) instead of setCount(count + 1)?',
      options: [
        'The functional form is faster because React can skip the closure lookup',
        'setCount(count + 1) does not work at all — React requires a function to be passed to all state setters',
        'The count variable in a closure may be stale if React batches updates, while the functional form receives the guaranteed latest state value as its argument',
        'The functional form prevents unnecessary re-renders by allowing React to compare the function reference instead of the value'
      ],
      correct: 2,
      explanation: 'React may batch multiple state updates together, meaning the count in your closure could be outdated by the time the setter runs — the functional form receives the actual current state as its argument, guaranteeing the update is based on the latest value.'
    },
    {
      question: 'Why must you create a new array rather than mutate the existing one when updating array state?',
      options: [
        'React freezes all state arrays to prevent accidental modification',
        'Array mutations like push() and splice() do not return a value, so the setter receives undefined',
        'React detects state changes by comparing references — mutating the existing array keeps the same reference, so React sees no change and may skip the re-render',
        'Mutating arrays in state causes an error because JavaScript arrays in React are stored as tuples'
      ],
      correct: 2,
      explanation: 'React uses reference equality to detect changes — mutating an existing array produces the same object reference, which React interprets as no change and may skip re-rendering; creating a new array produces a new reference that React recognises as a change.'
    },
    {
      question: 'What is "derived state" and why is it better to compute it during render than store it in useState?',
      options: [
        'Derived state is state inherited from a parent component, and it should be stored locally to prevent unnecessary parent re-renders',
        'Derived state is a value that can be computed from existing state or props — storing it separately in useState creates synchronisation risk; computing it during render keeps it always accurate with no extra state to manage',
        'Derived state is state that React automatically derives from your component\'s return value and stores for performance',
        'Derived state refers to state that is passed down from parent components and must be stored to prevent prop drilling'
      ],
      correct: 1,
      explanation: 'Values that can be computed from state or props should not be stored in separate useState variables — every update to the source requires also updating the derived state correctly, and it is easy to forget, causing bugs; computing during render is always consistent.'
    },
    {
      question: 'What does "lifting state up" mean and when should you do it?',
      options: [
        'Moving all state into a global store at the top of the application to make it accessible everywhere',
        'Moving state from a child component to a parent component when multiple sibling components need access to the same piece of state',
        'Moving useState calls to the top of the component function to comply with the Rules of Hooks',
        'Converting local state to derived state by computing it from props instead of storing it'
      ],
      correct: 1,
      explanation: 'Lifting state up means moving state to the closest common ancestor of the components that need it — when two sibling components need to share or be in sync with the same data, their common parent owns the state and passes it down to each child via props.'
    }
  ]
})

await addModule('React Development', {
  title: 'useEffect — Handling Side Effects and Lifecycle',
  description: 'Understand what side effects are in React, how useEffect coordinates them with the render cycle, how to control when effects run with dependencies, and how to properly clean up effects.',
  orderIndex: 5,
  content: `## What Is a Side Effect?

React components have one primary job: given some props and state, return JSX that describes the UI. The render process is designed to be a pure function — the same inputs always produce the same output, with no interaction with the outside world.

But real applications need to do things that go beyond rendering. They need to:
- Fetch data from an API
- Set up timers and intervals
- Subscribe to external events (WebSockets, browser events)
- Interact with browser APIs (localStorage, geolocation, title)
- Set up third-party library integrations

These operations are called **side effects** — they affect something outside the component's render output. The problem is that the render function runs frequently and needs to be fast and predictable. You cannot do a network request or set up a subscription directly inside the render — it would run on every render, create memory leaks, and produce unpredictable behaviour.

\`useEffect\` is React's way of saying: "Run this code, but not during render — run it after React has committed the output to the DOM."

## The Mental Model for useEffect

The best mental model is not "lifecycle methods" (the React class component concept). The better model is: **\`useEffect\` synchronises your component with something external.**

- Synchronise with a server: fetch user data when the user ID changes
- Synchronise with a timer: start a countdown when the component appears
- Synchronise with browser storage: save settings when they change
- Synchronise with a WebSocket: connect when the component mounts, disconnect when it unmounts

When you frame effects as synchronisation, questions like "when should this run?" answer themselves: "Whenever the things it depends on change."

## Basic useEffect Syntax

\`\`\`jsx
import { useState, useEffect } from 'react'

function DocumentTitle({ page }) {
  useEffect(() => {
    // This runs after the component renders
    document.title = \`\${page} — My App\`
  })

  return <h1>{page}</h1>
}
\`\`\`

With no second argument, the effect runs after every render. That is often not what you want — setting the document title on every render is wasteful if it has not changed.

## The Dependency Array

The second argument to \`useEffect\` is the **dependency array** — a list of values that the effect depends on. React runs the effect after render only if one of the dependencies changed since the last render.

\`\`\`jsx
useEffect(() => {
  document.title = \`\${page} — My App\`
}, [page])  // only re-run when page changes
\`\`\`

There are three forms:

**No dependency array — runs after every render:**
\`\`\`jsx
useEffect(() => {
  // Runs after every render
  console.log('Component rendered')
})
\`\`\`

**Empty dependency array — runs once after mount:**
\`\`\`jsx
useEffect(() => {
  // Runs once after the first render
  console.log('Component mounted')
  fetchInitialData()
}, [])
\`\`\`

**With dependencies — runs when dependencies change:**
\`\`\`jsx
useEffect(() => {
  // Runs after mount AND whenever userId changes
  fetchUser(userId)
}, [userId])
\`\`\`

The golden rule: **the dependency array should contain every reactive value used inside the effect.** A reactive value is anything that could change between renders — state variables, props, and values derived from them. If you use \`userId\` inside the effect, \`userId\` goes in the dependency array.

Omitting dependencies that should be there leads to **stale closures** — the effect uses outdated values without knowing it. React's ESLint plugin (\`eslint-plugin-react-hooks\`) warns you when dependencies are missing and is strongly recommended.

## Cleanup Functions

Some effects need to be cleaned up when the component unmounts or before the effect runs again. Without cleanup, you get memory leaks and bugs. Common examples: timers, subscriptions, event listeners, and WebSocket connections.

You clean up by returning a function from the effect:

\`\`\`jsx
function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    // Cleanup function — React calls this when:
    // 1. The component unmounts
    // 2. Before the effect runs again (due to dependencies changing)
    return () => {
      clearInterval(intervalId)
    }
  }, [])  // empty deps — set up once, clean up on unmount

  return <p>Elapsed: {seconds}s</p>
}
\`\`\`

Without the cleanup, every time this component mounted it would create a new interval, and old intervals would never be cleared — a classic memory leak.

Another example — event listeners:

\`\`\`jsx
function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    function handleMouseMove(event) {
      setPosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])  // Set up once, clean up on unmount

  return <p>Mouse: {position.x}, {position.y}</p>
}
\`\`\`

## Fetching Data with useEffect

Fetching data is the most common use of \`useEffect\`. The pattern is always the same: when a dependency changes (often an ID or query), fetch new data, and update state with the result.

\`\`\`jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    fetch(\`https://api.example.com/users/\${userId}\`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user')
        return response.json()
      })
      .then(data => {
        setUser(data)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [userId])  // Re-fetch whenever userId changes

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!user) return null

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
\`\`\`

This is correct but has a subtle bug — what if \`userId\` changes before the first fetch completes? The second fetch completes and sets state, then the first fetch completes and overwrites with stale data (a **race condition**).

The solution is an **AbortController** to cancel the previous fetch:

\`\`\`jsx
useEffect(() => {
  const controller = new AbortController()

  setIsLoading(true)
  setError(null)

  fetch(\`https://api.example.com/users/\${userId}\`, {
    signal: controller.signal
  })
    .then(res => res.json())
    .then(data => {
      setUser(data)
      setIsLoading(false)
    })
    .catch(err => {
      if (err.name === 'AbortError') return  // Ignore cancelled requests
      setError(err.message)
      setIsLoading(false)
    })

  return () => controller.abort()  // Cancel fetch on cleanup
}, [userId])
\`\`\`

When \`userId\` changes, React runs the cleanup (aborts the old fetch) before running the effect again (starting the new fetch). Race condition solved.

## Common useEffect Patterns

**Document title sync:**
\`\`\`jsx
useEffect(() => {
  document.title = title
}, [title])
\`\`\`

**Local storage sync:**
\`\`\`jsx
useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])

// Load from localStorage on mount
const [theme, setTheme] = useState(() => {
  return localStorage.getItem('theme') || 'light'
})
\`\`\`

Note the lazy initialiser — \`useState\` accepts a function as initial value, which is called once on mount. This is the pattern for initialising from localStorage.

**Scroll lock when modal is open:**
\`\`\`jsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }
  return () => {
    document.body.style.overflow = 'unset'
  }
}, [isOpen])
\`\`\`

**WebSocket connection:**
\`\`\`jsx
useEffect(() => {
  const socket = new WebSocket(\`wss://api.example.com/chat/\${roomId}\`)

  socket.onmessage = event => {
    setMessages(prev => [...prev, JSON.parse(event.data)])
  }

  socket.onerror = () => setError('Connection failed')

  return () => socket.close()
}, [roomId])
\`\`\`

**Debounced search:**
\`\`\`jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    // Wait 300ms after query stops changing before fetching
    const timeoutId = setTimeout(() => {
      fetch(\`/api/search?q=\${encodeURIComponent(query)}\`)
        .then(res => res.json())
        .then(data => setResults(data))
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <ul>
      {results.map(result => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

The cleanup cancels the previous timeout before the new one starts — so if the user is typing, the fetch only happens after they pause for 300ms.

## Rules of Hooks

useEffect is a Hook, and all React Hooks follow two rules:

**Rule 1: Only call Hooks at the top level.** Never call Hooks inside loops, conditions, or nested functions. Hooks must be called in the same order every render so React can match them to their stored state.

\`\`\`jsx
// Wrong
function Component({ condition }) {
  if (condition) {
    useEffect(() => { ... })  // Never!
  }
}

// Right — put the condition inside the effect
function Component({ condition }) {
  useEffect(() => {
    if (condition) {
      // ...
    }
  }, [condition])
}
\`\`\`

**Rule 2: Only call Hooks from React function components or custom Hooks.** Not from regular JavaScript functions, class components, or event handlers.

These rules exist because React uses call order to track which Hook corresponds to which state. Violating them causes React to mix up Hook state between renders.

## Custom Hooks — Extracting Effect Logic

When you find yourself writing the same effect pattern in multiple components, extract it into a **custom Hook** — a function whose name starts with \`use\` that calls React Hooks internally.

\`\`\`jsx
// Custom hook for fetching any resource
function useFetch(url) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    setIsLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP error \${res.status}\`)
        return res.json()
      })
      .then(data => {
        setData(data)
        setIsLoading(false)
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [url])

  return { data, isLoading, error }
}

// Use the custom hook in any component
function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useFetch(
    \`https://api.example.com/users/\${userId}\`
  )

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  return <h1>{user.name}</h1>
}

function PostList({ authorId }) {
  const { data: posts, isLoading, error } = useFetch(
    \`https://api.example.com/posts?author=\${authorId}\`
  )

  if (isLoading) return <p>Loading posts...</p>
  if (error) return <p>Failed to load posts</p>
  return posts.map(post => <div key={post.id}>{post.title}</div>)
}
\`\`\`

Custom Hooks are the React way to share stateful logic between components. They are not a special React feature — they are just conventions. Any function that uses React Hooks and whose name starts with \`use\` is a custom Hook.

\`useEffect\` is the most powerful and most subtle of React's Hooks. The key to using it well is the synchronisation mental model: identify what external thing your component needs to stay in sync with, make that the effect's job, and always clean up when the sync is no longer needed.`,
  quizzes: [
    {
      question: 'What is a "side effect" in the context of React components?',
      options: [
        'An unintended error caused by a bug in a component\'s render function',
        'Any operation that interacts with something outside the component\'s render output — such as fetching data, setting timers, or updating the document title',
        'A prop that has an unintended secondary effect on the component\'s appearance',
        'State that is modified by a child component instead of the component that owns it'
      ],
      correct: 1,
      explanation: 'Side effects are operations that go beyond returning JSX — they interact with external systems like APIs, browser APIs, or event subscriptions, and they need to be coordinated with the render cycle, which is what useEffect is designed to do.'
    },
    {
      question: 'What is the difference between useEffect with no dependency array, an empty array, and an array with values?',
      options: [
        'All three are identical — React ignores the dependency array and runs effects after every render',
        'No array runs after every render; empty array [] runs only once after the first render; [value] runs after the first render and again whenever value changes',
        'No array runs once on mount; empty array runs on every render; [value] runs only when value is initially set',
        'The dependency array only affects when the cleanup function runs, not when the effect itself runs'
      ],
      correct: 1,
      explanation: 'The dependency array controls when the effect re-runs: with no array every render triggers it, with [] only the initial mount triggers it, and with [value] the initial mount plus any render where value changed from its previous render value triggers it.'
    },
    {
      question: 'Why is a cleanup function necessary for a setInterval inside useEffect?',
      options: [
        'setInterval requires a cleanup function as its second argument to work correctly in React',
        'Without cleanup, the interval continues running after the component unmounts, creating a memory leak and attempting to update state on an unmounted component',
        'React automatically pauses intervals during re-renders, and the cleanup function tells React when to resume them',
        'The cleanup function converts the interval from asynchronous to synchronous to prevent timing issues'
      ],
      correct: 1,
      explanation: 'Without clearInterval in the cleanup, the interval created when the component mounts continues ticking after the component is removed from the page — the callback still runs and calls setState on a component that no longer exists, causing a memory leak and React warnings.'
    },
    {
      question: 'What is a race condition in data fetching and how does AbortController solve it?',
      options: [
        'A race condition occurs when two effects run simultaneously — AbortController ensures only one effect can run at a time',
        'A race condition occurs when a fast dependency change causes a second fetch to complete before the first, resulting in stale data being displayed — AbortController cancels the previous fetch in the cleanup so only the latest result is used',
        'A race condition occurs when state updates conflict with each other — AbortController queues state updates to process them in order',
        'A race condition occurs when the network is slow — AbortController implements retry logic to resolve slow requests'
      ],
      correct: 1,
      explanation: 'When dependencies change rapidly, multiple fetches can be in flight simultaneously and arrive out of order — AbortController in the cleanup cancels the previous in-flight request when the effect re-runs, ensuring only the response to the latest request updates state.'
    },
    {
      question: 'What is a custom Hook and what problem does it solve?',
      options: [
        'A component built into React that provides additional lifecycle management beyond what useState and useEffect offer',
        'A JavaScript function whose name starts with "use" that calls React Hooks internally, allowing stateful logic to be extracted and reused across multiple components without duplication',
        'A hook that overrides React\'s built-in rendering behaviour for performance-critical components',
        'A configuration file that customises how React processes Hook calls in a specific component tree'
      ],
      correct: 1,
      explanation: 'Custom Hooks are simply functions that use React Hooks and follow the "use" naming convention — they let you extract repeated stateful logic (like data fetching with loading and error state) into a reusable unit that any component can call, eliminating code duplication.'
    }
  ]
})

await addModule('React Development', {
  title: 'Handling Events and Forms in React',
  description: 'Learn React\'s event handling model, how to build controlled form inputs where React owns the value, how to validate forms, and how to structure form state for complex multi-field forms.',
  orderIndex: 6,
  content: `## Events in React — Familiar but Different

If you have worked with DOM events in vanilla JavaScript, React events will feel familiar. But React wraps the native browser events in its own system, and there are important differences in how you attach handlers.

In vanilla JavaScript:
\`\`\`javascript
button.addEventListener('click', handleClick)
\`\`\`

In React:
\`\`\`jsx
<button onClick={handleClick}>Click me</button>
\`\`\`

The differences:
- Event names are **camelCase** in React (\`onClick\`, \`onChange\`, \`onSubmit\`) not lowercase (\`onclick\`, \`onchange\`)
- You pass a **function reference** in JSX, not a string
- You never call \`addEventListener\` — event listeners are declaratively declared in JSX
- React uses **Synthetic Events** — wrappers around native events that normalise behaviour across browsers

\`\`\`jsx
function EventExamples() {
  function handleClick(event) {
    console.log('Clicked!', event.type)  // "click"
    console.log(event.target)            // the button element
  }

  function handleMouseEnter() {
    console.log('Mouse entered!')
  }

  function handleKeyDown(event) {
    console.log('Key:', event.key)
    if (event.key === 'Enter') console.log('Enter pressed!')
  }

  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <div onMouseEnter={handleMouseEnter}>Hover me</div>
      <input onKeyDown={handleKeyDown} placeholder="Type here" />
    </div>
  )
}
\`\`\`

React's Synthetic Event system means you get the same event object structure regardless of which browser the user is on. The event object has all the properties you expect: \`type\`, \`target\`, \`currentTarget\`, \`preventDefault\`, \`stopPropagation\`, and so on.

## Passing Arguments to Event Handlers

A common pattern is passing extra data to an event handler — like the ID of the item being clicked:

\`\`\`jsx
// Wrong — calls the function immediately during render
<button onClick={handleDelete(item.id)}>Delete</button>

// Right — wrap in an arrow function so it's called on click, not during render
<button onClick={() => handleDelete(item.id)}>Delete</button>

// Also right — works when you need the event object too
<button onClick={(event) => handleClick(event, item.id)}>Click</button>
\`\`\`

The most common mistake is calling the function instead of passing it. \`onClick={handleDelete(item.id)}\` runs \`handleDelete\` immediately during render (not on click) and passes its return value as the handler. The arrow function wrapper defers the call until the click actually happens.

## Controlled vs Uncontrolled Inputs

This is the most conceptually important part of React forms.

In HTML, a form input maintains its own internal state — the browser tracks what the user has typed. This is called an **uncontrolled** input — the DOM controls the value.

React introduces **controlled** inputs — where React (via state) controls the value. The input's displayed value is always determined by a state variable, and every keystroke updates that state variable, which re-renders the input with the new value.

\`\`\`jsx
// Uncontrolled — DOM owns the value
<input type="text" defaultValue="Alice" />

// Controlled — React owns the value
function ControlledInput() {
  const [name, setName] = useState('Alice')

  return (
    <input
      type="text"
      value={name}
      onChange={event => setName(event.target.value)}
    />
  )
}
\`\`\`

In a controlled input, setting \`value\` without an \`onChange\` handler makes the input read-only — the user cannot type because the value is always set to the state variable, and the state variable never changes.

**Why use controlled inputs?**
- The input's value is always in sync with state — no need to read the DOM to get the value
- You can validate and transform input on every keystroke
- You can reset the form by simply resetting state
- You can programmatically change the value by updating state

Controlled inputs are the standard React approach. Use uncontrolled inputs only when integrating with third-party DOM-focused libraries or when form performance is a serious concern.

## Building a Form Step by Step

Let's build a realistic registration form to illustrate every concept:

\`\`\`jsx
import { useState } from 'react'

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Generic change handler for text inputs
  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Clear error when user starts correcting the field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms'
    }

    return newErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitSuccess(true)
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="success">
        <h2>Welcome, {formData.name}!</h2>
        <p>Your account has been created successfully.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>Create Account</h1>

      <div className="field">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
          placeholder="Alice Smith"
        />
        {errors.name && <span className="error-msg">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'input-error' : ''}
          placeholder="alice@example.com"
        />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'input-error' : ''}
        />
        {errors.password && <span className="error-msg">{errors.password}</span>}
      </div>

      <div className="field">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={errors.confirmPassword ? 'input-error' : ''}
        />
        {errors.confirmPassword && (
          <span className="error-msg">{errors.confirmPassword}</span>
        )}
      </div>

      <div className="field field-checkbox">
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={handleChange}
        />
        <label htmlFor="agreeToTerms">I agree to the Terms of Service</label>
        {errors.agreeToTerms && (
          <span className="error-msg">{errors.agreeToTerms}</span>
        )}
      </div>

      {errors.submit && <div className="error-banner">{errors.submit}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}
\`\`\`

Let's unpack the key patterns in this form.

## The Generic Change Handler Pattern

The \`handleChange\` function handles all fields using the \`name\` attribute:

\`\`\`jsx
function handleChange(event) {
  const { name, value, type, checked } = event.target
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value,
  }))
}
\`\`\`

The \`name\` attribute on each input matches the property name in the \`formData\` object. The computed property key \`[name]\` updates the right field dynamically. Checkboxes use \`checked\` instead of \`value\`, so the handler checks the input type to grab the right property.

This pattern means you never have to write a separate handler function for each field — one generic handler covers all of them.

## Validation Patterns

Validation belongs in your form logic, not in the component's JSX. A separate \`validate\` function is clean and testable:

\`\`\`jsx
function validate(values) {
  const errors = {}

  // Required field
  if (!values.name.trim()) errors.name = 'Name is required'

  // Email format
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  // Minimum length
  if (values.password.length < 8) {
    errors.password = 'At least 8 characters required'
  }

  // Cross-field validation
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }

  return errors
}
\`\`\`

The validate function returns an errors object where keys match field names. Empty object means all valid; any keys mean failures. This pattern scales to any number of fields.

## Select, Radio, and Textarea

All form elements follow the same controlled pattern:

\`\`\`jsx
// Select dropdown
<select name="country" value={formData.country} onChange={handleChange}>
  <option value="">Select a country</option>
  <option value="AU">Australia</option>
  <option value="US">United States</option>
  <option value="GB">United Kingdom</option>
</select>

// Radio buttons
<div>
  {['beginner', 'intermediate', 'advanced'].map(level => (
    <label key={level}>
      <input
        type="radio"
        name="skillLevel"
        value={level}
        checked={formData.skillLevel === level}
        onChange={handleChange}
      />
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </label>
  ))}
</div>

// Textarea
<textarea
  name="bio"
  value={formData.bio}
  onChange={handleChange}
  rows={4}
  maxLength={500}
  placeholder="Tell us about yourself..."
/>
<p className="char-count">{formData.bio.length}/500</p>
\`\`\`

All of these use \`value\` (or \`checked\` for radio/checkbox) and \`onChange\` — the same controlled pattern applied consistently.

## Form Submission and API Integration

\`\`\`jsx
async function handleSubmit(event) {
  event.preventDefault()  // Stop the form from reloading the page

  // Validate first
  const validationErrors = validate(formData)
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors)
    return  // Stop submission
  }

  // Submit to API
  setIsSubmitting(true)

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Registration failed')
    }

    setSubmitSuccess(true)
  } catch (error) {
    setErrors({ submit: error.message })
  } finally {
    setIsSubmitting(false)
  }
}
\`\`\`

The \`finally\` block runs whether the try succeeded or failed — using it to reset \`isSubmitting\` ensures the button never stays permanently disabled.

## Resetting and Clearing Forms

Because state controls the values, resetting is trivial:

\`\`\`jsx
function resetForm() {
  setFormData({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  setErrors({})
}
\`\`\`

No DOM manipulation, no ref calls, no form.reset() — just set state back to the initial values. This is one of the most concrete benefits of controlled inputs.

Events and forms are where React applications become truly interactive. The controlled input pattern, the generic change handler, and the validate-then-submit flow are patterns you will use in almost every form you ever build in React. Learn them thoroughly and they become second nature.`,
  quizzes: [
    {
      question: 'What is a controlled input in React and what makes it "controlled"?',
      options: [
        'An input that has validation rules applied to it through the required and pattern HTML attributes',
        'An input whose displayed value is determined by React state, and every change is handled by an onChange handler that updates that state — React owns the value rather than the DOM',
        'An input that is disabled and cannot be modified by the user — React controls access to it',
        'An input that is wrapped in a React.memo() call to control when it re-renders'
      ],
      correct: 1,
      explanation: 'A controlled input sets value from state and onChange to update that state on every keystroke — React is the single source of truth for the input\'s value, keeping it always in sync with state rather than relying on the DOM\'s internal tracking.'
    },
    {
      question: 'Why does <button onClick={handleDelete(item.id)}> cause a bug?',
      options: [
        'onClick requires a string event name, not a function call',
        'handleDelete is called immediately during render rather than on click, because the parentheses invoke the function — its return value becomes the handler instead',
        'You cannot pass arguments to event handlers in React — only the event object is allowed',
        'The item.id argument is not accessible inside the onClick scope due to closure restrictions'
      ],
      correct: 1,
      explanation: 'Writing handleDelete(item.id) immediately calls the function during the render phase and assigns its return value as the handler — to defer the call until click, wrap it: onClick={() => handleDelete(item.id)}.'
    },
    {
      question: 'In the generic change handler pattern, what is the purpose of [name] with square brackets in the state update?',
      options: [
        'It accesses an array element at the index stored in the name variable',
        'It is a destructuring syntax that extracts the name property from the event target',
        'It is a computed property key — it uses the value of the name variable as the property name in the object, allowing one handler to update any field dynamically',
        'It prevents the property from being enumerated when the object is spread'
      ],
      correct: 2,
      explanation: 'Computed property keys ([variable]) use the value of the variable as the property name at runtime — since name equals the input\'s name attribute (like "email" or "password"), one handler can update any field by setting the right property in the state object.'
    },
    {
      question: 'Why should form validation be done in a separate validate function that returns an errors object, rather than inline in the JSX?',
      options: [
        'React requires validation to be in a separate function for security — inline validation is blocked by the content security policy',
        'Inline validation in JSX runs on every render which is too slow for complex forms',
        'A separate validate function is easier to test, can be reused, keeps the JSX clean, and makes the validation logic easy to read and maintain independently of the rendering logic',
        'JSX does not support boolean expressions long enough for validation rules'
      ],
      correct: 2,
      explanation: 'Separating validation into its own function follows the single responsibility principle — the function can be unit tested in isolation, the JSX stays focused on rendering, and the validation rules are readable as a cohesive block rather than scattered through the markup.'
    },
    {
      question: 'What is the advantage of using a finally block in an async form submission handler?',
      options: [
        'finally makes the async function synchronous so the form cannot be submitted again until the current submission completes',
        'finally runs whether the try block succeeded or threw an error, ensuring cleanup like setIsSubmitting(false) always executes and the submit button does not remain permanently disabled',
        'finally is required by React\'s form handling system to signal that the submission cycle is complete',
        'finally prevents the component from unmounting while the submission is in progress'
      ],
      correct: 1,
      explanation: 'A finally block executes regardless of whether the try succeeded or catch handled an error — putting setIsSubmitting(false) there guarantees the button always returns to its enabled state after the submission attempt, preventing it from getting permanently stuck in a loading state.'
    }
  ]
})

await addModule('React Development', {
  title: 'Fetching Data from an API in React',
  description: 'Learn how to fetch data from external APIs in React, handle loading and error states gracefully, avoid common pitfalls like memory leaks and race conditions, and build reusable data-fetching patterns.',
  orderIndex: 7,
  content: `## Data Fetching Is Central to Real Applications

Almost every real React application fetches data from an external source — a REST API, a GraphQL endpoint, a database-backed server. A to-do app syncs with a backend. A dashboard loads analytics. A social feed pulls posts. Understanding how to fetch data correctly in React — not just making the fetch work, but handling all the states and edge cases — is what separates toy apps from production-quality applications.

You already know the basics: \`useEffect\` runs after render, \`fetch\` retrieves data, \`useState\` holds the result. But correct data fetching in React involves several considerations that are not obvious at first:
- What does the user see while data is loading?
- What does the user see if the fetch fails?
- What happens if the user navigates away before the fetch completes?
- What happens if they trigger a new fetch before the previous one finishes?
- How do you avoid re-fetching data you already have?

This module addresses all of these systematically.

## The Three States of Async Data

Every piece of data fetched from an API is in one of exactly three states at any given moment:

1. **Loading** — the request is in flight, data is not yet available
2. **Success** — data arrived and can be displayed
3. **Error** — the request failed and an error should be communicated

Your UI must handle all three states. Forgetting the loading or error states is the most common mistake in React data fetching, and it leads to blank screens, silent failures, and confused users.

\`\`\`jsx
import { useState, useEffect } from 'react'

function PostList() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
      .then(response => {
        if (!response.ok) {
          throw new Error(\`HTTP error: \${response.status}\`)
        }
        return response.json()
      })
      .then(data => {
        setPosts(data)
        setIsLoading(false)
      })
      .catch(error => {
        setError(error.message)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Failed to load posts: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    )
  }

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  )
}
\`\`\`

Notice the early returns for loading and error states. This pattern — render guards at the top — keeps the main render path clean.

## Using async/await Instead of .then()

The \`fetch\` API returns Promises, and you can use async/await for a cleaner syntax. However, you cannot make the \`useEffect\` callback itself async:

\`\`\`jsx
// Wrong — useEffect callback cannot be async
useEffect(async () => {
  const data = await fetch('/api/posts')
  // ...
}, [])

// Right — define an async function inside and call it
useEffect(() => {
  async function fetchPosts() {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')

      if (!response.ok) {
        throw new Error(\`HTTP error: \${response.status}\`)
      }

      const data = await response.json()
      setPosts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  fetchPosts()
}, [])
\`\`\`

The reason: \`useEffect\` expects its callback to return either nothing or a cleanup function. An async function always returns a Promise, which \`useEffect\` would try to use as a cleanup function (and fail silently). Defining an async function inside and calling it immediately is the correct pattern.

## Fetching with Dependencies — Responding to User Input

When a user selects a category, types a search term, or clicks on a user ID, you need to fetch new data in response. This is where the dependency array becomes critical:

\`\`\`jsx
function PostsByUser({ userId }) {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) return  // Don't fetch if no userId

    let cancelled = false  // Flag to handle cleanup

    async function fetchUserPosts() {
      setIsLoading(true)
      setError(null)
      setPosts([])  // Clear previous posts immediately

      try {
        const response = await fetch(
          \`https://jsonplaceholder.typicode.com/posts?userId=\${userId}\`
        )

        if (!response.ok) throw new Error('Failed to fetch posts')

        const data = await response.json()

        if (!cancelled) {  // Only update state if not cancelled
          setPosts(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchUserPosts()

    return () => {
      cancelled = true  // Prevent state updates from completed fetch
    }
  }, [userId])  // Re-run whenever userId changes

  // ... render
}
\`\`\`

The \`cancelled\` flag prevents state updates after the component has unmounted or the dependency has changed. This handles both the memory leak (updating unmounted component) and the race condition (slow fetch for user 1 arriving after fast fetch for user 2 has already set state).

The AbortController approach from the previous module is an alternative — both patterns are valid. AbortController actually cancels the network request; the flag approach lets the request complete but ignores the result.

## Pagination — Loading Data in Pages

Many APIs return data paginated. Here is a pattern for loading page by page:

\`\`\`jsx
function PaginatedPosts() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const POSTS_PER_PAGE = 10

  useEffect(() => {
    let cancelled = false

    async function fetchPage() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          \`https://jsonplaceholder.typicode.com/posts?_page=\${page}&_limit=\${POSTS_PER_PAGE}\`
        )

        if (!response.ok) throw new Error('Fetch failed')

        // JSONPlaceholder returns total count in header
        const total = response.headers.get('x-total-count')
        const data = await response.json()

        if (!cancelled) {
          setPosts(data)
          if (total) setTotalPages(Math.ceil(total / POSTS_PER_PAGE))
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchPage()
    return () => { cancelled = true }
  }, [page])

  return (
    <div>
      {isLoading && <p>Loading page {page}...</p>}
      {error && <p>Error: {error}</p>}

      {!isLoading && posts.map(post => (
        <article key={post.id}>
          <h3>{post.title}</h3>
        </article>
      ))}

      <div className="pagination">
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1 || isLoading}
        >
          ← Previous
        </button>
        <span>Page {page}{totalPages ? \` of \${totalPages}\` : ''}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={(totalPages && page >= totalPages) || isLoading}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
\`\`\`

Incrementing \`page\` triggers the \`useEffect\` (because \`page\` is in the dependency array), which fetches the new page. The previous results are replaced. The pagination buttons update \`page\` state, creating a clean data flow.

## Building a Complete Data Fetching Hook

The \`useFetch\` custom Hook from the previous module is an excellent starting point. Let's expand it into a production-quality version:

\`\`\`jsx
import { useState, useEffect, useCallback } from 'react'

function useFetch(url, options = {}) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!url) return

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
      }

      const json = await response.json()
      setData(json)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }

    return () => controller.abort()
  }, [url])

  useEffect(() => {
    const cleanup = fetchData()
    return cleanup
  }, [fetchData])

  return { data, isLoading, error, refetch: fetchData }
}

// Usage
function UserProfile({ userId }) {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useFetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`)

  if (isLoading) return <p>Loading profile...</p>
  if (error) return (
    <div>
      <p>Error: {error}</p>
      <button onClick={refetch}>Retry</button>
    </div>
  )
  if (!user) return null

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>{user.company.name}</p>
    </div>
  )
}
\`\`\`

The \`refetch\` function lets the user retry on error, which significantly improves UX.

## POST, PUT, DELETE — Mutating Data

Data fetching is not only GET requests. Here is the pattern for creating, updating, and deleting:

\`\`\`jsx
function CreatePostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [createdPost, setCreatedPost] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          userId: 1,
        }),
      })

      if (!response.ok) throw new Error('Failed to create post')

      const newPost = await response.json()
      setCreatedPost(newPost)
      setTitle('')
      setBody('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {createdPost && (
        <div className="success">
          <p>Post created with ID: {createdPost.id}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Post title"
          required
        />
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Post content"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}
\`\`\`

## Handling Authentication Headers

Real APIs often require authentication tokens in request headers:

\`\`\`jsx
const API_BASE = 'https://api.example.com'

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('authToken')

  const response = await fetch(\`\${API_BASE}\${endpoint}\`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: \`Bearer \${token}\` }),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    // Token expired or invalid — redirect to login
    localStorage.removeItem('authToken')
    window.location.href = '/login'
    return
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || \`HTTP \${response.status}\`)
  }

  return response.json()
}

// Usage in a component
useEffect(() => {
  async function loadData() {
    try {
      const data = await apiFetch('/api/user/profile')
      setProfile(data)
    } catch (err) {
      setError(err.message)
    }
  }
  loadData()
}, [])
\`\`\`

A shared \`apiFetch\` utility function handles authentication headers, base URL, and common error cases in one place — much better than duplicating headers in every \`fetch\` call.

## Loading Skeletons — Better Loading UX

Instead of just "Loading...", skeleton screens give users a preview of the content structure:

\`\`\`jsx
function PostSkeleton() {
  return (
    <div className="post-skeleton">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
    </div>
  )
}

function PostList() {
  const { data: posts, isLoading, error } = useFetch('/api/posts')

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 5 }, (_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    )
  }

  // ... rest of component
}
\`\`\`

CSS for skeleton animation:
\`\`\`javascript
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  height: 16px;
  margin-bottom: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
\`\`\`

Data fetching done well significantly improves the perceived quality of an application. Handling all three states, avoiding race conditions, providing good loading UX, and making retry easy — these are the habits of professional React development.`,
  quizzes: [
    {
      question: 'Why can\'t you make the useEffect callback itself an async function?',
      options: [
        'Async functions are not allowed inside React components due to the Rules of Hooks',
        'useEffect expects its callback to return nothing or a cleanup function — an async function always returns a Promise, which useEffect would try to use as a cleanup function and fail silently',
        'Async callbacks in useEffect cause infinite loops because they resolve on a different render cycle',
        'React\'s rendering engine cannot handle asynchronous functions in the component lifecycle'
      ],
      correct: 1,
      explanation: 'useEffect\'s cleanup mechanism expects a function or undefined as the return value — async functions implicitly return Promises, which React would treat as the cleanup function, causing incorrect behaviour; the solution is to define and immediately call an async function inside the effect.'
    },
    {
      question: 'What is the purpose of the "cancelled" flag pattern in a useEffect data fetch?',
      options: [
        'It cancels the network request immediately, freeing up browser resources for other requests',
        'It tells React to skip the re-render caused by setState to avoid unnecessary DOM updates',
        'It prevents state updates from a completed fetch from running after the component has unmounted or the dependency has changed, avoiding memory leaks and stale data from race conditions',
        'It marks the fetch as non-critical so the browser can deprioritise it during heavy rendering'
      ],
      correct: 2,
      explanation: 'The cancelled flag is set to true in the cleanup function — state update calls check this flag before running, so if the component unmounts or deps change while a fetch is in flight, the resulting setState calls are suppressed, preventing both the unmounted-component warning and race condition bugs.'
    },
    {
      question: 'Why is it important to check response.ok before calling response.json() in a fetch request?',
      options: [
        'response.json() fails if called on an unsuccessful response because the body is always empty',
        'HTTP error responses (4xx, 5xx) resolve the fetch Promise successfully — without checking response.ok, a 404 or 500 would be treated as success and the error would go unhandled',
        'response.ok converts the response to JSON automatically, so calling json() afterwards causes a double-parse error',
        'Browsers block access to the response body unless response.ok is confirmed first for security reasons'
      ],
      correct: 1,
      explanation: 'The fetch Promise only rejects on network errors — HTTP error status codes like 404 or 500 still resolve successfully; checking response.ok (which is true only for 2xx status codes) lets you detect and throw for these HTTP errors explicitly.'
    },
    {
      question: 'What does adding a userId to the useEffect dependency array accomplish in a UserPosts component?',
      options: [
        'It caches the fetched posts under the userId key so subsequent renders with the same userId skip the fetch',
        'It causes the effect to re-run whenever userId changes, fetching the new user\'s posts automatically — the effect stays synchronised with the current userId prop',
        'It prevents the effect from running until the userId has been validated by the parent component',
        'It makes the fetch include the userId in the request headers for authentication'
      ],
      correct: 1,
      explanation: 'The dependency array tells React when to re-run the effect — including userId means every time the userId prop changes (because a different user was selected), the effect runs again and fetches that user\'s posts, keeping the displayed data in sync with the current userId.'
    },
    {
      question: 'What is a skeleton loading screen and why is it better UX than a spinner?',
      options: [
        'A skeleton screen uses HTML5 canvas to draw a low-resolution preview of the content before the real content loads',
        'A skeleton screen shows placeholders that match the shape and layout of the expected content, giving users a preview of the structure and reducing the perception of wait time compared to a generic spinner',
        'A skeleton screen is a React pattern where a minimal version of the component renders first, then gradually hydrates with real data',
        'A skeleton screen caches the previous render and shows it while new data loads to prevent blank screens during navigation'
      ],
      correct: 1,
      explanation: 'Skeleton screens show styled placeholders in the shape of the incoming content — this tells users what kind of content to expect, reduces the jarring transition from nothing to something, and psychologically makes the load feel faster than a spinner that gives no structural preview.'
    }
  ]
})

await addModule('React Development', {
  title: 'Putting It All Together — Build a Complete React App',
  description: 'Apply every concept from this track to design and build a complete GitHub User Search application — combining components, props, state, effects, event handling, and API fetching into a polished, production-quality React app.',
  orderIndex: 8,
  content: `## The Integration Module

Every module in this track has given you one layer of the React mental model. Components gave you the building block. Props gave you the wiring between components. State gave you dynamism. useEffect gave you coordination with the outside world. Events and forms gave you user interaction. Data fetching gave you real-world data.

Now you build something real. Not a toy counter, not an isolated example — a complete, polished application that a user could actually use.

The application: a **GitHub User Search app** that lets users search for any GitHub username, displays their profile information, and shows a list of their public repositories sorted by stars. It will use the real GitHub API with no authentication required.

Features:
- Search input with debounced fetching
- Profile card showing avatar, name, bio, and stats
- Repository list sorted by star count
- Loading, error, and empty states for every data operation
- Clean, well-structured component hierarchy

## Planning the Application

Before writing a line of code, plan the structure.

**Data needs:**
- Search query (string) — state in the main App component
- User profile (object or null) — fetched when query changes
- User repositories (array) — fetched when profile loads
- Loading state for each fetch
- Error state for each fetch

**Component hierarchy:**
\`\`\`
App
├── SearchBar          (search input + submit button)
├── UserProfile        (avatar, name, bio, stats)
│   └── StatBadge      (individual stat: repos, followers, following)
├── RepositoryList     (maps over repos)
│   └── RepositoryCard (individual repo: name, description, stars, language)
└── StatusMessage      (loading / error / empty states)
\`\`\`

**Data flow:**
- App owns all state (query, user, repos, loading, error)
- SearchBar receives the query and an onChange handler as props
- UserProfile receives the user object as props
- RepositoryList receives the repos array as props
- StatusMessages receive booleans and strings as props

This follows React's one-way data flow: state lives in the ancestor, flows down as props, events flow back up via callbacks.

## Setting Up the Project

\`\`\`javascript
npm create vite@latest github-search -- --template react
cd github-search
npm install
npm run dev
\`\`\`

Create this folder structure:
\`\`\`
src/
  components/
    SearchBar.jsx
    UserProfile.jsx
    StatBadge.jsx
    RepositoryList.jsx
    RepositoryCard.jsx
    StatusMessage.jsx
  hooks/
    useGitHubUser.js
  App.jsx
  App.css
  main.jsx
\`\`\`

## The Custom Hook — useGitHubUser

Encapsulating all the data-fetching logic in a custom hook keeps \`App.jsx\` clean and makes the fetching logic independently testable and reusable.

\`\`\`javascript
// src/hooks/useGitHubUser.js
import { useState, useEffect } from 'react'

const GITHUB_API = 'https://api.github.com'

export function useGitHubUser(username) {
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [isLoadingRepos, setIsLoadingRepos] = useState(false)
  const [userError, setUserError] = useState(null)
  const [reposError, setReposError] = useState(null)

  // Fetch user profile when username changes
  useEffect(() => {
    if (!username.trim()) {
      setUser(null)
      setRepos([])
      return
    }

    const controller = new AbortController()
    setIsLoadingUser(true)
    setUserError(null)
    setUser(null)

    fetch(\`\${GITHUB_API}/users/\${username}\`, { signal: controller.signal })
      .then(res => {
        if (res.status === 404) throw new Error('User not found')
        if (!res.ok) throw new Error(\`GitHub API error: \${res.status}\`)
        return res.json()
      })
      .then(data => {
        setUser(data)
        setIsLoadingUser(false)
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setUserError(err.message)
        setIsLoadingUser(false)
      })

    return () => controller.abort()
  }, [username])

  // Fetch repos when user loads successfully
  useEffect(() => {
    if (!user) {
      setRepos([])
      return
    }

    const controller = new AbortController()
    setIsLoadingRepos(true)
    setReposError(null)

    fetch(
      \`\${GITHUB_API}/users/\${user.login}/repos?per_page=100&sort=updated\`,
      { signal: controller.signal }
    )
      .then(res => {
        if (!res.ok) throw new Error('Failed to load repositories')
        return res.json()
      })
      .then(data => {
        // Sort by stars descending
        const sorted = data.sort((a, b) => b.stargazers_count - a.stargazers_count)
        setRepos(sorted)
        setIsLoadingRepos(false)
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setReposError(err.message)
        setIsLoadingRepos(false)
      })

    return () => controller.abort()
  }, [user])

  return { user, repos, isLoadingUser, isLoadingRepos, userError, reposError }
}
\`\`\`

Two separate effects — one for the user, one for the repos — each with their own loading and error state. The repo fetch depends on \`user\` being set, so it only fires after a successful user fetch.

## The Small Components

Build from the inside out — start with the smallest components:

\`\`\`jsx
// src/components/StatBadge.jsx
export default function StatBadge({ label, value }) {
  return (
    <div className="stat-badge">
      <span className="stat-value">
        {value >= 1000 ? \`\${(value / 1000).toFixed(1)}k\` : value}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
\`\`\`

\`\`\`jsx
// src/components/RepositoryCard.jsx
export default function RepositoryCard({ repo }) {
  const LANGUAGE_COLOURS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    CSS: '#563d7c',
    HTML: '#e34c26',
  }

  return (
    
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="repo-card"
    >
      <div className="repo-header">
        <h3 className="repo-name">{repo.name}</h3>
        {repo.fork && <span className="fork-badge">Fork</span>}
      </div>

      {repo.description && (
        <p className="repo-description">{repo.description}</p>
      )}

      <div className="repo-stats">
        {repo.language && (
          <span className="repo-language">
            <span
              className="language-dot"
              style={{
                backgroundColor: LANGUAGE_COLOURS[repo.language] || '#8b949e'
              }}
            />
            {repo.language}
          </span>
        )}

        <span className="repo-stars">
          ⭐ {repo.stargazers_count.toLocaleString()}
        </span>

        <span className="repo-forks">
          🍴 {repo.forks_count.toLocaleString()}
        </span>
      </div>
    </a>
  )
}
\`\`\`

\`\`\`jsx
// src/components/StatusMessage.jsx
export default function StatusMessage({ type, message, children }) {
  const icons = { loading: '⏳', error: '⚠️', empty: '🔍', info: 'ℹ️' }

  return (
    <div className={\`status-message status-\${type}\`}>
      <span className="status-icon">{icons[type]}</span>
      {message && <p>{message}</p>}
      {children}
    </div>
  )
}
\`\`\`

## The Larger Components

\`\`\`jsx
// src/components/SearchBar.jsx
import { useState } from 'react'

export default function SearchBar({ onSearch, isLoading }) {
  const [inputValue, setInputValue] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = inputValue.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Search GitHub username..."
        disabled={isLoading}
        autoFocus
      />
      <button
        type="submit"
        disabled={!inputValue.trim() || isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}
\`\`\`

\`\`\`jsx
// src/components/UserProfile.jsx
import StatBadge from './StatBadge'

export default function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <div className="user-avatar-section">
        <img
          src={user.avatar_url}
          alt={\`\${user.login}'s avatar\`}
          className="user-avatar"
        />
        
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="user-github-link"
        >
          View on GitHub ↗
        </a>
      </div>

      <div className="user-info">
        <h1 className="user-name">{user.name || user.login}</h1>
        {user.name && <p className="user-login">@{user.login}</p>}
        {user.bio && <p className="user-bio">{user.bio}</p>}

        <div className="user-details">
          {user.company && <span>🏢 {user.company}</span>}
          {user.location && <span>📍 {user.location}</span>}
          {user.blog && (
            <a href={user.blog} target="_blank" rel="noopener noreferrer">
              🔗 {user.blog}
            </a>
          )}
        </div>

        <div className="user-stats">
          <StatBadge label="Repos" value={user.public_repos} />
          <StatBadge label="Followers" value={user.followers} />
          <StatBadge label="Following" value={user.following} />
          <StatBadge label="Gists" value={user.public_gists} />
        </div>

        <p className="user-since">
          Member since {new Date(user.created_at).getFullYear()}
        </p>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`jsx
// src/components/RepositoryList.jsx
import RepositoryCard from './RepositoryCard'
import StatusMessage from './StatusMessage'

export default function RepositoryList({ repos, isLoading, error }) {
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading repositories..." />
  }

  if (error) {
    return <StatusMessage type="error" message={error} />
  }

  if (repos.length === 0) {
    return <StatusMessage type="empty" message="No public repositories found." />
  }

  return (
    <div className="repo-list">
      <h2 className="repo-list-title">
        Public Repositories ({repos.length})
      </h2>
      <div className="repo-grid">
        {repos.map(repo => (
          <RepositoryCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  )
}
\`\`\`

## App.jsx — Orchestrating Everything

\`\`\`jsx
// src/App.jsx
import { useState } from 'react'
import SearchBar from './components/SearchBar'
import UserProfile from './components/UserProfile'
import RepositoryList from './components/RepositoryList'
import StatusMessage from './components/StatusMessage'
import { useGitHubUser } from './hooks/useGitHubUser'
import './App.css'

export default function App() {
  const [searchedUsername, setSearchedUsername] = useState('')

  const {
    user,
    repos,
    isLoadingUser,
    isLoadingRepos,
    userError,
    reposError,
  } = useGitHubUser(searchedUsername)

  function handleSearch(username) {
    setSearchedUsername(username)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>GitHub Search</h1>
        <p>Search for any GitHub user to see their profile and repositories</p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} isLoading={isLoadingUser} />

        {/* Initial state — no search yet */}
        {!searchedUsername && (
          <StatusMessage type="info" message="Enter a GitHub username to get started." />
        )}

        {/* Loading user */}
        {isLoadingUser && (
          <StatusMessage type="loading" message={\`Searching for "\${searchedUsername}"...\`} />
        )}

        {/* User error */}
        {userError && !isLoadingUser && (
          <StatusMessage type="error" message={userError} />
        )}

        {/* User found */}
        {user && !isLoadingUser && (
          <>
            <UserProfile user={user} />
            <RepositoryList
              repos={repos}
              isLoading={isLoadingRepos}
              error={reposError}
            />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Data from the GitHub API · Built with React</p>
      </footer>
    </div>
  )
}
\`\`\`

## What Each Module Contributed

Look at the complete application and trace every concept:

**Module 2 — Components:** Every UI piece is a component. SearchBar, UserProfile, StatBadge, RepositoryCard, RepositoryList, StatusMessage. Each does one thing.

**Module 3 — Props:** Every component receives data from its parent. \`UserProfile\` receives \`user\`. \`RepositoryCard\` receives \`repo\`. \`SearchBar\` receives \`onSearch\` and \`isLoading\`. Events flow up via callbacks (\`onSearch\`). Data flows down via props.

**Module 4 — State:** \`searchedUsername\` in App drives everything. SearchBar has its own \`inputValue\` state for the controlled input. State is lifted to the appropriate level.

**Module 5 — useEffect:** Two effects in \`useGitHubUser\` — one depending on \`username\`, one depending on \`user\`. Each handles its own loading/error state and cleanup via AbortController.

**Module 6 — Events and Forms:** SearchBar is a controlled form with a submit handler. \`event.preventDefault()\` prevents page reload. The input uses \`value\` and \`onChange\`.

**Module 7 — Data Fetching:** Real GitHub API calls with proper error handling (including 404 detection), race condition prevention via AbortController, loading states, and error states.

## The React Architecture Pattern

This application demonstrates the architecture pattern that scales from small apps to large ones:

**Separate concerns clearly:**
- Fetching logic → custom hooks
- UI logic → components
- State → the component that needs it or its ancestor

**Data flows one way:**
- State lives at the top (App or custom hook)
- Flows down as props
- Events bubble up via callbacks

**Every async operation has three states:**
- Loading → show indicator
- Error → show message with recovery option
- Success → show data

**Components are small and focused:**
- Each component has one job
- Complex UIs compose simple components
- If a component is getting complex, split it

## Where React Takes You Next

This track has given you the complete core of React. You can build component hierarchies, manage state, handle effects, interact with APIs, process forms, and structure a real application. These are not beginner skills — this is how professional React applications are built.

From here, the natural progressions are:

**Next.js** — the full-stack React framework. Server-side rendering, static generation, file-based routing, and API routes. The majority of production React applications are Next.js applications.

**State management** — for applications where state is needed across many components. Zustand is beginner-friendly. Redux Toolkit is the enterprise standard. Both build on the state concepts you already understand.

**TanStack Query** — a data-fetching library that handles caching, background refetching, optimistic updates, and pagination. It replaces the manual fetch patterns from Module 7 with a much more powerful system.

**TypeScript** — adding static types to React. TypeScript catches prop type errors at compile time, makes components self-documenting, and is standard in professional React development.

**Testing** — React Testing Library is the standard for testing React components. It tests components the way users interact with them rather than implementation details.

Each of these is a layer on top of the React foundation you now have. The component model, the one-way data flow, the state management patterns, the effect model — all of it persists and scales. You are not starting over with each tool; you are extending the same mental model you built in this track.

React rewards the investment you make in understanding it deeply. The developers who truly understand why React works the way it does — not just the syntax, but the mental models — are the ones who build applications that are fast, maintainable, and a pleasure to work on. You have built that foundation.`,
  quizzes: [
    {
      question: 'In the GitHub Search app, why does the App component own the searchedUsername state rather than the SearchBar component?',
      options: [
        'Because SearchBar components are not allowed to have state in React',
        'Because SearchBar needs to be a controlled component, and controlled components cannot have their own state',
        'Because searchedUsername is needed by the useGitHubUser hook which is called in App — state lives where it is used, and the data it controls (user, repos) needs to be accessible at the App level',
        'Because putting state in SearchBar would cause unnecessary re-renders of the entire application on every keystroke'
      ],
      correct: 2,
      explanation: 'State lives in the component that uses it or needs to share it — searchedUsername drives the API calls in useGitHubUser (called in App) and determines what UserProfile and RepositoryList display, so App is the correct owner; SearchBar has its own inputValue state for the typed text that only it needs.'
    },
    {
      question: 'Why are two separate useEffect calls used in useGitHubUser — one for the user and one for repos — instead of one effect that does both?',
      options: [
        'React enforces a maximum of one useEffect per data fetch for performance reasons',
        'Fetching repos depends on the user being loaded first — a separate effect depending on user naturally sequences the requests and each effect can independently manage its own loading and error state',
        'Two effects run in parallel, making the total fetch time faster than a single sequential effect',
        'The repos fetch requires a different cleanup mechanism than the user fetch, which is only possible in separate effects'
      ],
      correct: 1,
      explanation: 'The repos fetch needs the user\'s login name which only exists after a successful user fetch — making the repos effect depend on user naturally creates the sequential dependency, while allowing each operation to have isolated loading, error, and cleanup state.'
    },
    {
      question: 'In the SearchBar component, why does the input have its own inputValue state rather than directly updating the parent\'s searchedUsername on every keystroke?',
      options: [
        'Directly updating the parent on every keystroke would cause the API to be called for every character typed, creating excessive network requests',
        'Parent state cannot be updated from child components — it is read-only from the child\'s perspective',
        'The input needs to be a controlled component, and its internal inputValue state is required for that pattern to work',
        'Both A and C — the input needs controlled component state for the value prop, and keeping the value local prevents API calls on every keystroke until the form is submitted'
      ],
      correct: 3,
      explanation: 'SearchBar uses local inputValue for the controlled input pattern (value + onChange) while only calling onSearch (which updates the parent) on form submission — this prevents the API from being triggered on every character typed while still maintaining a controlled input.'
    },
    {
      question: 'Why does the RepositoryCard component use an <a> tag with target="_blank" and rel="noopener noreferrer"?',
      options: [
        'The rel attribute is required by the GitHub API terms of service for all links to GitHub',
        'target="_blank" opens the link in a new tab, and rel="noopener noreferrer" is a security measure that prevents the opened page from accessing the opener via window.opener',
        'noopener noreferrer improves SEO by telling search engines not to follow GitHub links from the application',
        'These attributes are required for React Router to correctly intercept and handle the navigation event'
      ],
      correct: 1,
      explanation: 'Opening links in new tabs with target="_blank" creates a security risk where the opened page can manipulate the opener page via window.opener — rel="noopener noreferrer" eliminates this by removing the reference to the opener, which is a standard security practice for external links.'
    },
    {
      question: 'What architectural principle does extracting the data-fetching logic into useGitHubUser demonstrate, and why is it valuable?',
      options: [
        'It demonstrates code splitting, which reduces the initial bundle size by loading the hook asynchronously',
        'It demonstrates the separation of concerns — fetching logic lives in a custom hook that is independently testable and reusable, while App.jsx focuses purely on rendering and composition without data-fetching implementation details',
        'It demonstrates memoisation — the custom hook caches GitHub API responses so repeated searches for the same user avoid network requests',
        'It demonstrates the observer pattern — the hook subscribes to GitHub\'s streaming API and notifies App whenever new data arrives'
      ],
      correct: 1,
      explanation: 'Extracting fetching into useGitHubUser separates concerns — the hook owns all the data-fetching complexity (multiple effects, loading states, error handling, AbortControllers) while App.jsx stays clean, readable, and focused on composition; the hook can also be reused in any other component that needs GitHub user data.'
    }
  ]
})
  // ════════════════════════════════════════════════════════
  // END OF MODULES
  // ════════════════════════════════════════════════════════

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
