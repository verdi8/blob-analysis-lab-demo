import {PathCoords} from "./coords/pathCoords";
import {StringUtils} from "../utils/stringUtils";
import * as paper from "paper";
import {ExperienceEnum, GroupeEnum, WorkInfo} from "./work/workInfo";
import {Measurement} from "./measurement/measurement";
import {csvParse} from "d3-dsv";



/**
 * Le contenu d'un fichier CSV de mesure (pour une photo)
 */
export interface CsvResultFileData {
    filename: string,
    workInfo: WorkInfo,
    measures: Measurement[]
}


/**
 * Import de données, sert plutôt pour le debug
 */
export class DataImporter {

    /**
     * Fichier de résultats
     */
    public readCsvResultFileData(filename: string, csv: string) : CsvResultFileData {
        console.log(csvParse(csv));
        return null;
    }

    /**
     * Charge un PathCoords depuis des coordonnées text
     */
    public readPathCoords(text: string): PathCoords {
        let pathCoords = new PathCoords();
        let lines = StringUtils.splitLines(text);
        lines.filter(line => line.trim().length > 0).forEach(
            (line: string) => {
                let [x, y] = line.split("\t");
                pathCoords.points.push(new paper.Point(Number(x), Number(y)));
            }
        );
        return pathCoords;
    }
}
