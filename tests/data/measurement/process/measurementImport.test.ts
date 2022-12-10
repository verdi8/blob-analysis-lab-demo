import {WorkInfoFormatter} from "../../../../src/data/work/process/workInfoFormatter";
import {ExperienceEnum, GroupeEnum} from "../../../../src/data/work/workInfo";
import {ObjectUtils} from "../../../../src/utils/objectUtils";
import {MeasurementImport} from "../../../../src/data/measurement/process/measurementImport";
import resultsExpJ1CrB9Csv from "../../../fixtures/Results_ExpJ1CrB9.csv";
import resultsConJ11ExCsv from "../../../fixtures/Results_ConJ11Ex.csv";

describe('Testing Measurement import...', () => {

    /**
     * Class under test
     */
    let measurementImport = new MeasurementImport();

    it('Mono blob is well imported ', () => {
        let data = measurementImport.readMeasures("Results_ExpJ1CrB9.csv", resultsExpJ1CrB9Csv);
        expect(data.work.groupe).toEqual(GroupeEnum.Experimental);
        expect(data.work.jour).toEqual(1);
        expect(data.work.experience).toEqual(ExperienceEnum.Croissance);
        expect(data.work.blob).toEqual(9);

        expect(data.measurements).toHaveSize(1);
        expect(data.measurements[0]).toEqual({
            label: "ExpJ1CrB9.jpg" ,
            area: 33.4,
            perimeter: 33.93,
            circularity: 0.365,
            ar: 1.625,
            round: 0.615,
            solid: 0.871
        });
    });

    it('Multi blob is well imported ', () => {
        let data = measurementImport.readMeasures("Results_ConJ11Ex.csv", resultsConJ11ExCsv);
        expect(data.work.groupe).toEqual(GroupeEnum.Controle);
        expect(data.work.jour).toEqual(11);
        expect(data.work.experience).toEqual(ExperienceEnum.Exploration);
        expect(data.work.blob).toBeNull();

        expect(data.measurements).toHaveSize(3);
        expect(data.measurements[0]).toEqual({
            label: "ConJ11ExB1.jpg" ,
            area: 11.22,
            perimeter: 54.93,
            circularity: 1.212,
            ar: 0.4,
            round: 0.4,
            solid: 0.271
        });
        expect(data.measurements[1]).toEqual({
            label: "ConJ11ExB2.jpg" ,
            area: 33.4,
            perimeter: 33.93,
            circularity: 0.365,
            ar: 1.625,
            round: 0.615,
            solid: 0.871
        });
        expect(data.measurements[2]).toEqual({
            label: "ConJ11ExB9.jpg" ,
            area: 15.9,
            perimeter: 55.87,
            circularity: 0.6,
            ar: 1.98,
            round: 0.1,
            solid: 0.45
        });

    });

});