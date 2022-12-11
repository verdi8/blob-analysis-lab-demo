/**
 * Utilitaire d'export des données
 */
import {LabData} from "../lab";
import {Coords} from "./coords/coords";
import {MeasurementExport} from "./measurement/process/measurementExport";
import {CoordsMeasurement} from "./coords/process/coordsMeasurement";
import {PointMerger} from "./coords/process/pointMerger";

export class DataExporter {

    /**
     * Pour effectuer les mesures
     */
    private coordsMeasure = new CoordsMeasurement();

    /**
     * Pour l'export des données de mesures
     */
    private measureExport: MeasurementExport = new MeasurementExport();

    /**
     * Transforme un Path en CSV
     */
    public exportPathPointsAsXYCsv(coords : Coords, close : boolean) : string {
        const path = coords.toRemovedPath();
        let data = "";
        let pointMerger = new PointMerger();
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
    public exportPathDescriptorsAsCsv(labData : LabData) : string {
        let measurement = this.coordsMeasure.measure(labData.blobMaskCoords, labData.rulerCoords, labData.rulerTickCount, labData.filename);
        return this.measureExport.exportMeasurements(labData.workInfo,[measurement]).csv;
    }


    private toCsv(point : paper.Point) : string {
        return point.x + "\t" + point.y + "\n";
    }


}