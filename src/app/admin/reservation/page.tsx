"use client";

import { useState, useRef, useEffect } from "react";
import type { NextPage } from "next";

// --- 데이터 타입 및 초기 데이터 정의 ---
interface Reservation {
    id: number;
    name: string;
    phone: string;
}

interface Booth {
    id: number;
    name: string;
    slots: Reservation[][] ;
}

const DATES = ["2025-11-22", "2025-11-23"];
const MAX_SPOTS_PER_SLOT = 12;

const generateFakeReservations = (count: number): Reservation[] => {
    if (count > MAX_SPOTS_PER_SLOT) count = MAX_SPOTS_PER_SLOT;
    if (count === 0) return [];
    const reservations: Reservation[] = [];
    const firstNames = ["민준", "서준", "도윤", "예준", "시우", "하준", "지호", "주원", "서연", "서윤", "지우", "서현", "하윤", "민서", "지유"];
    const lastNames = ["김", "이", "박", "최", "정"];

    for (let i = 1; i <= count; i++) {
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        reservations.push({
            id: i,
            name: `${lastName}${firstName}`,
            phone: `010-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`,
        });
    }
    return reservations;
};

const initialReservations: Record<string, Booth[]> = {
    "2025-11-22": [
        { id: 1, name: "에어로켓 만들기", slots: [generateFakeReservations(12), generateFakeReservations(5), [], generateFakeReservations(8), generateFakeReservations(3), generateFakeReservations(4)] },
        { id: 2, name: "누리호 3D 입체모형 만들기", slots: [generateFakeReservations(10), [], generateFakeReservations(2), generateFakeReservations(1), generateFakeReservations(3), generateFakeReservations(2)] },
        { id: 3, name: "지구와 달의 운동모형 만들기", slots: [generateFakeReservations(8), generateFakeReservations(8), generateFakeReservations(4), [], generateFakeReservations(2), generateFakeReservations(3)] },
        { id: 4, name: "누리호 종이 로켓 만들기", slots: [generateFakeReservations(12), generateFakeReservations(12), generateFakeReservations(10), generateFakeReservations(5), generateFakeReservations(3), generateFakeReservations(4)] },
        { id: 5, name: "발포정 누리호 로켓 만들기", slots: [[], generateFakeReservations(6), generateFakeReservations(6), generateFakeReservations(2), generateFakeReservations(5), generateFakeReservations(6)] },
    ],
    "2025-11-23": [
        { id: 1, name: "에어로켓 만들기", slots: [generateFakeReservations(10), generateFakeReservations(10), generateFakeReservations(8), generateFakeReservations(8), generateFakeReservations(5), generateFakeReservations(5)] },
        { id: 2, name: "누리호 3D 입체모형 만들기", slots: [generateFakeReservations(8), generateFakeReservations(8), generateFakeReservations(8), [], [], []] },
        { id: 3, name: "지구와 달의 운동모형 만들기", slots: [generateFakeReservations(12), generateFakeReservations(12), generateFakeReservations(10), generateFakeReservations(5), generateFakeReservations(5), generateFakeReservations(2)] },
        { id: 4, name: "누리호 종이 로켓 만들기", slots: [generateFakeReservations(12), generateFakeReservations(12), generateFakeReservations(12), generateFakeReservations(12), generateFakeReservations(12), generateFakeReservations(12)] },
        { id: 5, name: "발포정 누리호 로켓 만들기", slots: [generateFakeReservations(10), generateFakeReservations(8), generateFakeReservations(6), generateFakeReservations(4), generateFakeReservations(2), []] },
    ],
};

const timeSlots = ["1회차\n(10:00-10:45)", "2회차\n(11:00-11:45)", "3회차\n(13:00-13:45)", "4회차\n(14:00-14:45)", "5회차\n(15:00-15:45)", "6회차\n(16:00-16:45)"];

// --- Page Component ---
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
        <div>
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
                    각 칸은 예약된 인원 수를 의미하며, {MAX_SPOTS_PER_SLOT}명이면 마감으로 표기됩니다.
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
                                    const isFull = spots.length >= MAX_SPOTS_PER_SLOT;
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




        </div>
            <dialog
                ref={dialogRef}
                onClose={closeModal}
                className="m-auto bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative backdrop:bg-black/50 backdrop:backdrop-blur-sm"
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
