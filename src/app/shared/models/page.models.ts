export interface PageRequestDto {
    first: number;
    rows: number;
    sortField?: string;
    sortOrder?: number;
    globalFilter?: string;
}

export interface PageResponse<T> {
    data: T[];
    totalRecords: number;
    page: number;
    size: number;
}
