"use client";

import { useState, useMemo, useEffect } from 'react';
import type { NextPage } from 'next';
import { 
  DATES, BOOTHS, TIMESLOTS, MAX_PARTICIPANTS,
  type ReservationDate, type BoothName, type TimeSlot, 
  type Participant, type FetchedParticipant 
} from '../type';

// --- API Simulation ---
const fetchParticipants = async (params: { date: ReservationDate; booth: BoothName; time: TimeSlot; }): Promise<FetchedParticipant[]> => {
  const { date, booth, time } = params;
  console.log(`서버에 예약자 정보 요청: ${date} / ${booth} / ${time}`);
  await new Promise(resolve => setTimeout(resolve, 250));

  if (date === "2025-11-22" && booth === "에어로켓 만들기" && time === "1회차 (10:00-10:45)") {
    return [
      { id: 1, name: "김민준", contact: "010-1111-2222" },
      { id: 5, name: "박서연", contact: "010-3333-4444" },
    ];
  }
  if (date === "2025-11-23" && booth === "누리호 3D 입체모형 만들기" && time === "3회차 (13:00-13:45)") {
    return [{ id: 3, name: "이도현", contact: "010-5555-6666" }];
  }
  return [];
};

const hasValidId = (p: Participant): p is Participant & { id: number } =>
    p.id !== null && p.id >= 1 && p.id <= MAX_PARTICIPANTS;

// --- Component ---
const AdminPage: NextPage = () => {
    const [selectedDate, setSelectedDate] = useState<ReservationDate | null>(null);
    const [selectedBooth, setSelectedBooth] = useState<BoothName | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
    const [reservations, setReservations] = useState<Record<string, Participant[]>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedDate && selectedBooth && selectedTimeSlot) {
            const key = `${selectedDate}-${selectedBooth}-${selectedTimeSlot}`;

            const loadParticipants = async () => {
                setIsLoading(true);
                const fetchedData = await fetchParticipants({
                    date: selectedDate,
                    booth: selectedBooth,
                    time: selectedTimeSlot
                });

                // 1. 12개의 빈 슬롯으로 구성된 초기 배열을 만듭니다.
                const initialSlots: Participant[] = Array.from({ length: MAX_PARTICIPANTS }, (_, i) => ({ id: null, name: '', contact: '' }));

                // 2. 받아온 데이터를 id에 맞는 위치에 채워 넣습니다.
                fetchedData.forEach(p => {
                    if (hasValidId(p)) {
                        initialSlots[p.id - 1] = p;
                    }
                });

                setReservations(prev => ({ ...prev, [key]: initialSlots }));
                setIsLoading(false);
            };

            // 캐시된 데이터가 없을 경우에만 API 호출
            loadParticipants();
        }
  }, [selectedDate, selectedBooth, selectedTimeSlot]);

  const reservationKey = useMemo(() => {
    if (selectedDate && selectedBooth && selectedTimeSlot) {
      return `${selectedDate}-${selectedBooth}-${selectedTimeSlot}`;
    }
    return null;
  }, [selectedDate, selectedBooth, selectedTimeSlot]);

  const participants = useMemo(() => {
    if (reservationKey && reservations[reservationKey]) {
      return reservations[reservationKey];
    }
    return [];
  }, [reservationKey, reservations]);

  const handleSelectDate = (date: ReservationDate) => {
    setSelectedDate(date);
    setSelectedBooth(null);
    setSelectedTimeSlot(null);
  };

  const handleSelectBooth = (booth: BoothName) => {
    if (!selectedDate) return;
    setSelectedBooth(booth);
    setSelectedTimeSlot(null);
  };

  const handleSelectTimeSlot = (timeSlot: TimeSlot) => {
    if (!selectedBooth) return;
    setSelectedTimeSlot(timeSlot);
  };

  const handleParticipantChange = (index: number, field: 'name' | 'contact', value: string) => {
    if (!reservationKey) return;
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    setReservations(prev => ({ ...prev, [reservationKey]: newParticipants }));
  };

  const handleSave = (index: number) => {
    if (!reservationKey) return;
    const participantToSave = participants[index];
    if (!participantToSave.name || !participantToSave.contact) {
      alert("이름과 연락처를 모두 입력해주세요.");
      return;
    }
    
    const newParticipants = [...participants];
    newParticipants[index] = { ...participantToSave, id: index + 1 };
    setReservations(prev => ({ ...prev, [reservationKey]: newParticipants }));
    
    alert(`[${index+1}]번 ${participantToSave.name}님 정보가 저장되었습니다.`);
  };

  const handleDelete = (index: number) => {
    if (!reservationKey) return;
    const participantToDelete = participants[index];

    if (window.confirm(`[${index+1}]번 ${participantToDelete.name}님의 예약을 삭제하시겠습니까?`)) {
        const newParticipants = [...participants];
        // 해당 슬롯을 빈 객체로 교체하여 자리를 보존
        newParticipants[index] = { id: null, name: '', contact: '' };
        setReservations(prev => ({ ...prev, [reservationKey]: newParticipants }));
        alert("삭제되었습니다.");
    }
  };

  return (
    <div className="admin-container">
      <header><h1>관리자 페이지 - 예약 현황</h1></header>
      <main className="content-wrapper">
        <div className="filters">
          <div className="filter-column"><h2>날짜 선택</h2>{DATES.map(date => (<div key={date} className={`item ${selectedDate === date ? 'selected' : ''}`} onClick={() => handleSelectDate(date)}>{date}</div>))}</div>
          <div className="filter-column"><h2>부스 선택</h2>{BOOTHS.map(booth => (<div key={booth} className={`item ${selectedBooth === booth ? 'selected' : ''} ${!selectedDate ? 'disabled' : ''}`} onClick={() => handleSelectBooth(booth)}>{booth}</div>))}</div>
          <div className="filter-column"><h2>회차 선택</h2>{TIMESLOTS.map(time => (<div key={time} className={`item ${selectedTimeSlot === time ? 'selected' : ''} ${!selectedBooth ? 'disabled' : ''}`} onClick={() => handleSelectTimeSlot(time)}>{time}</div>))}</div>
        </div>

        <div className="participants-section">
          {reservationKey ? (
            isLoading ? <div className="placeholder"><p>데이터를 불러오는 중입니다...</p></div> :
            <>
              <h2>참가자 명단</h2>
              <p className="selection-info">{selectedDate} / {selectedBooth} / {selectedTimeSlot}</p>
              <div className="participant-list">
                {participants.map((p, index) => (
                  <div key={index} className="participant-row">
                    <span className="participant-number">{index + 1}.</span>
                    <input type="text" placeholder="이름" className="input-name" value={p.name} onChange={(e) => handleParticipantChange(index, 'name', e.target.value)} disabled={!!p.id} />
                    <input type="text" placeholder="연락처" className="input-contact" value={p.contact} onChange={(e) => handleParticipantChange(index, 'contact', e.target.value)} disabled={!!p.id} />
                    {p.id ? (
                        <button onClick={() => handleDelete(index)} className="delete-button">지우기</button>
                    ) : (
                        <button onClick={() => handleSave(index)} className="save-button">저장</button>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="placeholder"><p>날짜, 부스, 회차를 모두 선택하면 참가자 명단을 관리할 수 있습니다.</p></div>
          )}
        </div>
      </main>

      <style jsx>{`
        .admin-container { padding: 2rem; font-family: var(--font-geist-sans); }
        header { text-align: center; margin-bottom: 2rem; }
        h1 { font-size: 2.2rem; font-weight: 600; }
        h2 { font-size: 1.2rem; font-weight: 500; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
        .content-wrapper { display: flex; gap: 2rem; }
        .filters { display: flex; gap: 1.5rem; flex-grow: 1; }
        .filter-column { flex: 1; }
        .item { padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.2s ease; }
        .item:hover { background-color: #f0f0f0; }
        .item.selected { background-color: #495057; color: white; border-color: #495057; font-weight: 500; }
        .item.disabled { cursor: not-allowed; background-color: #f8f9fa; color: #aaa; }
        .participants-section { flex: 1; padding-left: 2rem; border-left: 1px solid #eee; }
        .selection-info { font-size: 0.9rem; color: #555; margin-bottom: 1.5rem; }
        .participant-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .participant-row { display: flex; align-items: center; gap: 0.5rem; }
        .participant-number { font-size: 0.9rem; width: 2.5rem; flex-shrink: 0; text-align: right; padding-right: 0.5rem; }
        input[type="text"] { flex-grow: 1; padding: 0.5rem 0.75rem; border: 1px solid #ccc; border-radius: 4px; }
        input:disabled { background-color: #f1f1f1; color: #777; cursor: not-allowed; }
        button { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap; transition: background-color 0.2s; }
        .save-button { background-color: #28a745; color: white; }
        .save-button:hover { background-color: #218838; }
        .delete-button { background-color: #dc3545; color: white; }
        .delete-button:hover { background-color: #c82333; }
        .placeholder { display: flex; justify-content: center; align-items: center; height: 100%; background-color: #f8f9fa; border-radius: 8px; text-align: center; color: #666; }

        @media (max-width: 768px) {
          .admin-container { padding: 1rem; }
          .content-wrapper { flex-direction: column; gap: 0; }
          .filters { flex-direction: column; }
          .participants-section { padding-left: 0; border-left: none; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #eee; }
          .filter-column { min-width: 100%; }
          .participant-row { flex-wrap: wrap; row-gap: 0.5rem; }
          .input-name { flex-grow: 1; }
          .input-contact { flex-basis: 100%; }
          .participant-row button { margin-left: auto; }
        }
        @media (min-width: 769px) {
          .item { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;