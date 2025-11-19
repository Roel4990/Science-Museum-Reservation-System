export type ApiResult<T> = {
    success: boolean;
    data: T | null;
    error: string | null;
};

export function ok<T>(data: T): ApiResult<T> {
    return { success: true, data, error: null };
}

export function fail<T = never>(message: string): ApiResult<T> {
    return { success: false, data: null, error: message };
}
