import { formatInTimeZone } from 'date-fns-tz';

const DATE_FROM_ISO_STRING = /(.*)T(.*)[-Z]/;

export const toISOStringTz = (date: Date): string =>
  formatInTimeZone(
    date,
    'America/Campo_Grande',
    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
  );

export const splitDatetime = (
  datetime: string,
): { date: string; time: string } => {
  const matches = datetime.split(DATE_FROM_ISO_STRING);
  const [, date, time] = matches;

  return { date, time };
};
