import moment from "moment";

export interface DatesList {
  date: String;
  id: String;
  unix: number;
}

const getDateSubtract = (sub: number, unix?: number): DatesList => {
  // const momentTemp = unix ? moment(unix) : moment()
  const momentTemp = moment().subtract(sub, "days");
  return {
    date: momentTemp.format("ddd DD"),
    id: momentTemp.startOf("day").valueOf().toString(),
    unix: momentTemp.startOf("day").valueOf() / 100000,
  };
};

const getDateAddition = (sub: number, unix?: number): DatesList => {
  // const momentTemp = unix ? moment(unix) : moment()
  const momentTemp = moment().add(sub, "days");
  return {
    date: momentTemp.format("ddd DD"),
    id: momentTemp.startOf("day").valueOf().toString(),
    unix: momentTemp.startOf("day").valueOf() / 100000,
  };
};

const getNow = (unix?: number) => {
  const momentTemp = unix ? moment(unix) : moment();

  return momentTemp.startOf("day").valueOf().toString();
};

const encodeShortDate = (unix?: number) => {
  const momentTemp = unix ? moment(unix) : moment();
  return momentTemp.startOf("day").valueOf() / 100000;
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
