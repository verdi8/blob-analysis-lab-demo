/**
 * Utilitaire autour des objets
 */
export class ObjectUtils {

    /**
     * Deep clonin
     */
    public static deepClone<T>(obj:  T) : T{
        return JSON.parse(JSON.stringify(obj)) as T;
    }

}