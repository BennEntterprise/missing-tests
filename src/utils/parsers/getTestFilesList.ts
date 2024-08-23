import fs from 'node:fs'

// Walk the tests directory, and find all of it's .ts files, putting each in an array
// The array should be sorted alphabetically
// Return the array
function getTestFiles(testsDir: string): string[] {
    // For each directory, get the files in that directory, for any directories, call this function recursively
    const files = fs.readdirSync(testsDir);
    const testFiles: string[] = [];

    for (const file of files) {
        const fullPath = `${testsDir}/${file}`;
        // Put the path into our array
        testFiles.push(fullPath);
        // If it's a directory, call this function recursively
        if (fs.statSync(fullPath).isDirectory()) {
            testFiles.push(...getTestFiles(fullPath));
        }
    }

    const filteredFiles = testFiles.filter((file) => file.endsWith('.ts'));
    return filteredFiles.sort();
}
export { getTestFiles };