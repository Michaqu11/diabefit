import moment from "moment";

export interface DatesList {
  date: String;
  id: String;
  unix: number;
}

const getDateSubtract = (sub: number, unix?: number): DatesList => {
  const day = moment().subtract(sub, "days");

  return {
    date: day.format("ddd DD"),
    id: day.startOf("day").valueOf().toString(),
    unix: day.startOf("day").valueOf() / 100000,
  };
};

const getDateAddition = (sub: number, unix?: number): DatesList => {
  const day = moment().add(sub, "days");
  return {
    date: day.format("ddd DD"),
    id: day.startOf("day").valueOf().toString(),
    unix: day.startOf("day").valueOf() / 100000,
  };
};

const getNow = (unix?: number) => {
  const day = unix ? moment(unix) : moment();

  return day.startOf("day").valueOf().toString();
};

const encodeShortDate = (unix?: number) => {
  const day = unix ? moment(unix) : moment();
  return day.startOf("day").valueOf() / 100000;
};

const decodeShortDate = (unix: number) => {
  return unix * 100000;
};

export {
  getDateSubtract,
  getDateAddition,
  getNow,
  encodeShortDate,
  decodeShortDate,
};
