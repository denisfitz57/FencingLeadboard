
import { Fencer, BoutResult } from '../types';
import {
  CURVE_CONSTANT,
  BASE_CHANGE,
  WIN_BONUS,
  MAX_SCORE,
  LEADERBOARD_MONTHS_EXPIRE,
  MULTIPLIER_AMOUNT,
  POINTS_BOUT,
  POINTS_WIN,
  POINTS_TOUCH,
} from '../constants';

// Helper to get month difference between two dates
const monthDiff = (d1: Date, d2: Date): number => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

export const calculateLeaderboard = (fencers: Fencer[], bouts: BoutResult[]): Fencer[] => {
  // Create a mutable map of fencers for efficient lookups and updates.
  const fencerMap = new Map<string, Fencer>();
  fencers.forEach(fencer => {
    fencerMap.set(fencer.id, {
      ...fencer,
      bouts: 0,
      wins: 0,
      rating: 1000,
      points: 0,
      daily_bouts: 0,
      refereed_bouts: 0,
    });
  });

  const sortedBouts = [...bouts].sort((a, b) => new Date(a.bout_date).getTime() - new Date(b.bout_date).getTime());

  let lastBoutDate: string | null = null;

  for (const bout of sortedBouts) {
    const fencer1 = fencerMap.get(bout.fencer1Id);
    const fencer2 = fencerMap.get(bout.fencer2Id);
    const referee = fencerMap.get(bout.refereeId);

    if (!fencer1 || !fencer2 || !referee) {
      continue; // Skip if any participant is not found
    }

    // --- Date Check for Daily Bouts Reset ---
    const currentBoutDate = new Date(bout.bout_date).toDateString();
    if (lastBoutDate !== currentBoutDate) {
      fencerMap.forEach(f => {
        f.daily_bouts = 0;
      });
      lastBoutDate = currentBoutDate;
    }
    
    // --- Bout Count ---
    fencer1.bouts += 1;
    fencer2.bouts += 1;
    referee.refereed_bouts += 1;
    if (bout.winner === 1) {
      fencer1.wins += 1;
    } else {
      fencer2.wins += 1;
    }

    // --- Rating Change ---
    const win_chance = 1 / (1 + Math.pow(10, (fencer2.rating - fencer1.rating) / CURVE_CONSTANT));
    
    let rating_change: number;
    if (bout.winner === 1) {
      rating_change = BASE_CHANGE * (1 - win_chance);
    } else {
      rating_change = BASE_CHANGE * -win_chance;
    }

    const score_diff_scale = (Math.abs(bout.score1 - bout.score2) + WIN_BONUS) / (MAX_SCORE + WIN_BONUS);
    rating_change *= score_diff_scale;

    // --- Points Change ---
    const boutDate = new Date(bout.bout_date);
    const today = new Date();
    const months_old = monthDiff(boutDate, today);

    let points_gained1 = 0;
    let points_gained2 = 0;

    if (months_old < LEADERBOARD_MONTHS_EXPIRE) {
      const age_scale = (LEADERBOARD_MONTHS_EXPIRE - months_old) / LEADERBOARD_MONTHS_EXPIRE;

      fencer1.daily_bouts += 1;
      fencer2.daily_bouts += 1;

      const multiplier1 = 1.0 + (fencer1.daily_bouts - 1) * MULTIPLIER_AMOUNT;
      const multiplier2 = 1.0 + (fencer2.daily_bouts - 1) * MULTIPLIER_AMOUNT;

      let p1 = POINTS_BOUT;
      let p2 = POINTS_BOUT;

      if (bout.winner === 1) {
        p1 += POINTS_WIN;
      } else {
        p2 += POINTS_WIN;
      }

      p1 += bout.score1 * POINTS_TOUCH;
      p2 += bout.score2 * POINTS_TOUCH;
      
      points_gained1 = p1 * age_scale * multiplier1 * (1 - win_chance);
      points_gained2 = p2 * age_scale * multiplier2 * win_chance;
    }
    
    // --- Update Fencers ---
    fencer1.rating += rating_change;
    fencer2.rating -= rating_change;
    fencer1.points += points_gained1;
    fencer2.points += points_gained2;

    // Put them back in the map
    fencerMap.set(fencer1.id, fencer1);
    fencerMap.set(fencer2.id, fencer2);
    fencerMap.set(referee.id, referee);
  }

  // Convert map back to array and sort by points
  return Array.from(fencerMap.values()).sort((a, b) => b.points - a.points);
};
