/**
 * Import et export des infos de travail en cours
 */
import {WorkInfo} from "../workInfo";

/**
 * Formattage des infos du travail en cours
 */
export class WorkInfoFormatter {

    /**
     * Transforme le work info en code
     */
    public format(workInfo : WorkInfo) : string {
        return workInfo.groupe
        + "J" + workInfo.jour
        + workInfo.experience
        +  (workInfo.blob != null  ? "B" + workInfo.blob : "");
    }


}