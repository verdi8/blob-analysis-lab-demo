import * as paper from "paper";
import {AbstractInstrument, Instrument} from "./instrument";
import {PaperUtils} from "../utils/paperUtils";
import {CircleCoords} from "../maths/circleCoords";

const HANDLE_WIDTH = 10;

const LINE_WIDTH = 2;

/**
 * Représente la boîte de Petri
 */
export class PetriDish extends AbstractInstrument implements Instrument {
    /**
     * Représente le coordonnées de la boîte
     */
    public coords : CircleCoords | null = null;

    /**
     * Le Group paperjs d'affichage de la boîte
     */
    private dishGroup: paper.Group | null = null;

    clear(): void {
        if(this.dishGroup != null) {
            this.dishGroup.remove();
        }
        this.dishGroup = null;
        this.coords = null;
    }

    bounds(): paper.Rectangle {
        if(this.coords != null) {
            return new paper.Rectangle(this.coords.center.x - this.coords.radius, this.coords.center.y - this.coords.radius, this.coords.radius * 2, this.coords.radius * 2);
        } else {
            return null;
        }
    }

    /**
     * Lorsque quelque chose est déplacé de la règle
     */
    private onMouseDrag(event) : boolean {
        if(!this.active || event.point.x < 0) {
            return true;
        }
        let centerHandle = this.dishGroup.getItem({ name : "centerHandle"});
        let rightHandle = this.dishGroup.getItem({ name : "rightHandle"});
        let bottomHandle = this.dishGroup.getItem({ name : "bottomHandle"});
        if(event.target == centerHandle) {
            this.coords.center = this.coords.center.add(event.delta);

        } else if(event.target == rightHandle) {
            let newRadius = event.point.x - this.coords.center.x;
            if(newRadius > 10) {
                this.coords.radius = newRadius;
            }

        } else if(event.target == bottomHandle) {
            let newRadius = event.point.y - this.coords.center.y;
            if(newRadius > 10) {
                this.coords.radius = newRadius;
            }
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
                this.coords = new CircleCoords(
                    new paper.Point(
                        this.lab.data.pictureSize.width/ 2,
                        this.lab.data.pictureSize.height / 2
                    ),
                    this.lab.data.pictureSize.width * 0.75 / 2
                );

            } else { // Instrument inactif et non initialisé : on ne fait rien
                return;
            }
        }

        if(this.dishGroup == null) {
            this.dishGroup = new paper.Group();

            // circle
            let circle = new paper.Path();
            circle.name = "circle";
            this.dishGroup.addChild(circle);

            // center handle
            let centerHandle = new paper.Path.RegularPolygon(new paper.Point(0,0), 4, 100);
            centerHandle.name = "centerHandle";
            centerHandle.onMouseDrag = this.onMouseDrag.bind(this);
            this.dishGroup.addChild(centerHandle);

            // right handle
            let rightHandle = new paper.Path.RegularPolygon(new paper.Point(0,0), 4, 100);
            rightHandle.name = "rightHandle";
            rightHandle.onMouseDrag = this.onMouseDrag.bind(this);
            this.dishGroup.addChild(rightHandle);

            // bottom handle
            let bottomHandle = new paper.Path.RegularPolygon(new paper.Point(0,0), 4, 100);
            bottomHandle.name = "bottomHandle";
            bottomHandle.onMouseDrag = this.onMouseDrag.bind(this);
            this.dishGroup.addChild(bottomHandle);
        }


        this.dishGroup.strokeColor = this.defaultColor();

        let centerHandle = this.dishGroup.getItem({ name : "centerHandle"});
        centerHandle.position = this.coords.center;
        centerHandle.strokeColor = this.handleColor();
        centerHandle.fillColor = this.handleColor();
        centerHandle.visible = this.active;
        PaperUtils.rescaleToAbsoluteWidth(centerHandle, HANDLE_WIDTH);

        let rightHandle = this.dishGroup.getItem({ name : "rightHandle"});
        rightHandle.position = this.coords.center.add(new paper.Point(this.coords.radius, 0));
        rightHandle.strokeColor = this.handleColor();
        rightHandle.fillColor = this.handleColor();
        PaperUtils.rescaleToAbsoluteWidth(rightHandle, HANDLE_WIDTH);

        let bottomHandle = this.dishGroup.getItem({ name : "bottomHandle"});
        bottomHandle.position = this.coords.center.add(new paper.Point(0, this.coords.radius));
        bottomHandle.strokeColor = this.handleColor();
        bottomHandle.fillColor = this.handleColor();
        PaperUtils.rescaleToAbsoluteWidth(bottomHandle, HANDLE_WIDTH);

        let circle = this.dishGroup.getItem({ name : "circle"}) as paper.Path;
        circle.removeSegments();
        circle.copyContent(new paper.Path.Circle(this.coords.center, this.coords.radius ));
        PaperUtils.strokeWidthToAbsoluteWidth(circle, LINE_WIDTH);

        paper.view.update();
    }



}