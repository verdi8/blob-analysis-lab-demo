/**
 * Une classe utilitaire pour données mockées
 */
import expJ1CrB9CoordBlobTxt from './ExpJ1CrB9_Coord_Blob.txt';
import {DataImporter} from "../../src/data/dataImporter";
import {LabData} from "../../src/lab";
import {VectorCoords} from "../../src/data/coords/vectorCoords";
import {EllipseCoords} from "../../src/data/coords/ellipseCoords";

/**
 * Charge des données de tes
 */
export class Fixtures {

    /**
     * Pour charger les données brutes
     */
    private static dataImporter = new DataImporter();

    /**
     * Contenu de ExpJ1CrB9_Coord_Blob.txt
     */
    public static labData() : LabData {
        return  {
            filename: "ExpJ1CrB9.jpg",
            pictureSize: new paper.Size(2250, 4000),
            rulerCoords: new VectorCoords( new paper.Point(542,438), new paper.Point(1929, 398)),
            rulerTickCount : 10,
            petriDishCoords: new EllipseCoords(new paper.Point(1172, 1305), 631, 625),
            blobMaskCoords : this.dataImporter.import(expJ1CrB9CoordBlobTxt),
        }
    }




}