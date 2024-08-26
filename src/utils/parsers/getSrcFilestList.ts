import fs from 'node:fs'
import { Logger } from '../logger';

const logger = Logger.getInstance()

/**
 * @function getSrcFilesList
 * @description Given a src directory, return a list of all the .ts files in the directory and its subdirectories
 * @param srcDir - string - the directory to search for .ts files
 * @returns Array<string> - a list of all the .ts files in the directory and its subdirectories
 */
function getSrcFilesList(srcDir: string): Array<string> {
    logger.log('Getting src files list');

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
    const sortedFiles = filteredFiles.slice().sort();

    console.log(`Found ${srcFiles.length} source file(s)`);
    logger.log('srcFiles:', srcFiles);

    return sortedFiles;
}
export { getSrcFilesList };