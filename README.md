# Missing Tests

This package helps to identify typescript modules that are missing unit tests. The philosophy of this package is that EVERY module should have a corresponding tests file, even if it's only to measure the line count. 

## Installation

First install the package `npm i -g missing-tests`.

## Usage

To call the utility you can run: 

`missing-commits SRC_MODULE  TEST_MODULE`

If you omit the arguments for each module the utility will assume you mean ./src and ./tests/unit.

The utility will then comb each of these trees assuming they are intended to mirror each other. For instance, if you have a `./src/utils/index.ts` you should also have a `./tests/unit/utils/index.test.ts`. If you have a `./src/components/logger/index.ts` but no `./tests/uxnit/components/logger/index.test.ts` that should be reported.

### Suggested Use

After you have run the utility once to audit your files. If you agree with the output, instruct the utility to automatically create any files that are missing using the `--create-empty-tests` flag. This works best when you have a clean git working directory so that you can survey the files created.
