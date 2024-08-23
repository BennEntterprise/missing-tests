// This file contains the template for the jest test files that will be created if the create flag is passed
export const jestTemplate = `import {describe, it} from '@jest/globals';

describe('Test Suite', () => {
    it('should pass', () => {
        expect(true).toBe(true);
        });
        });
        `;