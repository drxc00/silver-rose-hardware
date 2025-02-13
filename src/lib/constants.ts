
export const UserRole = {
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER"
} as const;
// For typescript
export type UserRole = typeof UserRole[keyof typeof UserRole];