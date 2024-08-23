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
    .option('-d, --debug', 'Debug mode')
    .option('-c, --create', 'Create missing test files');
program.parse(process.argv);
const options = program.opts();
// Instantiate the logger if debug was passed
const logger = new Logger(options.debug);

const srcDir = options.srcFile;
const testsDir = options.testsFile;

// Ensure both files exist
logger.log(`Checking for test files in ${testsDir} and source files in ${srcDir}`)
if (!fs.existsSync(srcDir)) {
    console.error(`Source directory does not exist: ${srcDir}`);
    process.exit(1);
}
if (!fs.existsSync(testsDir)) {
    console.error(`Tests directory does not exist: ${testsDir}`);
    process.exit(1);
}


function getSrcFilesList(srcDir: string): Array<string> {
    // For each directory, get the files in that directory, for any directories, call this function recursively
    const files = fs.readdirSync(srcDir);
    const srcFiles: Array<string> = [];

    for (const file of files) {
        const fullPath = `${srcDir}/${file}`;
        // Put the path into our array
        srcFiles.push(fullPath);
        // If it's a directory, call this function recursively
        if (fs.statSync(fullPath).isDirectory()) {
            srcFiles.push(...getSrcFilesList(fullPath));
        }
    }

    const filteredFiles = srcFiles.filter((file) => file.endsWith('.ts'));
    return filteredFiles.sort();
}

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

logger.log('Getting src files list');
const srcFiles = getSrcFilesList(srcDir);
logger.log(`Found ${srcFiles.length} source files`);

logger.log('Getting tests files list');
const testFiles = getTestFiles(testsDir);
logger.log(`Found ${testFiles.length} test files`);

console.log('srcFiles:', srcFiles);
console.log('testFiles:', testFiles);

const results: Record<string, null | string> = {};

// Using the srcFiles as our left join, loop through and discern if there is a test file for each src file
for (const srcFile of srcFiles) {
    // Reconstruct the path to the test file. 
    // Remove the srcDir from the srcFile path, replace it with the testDir, and replace the .ts with .test.ts
    const searchTarget = srcFile.replace(srcDir, testsDir).replace('.ts', '.test.ts');
    // Check if the test file exists
    if (testFiles.includes(searchTarget)) {
        results[srcFile] = searchTarget;
    } else {
        results[srcFile] = null;
    }
}

console.log('Results:', results);

// If the create flag was passed, create any missing test files
function createTestFilesForMissingResults(results: Record<string, null | string>) {
    for (const [srcFile, testFile] of Object.entries(results)) {
        if (testFile === null) {
            const newTestFile = srcFile.replace(srcDir, testsDir).replace('.ts', '.test.ts');
            fs.writeFileSync(newTestFile, '');
            logger.log(`Created new test file: ${newTestFile}`);
        }
    }
}
if (options.create) {
    createTestFilesForMissingResults(results);
}

// Summarize the Results
const missingTests = Object.entries(results).filter(([_, testFile]) => testFile === null);
const missingTestsCount = missingTests.length;
const totalFiles = srcFiles.length;
const testCoverage = (totalFiles - missingTestsCount) / totalFiles * 100;
console.log("")
console.log(`Total Files: ${totalFiles}`);
console.log(`Missing Tests: ${missingTestsCount}`);
console.log(`Test Coverage: ${testCoverage.toFixed(2)}%`);
console.log("")
console.log("")
console.log("If you'd like to automatically create the test files for any NULL results, run the same command with -c or --create flag")
console.log("")
