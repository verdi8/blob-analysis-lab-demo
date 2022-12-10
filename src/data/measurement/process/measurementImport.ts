/**
 * Import de mesures
 */
import {Measurement} from "../measurement";
import {WorkInfo} from "../../work/workInfo";
import {WorkInfoParser} from "../../work/process/workInfoParser";
import {csvParseRows} from "d3-dsv";

const MEASURE_FILENAME_REGEX = /^Results_(?<work>[a-zA-Z0-9]+).csv$/i;

/**
 * EN charge de l'import de mesures (lecture de fichiers CSV)
 */
export class MeasurementImport {

    /**
     * Poru parser la session de travail
     */
    private workInfoParser = new WorkInfoParser();

    /**
     * Lit des mesures depuis des données csv
     * @param String
     */
    public readMeasures(filename: string, csv: string) : { work: WorkInfo, measurements: Measurement[] } {
        let match = filename.match(MEASURE_FILENAME_REGEX);
        let work = null;
        if(match != null) {
            work = this.workInfoParser.parse(match.groups.work);
        }
        if(work == null) {
            throw new Error("Le nom du fichier " + filename + " ne respecte pas la nomenclature (par ex.: Results_ExpJ2ConB3.csv)");
        }

        let measurements : Measurement[] = csvParseRows(csv, (d, i) : Measurement => {
            if(i == 0) {
                if(d.length != 8 || d[0] != " " || d[1] != "Label" || d[2] != "Area" || d[3] != "Perim." || d[4] != "Circ." || d[5] != "AR" || d[6] != "Round" || d[7] != "Solidity" ) {
                    throw new Error("Fichier " + filename + " : la première ligne du fichier ne contient pas les en-têtes attendus (\" ,Label,Area,Perim.,Circ.,AR,Round,Solidity\")")
                }
            } else {
                return {
                    label: d[1], // le nom du fichier
                    area:  +d[2],
                    perimeter: +d[3],
                    circularity: +d[4],
                    ar: +d[5],
                    round: +d[6],
                    solid: +d[7]
                };
            }
        });
        return { work: work, measurements: measurements };
    }


}