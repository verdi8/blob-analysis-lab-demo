/**
 * Merge des mesures
 */
import {MeasurementWorks} from "../measurementWorks";
import {WorkInfo} from "../../work/workInfo";
import {Measurement} from "../measurement";
import {ObjectUtils} from "../../../utils/objectUtils";
import {MeasurementImport} from "./measurementImport";
import {WorkInfoFormatter} from "../../work/process/workInfoFormatter";

/**
 * En charge du merge des mesures
 */
export class MeasurementMerge {

    /**
     * Pour importer les données CSV
     */
    private measurementImport = new MeasurementImport();

    /**
     * Pour encoder le WorkInfo
     */
    private workInfoFormatter = new WorkInfoFormatter();

    /**
     * Ajoute un fichier de mesures dans
     */
    public mergeInto(measurementWorks: MeasurementWorks, filename: string, work: WorkInfo, measurements: Measurement[]) : MeasurementWorks {
        // La session de travail (ensemble de blobs)
        let groupWork = ObjectUtils.deepClone(work);
        groupWork.blob = null;

        measurementWorks = ObjectUtils.deepClone(measurementWorks);

        let workKey = this.workInfoFormatter.format(groupWork);
        if (measurementWorks[workKey] == null) {
            measurementWorks[workKey] = { work: groupWork, files: {}};
        }
        measurementWorks[workKey].files[filename] = measurements;
        return measurementWorks;
    }


}