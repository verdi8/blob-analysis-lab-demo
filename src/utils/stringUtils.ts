/**
 * Utilitaires
 */
export class StringUtils {

    /**
     * Découpe en multi-ligne
     */
    public static splitLines(text: string) : string[] {
        return text.split(/\r?\n/);
    }


}