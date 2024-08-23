#!/usr/bin/env node

import { Command } from 'commander';
import { Logger } from './logger';
import packageJSON from '../package.json';

const program = new Command();

program
    .version(packageJSON.version)
    .description('A simple CLI tool for figuring out if you have test files for each ts module in your project')
    // Add the optional args for srcFile and testsFile, with defaults `./src` and `./tests` respectively
    // Add an optional --debug flag which is responsible for selectively enabling the logger
    .option('-s, --srcFile <srcFile>', 'Source file path', './src')
    .option('-t, --testsFile <testsFile>', 'Tests file path', './tests')
    .option('-d, --debug', 'Debug mode');

program.parse(process.argv);

const options = program.opts();

// Instantiate the logger if debug was passed
const logger = new Logger(options.debug);

logger.log('Options:', options);