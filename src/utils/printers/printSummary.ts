import { OptionValueSource } from "commander";

export const printSummary = (totalFiles: number, missingTestsCount: number, testCoveragePct: string, isCreate: boolean) => {
    console.log("")
    console.log(`Total Source Files: ${totalFiles}`);
    console.log(`Source Files Missing Test File: ${missingTestsCount}`);
    console.log(`File Coverage: ${testCoveragePct}%`);
    console.log("")

    if (missingTestsCount > 0 && !isCreate) {
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