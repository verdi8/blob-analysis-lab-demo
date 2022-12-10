import {ExperienceEnum, GroupeEnum} from "../../../../src/data/work/workInfo";
import {MeasurementImport} from "../../../../src/data/measurement/process/measurementImport";
import resultsExpJ1CrB9Csv from "../../../fixtures/Results_ExpJ1CrB9.csv";
import resultsConJ11ExB1Csv from "../../../fixtures/Results_ConJ11ExB1.csv";
import resultsConJ11ExB2Csv from "../../../fixtures/Results_ConJ11ExB2.csv";
import resultsConJ11ExB9Csv from "../../../fixtures/Results_ConJ11ExB9.csv";
import {MeasurementMerge} from "../../../../src/data/measurement/process/measurementMerge";
import {MeasurementWorks} from "../../../../src/data/measurement/measurementWorks";

describe('Testing Measurement merge...', () => {

    /**
     * Class under test
     */
    let measurementMerge = new MeasurementMerge();

    /**
     * Pour d'abord importer les données
     */
    let measurementImport = new MeasurementImport();

    it('Merge works well', () => {
        let measurementWorks: MeasurementWorks = {};
        {
            let {work, measurements} = measurementImport.readMeasures("Results_ConJ11ExB9.csv", resultsConJ11ExB9Csv);
            measurementWorks = measurementMerge.mergeInto(measurementWorks, "Results_ConJ11ExB9.csv", work, measurements);
        }
        {
            let {work, measurements} = measurementImport.readMeasures("Results_ConJ11ExB1.csv", resultsConJ11ExB1Csv);
            measurementWorks = measurementMerge.mergeInto(measurementWorks, "Results_ConJ11ExB1.csv", work, measurements);
        }
        {
            let {work, measurements} = measurementImport.readMeasures("Results_ExpJ1CrB9.csv", resultsExpJ1CrB9Csv);
            measurementWorks = measurementMerge.mergeInto(measurementWorks, "Results_ExpJ1CrB9.csv", work, measurements);
        }
        {
            let {work, measurements} = measurementImport.readMeasures("Results_ConJ11ExB2.csv", resultsConJ11ExB2Csv);
            measurementWorks = measurementMerge.mergeInto(measurementWorks, "Results_ConJ11ExB2.csv", work, measurements);
        }
        expect(measurementWorks).toHaveSize(2);
        expect(measurementWorks["ExpJ1Cr"].work).toEqual({groupe: GroupeEnum.Experimental, jour: 1, experience: ExperienceEnum.Croissance, blob: null});
        expect(measurementWorks["ExpJ1Cr"].files).toHaveSize(1);
        expect(measurementWorks["ExpJ1Cr"].files["Results_ExpJ1CrB9.csv"]).toHaveSize(1);
        expect(measurementWorks["ExpJ1Cr"].files["Results_ExpJ1CrB9.csv"][0]).toEqual({
            label: "ExpJ1CrB9.jpg" ,
            area: 33.4,
            perimeter: 33.93,
            circularity: 0.365,
            ar: 1.625,
            round: 0.615,
            solid: 0.871
        });
        expect(measurementWorks["ConJ11Ex"].work).toEqual({groupe: GroupeEnum.Controle, jour: 11, experience: ExperienceEnum.Exploration, blob: null});
        expect(measurementWorks["ConJ11Ex"].files).toHaveSize(3);
        expect(measurementWorks["ConJ11Ex"].files["Results_ConJ11ExB1.csv"]).toHaveSize(1);
        expect(measurementWorks["ConJ11Ex"].files["Results_ConJ11ExB1.csv"][0]).toEqual({
            label: "ConJ11ExB1.jpg" ,
            area: 11.22,
            perimeter: 54.93,
            circularity: 1.212,
            ar: 0.4,
            round: 0.4,
            solid: 0.271
        });
        expect(measurementWorks["ConJ11Ex"].files["Results_ConJ11ExB2.csv"]).toHaveSize(1);
        expect(measurementWorks["ConJ11Ex"].files["Results_ConJ11ExB2.csv"][0]).toEqual({
            label: "ConJ11ExB2.jpg" ,
            area: 33.4,
            perimeter: 33.93,
            circularity: 0.365,
            ar: 1.625,
            round: 0.615,
            solid: 0.871
        });
        expect(measurementWorks["ConJ11Ex"].files["Results_ConJ11ExB9.csv"]).toHaveSize(1);
        expect(measurementWorks["ConJ11Ex"].files["Results_ConJ11ExB9.csv"][0]).toEqual({
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