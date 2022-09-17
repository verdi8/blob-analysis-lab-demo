import * as paper from "paper";
import {DEBUG_MODE, Lab} from "../lab";
import {Coords} from "../data/coords/coords";
import {PaperUtils} from "../utils/paperUtils";
import {ToEllipseFitter} from "../data/coords/transform/toEllipseFitter";

/**
 * Un instrument d'analyse
 */
export interface Instrument  {

    /**
     * Active l'instrument
     */
    activate() : void;

    /**
     * Active l'instrument
     */
    deactivate() : void;

    /**
     * Indique si l'instrument a été activé une fois
     */
    hasBeenStarted() : void;

    /**
     * Retire l'instrument
     */
    clear() : void;

    /**
     * Rafraîchit l'affichage
     */
    refresh() : void;

}

/**
 * Décrit une poignée
 */
export class Handle {

    public constructor(public name : String,  public moveable : boolean) {
    }

}

export interface Handles {[key: string]: Handle};

export abstract class AbstractInstrument<C extends Coords> implements Instrument{

    /**
     * Instrument actif / inactif
     */
    public active : boolean = false;

    private started : boolean = false;

    /**
     * Contient le dessin de l'instrument
     */
    protected drawGroup : paper.Group = new paper.Group();

    protected constructor(protected lab : Lab, protected coords : C,  protected handles : Handle[]) {
    }

    public activate() : void {
        this.active = true;
        this.started = true;
        this.onActivation();
        this.refresh();
    };

    public deactivate() : void {
        this.active = false;
        this.onDeactivation();
        this.refresh();
    };

    public clear(): void {
        this.coords = null;
        this.drawGroup.remove();
    }

    public hasBeenStarted() {
        return this.started;
    }

    public refresh() : void {
        if(!this.started) { // N'affiche rien l'instrument n'a pas été activé une fois
            return;
        }

        // Remove les enfants mais pas le groupe
        this.drawGroup.removeChildren().forEach((child: paper.Item) => child.remove());

        // Le dessin de l'instrument
        this.drawIn(this.coords, this.drawGroup);
        this.drawGroup.strokeWidth = 1;
        this.drawGroup.strokeScaling = false;
        this.drawGroup.strokeColor = this.outlineColor(this.active);
        this.drawGroup.fillColor = this.fillColor(this.active, this.coords);

        // Ajoute les poignées
        if(this.active) {
            for (let handle of this.handles) {
                let location = this.locateHandle(this.coords, handle);
                if (location != null) {
                    let path = new paper.Path.RegularPolygon(location, 4, PaperUtils.absoluteDimension(5));
                    path.strokeColor = new paper.Color("black");
                    path.fillColor = new paper.Color("white");
                    if (handle.moveable) {
                        path.onMouseDrag = (event: paper.MouseEvent) => {
                            this.onHandleMove(this.coords, handle, event.point, event.delta)
                            this.refresh();
                        }
                        path.onMouseEnter = () => {
                            PaperUtils.changeCursor("crosshair");
                        };
                        path.onMouseLeave = () => {
                            PaperUtils.changeCursor(null);
                        };
                    }
                    this.drawGroup.addChild(path);
                }
            }
        }
    }

    /**
     * Pour dessiner le coutour (sans les poignées).
     * Le groupe est vide lors de l'appel de cette méthode.
     */
    abstract drawIn(coords : C, group : paper.Group);

    /**
     * Appelé lorsqu'une poignée est bougée pour mettre à jour les coordonnées
     */
    abstract onHandleMove(coords : C, handle: Handle, point : paper.Point, delta : paper.Point) : void;

    /**
     * Appelé pour localiser une poignée par rapport aux coordonnnées.
     * Si null, poignée non affichée
     */
    abstract locateHandle(coords : C, handle : Handle) : paper.Point | null;

    /**
     * A surcharger si besoin
     */
    protected outlineColor(active : boolean) : paper.Color | null {
        if(active) {
            return new paper.Color("yellow");
        } else {
            return new paper.Color("olive");
        }
    }

    /**
     * A surcharger si besoin
     */
    protected fillColor(active : boolean, coords : C) : paper.Color | null {
        return null;
    }

    /**
     * A surcharger si besoin
     */
    protected onActivation() : void {
    }

    /**
     * A surcharger si besoin
     */
    protected onDeactivation() : void {
    }

}