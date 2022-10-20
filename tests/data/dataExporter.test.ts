import {DataExporter} from "../../src/data/dataExporter";
import {Fixtures} from "../fixtures/fixtures";
import expectedResultsCsv from "../fixtures/Results_ExpJ1CrB9.csv";

describe('Testing DataExporter...', () => {

    /**
     * Class under test
     */
    let dataExporter = new DataExporter();

    it('CSV metrics are correct', () => {
        let labData = Fixtures.labData();
        let descriptorsCsv = dataExporter.exportPathDescriptorsAsCsv(labData, labData.blobMaskCoords);
        expect(descriptorsCsv).toEqual(expectedResultsCsv);
    });

    it('Tick count may vary along with the ruler length', () => {
        let labData = Fixtures.labData();

        labData.rulerTickCount = 8;
        labData.rulerCoords.end = labData.rulerCoords.start.add(
            labData.rulerCoords.end.subtract(labData.rulerCoords.start).multiply(8).divide(10)
        )

        let descriptorsCsv = dataExporter.exportPathDescriptorsAsCsv(labData, labData.blobMaskCoords);
        expect(descriptorsCsv).toEqual(expectedResultsCsv);
    });
});