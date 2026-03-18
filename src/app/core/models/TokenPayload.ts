export interface TokenPayload {
    role: string;
    name: string;
    userId: number;
    exp?: number;
}