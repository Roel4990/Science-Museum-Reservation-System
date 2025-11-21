"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { TIMESLOTS, DATES, MAX_PARTICIPANTS } from "@/constants/reservation";
import { type reservationsResponse } from "@/types/reservation";
import {getReservations} from "@/lib/api/reservations";
import {ApiResult} from "@/lib/api/types";

const timeSlots = TIMESLOTS.map(t => t.replace(' (', '\n('));

async function fetchReservations() {
    const res: ApiResult<reservationsResponse> = await getReservations();
    if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to fetch reservations.');
    }
    return res.data;
}

const Home: NextPage = () => {
    const [selectedDate, setSelectedDate] = useState<string>(DATES[0]);

    const { data: reservations, isError, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['reservations'],
        queryFn: fetchReservations,
        refetchInterval: 3000
    });

    const currentBooths = reservations?.dateMap[selectedDate] || [];

    const handleRefresh = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">예약 현황을 불러오는 중입니다...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-8 font-sans text-gray-800">
            <header className="text-center mb-10">
                <h1 className="inline-block text-4xl sm:text-4xl font-bold text-white px-7 py-4 rounded-lg mb-15" style={{ backgroundColor: '#CD3332' }}>누리호 4차 발사 성공 기원 행사 체험부스 예약현황</h1>
                <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                    <div className="flex items-center border border-gray-300 rounded-lg p-1 bg-gray-50">
                        {DATES.map(date => (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md transition-colors duration-200 ${selectedDate === date ? 'bg-gray-800 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                {date}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                        disabled={isFetching}
                    >
                        새로고침
                    </button>
                </div>
                {isError && (
                    <p className="w-full text-center text-red-500 bg-red-50 py-2 rounded-lg mb-4">
                        서버 데이터를 불러오는 데 실패했습니다. 현재 표시되는 데이터는 실제와 다를 수 있습니다.
                    </p>
                )}
                <p className="w-full text-center text-gray-600 text-sm">
                    각 칸은 남은 인원 수를 의미하며, {12 - MAX_PARTICIPANTS}명이면 마감으로 표기됩니다.
                </p>
            </header>
            <main>
                <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 font-medium text-gray-700 uppercase text-sm text-left">부스명</th>
                                {timeSlots.map((time, index) => (
                                    <th key={index} className="p-4 font-medium text-gray-700 uppercase text-sm whitespace-pre-line">{time}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {currentBooths.map((booth) => (
                                <tr key={booth.boothType} className="border-b border-gray-200 last:border-b-0">
                                    <td className="p-4 font-medium text-gray-800">{booth.boothName}</td>
                                    {booth.rounds.map((round) => {
                                        const isFull = round.count >= MAX_PARTICIPANTS;
                                        const hasReservations = round.count > 0;
                                        return (
                                            <td
                                                key={round.roundNo}
                                                className={`p-4 text-center font-semibold ${isFull ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"} ${hasReservations ? "cursor-pointer hover:bg-gray-200 transition-colors duration-200" : ""}`}
                                            >
                                                {round.count < MAX_PARTICIPANTS ? `${MAX_PARTICIPANTS - round.count}자리` : "마감"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Home;
