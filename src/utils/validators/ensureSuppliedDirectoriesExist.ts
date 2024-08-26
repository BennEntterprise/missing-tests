
import { options } from "../../index"
import { Logger } from '../logger'
import fs from 'fs';

const logger = Logger.getInstance();
/**
 * @description ensures that the directories supplied by the user exist, or will handle 
 * creation if the user has supplied the create flag in the CLI options
 * @returns void
 */
export const ensureSuppliedDirectoriesExist = () => {
    const { srcDir, testsDir } = options;
    console.log(srcDir, testsDir)
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
}