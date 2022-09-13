import * as paper from "paper";
import {AbstractInstrument, Handle, Instrument} from "./instrument";
import {VectorCoords} from "../data/coords/vectorCoords";
import {Lab} from "../lab";
import {PaperUtils} from "../utils/paperUtils";

/**
 * Représente la règle
 */
export class Ruler extends AbstractInstrument<VectorCoords> implements Instrument {

    public constructor(protected lab : Lab, coords : VectorCoords, private tickCount : number) {
        super(lab, coords, [
            new Handle("startHandle", true),
            new Handle("endHandle", true)
        ])
    }

    drawIn(coords : VectorCoords, group: paper.Group) {
        group.addChild(new paper.Path.Line(coords.start, coords.end));

        let vector = this.coords.asPointVector();
        for (let i = 0; i < this.tickCount; i++) {
            let tickCircle = new paper.Path.Circle(this.coords.start.add(vector.multiply(i / this.tickCount)), PaperUtils.absoluteDimension(1));
            group.addChild(tickCircle);
        }

    }

    locateHandle(coords: VectorCoords, handle: Handle): paper.Point {
        if(handle.name == "startHandle") {
            return coords.start;

        } else if(handle.name == "endHandle") {
            return coords.end;
        }
        throw new Error("Unknown handle");
    }

    onHandleMove(coords : VectorCoords, handle: Handle, point: paper.Point, delta: paper.Point): void {
        if(handle.name == "startHandle") {
            coords.start = coords.start.add(delta);

        } else if(handle.name == "endHandle") {
            coords.end = coords.end.add(delta);
        }
    }

}