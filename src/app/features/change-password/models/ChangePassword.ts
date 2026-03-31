export interface ChangePasswordRequest {
    userid: number;
    userName: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}
