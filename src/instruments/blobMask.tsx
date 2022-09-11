import * as paper from "paper";
import {AbstractInstrument, Instrument} from "./instrument";
import {PaperUtils} from "../utils/paperUtils";

const HANDLE_WIDTH = 10;

const LINE_WIDTH = 2;

/**
 * Représente la boîte de Petri
 */
export class BlobMask extends AbstractInstrument implements Instrument {

    /**
     * Représente le point de départ du masque
     */
    public coords : paper.Path | null = null;

    /**
     * Le Group paperjs d'affichage de la boîte
     */
    private maskGroup: paper.Group | null = null;


    clear(): void {
        if(this.maskGroup != null) {
            this.maskGroup.remove();
        }
        this.maskGroup = null;
        this.coords = null;
    }

    bounds(): paper.Rectangle {
        if(this.coords != null) {
            return this.coords.bounds;
        } else {
            return null;
        }
    }

    /**
     * Indique si le masque est fermé (le dernier point est proche du premier)
     */
    public isClosed() : boolean {
        return this.coords != null
            && this.coords.firstSegment.point.getDistance(this.coords.lastSegment.point) < 10
    }

    /**
     * Surchage de l'activation pour attacher le handler
     */
    public activate() {
        super.activate();
        if(this.lab.raster != null && !this.lab.raster.data.blobMaskAttached) {
            this.lab.raster.on("mousedrag", this.onMouseDrag.bind(this));
            this.lab.raster.data.blobMaskAttached = true;
        }
    }

    /**
     * Surchage de la désactivation pour attacher le handler
     */
    public deactivate() {
        super.deactivate();
    }

    /**
     * Lorsque quelque chose est déplacé de la règle
     */
    private onMouseDrag(event : paper.MouseEvent) : boolean {
        if(!this.active) {
            return true;
        }

        if(this.coords == null) {
            this.coords = new paper.Path();
        }
        this.coords.add(event.point);

        this.refresh();
        return true;
    }

    refresh(): void {
        if(this.coords == null) {
            return;
        }

        if(this.maskGroup == null) {
            this.maskGroup = new paper.Group();

            // start handle
            let startHandle = new paper.Path.RegularPolygon(this.coords.firstSegment.point, 4, 100);
            startHandle.name = "startHandle";
            this.maskGroup.addChild(startHandle);

            // line
            let line = new paper.Path();
            line.name = "line";
            this.maskGroup.addChild(line);
        }

        this.maskGroup.strokeColor = this.defaultColor();

        let startHandle = this.maskGroup.getItem({ name : "startHandle"});
        startHandle.position = this.coords.firstSegment.point;
        startHandle.strokeColor = this.handleColor();
        startHandle.fillColor = this.handleColor();
        PaperUtils.rescaleToAbsoluteWidth(startHandle, HANDLE_WIDTH);

        let line = this.maskGroup.getItem({ name : "line"}) as paper.Path;
        line.removeSegments();
        line.addSegments(this.coords.segments);
        line.smooth({ type: 'continuous' });
        line.strokeColor = new paper.Color(this.active ? "yellow" : "olive");
        line.fillColor = this.isClosed() ? new paper.Color(this.active ? "yellow" : "olive") : null;
        PaperUtils.strokeWidthToAbsoluteWidth(line, LINE_WIDTH);
        paper.view.update();
    }



}