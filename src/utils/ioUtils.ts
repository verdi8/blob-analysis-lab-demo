/**
 * Une classe utilitaire pour les entrées/sorties
 */
export class IoUtils {

    /**
     * Ouvre un chargement
     */
    public static openTextFile(onTextLoad : (text: string) => void) : void {
        let input : HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.onchange = (e: InputEvent)  => {
            // getting a hold of the file reference
            var file = (e.target as HTMLInputElement).files[0];

            // setting up the reader
            this.readTextFile(file, onTextLoad)

        }
        input.click();
    }

    /**
     * Lit le texte dans un fichier
     */
    public static readTextFile(file: Blob, onTextLoad : (text: string) => void) : void {
        let reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            onTextLoad(readerEvent.target.result as string);
        }
    }
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