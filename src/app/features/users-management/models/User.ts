export interface User {
    userId: number;
    username: string;
    fullName: string;
}

export interface AddUserForm {
    username: string;
    fullName: string;
    password: string;
    confirmPassword: string;
}