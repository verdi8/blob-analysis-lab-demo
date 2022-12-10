import {PathCoords} from "../pathCoords";
import {Measurement} from "../../measurement/measurement";
import {ToEllipseFitter} from "../transform/toEllipseFitter";
import {ToConvexHull} from "../transform/toConvexHull";
import {VectorCoords} from "../vectorCoords";

/**
 * Transforme des coordonnées en Measures
 */
export class CoordsMeasurement {

    /**
     *  Effectue des mesures sur le coordonnées
     */
    public measure(coords : PathCoords, scaleCoords : VectorCoords, scaleUnitCount: number, label: string) : Measurement {
        let path = coords.toRemovedPath();
        path.closePath();

        let linearScale = scaleCoords.distance() / scaleUnitCount; // pixels/cm
        let areaScale = Math.pow(linearScale, 2);
        let fittingEllipse = new ToEllipseFitter().transform(coords);
        let convexHull = new ToConvexHull().transform(coords);

        let area = Math.abs(path.area) / areaScale;
        let convexArea = Math.abs(convexHull.toRemovedPath().area) / areaScale;
        let perimeter = path.length / linearScale;
        let major = fittingEllipse.getMajorAxis() / linearScale;
        let minor = fittingEllipse.getMinorAxis() / linearScale;
        let circularity = 4 * Math.PI * area / Math.pow(perimeter, 2);
        let ar = major / minor;
        let round = (4 * area) / (Math.PI * major * major);
        let solid = area / convexArea;

        return  {
            label: label,
            area: area,
            perimeter: perimeter,
            circularity: circularity,
            ar: ar,
            round: round, solid: solid
        }
    }


}