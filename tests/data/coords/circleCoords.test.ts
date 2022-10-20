import * as paper from "paper";
import {CircleCoords} from "../../../src/data/coords/circleCoords";

describe('Testing CircleCoords...', () => {

    let circleCoords = new CircleCoords(new paper.Point(7, 11), 10.5);

    it('bounds are correct', () => {
        let bounds = circleCoords.bounds();
        expect(bounds.x).toBe(-3.5);
        expect(bounds.y).toBe(0.5);
        expect(bounds.width).toBe(21);
        expect(bounds.height).toBe(21);
    });

    it('coords are correct', () => {
        expect(circleCoords.radius).toBe(10.5);
        expect(circleCoords.center.x).toBe(7);
        expect(circleCoords.center.y).toBe(11);
    });

});