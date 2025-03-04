import { LogType } from "./constants";

export interface LogDto {
    logMessage: string | undefined;
    logType: LogType;
}


