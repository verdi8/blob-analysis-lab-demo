
import * as paper from "paper";
import {Coords} from "./coords";

/**
 * Étend les types de paper avec un Vecteur
 */
export class VectorCoords implements Coords {

    public constructor(public start : paper.Point, public end : paper.Point) {
    }

    public bounds(): paper.Rectangle {
        return new paper.Rectangle(this.start, this.end);
    }

    public distance(): number {
        return this.asPointVector().length;
    }

    public asPointVector() : paper.Point {
        return this.end.subtract(this.start);
    }

    toRemovedPath(): paper.Path {
        return new paper.Path.Line(this.start, this.end);
    }

}

