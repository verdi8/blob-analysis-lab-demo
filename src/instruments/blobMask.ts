import * as paper from "paper";
import {AbstractInstrument, Handle, Instrument} from "./instrument";
import {PathCoords} from "../data/coords/pathCoords";
import {Lab} from "../lab";
import {EllipseFitter} from "../data/coords/transform/ellipseFitter";

/**
 * Représente la boîte de Petri
 */
export class BlobMask extends AbstractInstrument<PathCoords> implements Instrument {

    public constructor(protected lab : Lab, coords : PathCoords) {
        super(lab, coords, [
            new Handle("startHandle", true),
        ])
    }

    drawIn(coords: PathCoords, group: paper.Group) {
        let line = coords.path.clone();
        group.addChild(line);

        // Affiche la fitted ellipse
        // if(line.length > 10) {
        // const pathCoords = new PathCoords(line.clone());
        // group.addChild(new EllipseFitter().getFittingEllipse(pathCoords).toPath());
        // }

    }

    onHandleMove(coords: PathCoords, handle: Handle, point: paper.Point, delta: paper.Point): void {
        throw new Error("Method not implemented.");
    }

    locateHandle(coords: PathCoords, handle: Handle): paper.Point {
        if(handle.name == "startHandle") {
            if(coords.path.isEmpty()) {
                return null;
            } else {
                return coords.path.firstSegment.point;
            }
        }
        throw new Error("Unknown handle");
    }

    /**
     * Attacher le handler lors de l'activation
     */
    public onActivation() {
        if(!this.lab.raster.data.blobMaskAttached) {
            this.lab.raster.on("mousedrag", this.onMouseDrag.bind(this));
            this.lab.raster.data.blobMaskAttached = true;
        }
    }

    /**
     * Lorsque quelque chose est déplacé de la règle
     */
    private onMouseDrag(event : paper.MouseEvent) : boolean {
        if(!this.active) {
            return true;
        }
        this.coords.path.add(event.point);
        this.refresh();
        return true;
    }

    protected fillColor(active: boolean, coords : PathCoords): paper.Color | null {
        if(coords.isClosed()) {
            let fillColor = active ? new paper.Color("yellow") : new paper.Color("olive");
            fillColor.alpha = 0.5;
            return fillColor;
        } else {
            return null;
        }
    }

    /**
     * Supprime quelques derniers points
     */
    public undo() {
        this.coords.path.removeSegments(Math.max(this.coords.path.segments.length - 5, 0));
        this.refresh();
    }

    /**
     * Supprime touy
     */
    public undoAll() {
        this.coords.path.removeSegments();
        this.refresh();
    }
}