/**
 * Classe utilitaire sur les tableaux
 */
export class ArrayUtils {

    /**
     * Donne l'item suivant dans une liste d'items
     * @return null si l'item n'existe pas ou est le dernier item
     */
    public static nextItem<I>(items : I[], item : I) : I | null {
        let index = items.indexOf(item);
        if(index >= 0 && index < items.length - 1) {
            return items[index + 1]
        } else {
            return null;
        }
    }

    /**
     * Donne l'item suivant dans une liste d'items
     * @return null si l'item n'existe pas ou est le dernier item
     */
    public static contains<I>(items : I[], item : I) : boolean {
        return items.indexOf(item) != -1;
    }


}