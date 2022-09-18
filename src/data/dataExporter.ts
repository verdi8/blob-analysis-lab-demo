/**
 * Utilitaire d'export des données
 */
import {LabData} from "../lab";
import {ToEllipseFitter} from "./coords/transform/toEllipseFitter";
import {Coords} from "./coords/coords";
import {MathUtils} from "../utils/mathUtils";
import {ToConvexHull} from "./coords/transform/toConvexHull";
import {PathCoords} from "./coords/pathCoords";

const ROUNDING_DECIMALS = 3;

export class DataExporter {

    /**
     * Transforme un Path en CSV
     */
    public exportPathAsXYCsv(coords : Coords, close : boolean) : string {
        const path = coords.toRemovedPath();
        let data = "";
        for (let i = 0; i < path.segments.length; i++) {
            let segment = path.segments[i];
            data += Math.round(segment.point.x) + "\t" + Math.round(segment.point.y) + "\n";
        }
        return data;
    }

    /**
     * Transforme un Path en CSV
     */
    public exportPathDescriptorsAsCsv(labData : LabData, coords : PathCoords) : string {
        let path = coords.toRemovedPath();
        path.closePath();

        let linearScale = labData.rulerCoords.distance() / labData.rulerTickCount; // pixels/cm
        let areaScale = Math.pow(linearScale, 2);
        let fittingEllipse = new ToEllipseFitter().transform(coords);
        let convexHull = new ToConvexHull().transform(coords);

        let line = 1;
        let label = labData.filename;
        let area = path.area / areaScale;
        let perimeter = path.length / linearScale;
        let circularity = 4 * Math.PI * area / Math.pow(perimeter, 2);
        let ar = fittingEllipse.getMajorAxis() / fittingEllipse.getMinorAxis();
        let round = 4 * area / (Math.PI * fittingEllipse.getMajorAxis());
        let solid = area / (convexHull.toRemovedPath().area / areaScale);

        let headers : string[] = [ " ", "Label", "Area", "Perim.", "Circ.","AR","Round","Solidity"];
        let data = [ line,
            label,
            MathUtils.round(area, ROUNDING_DECIMALS),
            MathUtils.round(perimeter, ROUNDING_DECIMALS),
            MathUtils.round(circularity, ROUNDING_DECIMALS),
            MathUtils.round(ar, ROUNDING_DECIMALS),
            MathUtils.round(round, ROUNDING_DECIMALS),
            MathUtils.round(solid, ROUNDING_DECIMALS),
        ]

        return headers.join(",") + "\n" + data.join(",");
    }


}