import type {CreateReservationPayload, CreateReservationResult} from "@/types/reservation";
import {ApiResult, fail, ok} from "./types";

export const createReservation = async (payload: CreateReservationPayload): Promise<ApiResult<CreateReservationResult>> => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!apiUrl) {
            return fail("API URL is not configured.");
        }
        const url = `${apiUrl}/api/v1/admin/reservations`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to create reservation' }));
            return fail(errorData.message || 'Unknown error occurred');
        }

        const data = await response.json();
        return ok(data);
    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }
        return fail("An unknown error occurred.");
    }
};
