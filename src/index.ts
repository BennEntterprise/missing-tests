#!/usr/bin/env node

import { Command } from 'commander';
import { Logger } from './utils/logger';
import packageJSON from '../package.json';
import fs from 'node:fs';
import { getSrcFilesList } from './utils/parsers/getSrcFilestList';
import { getTestFiles } from './utils/parsers/getTestFilesList';
import { createTestFilesForMissingResults } from './utils/createTestFilesForMissingResults';
import { printSummary } from './utils/printers/printSummary';
import { ensureSuppliedDirectoriesExist } from './utils/validators/ensureSuppliedDirectoriesExist';

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
const opts = program.opts();

export const options = {
    srcDir: opts.srcFile,
    testsDir: opts.testsFile,
    debug: opts.debug,
    create: opts.create
};

export const logger = Logger.getInstance(options.debug);

export const srcDir = opts.srcFile;
export const testsDir = opts.testsFile;

ensureSuppliedDirectoriesExist();


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

printSummary(totalFiles, missingTestsCount, testCoverage.toFixed(2), options.create);
