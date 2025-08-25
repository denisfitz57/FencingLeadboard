
export interface Fencer {
  id: string;
  name: string;
  bouts: number;
  wins: number;
  rating: number;
  points: number;
  daily_bouts: number;
  refereed_bouts: number;
}

export interface BoutResult {
  id: string;
  bout_date: string; // ISO string date
  fencer1Id: string;
  fencer2Id: string;
  refereeId: string;
  score1: number;
  score2: number;
  winner: 1 | 2;
}
