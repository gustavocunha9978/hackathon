import { format, isDate } from 'date-fns';

// ------------------------------------------------------------------------------------------

export const EN_US = 'en-US'; // aaaa-mm-dd
export const PT_BR = 'pt-BR'; // dd/mm/aaaa
export const DATE_OBJECT = 'DATE_OBJECT'; // Tue Oct 12 2021 00:00:00 GMT-0300 (Horário Padrão de Brasília)
export const ISO = 'ISO'; // 2021-05-21T03:00:00.000Z
export const PT_BR_DATE_TIME = 'PT_BR_DATE_TIME'; // 2021-05-21T03:00:00.000Z

const identifyDateFormat = (date: string) => {
  if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return EN_US;
  }

  if (date.match(/^\d{2}[/]\d{2}[/]\d{4}$/)) {
    return PT_BR;
  }

  if (
    date.match(
      /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/,
    )
  ) {
    return ISO;
  }

  if (isDate(new Date(date))) {
    return DATE_OBJECT;
  }

  return 'formato não identificado';
};

const verifyIfFormatIsValid = (inputFormat: string) => {
  if (
    !(
      inputFormat === EN_US ||
      inputFormat === PT_BR ||
      inputFormat === DATE_OBJECT ||
      inputFormat === ISO
    )
  ) {
    return 'formato inválido';
  }
  return 'válido';
};

/**
 * Função que converte a data no formato desejado.
 *
 * O primeiro parametro é o valor da data. Pode ser uma string ou um Date.
 *
 * O segundo parametro é o formato desejado. Utilize as constantes para informar o formato.
 *
 * Formatos válidos:
 * EN_US,PT_BR, DATE_OBEJCT, ISO
 * @param {string | Date} value
 * @param {EN_US | PT_BR | DATE_OBJECT | ISO} desiredFormat
 * @returns
 */
export const formatDate = (value: string | Date, desiredFormat: string) => {
  let dateObj = null;

  const originalFormat = identifyDateFormat(String(value));

  verifyIfFormatIsValid(desiredFormat);

  if (originalFormat === EN_US) {
    const [year, month, day] = String(value).split('-');
    dateObj = new Date(Number(year), Number(month) - 1, Number(day));
  }

  if (originalFormat === PT_BR) {
    const [day, month, year] = String(value).split('/');
    dateObj = new Date(Number(year), Number(month) - 1, Number(day));
  }

  if (originalFormat === ISO || originalFormat === DATE_OBJECT) {
    dateObj = new Date(value);
  }

  if (dateObj) {
    if (desiredFormat === EN_US) {
      return `${dateObj.getFullYear()}-${
        dateObj.getMonth() + 1
      }-${dateObj.getDate()}`;
    }

    if (desiredFormat === PT_BR) {
      return dateObj.toLocaleDateString(PT_BR);
    }

    if (desiredFormat === ISO) {
      return dateObj.toISOString();
    }

    if (desiredFormat === DATE_OBJECT) {
      return dateObj;
    }
  }

  return 'Erro ao converter a data';
};

/**
 * Formatar data e hora.
 *
 * O primeiro parametro é o valor da data. Pode ser uma string ou um Date.
 *
 * O segundo parametro é o formato desejado. Utilize as constantes para informar o formato. default: PT_BR_DATE_TIME
 * @param {string | Date} value
 * @param {PT_BR_DATE_TIME} desiredFormat
 * @returns
 */
export const formatDateAndTime = (
  date: string | Date,
  desiredFormat = PT_BR_DATE_TIME,
) => {
  if (desiredFormat === PT_BR_DATE_TIME) {
    return format(formatDate(date, DATE_OBJECT) as Date, 'dd/MM/yyyy kk:mm');
  }
  return 'não implementado';
};
