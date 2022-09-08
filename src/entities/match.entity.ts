import { Maps } from '../types';
import { Expose } from 'class-transformer';

export class Match {
  map: Maps;
  denerd_score: number;
  chase_score: number;

  private _date: string;
  set date(date) {
    this._date = date;
  }

  private _time: string;
  set time(time) {
    this._time = time;
  }

  @Expose()
  public get id(): string {
    return `${this._date}T${this._time}Z`;
  }

  @Expose()
  public get created_at(): string {
    return `${this._date}T${this._time}Z`;
  }
}
