#!/usr/bin/env node

import { Command } from 'commander';
import { Logger } from './utils/logger';
import packageJSON from '../package.json';
import fs from 'node:fs';
import { getSrcFilesList } from './utils/parsers/getSrcFilestList';
import { getTestFilesList } from './utils/parsers/getTestFilesList';
import { createTestFilesForMissingResults } from './utils/createTestFilesForMissingResults';
import { printSummary } from './utils/printers/printSummary';
import { ensureSuppliedDirectoriesExist } from './utils/validators/ensureSuppliedDirectoriesExist';
import { auditFilesLists } from './utils/parsers/auditFilesLists';

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

const srcFiles = getSrcFilesList(srcDir);
const testFiles = getTestFilesList(testsDir);
const results = auditFilesLists(srcFiles, testFiles)

if (options.create) {
    createTestFilesForMissingResults(results);
}

// Summarize the Results
const missingTests = Object.entries(results).filter(([_, testFile]) => testFile === null);
const missingTestsCount = missingTests.length;
const totalFiles = srcFiles.length;
const testCoverage = (totalFiles - missingTestsCount) / totalFiles * 100;

printSummary(totalFiles, missingTestsCount, testCoverage.toFixed(2), options.create);
