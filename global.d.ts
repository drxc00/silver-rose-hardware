// This file is for extending types for any modules
// Make sure to add a reference to this file in tsconfig.json

import '@tanstack/react-table';

declare module '@tanstack/react-table' {
    interface FilterFns {
        includeSubcategories?: FilterFn<CategoryTree> | undefined | null
    }
}