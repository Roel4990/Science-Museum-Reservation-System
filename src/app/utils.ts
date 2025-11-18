import type { Reservation } from './type';
import { MAX_PARTICIPANTS } from './type';

export const generateFakeReservations = (count: number): Reservation[] => {
    if (count > MAX_PARTICIPANTS) count = MAX_PARTICIPANTS;
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
