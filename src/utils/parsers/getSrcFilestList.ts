import fs from 'node:fs'

function getSrcFilesList(srcDir: string): Array<string> {
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
    return filteredFiles.sort();
}
export { getSrcFilesList };