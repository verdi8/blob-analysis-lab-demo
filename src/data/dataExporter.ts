/**
 * Utilitaire d'export des données
 */
import {LabData} from "../lab";
import {EllipseFitter} from "./coords/transform/ellipseFitter";
import {PathCoords} from "./coords/pathCoords";
import {Coords} from "./coords/coords";
import {MathUtils} from "../utils/mathUtils";

const ROUNDING_DECIMALS = 3;

export class DataExporter {

    /**
     * Transforme un Path en CSV
     */
    public exportPathAsXYCsv(coords : Coords, close : boolean) : string {
        const path = coords.toPath();
        if(close) {
            path.closePath();
        }
        let data = "";
        for (let i = 0; i < path.length; i++) {
            let point = path.getPointAt(i);
            data += Math.round(point.x) + "\t" + Math.round(point.y) + "\n";
        }
        return data;
    }

    /**
     * Transforme un Path en CSV
     */
    public exportPathDescriptorsAsCsv(labData : LabData, coords : Coords) : string {
        let path = coords.toPath();
        path.closePath();

        let linearScale = labData.rulerCoords.distance() / labData.rulerTickCount; // pixels/cm
        let areaScale = Math.pow(linearScale, 2);
        let fittingEllipse = new EllipseFitter().getFittingEllipse(coords);

        let line = 1;
        let label = labData.filename;
        let area = path.area / areaScale;
        let perimeter = path.length / linearScale;
        let circularity = 4 * Math.PI * area / Math.pow(perimeter, 2);
        let ar = fittingEllipse.getMajorAxis() / fittingEllipse.getMinorAxis();
        let round = 4 * area / (Math.PI * fittingEllipse.getMajorAxis());
        let solid = "todo";

        let headers : string[] = [ " ", "Label", "Area", "Perim.", "Circ.","AR","Round","Solidity"];
        let data = [ line,
            label,
            MathUtils.round(area, ROUNDING_DECIMALS),
            MathUtils.round(perimeter, ROUNDING_DECIMALS),
            MathUtils.round(circularity, ROUNDING_DECIMALS),
            MathUtils.round(ar, ROUNDING_DECIMALS),
            MathUtils.round(round, ROUNDING_DECIMALS),
            solid,
        ]

        return headers.join(",") + "\n" + data.join(",");
    }


}