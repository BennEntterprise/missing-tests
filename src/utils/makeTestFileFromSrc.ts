import fs from 'fs';

function makeTestFileFromSrc(srcDir: string): string {
  let testDir = srcDir;
  testDir.replace('src', 'test').replace('.ts', '.test.ts');
  return testDir;
}

export { makeTestFileFromSrc };