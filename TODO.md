
# TODO

This todo file represents items that should be addressed for this package. They are loosely in priority order, but it is not guaranteed

# Features

- if the test file doesn't exist ask the user if they would like it created, if not then exit.
- allow for additional testTemplates and implement using a GoF Strategy pattern?
- support "neighbor" test method search
- add chalk to color the output and make it more friendly
- add figlet header on the output

# Bugs

- turn logger into a singleton so it can be used everywhere and not need an export from index
- (template.jest.ts) it should have a skipped test so that it shows up on --verbose output
- (template.jest.ts) automatically reference the source code file (relative references were giving me a hard time today).

# Tests

- write tests for the source code of this repo right now "tests" just serves as a sample client directory to test the source code against, very meta 🤣
- (index.test.ts) index.ts should not have any exports as it is the main routine


# DONE

-  2024-08-23 - (template.jest.ts) it should have a skipped test so that it shows up on --verbose output