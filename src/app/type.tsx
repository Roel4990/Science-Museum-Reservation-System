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
    slotNo: number;
    reservationId: number;
    name: string;
    phone: string;
}

export type FetchedParticipant = Required<Participant>;

export interface Slot {
  slotNo: number | null;
  reservationId: number | null;
  name: string;
  phone: string;
}

export interface ReservationDetailResponse {
  date: string;
  boothType: string;
  roundNo: number;
  slots: Slot[];
}

export interface CreateReservationPayload {
  date: string;
  boothType: string;
  round: number;
  slotNo: number;
  name: string;
  phone: string;
}

export interface CreateReservationResult {
  reservationId: number;
}

export interface Booth {
    boothType: BoothType;
    boothName: BoothName;
    rounds: round[];
}

export interface round {
    roundNo: number;
    count: number;
}

export enum BoothType {
    AIR_ROCKET = "AIR_ROCKET",
    NURIHO_3D = "NURIHO_3D",
    EARTH_MOON_MODEL = "EARTH_MOON_MODEL",
    NURIHO_PAPER_ROCKET = "NURIHO_PAPER_ROCKET",
    NURIHO_TABLET_ROCKET = "NURIHO_TABLET_ROCKET"
}

export interface reservationsResponse {
    dateMap: {
        [date: string]: Booth[];
    };
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
