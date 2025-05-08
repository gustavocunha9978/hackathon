import { isToday, isPast } from 'date-fns';
import { DATE_OBJECT, formatDate } from './formatDate';

/**
 * Verifica se a data já é no passado e se não é o atual
 *
 * Função criada pois o isPast do date-fns considera o dia atual como passado
 * e na maior parte dio sistema a regra é que hoje ainda
 * @param {*} date
 * @returns
 */
export const isPastAndNotToday = (date: Date | string) => {
  const formattedDate = formatDate(date, DATE_OBJECT) as Date;
  return isPast(formattedDate) && !isToday(formattedDate);
};
