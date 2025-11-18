"use client";

import { useState, useRef, useEffect } from "react";
import type { NextPage } from "next";
import type { Reservation } from "@/app/type";
import { DATES, MAX_PARTICIPANTS, TIMESLOTS } from "@/app/type";
import { initialReservations } from "@/app/data";

const timeSlots = TIMESLOTS.map(t => t.replace(' (', '\n('));

const Home: NextPage = () => {
    const [selectedDate, setSelectedDate] = useState<string>(DATES[0]);
    const [reservations, setReservations] = useState(initialReservations);
    const [modalData, setModalData] = useState<{ boothName: string; time: string; reservations: Reservation[] } | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const currentBooths = reservations[selectedDate];

    useEffect(() => {
        const dialog = dialogRef.current;
        if (modalData) {
            dialog?.showModal();
        } else {
            dialog?.close();
        }
    }, [modalData]);

    const handleRefresh = () => {
        if (window.confirm("현재 날짜의 예약 현황을 초기화하시겠습니까?")) {
            setReservations(prev => ({
                ...prev,
                [selectedDate]: initialReservations[selectedDate],
            }));
            alert("예약 현황이 초기화되었습니다.");
        }
    };

    const handleSlotClick = (boothName: string, time: string, reservations: Reservation[]) => {
        if (reservations.length > 0) {
            setModalData({ boothName, time, reservations });
        }
    };

    const closeModal = () => {
        setModalData(null);
    };

    return (
        <div className="container mx-auto p-4 sm:p-8 font-sans text-gray-800">
            <header className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">예약 현황</h1>
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
                    <button onClick={handleRefresh} className="px-4 py-2 text-sm sm:text-base bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        새로고침
                    </button>
                </div>
                <p className="w-full text-center text-gray-600 text-sm">
                    각 칸은 예약된 인원 수를 의미하며, {MAX_PARTICIPANTS}명이면 마감으로 표기됩니다.
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
                            <tr key={booth.id} className="border-b border-gray-200 last:border-b-0">
                                <td className="p-4 font-medium text-gray-800">{booth.name}</td>
                                {booth.slots.map((spots, slotIndex) => {
                                    const isFull = spots.length >= MAX_PARTICIPANTS;
                                    const hasReservations = spots.length > 0;
                                    return (
                                        <td
                                            key={slotIndex}
                                            className={`p-4 text-center font-semibold ${isFull ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"} ${hasReservations ? "cursor-pointer hover:bg-gray-200 transition-colors duration-200" : ""}`}
                                            onClick={() => handleSlotClick(booth.name, timeSlots[slotIndex], spots)}
                                        >
                                            {spots.length}명
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <dialog
                ref={dialogRef}
                onClose={closeModal}
                className="m-auto bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative backdrop:bg-black:backdrop-blur-sm"
            >
                {modalData && (
                    <>
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-4 text-3xl font-light text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-bold mb-2 text-gray-800">
                            {modalData.boothName}
                        </h2>
                        <h3 className="text-lg text-gray-600 mb-6">
                            {modalData.time.replace("\n", " ")} 예약자 명단
                        </h3>

                        <div className="max-h-[60vh] overflow-y-auto border-t border-gray-200">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-gray-100">
                                <tr>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-center w-16">
                                        No.
                                    </th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">
                                        이름
                                    </th>
                                    <th className="p-3 text-sm font-medium text-gray-600 text-left">
                                        연락처
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {modalData.reservations.map((res, index) => (
                                    <tr key={res.id} className="border-b border-gray-100 last:border-0">
                                        <td className="p-3 text-center text-gray-600">{index + 1}</td>
                                        <td className="p-3 text-gray-800">{res.name}</td>
                                        <td className="p-3 text-gray-800">{res.phone}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </dialog>
        </div>
    );
};

export default Home;
