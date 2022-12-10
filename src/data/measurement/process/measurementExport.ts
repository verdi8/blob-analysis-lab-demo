import {Measurement} from "../measurement";
import {MathUtils} from "../../../utils/mathUtils";
import {WorkInfo} from "../../work/workInfo";
import {csvFormatRows} from "d3-dsv";
import {WorkInfoFormatter} from "../../work/process/workInfoFormatter";

const ROUNDING_DECIMALS = 3;

/**
 * Export de mesures
 */
export class MeasurementExport {

    private workInfoFormatter = new WorkInfoFormatter();


    /**
     * Export les mesures au format CSV
     */
    public exportMeasurements(work: WorkInfo, measurements: Measurement[]) : { filename: string, csv: string }  {
        return {
            filename: "Results_" + this.workInfoFormatter.format(work) + ".csv",
            csv: csvFormatRows([[" ", "Label", "Area", "Perim.", "Circ.","AR","Round","Solidity"]]
                .concat(measurements.map((measurement, i) =>
                    [ (i + 1).toString(),
                        measurement.label,
                        MathUtils.round(measurement.area, ROUNDING_DECIMALS).toString(),
                        MathUtils.round(measurement.perimeter, ROUNDING_DECIMALS).toString(),
                        MathUtils.round(measurement.circularity, ROUNDING_DECIMALS).toString(),
                        MathUtils.round(measurement.ar, ROUNDING_DECIMALS).toString(),
                        MathUtils.round(measurement.round, ROUNDING_DECIMALS).toString(),
                        MathUtils.round(measurement.solid, ROUNDING_DECIMALS).toString(),
                    ]
                )))};
    }
    /**
     * Export les mesures au format CSV
     */
    public exportDryMeasures(work: WorkInfo) : { filename: string, csv: string }  {
        return this.exportMeasurements(work, []);
    }


}