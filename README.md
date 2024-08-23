# Missing Tests (CURRENTLY ALPHA, LIKELY UNSTABLE)

Aiming for 100% code 

## Assumptions

This package is still beta and is taylored to fit my particular coding style. I'll likely expand it in the future but for now it operates on a few assumptions.

1. You are using a mirror, and not neighbor strategy for storing your test files.
2. You name your modules as `myModule.ts` and it's corresponding test as `myModule.test.ts` (of course stored in the mirrored path).
3. There are zero directories/files you want to exclude 

## Installation

First install the package `npm i -g missing-tests`.

## Usage

Call the CLI Help:

```
> npx missing-tests --help
Usage: missing-tests [options]

A simple CLI tool for figuring out if you have test files for each ts module in your project

Options:
  -V, --version                output the version number
  -s, --srcFile <srcFile>      Source file path (default: "./src")
  -t, --testsFile <testsFile>  Tests file path (default: "./tests")
  -d, --debug                  Debug mode
  -c, --create                 Create missing test files
  -h, --help                   display help for command
```

Call the utility using all defaults:

`> npx missing-tests`

Call the utility providing the src code and test code file which constitute either half of your mirror structure.

`npx missing-tests --srcFile path/to/src-code --testsFile path/to/test/directory` 

The utility will then comb each of these trees assuming they are intended to mirror each other. For instance, if you have a `./src/utils/index.ts` you should also have a `./tests/utils/index.test.ts`. If you have a `./src/components/logger/index.ts` but no test file, that will show up as NULL.

### Suggested Use

After you have run the utility once to audit your files. If you agree with the output, instruct the utility to automatically create any files that are missing using the `--create-empty-tests` flag. This works best when you have a clean git working directory so that you can survey the files created.
