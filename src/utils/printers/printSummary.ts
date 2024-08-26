import type { ResultsType } from "../parsers/auditFilesLists";
import { options } from "../../index";

export const printSummary = (results: ResultsType) => {
    const totalFiles = Object.keys(results).length;
    const missingTests = Object.entries(results).filter(([_, testFile]) => testFile === null);
    const missingTestsCount = missingTests.length;
    const testCoverage: number = (totalFiles - missingTestsCount) / totalFiles * 100;
    const testCoveragePct: string = testCoverage.toFixed(2);

    console.log("")
    console.log(`Total Source Files: ${totalFiles}`);
    console.log(`Source Files Missing Test File: ${missingTestsCount}`);
    console.log(`File Coverage: ${testCoveragePct}%`);
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
}