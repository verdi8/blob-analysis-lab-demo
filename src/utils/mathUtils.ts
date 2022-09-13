/**
 * Enrichit des fonctions mathématiques
 */
export class MathUtils {

    /**
     * Arrondit avec des décimales
     */
    public static round(value : number, decimals : number) {
        let tenPow = Math.pow(10, decimals);
        return Math.round((value + Number.EPSILON) * tenPow) / tenPow;
    }

}