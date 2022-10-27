import { Maps } from '../types';

export class Match {
  id: string;
  sprint_id: string;
  map: Maps;

  p1_score: number;
  p2_score: number;

  updated_at: string;
  created_at: string;
}
