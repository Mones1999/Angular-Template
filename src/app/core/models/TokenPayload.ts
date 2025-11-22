export interface TokenPayload {
    privileges: string[];
    isNeedChangePassword: boolean;
    firstLogin: boolean;
    enableCopyPasteInWeb: boolean;
    groupId: number;
    name: string;
    sessionId: string;
    showChangePasswordReminder: boolean;
    userId: number;
    isTwoFactorAuthApplied: boolean;
    exp?: number;
}