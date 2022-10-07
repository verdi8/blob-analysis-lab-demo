import * as paper from "paper";
import {VectorCoords} from "../../../src/data/coords/vectorCoords";

describe('Testing VectorCoords...', () => {

   let vectorCoords = new VectorCoords(new paper.Point(3, 45), new paper.Point(-25.25, 109));

    it('bounds are correct', () => {
        let bounds = vectorCoords.bounds();
        expect(bounds.x).toBe(-25.25);
        expect(bounds.y).toBe(45);
        expect(bounds.width).toBe(28.25);
        expect(bounds.height).toBe(64);
    });

    it('distance is correct', () => {
        expect(vectorCoords.distance()).toBe(Math.sqrt(Math.pow(28.25, 2) + Math.pow(64,2)));
    });

    it('start is correct', () => {
        expect(vectorCoords.start.x).toBe(3);
        expect(vectorCoords.start.y).toBe(45);
    });

    it('end is correct', () => {
        expect(vectorCoords.end.x).toBe(-25.25);
        expect(vectorCoords.end.y).toBe(109);
    });

    it('toRemovedPath() is correct', () => {
        let segments = vectorCoords.toRemovedPath().segments;
        expect(segments.length).toBe(2);
        expect(segments[0].point.x).toBe(3);
        expect(segments[0].point.y).toBe(45);
        expect(segments[1].point.x).toBe(-25.25);
        expect(segments[1].point.y).toBe(109);
    });
});