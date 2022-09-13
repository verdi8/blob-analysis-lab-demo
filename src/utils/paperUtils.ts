import * as paper from "paper";

/**
 * Classe d'utilitaires pour PaperJS
 */
export class PaperUtils {

    /**
     * Applique un scale pour obtenir une taille absolue (prise en compte du zoom)
     */
    public static rescaleToAbsoluteWidth(item : paper.Item, width : number) : void {
        let targetRelativeWidth = Math.round(width / paper.view.zoom);
       if(item.bounds.width != targetRelativeWidth) {
           item.scale(targetRelativeWidth / item.bounds.width);
       }
    }

    /**
     * Calcul un strokeWidth pour obtenir une épaisseur absolue (quelque soit le zoom)
     */
    public static absoluteDimension(dimension : number) : number {
        return  Math.round(dimension / paper.view.zoom);
    }

    /**
     * Change le curseur sur le canvas
     */
    public static changeCursor(cursor : string) {
        paper.view.element.style.setProperty("cursor", cursor);
    }

}