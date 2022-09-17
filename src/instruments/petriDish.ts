import * as paper from "paper";
import {AbstractInstrument, Handle, Instrument} from "./instrument";
import {CircleCoords} from "../data/coords/circleCoords";
import {Lab} from "../lab";
import {EllipseCoords} from "../data/coords/ellipseCoords";

/**
 * Représente la boîte de Petri
 */
export class PetriDish extends AbstractInstrument<EllipseCoords> implements Instrument {

    public constructor(protected lab : Lab, coords : EllipseCoords) {
        super(lab, coords, [
            new Handle("rightHandle", true),
            new Handle("bottomHandle", true),
            new Handle("centerHandle", true),
        ])
    }

    drawIn(coords : EllipseCoords, group: paper.Group) {
        group.addChild(coords.toRemovedPath());
    }

    onHandleMove(coords: EllipseCoords, handle: Handle, point: paper.Point, delta: paper.Point): void {
        switch (handle.name) {
            case "centerHandle" :
                coords.center = coords.center.add(delta);
                break;

            case "rightHandle":
                let newRadiusX = point.x - coords.center.x;
                let deltaRadiusX = newRadiusX - coords.radiusX;
                if(newRadiusX > 10) {
                    coords.radiusX = coords.radiusX + deltaRadiusX / 2;
                    coords.center = coords.center.add(new paper.Point(deltaRadiusX / 2, 0));
                }
                break;

            case "bottomHandle":
                let newRadiusY = point.y - coords.center.y;
                let deltaRadiusY = newRadiusY - coords.radiusY;
                if(newRadiusY > 10) {
                    coords.radiusY = coords.radiusY + deltaRadiusY / 2;
                    coords.center = coords.center.add(new paper.Point(0, deltaRadiusY / 2));
                }
                break;
        }
    }

    locateHandle(coords: EllipseCoords, handle: Handle): paper.Point {
        switch (handle.name) {
            case "centerHandle" :
                return coords.center;

            case "rightHandle":
                return coords.center.add(new paper.Point(coords.radiusX, 0));

            case "bottomHandle":
                return coords.center.add(new paper.Point(0, coords.radiusY));

            default:
                throw new Error("Unknown handle");
        }

    }

}