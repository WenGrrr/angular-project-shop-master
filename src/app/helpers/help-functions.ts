import {Moment} from "moment";
import * as moment from "moment";

export function parseDateToString(date: Moment):string {
  return moment(date).format("DD/MM/YYYY");
}

export function parseStringToDate(date: string):moment.Moment {
  return moment(date,"DD/MM/YYYY");
}
