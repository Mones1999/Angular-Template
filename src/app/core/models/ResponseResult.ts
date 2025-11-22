export interface ResponseResult<T = null> {
    statusCode: number;
    statusDescription: string;
    result?: T;
}