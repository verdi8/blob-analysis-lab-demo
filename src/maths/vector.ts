/**
 * Etend les types de paper avec un Vecteur
 */
import Point = paper.Point;

export class Vector {

    public constructor(public start : Point, public end : Point) {
    }

    /**
     * Donne le centre
     */
    public getMiddle() : Point {
        return this.start.add(this.end.subtract(this.start).divide(2));
    }
}

