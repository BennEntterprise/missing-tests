#!/usr/bin/env node

import { Command } from 'commander';
import { Logger } from './logger';
import packageJSON from '../package.json';
import fs from 'node:fs';


// Command Setup
const program = new Command();
program
    .version(packageJSON.version)
    .description('A simple CLI tool for figuring out if you have test files for each ts module in your project')
    .option('-s, --srcFile <srcFile>', 'Source file path', './src')
    .option('-t, --testsFile <testsFile>', 'Tests file path', './tests')
    .option('-d, --debug', 'Debug mode', true);
program.parse(process.argv);
const options = program.opts();
// Instantiate the logger if debug was passed
const logger = new Logger(options.debug);

console.log('Passed options:', options);

const srcDir = options.srcFile;
const testsDir = options.testsFile;

// Walk the src directory, and find all of it's .ts files, putting each as a key in an object with a value of null.
// The key should contain the entire filepath starting from the root of the passed object
// Example:
// {
//     'src/index.ts': null,
//     'src/logger.ts': null,
//     'src/utils.ts': null,
// }
// The keys should be sorted alphabetically
// Return the object
function getSrcFiles(srcDir: string): Record<string, string | null> {
    // For each directory, get the files in that directory, for any directories, call this function recursively
    const files = fs.readdirSync(srcDir);
    const srcFiles: Record<string, null> = {};
    for (const file of files) {
        const fullPath = `${srcDir}/${file}`;
        // Put the path into our object
        srcFiles[fullPath] = null;
        // If it's a directory, call this function recursively
        if (fs.statSync(fullPath).isDirectory()) {
            Object.assign(srcFiles, getSrcFiles(fullPath));
        }
    }
    return srcFiles;
}

// Echo the object returned from getSrcFiles
logger.log('Found Source Files', getSrcFiles(srcDir));

// Walk the tests directory, and find all of it's .ts files, putting each in an array
// The array should be sorted alphabetically
// Return the array
function getTestFiles(testsDir: string): string[] {
    // For each directory, get the files in that directory, for any directories, call this function recursively
    const files = fs.readdirSync(testsDir);
    const testFiles: string[] = [];
    for (const file of files) {
        const fullPath = `${testsDir}/${file}`;
        // Put the path into our array
        testFiles.push(fullPath);
        // If it's a directory, call this function recursively
        if (fs.statSync(fullPath).isDirectory()) {
            testFiles.push(...getTestFiles(fullPath));
        }
    }

    const filteredFiles = testFiles.filter((file) => file.endsWith('.ts'));
    return filteredFiles.sort();
}

// Echo the array returned from getTestFiles
logger.log('Found Test Files', getTestFiles(testsDir));

// Compare the object from getSrcFiles with the array from getTestFiles
// For each key in the object, check if there is a corresponding test file in the array
// If there is, set the value of the key to the path of the test file
// If there isn't, set the value of the key to null
// example: 
// src/index.ts -> tests/src/index.test.ts is a MATCH
// src/logger.ts -> tests/src/logger.test.ts is a MATCH
// src/utils.ts -> NO TEST FILE FOUND is not a match
// Return the object
function compareSrcAndTestFiles(srcFiles: Record<string, string | null>, testFiles: string[]): Record<string, string | null> {
    for (const srcFile in srcFiles) {
        const testFile = testFiles.find((file) => file === srcFile.replace('src', 'tests').replace('.ts', '.test.ts'));
        srcFiles[srcFile] = testFile || 'NO TEST FILE FOUND';
    }
    return srcFiles;
}

// Combine the results of each scan into a single object using the equivalent of left join src files test files
// Return the object
const results = Object.assign({}, getSrcFiles(srcDir));
const tests = getTestFiles(testsDir);
for (const srcFile in results) {

    // Take the existing file, replace the first character "." with "./tests/" and replace the last ".ts" with ".test.ts", this forms the basis of our target match
    const target = srcFile.replace('./', './tests/').replace('.ts', '.test.ts');
    console.log('Looking for Target:', target);
    // Find this target in the test files array
    if (tests.includes(target)) {
        results[srcFile] = target;
    } else {
        results[srcFile] = 'NO TEST FILE FOUND';
    }
}

console.log('results', results)


