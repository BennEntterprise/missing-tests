import fs from 'node:fs'
import { logger, srcDir, testsDir } from '../index';
// If the create flag was passed, create any missing test files
function createTestFilesForMissingResults(results: Record<string, null | string>) {
    for (const [srcFile, testFile] of Object.entries(results)) {
        if (testFile === null) {
            const newTestFile = srcFile.replace(srcDir, testsDir).replace('.ts', '.test.ts');
            // Ensure that the required directories exist, if they don't already, then create the required nesting.
            const newTestDir = newTestFile.split('/').slice(0, -1).join('/');
            if (!fs.existsSync(newTestDir)) {
                fs.mkdirSync(newTestDir, { recursive: true });
                logger.log(`Did not find ${newTestDir}, creating it now`);
            } else {
                logger.log(`Found: ${newTestDir}, no need to create it`);
            }
            fs.writeFileSync(newTestFile, '');
            logger.log(`Created new test file: ${newTestFile}`);
        }
    }
}

export { createTestFilesForMissingResults };