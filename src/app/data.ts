import type { Booth } from './type';
import { generateFakeReservations } from './utils';

export const initialReservations: Record<string, Booth[]> = {
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
