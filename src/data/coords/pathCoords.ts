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

    public constructor(public points : paper.Point[] = []) {
    }

    bounds(): paper.Rectangle {
        return this.toRemovedPath().bounds;
    }

    toRemovedPath(): paper.Path {
        let path = new paper.Path();
        path.remove();
        this.points.forEach((point) => {
            path.add(point)
        })
        return path;
    }

    /**
     * Indique si le masque est fermé (le dernier point est proche du premier)
     */
    public isClosed() : boolean {
        let path = this.toRemovedPath();
        return !path.isEmpty()
            && (path.bounds.width > CLOSING_DISTANCE || path.bounds.height > CLOSING_DISTANCE)
            && path.firstSegment.point.getDistance(path.lastSegment.point) < CLOSING_DISTANCE;
    }

}