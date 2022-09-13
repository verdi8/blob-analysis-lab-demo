import * as paper from "paper";
import {AbstractInstrument, Handle, Instrument} from "./instrument";
import {CircleCoords} from "../data/coords/circleCoords";
import {Lab} from "../lab";

/**
 * Représente la boîte de Petri
 */
export class PetriDish extends AbstractInstrument<CircleCoords> implements Instrument {

    public constructor(protected lab : Lab, coords : CircleCoords) {
        super(lab, coords, [
            new Handle("rightHandle", true),
            new Handle("bottomHandle", true),
            new Handle("centerHandle", true),
        ])
    }

    drawIn(coords : CircleCoords, group: paper.Group) {
        group.addChild(new paper.Path.Circle(coords.center, coords.radius));
    }

    onHandleMove(coords: CircleCoords, handle: Handle, point: paper.Point, delta: paper.Point): void {
        switch (handle.name) {
            case "centerHandle" :
                coords.center = coords.center.add(delta);
                break;

            case "rightHandle":
                let newRadiusX = point.x - coords.center.x;
                let deltaRadiusX = newRadiusX - coords.radius;
                if(newRadiusX > 10) {
                    coords.radius = coords.radius + deltaRadiusX / 2;
                    coords.center = coords.center.add(new paper.Point(deltaRadiusX, 0));
                }
                break;

            case "bottomHandle":
                let newRadiusY = point.y - coords.center.y;
                let deltaRadiusY = newRadiusY - coords.radius;
                if(newRadiusY > 10) {
                    coords.radius = coords.radius + deltaRadiusY / 2;
                    coords.center = coords.center.add(new paper.Point(0, deltaRadiusY));
                }
                break;
        }
    }

    locateHandle(coords: CircleCoords, handle: Handle): paper.Point {
        switch (handle.name) {
            case "centerHandle" :
                return coords.center;

            case "rightHandle":
                return coords.center.add(new paper.Point(coords.radius, 0));

            case "bottomHandle":
                return coords.center.add(new paper.Point(0, coords.radius));

            default:
                throw new Error("Unknown handle");
        }

    }

}