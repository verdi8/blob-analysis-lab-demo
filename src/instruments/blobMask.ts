import * as paper from "paper";
import {AbstractInstrument, Handle, Instrument} from "./instrument";
import {PathCoords} from "../data/coords/pathCoords";
import {DEBUG_MODE, Lab} from "../lab";
import {ToEllipseFitter} from "../data/coords/transform/toEllipseFitter";
import {PaperUtils} from "../utils/paperUtils";
import {ToConvexHull} from "../data/coords/transform/toConvexHull";

/**
 * Représente la boîte de Petri
 */
export class BlobMask extends AbstractInstrument<PathCoords> implements Instrument {

    /**
     * Garde l'état fermé ou pas
     */
    private wasClosed: boolean = false;

    /**
     * Appelé lorsque le tracé est fermé
     */
    public onClose : () => void = () => {};

    /**
     * Appelé lorsque le tracé s'ouvre
     */
    public onOpen : () => void = () => {};

    public constructor(protected lab : Lab, coords : PathCoords) {
        super(lab, coords, [
            new Handle("startHandle", true),
        ])
    }

    drawIn(coords: PathCoords, group: paper.Group) {
        let line = coords.toRemovedPath();
        group.addChild(line);
    }

    /**
     * Surcharge pour gérer l'état fermé ouvert du tracé
     */
    refresh() {
        super.refresh();
        let isClosed = this.coords.isClosed();
        if(!this.wasClosed && isClosed) {
            this.onClose();

        } else if(this.wasClosed && !isClosed) {
            this.onOpen();
        }
        this.wasClosed = isClosed;

        if(DEBUG_MODE) { // Traces les contours convexes et fitted ellipse
            if(this.drawGroup.bounds.area > 10) {
                let fittedEllipse = new ToEllipseFitter().transform(this.coords).toRemovedPath();
                fittedEllipse.strokeColor = new paper.Color("red");
                fittedEllipse.strokeWidth = PaperUtils.absoluteDimension(2);
                fittedEllipse.dashArray = [10, 12];
                this.drawGroup.addChild(fittedEllipse);
            }

            let convexHull = new ToConvexHull().transform(this.coords).toRemovedPath();
            convexHull.strokeColor = new paper.Color("red");
            convexHull.strokeWidth = PaperUtils.absoluteDimension(2);
            convexHull.dashArray = [10, 12];
            convexHull.closed = true;
            this.drawGroup.addChild(convexHull);
        }

    }

    onHandleMove(coords: PathCoords, handle: Handle, point: paper.Point, delta: paper.Point): void {
        throw new Error("Method not implemented.");
    }

    locateHandle(coords: PathCoords, handle: Handle): paper.Point {
        if(handle.name == "startHandle") {
            if(coords.points.length == 0) {
                return null;
            } else {
                return coords.points[0];
            }
        }
        throw new Error("Unknown handle");
    }

    /**
     * Attacher le handler lors de l'activation
     */
    public onActivation() {
        if(!this.lab.raster.data.blobMaskAttached) {
            this.lab.raster.on("mousedown", this.onMouseDown.bind(this));
            this.lab.raster.on("mousedrag", this.onMouseDrag.bind(this));
            this.lab.raster.data.blobMaskAttached = true;
        }
    }

    /**
     * Lorsque quelque chose est déplacé de la règle
     */
    private addMousePoint(point : paper.Point) {
        if(!this.coords.isClosed()) { // Une fois la boucle fermée, on ne peut plus ajouter de
            this.coords.points.push(point)
            this.refresh();
        }
        return true;
    }

    private onMouseDown(event : paper.MouseEvent) : boolean {
        if(!this.active) {
            return true;
        }
        if(event.modifiers.control) {
            return true; // On ne fait si CONTROL est pressé en dessinant
        }
        this.addMousePoint(event.point);
        return true;
    }

    /**
     * Déplacement de la souris
     */
    private onMouseDrag(event : paper.MouseEvent) : boolean {
        if(!this.active) {
            return true;
        }
        if(event.modifiers.control) {
            return true; // On ne fait si CONTROL est pressé en dessinant
        }
        this.addMousePoint(event.point);
        return true;
    }


    protected override fillColor(active: boolean, coords : PathCoords): paper.Color | null {
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
        this._undo(Math.max(this.coords.points.length - 5, 0));
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
        this.coords.points = this.coords.points.slice(0, from);
        this.refresh();
    }

}