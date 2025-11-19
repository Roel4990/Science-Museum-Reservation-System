"use client";

import { useState, useMemo, useEffect } from 'react';
import type { NextPage } from 'next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    DATES, BOOTHS, TIMESLOTS, MAX_PARTICIPANTS, BoothType,
    type ReservationDate, type BoothName, type TimeSlot,
    type Participant, type CreateReservationPayload, Slot
} from '../type';
import './admin.css';
import { ApiResult } from "@/lib/api/types";
import { getReservationDetail } from "@/lib/api/reservationDetail";
import { createReservation } from "@/lib/api/reservationCreate";
import { deleteReservation } from "@/lib/api/reservationDelete";


async function fetchReservationDetail(
    date: string,
    boothType: string,
    roundNo: number
) {
    try {
        const res: ApiResult<Slot[]> = await getReservationDetail(date, boothType, roundNo);
        if (!res.success || !res.data) throw new Error(res.error || 'fail');
        return res.data;
    } catch {
        return null;
    }
}

const boothNameToType: Record<BoothName, BoothType> = {
    "에어로켓 만들기": BoothType.AIR_ROCKET,
    "누리호 3D 입체모형 만들기": BoothType.NURIHO_3D,
    "지구와 달의 운동모형 만들기": BoothType.EARTH_MOON_MODEL,
    "누리호 종이 로켓 만들기": BoothType.NURIHO_PAPER_ROCKET,
    "발포정 누리호 로켓 만들기": BoothType.NURIHO_TABLET_ROCKET,
};

// --- Component ---
const AdminPage: NextPage = () => {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState<ReservationDate | null>(null);
    const [selectedBooth, setSelectedBooth] = useState<BoothName | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

    const [participants, setParticipants] = useState<Participant[]>([]);

    const reservationQueryKey = useMemo(() =>
        ['reservations', selectedDate, selectedBooth, selectedTimeSlot],
        [selectedDate, selectedBooth, selectedTimeSlot]
    );

    // useQuery to fetch and cache reservation data
    const { data: serverData, isLoading: isParticipantsLoading } = useQuery({
        queryKey: reservationQueryKey,
        queryFn: async () => {
            if (!selectedDate || !selectedBooth || !selectedTimeSlot) {
                return [];
            }
            const roundNo = parseInt(selectedTimeSlot.split('회차')[0], 10);
            const boothType = boothNameToType[selectedBooth];
            const fetchedData = await fetchReservationDetail(selectedDate, boothType, roundNo);

            const initialSlots: Participant[] = Array.from({ length: MAX_PARTICIPANTS }, (_, i) => ({ slotNo: 0, name: '', phone: '', reservationId: 0 }));

            if (fetchedData) {
                fetchedData.forEach(slot => {
                    if (slot.slotNo !== null && slot.slotNo >= 1 && slot.slotNo <= MAX_PARTICIPANTS) {
                        const index = slot.slotNo - 1;
                        initialSlots[index] = {
                            ...initialSlots[index],
                            slotNo: slot.slotNo,
                            name: slot.name || '',
                            phone: slot.phone || '',
                            reservationId: slot.reservationId || 0,
                        };
                    }
                });
            }
            return initialSlots;
        },
        enabled: !!(selectedDate && selectedBooth && selectedTimeSlot),
    });

    useEffect(() => {
        setParticipants(serverData || []);
    }, [serverData]);

    const createReservationMutation = useMutation({
        mutationFn: createReservation,
        onMutate: async (newReservation: CreateReservationPayload) => {
            await queryClient.cancelQueries({ queryKey: reservationQueryKey });
            const previousParticipants = queryClient.getQueryData<Participant[]>(reservationQueryKey);

            queryClient.setQueryData<Participant[]>(reservationQueryKey, (old) => {
                if (!old) return [];
                const newParticipants = [...old];
                const index = newReservation.slotNo - 1;
                if (index >= 0 && index < newParticipants.length) {
                    newParticipants[index] = {
                        ...newParticipants[index],
                        name: newReservation.name,
                        phone: newReservation.phone,
                        slotNo: newReservation.slotNo,
                        reservationId: -1,
                    };
                }
                return newParticipants;
            });

            return { previousParticipants };
        },
        onError: (err, newReservation, context) => {
            alert(`저장 실패: ${(err as Error).message}`);
            if (context?.previousParticipants) {
                queryClient.setQueryData(reservationQueryKey, context.previousParticipants);
            }
        },
        onSuccess: (result) => {
            if (result.success) {
                alert('저장되었습니다.');
            } else {
                alert(`저장 실패: ${result.error}`);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: reservationQueryKey });
        },
    });

    const deleteReservationMutation = useMutation({
        mutationFn: deleteReservation,
        onMutate: async (reservationId: number) => {
            await queryClient.cancelQueries({ queryKey: reservationQueryKey });
            const previousParticipants = queryClient.getQueryData<Participant[]>(reservationQueryKey);

            queryClient.setQueryData<Participant[]>(reservationQueryKey, (old ) =>
                old?.map(p =>
                    p.reservationId === reservationId
                        ? { ...p, slotNo: 0, name: '', phone: '', reservationId: 0 }
                        : p
                ) || []
            );
            return { previousParticipants };
        },
        onError: (err, newTodo, context) => {
            alert(`삭제 실패: ${(err as Error).message}`);
            if (context?.previousParticipants) {
                queryClient.setQueryData(reservationQueryKey, context.previousParticipants);
            }
        },
        onSuccess: (result) => {
            if (result.success) {
                alert('삭제되었습니다.');
            } else {
                alert(`삭제 실패: ${result.error}`);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: reservationQueryKey });
        },
    });


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

    const handleParticipantChange = (index: number, field: 'name' | 'phone', value: string) => {
        const newParticipants = [...participants];
        if (newParticipants[index]) {
            newParticipants[index] = { ...newParticipants[index], [field]: value };
            setParticipants(newParticipants);
        }
    };

    const handleSave = (index: number) => {
        if (!selectedDate || !selectedBooth || !selectedTimeSlot) return;
        const participantToSave = participants[index];
        if (!participantToSave.name || !participantToSave.phone) {
            alert("이름과 연락처를 모두 입력해주세요.");
            return;
        }

        const payload: CreateReservationPayload = {
            date: selectedDate,
            boothType: boothNameToType[selectedBooth],
            round: parseInt(selectedTimeSlot.split('회차')[0], 10),
            slotNo: index + 1,
            name: participantToSave.name,
            phone: participantToSave.phone,
        };

        createReservationMutation.mutate(payload);
    };

    const handleDelete = (index: number) => {
        const participantToDelete = participants[index];
        if (!participantToDelete?.reservationId) {
            alert("삭제할 수 없는 예약입니다 (ID 없음).");
            return;
        }

        if (window.confirm(`[${index + 1}]번 ${participantToDelete.name}님의 예약을 삭제하시겠습니까?`)) {
            deleteReservationMutation.mutate(participantToDelete.reservationId);
        }
    };

    const showParticipants = selectedDate && selectedBooth && selectedTimeSlot;

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
                    {showParticipants ? (
                        isParticipantsLoading ? <div className="placeholder"><p>참가자 명단을 불러오는 중입니다...</p></div> :
                        <>
                          <h2>참가자 명단</h2>
                          <p className="selection-info">{selectedDate} / {selectedBooth} / {selectedTimeSlot}</p>
                          <div className="participant-list">
                            {participants.map((p, index) => (
                              <div key={index} className="participant-row">
                                <span className="participant-number">{index + 1}.</span>
                                <input type="text" placeholder="이름" className="input-name" value={p.name} onChange={(e) => handleParticipantChange(index, 'name', e.target.value)} disabled={!!p.reservationId} />
                                <input type="text" placeholder="연락처" className="input-contact" value={p.phone} onChange={(e) => handleParticipantChange(index, 'phone', e.target.value)} disabled={!!p.reservationId} />
                                {p.reservationId ? (
                                    <button onClick={() => handleDelete(index)} className="delete-button" disabled={deleteReservationMutation.isPending && deleteReservationMutation.variables === p.reservationId}>
                                        {deleteReservationMutation.isPending && deleteReservationMutation.variables === p.reservationId ? '삭제중...' : '지우기'}
                                    </button>
                                ) : (
                                    <button onClick={() => handleSave(index)} className="save-button" disabled={createReservationMutation.isPending && createReservationMutation.variables?.slotNo === (index + 1)}>
                                        {createReservationMutation.isPending && createReservationMutation.variables?.slotNo === (index + 1) ? '저장중...' : '저장'}
                                    </button>
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
        </div>
    );
};

export default AdminPage;
