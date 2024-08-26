import fs from 'node:fs'
import { Logger } from '../logger';

const logger = Logger.getInstance();

/**
 * @description Given a tests directory, return a list of all the .ts files in the directory and its subdirectories
 * @param string testsDir 
 * @returns Array<string> - a list of all the .ts files in the directory and its subdirectories
 */
function getTestFilesList(testsDir: string): string[] {
    logger.log('Getting tests files list');

    // For each directory, get the files in that directory, for any directories, call this function recursively
    const files = fs.readdirSync(testsDir);
    const testFiles: string[] = [];

    for (const file of files) {
        const fullPath = `${testsDir}/${file}`;
        // Put the path into our array
        testFiles.push(fullPath);
        // If it's a directory, call this function recursively
        if (fs.statSync(fullPath).isDirectory()) {
            testFiles.push(...getTestFilesList(fullPath));
        }
    }

    const filteredFiles = testFiles.filter((file) => file.endsWith('.ts'));
    const sortedFiles = filteredFiles.slice().sort();

    console.log(`Found ${testFiles.length} test file(s)`);
    logger.log('testFiles:', testFiles);

    return sortedFiles;
}
export { getTestFilesList };