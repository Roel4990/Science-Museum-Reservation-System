"use client";

import { useState } from "react";
import type { NextPage } from "next";

// --- 데이터 타입 및 초기 데이터 정의 ---
interface Booth {
  id: number;
  name: string;
  slots: number[];
}

const DATES = ["2025-11-22", "2025-11-23"];

// 날짜별 초기 부스 데이터
const initialReservations: Record<string, Booth[]> = {
  "2025-11-22": [
    { id: 1, name: "에어로켓 만들기", slots: [12, 5, 0, 8, 3, 4] },
    { id: 2, name: "누리호 3D 입체모형 만들기", slots: [10, 0, 2, 1, 3, 2] },
    { id: 3, name: "지구와 달의 운동모형 만들기", slots: [8, 8, 4, 0, 2, 3] },
    { id: 4, name: "누리호 종이 로켓 만들기", slots: [15, 12, 10, 5, 3, 4] },
    { id: 5, name: "발포정 누리호 로켓 만들기", slots: [0, 6, 6, 2, 5, 6] },
  ],
  "2025-11-23": [
    { id: 1, name: "에어로켓 만들기", slots: [10, 10, 8, 8, 5, 5] },
    { id: 2, name: "누리호 3D 입체모형 만들기", slots: [8, 8, 8, 0, 0, 0] },
    { id: 3, name: "지구와 달의 운동모형 만들기", slots: [12, 12, 10, 5, 5, 2] },
    { id: 4, name: "누리호 종이 로켓 만들기", slots: [15, 15, 15, 15, 15, 15] },
    { id: 5, name: "발포정 누리호 로켓 만들기", slots: [10, 8, 6, 4, 2, 0] },
  ],
};

const timeSlots = ["1회차 (10:00-10:45)", "2회차 (11:00-11:45)", "3회차 (13:00-13:45)", "4회차 (14:00-14:45)", "5회차 (15:00-15:45)", "6회차 (16:00-16:45)"];

// --- 컴포넌트 ---
const Home: NextPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(DATES[0]);
  const [reservations, setReservations] = useState(initialReservations);

  const currentBooths = reservations[selectedDate];

  const handleReservation = (boothIndex: number, slotIndex: number) => {
    const selectedBooth = currentBooths[boothIndex];
    const selectedSlotSpots = selectedBooth.slots[slotIndex];

    if (selectedSlotSpots === 0) {
      alert("해당 시간대는 마감되었습니다.");
      return;
    }

    const confirmation = window.confirm(
      `'${selectedBooth.name}' 부스, ${timeSlots[slotIndex]}으로 예약하시겠습니까?`
    );

    if (confirmation) {
      const newBoothsForDate = currentBooths.map((booth, bIndex) => {
        if (bIndex === boothIndex) {
          const newSlots = booth.slots.map((spots, sIndex) => 
            sIndex === slotIndex ? spots - 1 : spots
          );
          return { ...booth, slots: newSlots };
        }
        return booth;
      });

      setReservations(prev => ({
        ...prev,
        [selectedDate]: newBoothsForDate,
      }));
      alert("예약이 완료되었습니다!");
    }
  };

  const handleRefresh = () => {
    if (window.confirm("현재 날짜의 예약 현황을 초기화하시겠습니까?")) {
      setReservations(prev => ({
        ...prev,
        [selectedDate]: initialReservations[selectedDate],
      }));
      alert("예약 현황이 초기화되었습니다.");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>예약현황</h1>
        <div className="controls-container">
          <div className="date-selectors">
            {DATES.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`date-selector ${selectedDate === date ? 'selected' : ''}`}
              >
                {date}
              </button>
            ))}
          </div>
          <button onClick={handleRefresh} className="refresh-button">
            새로고침
          </button>
          <p className="table-description">
            각 칸은 남은 인원 수를 의미하며, 0명이면 마감으로 표기됩니다.
          </p>
        </div>
      </header>
      <main>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>부스명</th>
                {timeSlots.map((time, index) => (
                  <th key={index}>{time}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentBooths.map((booth, boothIndex) => (
                <tr key={booth.id}>
                  <td>{booth.name}</td>
                  {booth.slots.map((spots, slotIndex) => (
                    <td
                      key={slotIndex}
                      onClick={() => handleReservation(boothIndex, slotIndex)}
                      className={spots > 0 ? "available" : "full"}
                    >
                      {spots > 0 ? `${spots}자리 남음` : "마감"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: var(--font-geist-sans);
          color: #333;
        }
        header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .controls-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        .date-selectors {
          display: flex;
          gap: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 4px;
        }
        .date-selector {
          padding: 0.5rem 1rem;
          border: none;
          background-color: transparent;
          cursor: pointer;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .date-selector.selected {
          background-color: #495057;
          color: white;
        }
        .refresh-button {
          padding: 0.6rem 1.2rem;
          border: 1px solid #ddd;
          background-color: #f8f8f8;
          color: #555;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .refresh-button:hover {
          background-color: #eee;
        }
        .table-description {
          flex-basis: 100%;
          font-size: 0.9rem;
          color: #777;
          margin-top: 0.5rem;
        }
        .table-container { overflow-x: auto; }
        table {
          width: 100%;
          border-collapse: collapse;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        th, td {
          padding: 1rem 1.25rem;
          text-align: center;
          border-bottom: 1px solid #eaeaea;
          white-space: nowrap;
        }
        th {
          background-color: #f9fafb;
          font-weight: 500;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        tr:last-child td { border-bottom: none; }
        td:first-child, th:first-child {
          text-align: left;
          font-weight: 500;
        }
        .available {
          background-color: #f0fff4;
          color: #2f855a;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }
        .available:hover { background-color: #c6f6d5; }
        .full {
          background-color: #fef2f2;
          color: #9b2c2c;
          font-weight: 500;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Home;
