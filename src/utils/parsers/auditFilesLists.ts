import { srcDir, testsDir } from '../../index';

export type ResultsType = {
    [key: string]: null | string;
}

export const auditFilesLists = (srcFiles: Array<string>, testFiles: Array<string>): ResultsType => {
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
    return results;
}