import type {ReservationDetailResponse, Slot} from "@/types/reservation";
import {ApiResult, fail, ok} from "./types";

export const getReservationDetail = async (date: string, booth: string, round: number): Promise<ApiResult<Slot[]>> => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!apiUrl) {
            return fail("API URL is not configured.");
        }

        const url = new URL(`${apiUrl}/api/v1/admin/reservations/detail`);
        url.searchParams.append("date", date);
        url.searchParams.append("booth", booth);
        url.searchParams.append("round", String(round));

        const response = await fetch(url.toString());

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Could not retrieve error text.");
            return fail(`Network response was not ok: ${errorText}`);
        }

        const apiResponse: { data: ReservationDetailResponse } = await response.json();

        if (apiResponse.data && apiResponse.data.slots) {
            const slots = apiResponse.data.slots.map(slot => ({
                slotNo: slot.slotNo,
                reservationId: slot.reservationId,
                name: slot.name,
                phone: slot.phone,
            }));
            return ok(slots);
        }
        return fail("API response did not contain valid slot data.");

    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }
        return fail("An unknown error occurred.");
    }
};
