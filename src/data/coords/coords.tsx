import * as paper from "paper";
import {PathCoords} from "./pathCoords";


/**
 * Des coordonnées pour les instruments
 */
export interface Coords {

    /**
     * Donne le contour de l'instrument.
     * @return null si l'instrument n'est pas dessiné
     */
    bounds() : paper.Rectangle;

    /**
     * Un paper.Path representatif des coodonnées
     */
    toRemovedPath() : paper.Path;

}