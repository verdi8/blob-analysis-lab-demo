import * as paper from "paper";
import {AbstractInstrument, Handle, Instrument} from "./instrument";
import {PathCoords} from "../data/coords/pathCoords";
import {DEBUG_MODE, Lab} from "../lab";
import {EllipseFitter} from "../data/coords/transform/ellipseFitter";

/**
 * Représente la boîte de Petri
 */
export class BlobMask extends AbstractInstrument<PathCoords> implements Instrument {

    /**
     * Appelé lorsque le tracé est fermé
     */
    public onClosed : () => void = () => {};

    /**
     * Appelé lorsque le tracé s'ouvre
     */
    public onOpened : () => void = () => {};

    public constructor(protected lab : Lab, coords : PathCoords) {
        super(lab, coords, [
            new Handle("startHandle", true),
        ])
    }

    drawIn(coords: PathCoords, group: paper.Group) {
        let line = coords.path.clone();
        group.addChild(line);

        if(DEBUG_MODE) {
            if(line.length > 10) {
                const pathCoords = new PathCoords(line.clone());
                group.addChild(new EllipseFitter().transform(pathCoords).toPath());
            }
        }

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
        if(!this.coords.isClosed()) { // Une fois la boucle fermée, on ne peut plus ajouter de
            this.coords.path.add(event.point)
            if(this.coords.isClosed()) {
                this.onClosed();
            }
        }

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
        this._undo(Math.max(this.coords.path.segments.length - 5, 0));
    }

    /**
     * Supprime tout
     */
    public undoAll() {
        this._undo(0);
    }

    /**
     * En charge de la suppression
     */
    private _undo(from : number) {
        let wasClosed = this.coords.isClosed();
        this.coords.path.removeSegments(from);
        if(wasClosed) {
            this.onOpened();
        }
        this.refresh();
    }

}