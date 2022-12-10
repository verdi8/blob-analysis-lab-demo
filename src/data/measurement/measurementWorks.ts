import {WorkInfo} from "../work/workInfo";
import {Measurement} from "./measurement";

/**
 * Regroupe des mesures par sessions de travail
 */
export interface MeasurementWorks {

    [work: string]: {
        work: WorkInfo,
        files: { [filename: string] : Measurement[] }
    }

}