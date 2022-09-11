import * as paper from "paper";
import * as React from "react";
import {Lab} from "../lab";

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
     * Retire l'instrument
     */
    clear() : void;

    /**
     * Rafraîchit l'affichage
     */
    refresh() : void;

    /**
     * Donne le contour de l'instrument.
     * @return null si l'instrument n'est pas dessiné
     */
    bounds() : paper.Rectangle;

}

const ACTIVE_HANDLE_COLOR: paper.Color = new paper.Color("yellow");
const INACTIVE_HANDLE_COLOR: paper.Color = new paper.Color("darkred");
const ACTIVE_DEFAULT_COLOR: paper.Color = new paper.Color("red");
const INACTIVE_DEFAULT_COLOR: paper.Color = new paper.Color("darkred");

export abstract class AbstractInstrument implements Instrument{

    /**
     * Instrument actif / inactif
     */
    protected active : boolean = false;

    public constructor(protected lab : Lab) {
    }

    activate() : void {
        this.active = true;
        this.refresh();
    };

    deactivate() : void {
        this.active = false;
        this.refresh();
    };

    abstract bounds() : paper.Rectangle;

    abstract refresh() : void;

    abstract clear(): void;

    /**
     * La couleur à utiliser par défaut
     */
    protected defaultColor() : paper.Color {
        return this.active ? ACTIVE_DEFAULT_COLOR : INACTIVE_DEFAULT_COLOR;
    }

    /**
     * La couleur à utiliser pour les poignées
     */
    protected handleColor() : paper.Color {
        return this.active ? ACTIVE_HANDLE_COLOR : INACTIVE_HANDLE_COLOR;
    }

    /**
     * Génère une poignée
     */
    protected handle(name: string) {
        return new paper.Path.RegularPolygon(new paper.Point(0,0), 4, 100);
    }


}