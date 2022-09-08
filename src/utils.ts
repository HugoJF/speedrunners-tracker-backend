const DATE_FROM_ISO_STRING = /(.*)T(.*)Z/;

export const splitDatetime = (
  datetime: string,
): { date: string; time: string } => {
  const matches = datetime.split(DATE_FROM_ISO_STRING);
  const [, date, time] = matches;

  return { date, time };
};
