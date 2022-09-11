import * as paper from "paper";
import {AbstractInstrument, Instrument} from "./instrument";
import {Vector} from "../maths/vector";
import {PaperUtils} from "../utils/paperUtils";

const HANDLE_WIDTH = 10;

const LINE_WIDTH = 2;

/**
 * Représente une règle
 */
export class Ruler extends AbstractInstrument implements Instrument {

    /**
     * Un vecteur pour représenter la règle
     */
    public coords: Vector | null = null;

    /**
     * Le Group paperjs d'affichage de la règle
     */
    private rulerGroup: paper.Group | null = null;

    clear(): void {
        if(this.rulerGroup != null) {
            this.rulerGroup.remove();
        }
        this.rulerGroup = null;
        this.coords = null;
    }

    bounds(): paper.Rectangle {
        if(this.coords != null) {
            return new paper.Rectangle(this.coords.start, this.coords.end);
        } else {
            return null;
        }
    }

    /**
     * Lorsque quelque chose est déplacé de la règle
     */
    private onMouseDrag(event) : boolean {
        if(!this.active) {
            return true;
        }
        let startHandle = this.rulerGroup.getItem({ name : "startHandle"});
        let endHandle = this.rulerGroup.getItem({ name : "endHandle"});
        if(event.target == startHandle) {
            this.coords.start = this.coords.start.add(event.delta);

        } else if(event.target == endHandle) {
            this.coords.end = this.coords.end.add(event.delta);
        }
        this.refresh();
        return true;
    }

    refresh(): void {
        if(this.coords == null) {
            if(this.active) {
                // On est dans le cas d'une activation alors que l'instrument n'a pas été placé

                // Pas de données d'image définie, on ne fait rien
                if(this.lab.data == null) {
                    return;
                }

                // Position par défaut
                this.coords = new Vector(
                    new paper.Point(
                        this.lab.data.pictureSize.width * 0.25,
                        this.lab.data.pictureSize.height / 2
                    ),
                    new paper.Point(
                        this.lab.data.pictureSize.width * 0.75,
                        this.lab.data.pictureSize.height / 2
                    )
                );

            } else { // Instrument inactif et non initialisé : on ne fait rien
                return;
            }
        }

        if(this.rulerGroup == null) {
            this.rulerGroup = new paper.Group();

            // line
            let line = new paper.Path.Line(this.coords.start, this.coords.end);
            line.name = "line";
            this.rulerGroup.addChild(line);

            // start handle
            let startHandle = new paper.Path.RegularPolygon(this.coords.start, 4, 100);
            startHandle.name = "startHandle";
            startHandle.onMouseDrag = this.onMouseDrag.bind(this);
            this.rulerGroup.addChild(startHandle);

            // end handle
            let endHandle = new paper.Path.RegularPolygon(this.coords.start, 4, 100);
            endHandle.name = "endHandle";
            endHandle.onMouseDrag = this.onMouseDrag.bind(this);
            this.rulerGroup.addChild(endHandle);
        }

        this.rulerGroup.strokeColor = this.defaultColor();

        let startHandle = this.rulerGroup.getItem({ name : "startHandle"});
        startHandle.position = this.coords.start;
        startHandle.strokeColor = this.handleColor();
        startHandle.fillColor = this.handleColor();
        PaperUtils.rescaleToAbsoluteWidth(startHandle, HANDLE_WIDTH);

        let endHandle = this.rulerGroup.getItem({ name : "endHandle"});
        endHandle.position = this.coords.end;
        endHandle.strokeColor = this.handleColor();
        endHandle.fillColor = this.handleColor();
        PaperUtils.rescaleToAbsoluteWidth(endHandle, HANDLE_WIDTH);

        let line = this.rulerGroup.getItem({ name : "line"}) as paper.Path;
        line.removeSegments();
        line.add(this.coords.start, this.coords.end);
        line.strokeColor = this.defaultColor();
        PaperUtils.strokeWidthToAbsoluteWidth(line, LINE_WIDTH);

        paper.view.update();
    }




}