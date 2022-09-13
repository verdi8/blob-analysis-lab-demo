import * as paper from "paper";
import {Coords} from "./coords";

/**
 * Distance en dessous de la quelle on considère que le path est fermé
 */
const CLOSING_DISTANCE = 10;

/**
 * Etend les types de paper avec un cercle (centre + rayon)
 */
export class PathCoords implements Coords {

    public constructor(public path : paper.Path) {
    }

    bounds(): paper.Rectangle {
        return this.path.bounds;
    }

    toPath(): paper.Path {
        const result = this.path.clone();
        result.remove();
        return result;
    }

    /**
     * Indique si le masque est fermé (le dernier point est proche du premier)
     */
    public isClosed() : boolean {
        return !this.path.isEmpty()
            && (this.path.bounds.width > CLOSING_DISTANCE || this.path.bounds.height > CLOSING_DISTANCE)
            && this.path.firstSegment.point.getDistance(this.path.lastSegment.point) < CLOSING_DISTANCE;
    }

}