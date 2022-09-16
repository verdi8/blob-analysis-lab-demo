/**
 * Des coordonnées représentant une ellipse
 */
import {Coords} from "./coords";
import * as paper from "paper";

export class EllipseCoords implements Coords {

    public constructor(public center : paper.Point, public radiusX : number, public radiusY : number, public angle : number = 0) {
    }

    bounds(): paper.Rectangle {
        return this.toPath().bounds;
    }

    toPath(): paper.Path {
        let path = new paper.Path.Ellipse(new paper.Rectangle(
                new paper.Point(this.center.x - this.radiusX, this.center.y - this.radiusY),
                new paper.Size(2 * this.radiusX, 2 * this.radiusY)
            )
        );
        path.rotate(this.angle);
        path.remove();
        return path;
    }

    /**
     * Donne l'axe le plus grand (2 * le rayon le plus grand)
     */
    public getMajorAxis() {
        return 2 * Math.max(this.radiusX, this.radiusY);
    }

    /**
     * Donne l'axe le plus petit (2 * le rayon le plus grand)
     */
    public getMinorAxis() {
        return 2 * Math.min(this.radiusX, this.radiusY);
    }
}