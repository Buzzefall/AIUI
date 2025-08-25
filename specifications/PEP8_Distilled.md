# PEP 8 Distilled: The Style Guide for Python Code (v3)

This document provides a refined and comprehensive summary of PEP 8, the official style guide for Python code. The primary goal of PEP 8 is to improve the readability and consistency of Python code, making it easier to maintain and share. This guide is not a replacement for the full PEP 8, but rather a quick reference and a learning tool.

## Core Philosophy: Readability and Consistency

The guiding principles of PEP 8 are rooted in the "Zen of Python" (**[PEP 20](https://peps.python.org/pep-0020/)**). Readability is paramount, as code is read far more often than it is written. A key insight is that "code is read much more often than it is written".

However, PEP 8 also acknowledges that consistency should not be an unbreakable rule. The principle of "A Foolish Consistency is the Hobgoblin of Little Minds" applies. If adhering to the guide makes the code less readable, it's better to be inconsistent.

## Code Layout

*   **Indentation:** Use 4 spaces per indentation level. Do not use tabs. For continuation lines, you can either align the wrapped elements vertically, or use a hanging indent.
*   **Line Length:** Limit all lines to a maximum of 79 characters. For flowing long blocks of text like docstrings or comments, the line length should be limited to 72 characters.
*   **Line Breaks:** Use parentheses, brackets, and braces for implicit line continuation, which is preferred over using backslashes.

## Imports

*   Imports should usually be on separate lines.
*   Imports are always put at the top of the file, just after any module comments and docstrings, and before module globals and constants.
*   Imports should be grouped in the following order:
    1.  Standard library imports.
    2.  Related third-party imports.
    3.  Local application/library specific imports.
*   Absolute imports are recommended, as they are usually more readable and tend to be better behaved.

## String Quotes

In Python, single-quoted strings and double-quoted strings are the same. PEP 8 does not make a recommendation for this. Pick a rule and stick to it. When a string contains single or double quote characters, use the other one to avoid backslashes in the string.

## Whitespace in Expressions and Statements

*   Avoid extraneous whitespace immediately inside parentheses, brackets or braces, and immediately before a comma, semicolon, or colon.
*   Always surround binary operators with a single space on either side.

## Comments

*   **Block Comments:** Generally apply to some (or all) code that follows them, and are indented to the same level as that code.
*   **Inline Comments:** Should be used sparingly and separated by at least two spaces from the statement.

## Docstrings

Write docstrings for all public modules, functions, classes, and methods. The conventions for writing good docstrings are the subject of **[PEP 257](https://peps.python.org/pep-0257/)**. The docstring should be a short phrase ending in a period, prescribing the function's effect as a command (e.g., "Do this," "Return that").

## Naming Conventions

*   **Modules:** Short, all-lowercase names. Underscores can be used if it improves readability.
*   **Classes:** `CapWords` convention.
*   **Functions and Variables:** `lowercase_with_underscores`.
*   **Constants:** `ALL_CAPS_WITH_UNDERSCORES`.

## Annotations

The style for function annotations is detailed in **[PEP 3107](https://peps.python.org/pep-3107/)**. The introduction of type hints is covered in **[PEP 484](https://peps.python.org/pep-0484/)**, and the syntax for variable annotations is defined in **[PEP 526](https://peps.python.org/pep-0526/)**. The general rule is to use the same formatting for annotations as for other parts of the code.

## Programming Recommendations

*   Comparisons to singletons like `None` should always be done with `is` or `is not`.
*   Use `isinstance()` to check an object's type.
*   Derive exceptions from `Exception` rather than `BaseException`.
*   When catching exceptions, mention specific exceptions whenever possible.

---

## Reference Appendix

### Direct References in PEP 8

These PEPs are explicitly mentioned in the text of PEP 8 and provide essential context for its guidelines.

*   **[PEP 7](https://peps.python.org/pep-0007/) - Style Guide for C Code:**
    *   **Relation:** PEP 8 was inspired by PEP 7, which provides style guidelines for the C code that implements the Python interpreter.
    *   **Mentioned in:** The "Introduction" section of PEP 8.
*   **[PEP 20](https://peps.python.org/pep-0020/) - The Zen of Python:**
    *   **Relation:** Provides the philosophical foundation for Python's design, emphasizing readability and simplicity, which are the core principles of PEP 8.
    *   **Mentioned in:** The "A Foolish Consistency is the Hobgoblin of Little Minds" section of PEP 8.
*   **[PEP 257](https://peps.python.org/pep-0257/) - Docstring Conventions:**
    *   **Relation:** The official guide for writing clear and consistent docstrings. PEP 8 defers to PEP 257 for all docstring conventions.
    *   **Mentioned in:** The "Docstrings" section of PEP 8.
*   **[PEP 3107](https://peps.python.org/pep-3107/) - Function Annotations:**
    *   **Relation:** Defines the syntax for function annotations, which are used for type hints. PEP 8 provides style guidelines for these annotations.
    *   **Mentioned in:** The "Function Annotations" section of PEP 8.
*   **[PEP 484](https://peps.python.org/pep-0484/) - Type Hints:**
    *   **Relation:** Introduces a standardized way to add type hints to Python code. PEP 8 provides style guidelines for the use of type hints.
    *   **Mentioned in:** The "Function Annotations" section of PEP 8.
*   **[PEP 526](https://peps.python.org/pep-0526/) - Syntax for Variable Annotations:**
    *   **Relation:** Defines the syntax for adding type hints to variables. PEP 8 provides style guidelines for these annotations.
    *   **Mentioned in:** The "Function Annotations" section of PEP 8.

### Indirect & Related References

These PEPs are not directly mentioned in the text of PEP 8, but they are highly relevant to its principles and are often referenced in discussions about Python style and best practices.

*   **[PEP 5](https://peps.python.org/pep-0005/) - Guidelines for Language Evolution:**
    *   **Relation:** While not directly cited, PEP 5 provides the guidelines for how new features are introduced into Python. Understanding this process is helpful for appreciating how style conventions evolve with the language.
*   **[PEP 287](https://peps.python.org/pep-0287/) - reStructuredText Docstring Format:**
    *   **Relation:** While PEP 257 defines the basic conventions for docstrings, PEP 287 specifies a standard format for more complex docstrings, which is widely used in the Python community.