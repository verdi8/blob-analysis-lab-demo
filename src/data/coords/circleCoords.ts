import * as paper from "paper";
import {Coords} from "./coords";

/**
 * Etend les types de paper avec un cercle (centre + rayon)
 */

export class CircleCoords implements Coords {

    public constructor(public center : paper.Point, public radius : number) {
    }

    bounds(): paper.Rectangle {
        return new paper.Rectangle(this.center.x - this.radius, this.center.y - this.radius, this.radius * 2, this.radius * 2);
    }

    toPath(): paper.Path {
        return new paper.Path.Circle(this.center, this.radius);
    }

}