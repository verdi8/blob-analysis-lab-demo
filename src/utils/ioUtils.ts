/**
 * Une classe utilitaire pour les entrées/sorties
 */
export class IoUtils {

    /**
     * Donne le nom de fichier sans extension
     */
    public static basename(filename : string) : string {
        return filename.replace(/\.[^/.]+$/, "");
    }

    /**
     * Déclenche un téléchargement
     */
    public static downloadData(filename : string, mimeType : string, data : string) {
        this.downloadDataUrl(filename, "data:" + mimeType + "," + encodeURIComponent(data));
    }

    /**
     * Déclenche un téléchargement
     */
    public static downloadDataUrl(filename : string, dataUrl : string) {
        let anchor = document.createElement("a");
        anchor.href = dataUrl;
        anchor.download = filename;
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }
}