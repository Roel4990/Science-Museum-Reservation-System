import {ApiResult, fail, ok} from "@/lib/api/types";

export const deleteReservation = async (reservationId: number): Promise<ApiResult<void>> => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!apiUrl) {
            return fail("API URL is not configured.");
        }
        const url = `${apiUrl}/api/v1/admin/reservations/${reservationId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to delete reservation' }));
            return fail(errorData.message || 'Unknown error occurred');
        }

        return ok(undefined);
    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }
        return fail("An unknown error occurred.");
    }
};