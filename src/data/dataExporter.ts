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

/**
 * Merge des point alignés horizontalement ou verticalement
 */
class PointMerger {

    private startPoint: paper.Point | null;
    private endPoint: paper.Point | null;

    next(point : paper.Point | null) : paper.Point[] {
        if(point == null) { // Null lorsque l'on a passé le dernier point => lus de point à merger, on retourne ce qu'il reste
            if(this.endPoint != null) {
                return [this.startPoint, this.endPoint];
            } else if(this.startPoint != null) {
                return [this.startPoint];
            } else {
                return [];
            }
        } else {
            if (this.startPoint == null) { // On est sur le premier point
                this.startPoint = point;
                return [];
            } else {
                if(this.endPoint == null) { // On a déjà un point de départ
                    if(point.y == this.startPoint.y && point.x == this.startPoint.x) {
                        return []
                    } else if(point.y == this.startPoint.y
                        || point.x == this.startPoint.x) {
                        this.endPoint = point;
                        return [];
                    } else {
                        let result = [this.startPoint];
                        this.startPoint = point;
                        return result
                    }
                } else {
                    if(point.y == this.endPoint.y && point.x == this.endPoint.x) {
                        return [];

                    } else if(point.y == this.endPoint.y && Math.sign(this.endPoint.x - this.startPoint.x) == Math.sign(this.endPoint.x - this.startPoint.x)) {
                        // Dans l'alignement horizontal
                        this.endPoint = point;
                        return [];

                    } else  if(point.x == this.endPoint.x && Math.sign(this.endPoint.y - this.startPoint.y) == Math.sign(this.endPoint.y - this.startPoint.y)) {
                        // Dans l'alignement vertical
                        this.endPoint = point;
                        return [];

                    } else {
                        if(point.y == this.endPoint.y || point.x == this.endPoint.x) {
                            let result = [this.startPoint];
                            this.startPoint = this.endPoint;
                            this.endPoint = point;
                            return  result;

                        } else {
                            let result = [this.startPoint, this.endPoint];
                            this.startPoint = point;
                            this.endPoint = null;
                            return  result;
                        }
                    }
                }
            }
        }
    }
}


export class DataExporter {

    /**
     * Transforme un Path en CSV
     */
    public exportPathPointsAsXYCsv(coords : Coords, close : boolean) : string {
        const path = coords.toRemovedPath();
        let data = "";
        let pointMerger: PointMerger = new PointMerger();
        for (let i = 0; i < path.length; i++) {
            let point = path.getPointAt(i).round();
            pointMerger.next(point).forEach(
                (p) => data += this.toCsv(p)
            );
        }
        pointMerger.next(null).forEach(
            (p) => data += this.toCsv(p)
        );
        return data;
    }

    /**
     * Transforme un Path en CSV par segments
     */
    public exportPathSegmentsAsXYCsv(coords : Coords, close : boolean) : string {
        const path = coords.toRemovedPath();
        let data = "";
        let pointMerger: PointMerger = new PointMerger();
        for (let i = 0; i < path.segments.length; i++) {
            let segment = path.segments[i];
            data += this.toCsv(segment.point.round());
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
        let convexArea = convexHull.toRemovedPath().area / areaScale;
        let perimeter = path.length / linearScale;
        let major = fittingEllipse.getMajorAxis() / linearScale;
        let minor = fittingEllipse.getMinorAxis() / linearScale;
        let circularity = 4 * Math.PI * area / Math.pow(perimeter, 2);
        let ar = major / minor;
        let round = (4 * area) / (Math.PI * major * major);
        let solid = area / convexArea;

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


    private toCsv(point : paper.Point) : string {
        return point.x + "\t" + point.y + "\n";
    }

}