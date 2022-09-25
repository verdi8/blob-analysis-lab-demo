import * as paper from "paper";

/**
 * Décrit les composantes RGB + alpha (0 transparent => 1, 255 => opaque)
 */
export interface Rgba { r : number, g : number, b : number, a : number }

/**
 * Accès direct aux données sous-jacente à un raster (Canva/2d context et image data)
 */
export class ImageDataWrapper {

    /**
     * Factory method autour d'un Raster
     */
    public static forRaster(raster : paper.Raster) : ImageDataWrapper {
        return new ImageDataWrapper(raster.getImageData(new paper.Rectangle(0, 0, raster.width, raster.height)));
    }

    constructor(public imageData : ImageData) {
    }

    /**
     * Donne les données RGBA (alpha) aux coordonnées données
     */
    getRgbaAt(x: number, y: number) : Rgba {
        return this.getRgabAtOffset(this.offset(x, y));
    }

    /**
     * Donne les données RGBA (alpha) aux coordonnées données
     */
    setRgbaAt(x: number, y: number, rgba : Rgba) : void {
        this.setRgabAtOffset(this.offset(x, y), rgba);
    }

    /**
     * Définit le Rgba à l'offset
     */
    private setRgabAtOffset(offset : number, rgba : Rgba) {
        this.imageData.data[offset] = rgba.r;
        this.imageData.data[offset + 1] = rgba.g;
        this.imageData.data[offset + 2] = rgba.b;
        this.imageData.data[offset + 3] = rgba.a;
    }

    /**
     * Donne le Rgba à l'offset
     */
    private getRgabAtOffset(offset : number) : Rgba{
        return { r: this.imageData.data[offset], g: this.imageData.data[offset + 1], b: this.imageData.data[offset + 2], a: this.imageData.data[offset + 3] };
    }

    /**
     * Donne l'offset dans l'ImageData
     */
    private offset(x: number, y: number) : number {
        return this.imageData.data.byteOffset + (y * this.imageData.width) * 4 + (x * 4);
    }

    /**
     * Applique une fonction (comme un filtre) à chaque pixel
     */
    apply(f : (Rgba) => Rgba) : ImageDataWrapper {

        for (let offset = this.imageData.data.byteOffset; offset <  this.imageData.data.length; offset = offset + 4) {
            this.setRgabAtOffset(offset, f(this.getRgabAtOffset(offset)));
        }
        return this;
    }

    /**
     * Remplace l'ImageData dans la cible
     */
    andStore(canvasRenderingContext2D : CanvasRenderingContext2D) {
        canvasRenderingContext2D.putImageData(this.imageData, 0, 0);
    }

}