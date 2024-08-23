import fs from 'node:fs'
import { logger, srcDir, testsDir } from '../index';
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

export { createTestFilesForMissingResults };