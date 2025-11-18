export type ReservationDate = "2025-11-22" | "2025-11-23";

export type BoothName = 
  | "에어로켓 만들기" 
  | "누리호 3D 입체모형 만들기" 
  | "지구와 달의 운동모형 만들기" 
  | "누리호 종이 로켓 만들기" 
  | "발포정 누리호 로켓 만들기";

export type TimeSlot = 
  | "1회차 (10:00-10:45)" 
  | "2회차 (11:00-11:45)" 
  | "3회차 (13:00-13:45)"
  | "4회차 (14:00-14:45)" 
  | "5회차 (15:00-15:45)" 
  | "6회차 (16:00-16:45)";

export interface Participant {
  id: number | null;
  name: string;
  contact: string;
}

export type FetchedParticipant = Required<Participant>;

export interface Reservation {
  id: number;
  name: string;
  phone: string;
}

export interface Booth {
  id: number;
  name: BoothName;
  slots: Reservation[][];
}

export const DATES: ReservationDate[] = ["2025-11-22", "2025-11-23"];

export const BOOTHS: BoothName[] = [
  "에어로켓 만들기", 
  "누리호 3D 입체모형 만들기", 
  "지구와 달의 운동모형 만들기", 
  "누리호 종이 로켓 만들기", 
  "발포정 누리호 로켓 만들기"
];

export const TIMESLOTS: TimeSlot[] = [
  "1회차 (10:00-10:45)", "2회차 (11:00-11:45)", "3회차 (13:00-13:45)",
  "4회차 (14:00-14:45)", "5회차 (15:00-15:45)", "6회차 (16:00-16:45)"
];

export const MAX_PARTICIPANTS = 12;
