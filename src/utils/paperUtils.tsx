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
     * Applique un strokeWidth pour obtenir une épiasseur absolue (prise en compte du zoom)
     */
    public static strokeWidthToAbsoluteWidth(item : paper.Item, width : number) : void {
        let targetRelativeWidth = Math.round(width / paper.view.zoom);
        if(item.strokeWidth != targetRelativeWidth) {
            item.strokeWidth = targetRelativeWidth;
        }
    }



}