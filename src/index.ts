#!/usr/bin/env node

import { Command } from 'commander';
import { Logger } from './utils/logger';
import packageJSON from '../package.json';
import fs from 'node:fs';
import { getSrcFilesList } from './utils/parsers/getSrcFilestList';
import { getTestFiles } from './utils/parsers/getTestFilesList';
import { createTestFilesForMissingResults } from './utils/createTestFilesForMissingResults';


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

export const logger = new Logger(options.debug);
export const srcDir = options.srcFile;
export const testsDir = options.testsFile;

// Ensure both files exist
logger.log(`Checking for test files in ${testsDir} and source files in ${srcDir}`)
if (!fs.existsSync(srcDir)) {
    console.error(`Source directory does not exist: ${srcDir}`);
    process.exit(1);
}
if (!fs.existsSync(testsDir)) {
    if (options.create) {
        fs.mkdirSync(testsDir, { recursive: true });
        logger.log(`Did not find ${testsDir}, creating it now`);
    } else {
        console.error(`Tests directory does not exist: ${testsDir}`);
        process.exit(1);
    }
}

logger.log('Getting src files list');
const srcFiles = getSrcFilesList(srcDir);
console.log(`Found ${srcFiles.length} source file(s)`);
logger.log('srcFiles:', srcFiles);

logger.log('Getting tests files list');
const testFiles = getTestFiles(testsDir);
console.log(`Found ${testFiles.length} test file(s)`);
logger.log('testFiles:', testFiles);

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

console.log('Results Flat Map:', results);

if (options.create) {
    createTestFilesForMissingResults(results);
}

// Summarize the Results
const missingTests = Object.entries(results).filter(([_, testFile]) => testFile === null);
const missingTestsCount = missingTests.length;
const totalFiles = srcFiles.length;
const testCoverage = (totalFiles - missingTestsCount) / totalFiles * 100;

console.log("")
console.log(`Total Source Files: ${totalFiles}`);
console.log(`Source Files Missing Test File: ${missingTestsCount}`);
console.log(`File Coverage: ${testCoverage.toFixed(2)}%`);
console.log("")

if (missingTestsCount > 0 && !options.create) {
    const logMsg = [
        'If you\'d like to automatically create the test files for any',
        "NULL results, run the same command with -c or--create flag",
        '   Example: npx missing-tests -s ./src -t ./tests -c.',
        "",
        "Or you can use this output to manually create the test files."
    ]
    console.log(logMsg.join('\n'));
}
console.log("")
