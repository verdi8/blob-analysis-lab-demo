import {Coords} from "./coords/coords";
import {PathCoords} from "./coords/pathCoords";
import {StringUtils} from "../utils/stringUtils";
import * as paper from "paper";

/**
 * Import de données, sert plutôt ôu rle debug
 */
export class DataImporter {

    /**
     * Charge un PathCoords depuis des coordonnées text
     */
    public import(text: string): PathCoords {
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
