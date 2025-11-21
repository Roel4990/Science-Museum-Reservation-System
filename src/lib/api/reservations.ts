import type { reservationsResponse } from "@/types/reservation";
import {ApiResult, fail, ok} from "./types";

export const getReservations = async (): Promise<ApiResult<reservationsResponse>> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
        const res = await fetch(`${apiUrl}/api/v1/reservations/summary`);
        if (!res.ok) {
            const errorText = await res.text().catch(() => "Could not retrieve error text.");
            return fail(`Network response was not ok: ${errorText}`);
        }
        const apiResponse = await res.json();
        if (apiResponse.data) {
            return ok(apiResponse.data);
        }
        return fail("API response did not contain data.");
    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }
        return fail("An unknown error occurred.");
    }
};
