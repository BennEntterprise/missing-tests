// This file contains a template for a jest test file. It is used to create test files for missing tests.
//

import fs from 'fs';
import { logger } from '../index'

export const jestTemplate = (relPath: string) => {
    return `
        import { describe, expect, test } from '@jest/globals';
        // import * as SUT from '${relPath}';

        describe('SYSTEM_UNDER_TEST', () => {
            test.skip('should do something', () => {
                expect('SYSTEM_UNDER_TEST').toBeDefined();
            });
        });
    `
};