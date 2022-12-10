import {ExperienceEnum, GroupeEnum} from "../../../../src/data/work/workInfo";
import {WorkInfoParser} from "../../../../src/data/work/process/workInfoParser";

describe('Testing WorkInfoParser...', () => {

    /**
     * Class under test
     */
    let workInfoParser = new WorkInfoParser();

    it('Parsing works well', () => {
        let workInfo1 = workInfoParser.parse("ConJ1ExB2");
        expect(workInfo1.groupe).toEqual(GroupeEnum.Controle);
        expect(workInfo1.jour).toEqual(1);
        expect(workInfo1.experience).toEqual(ExperienceEnum.Exploration);
        expect(workInfo1.blob).toEqual(2);

        let workInfo2 = workInfoParser.parse("ExpJ25CrB99");
        expect(workInfo2.groupe).toEqual(GroupeEnum.Experimental);
        expect(workInfo2.jour).toEqual(25);
        expect(workInfo2.experience).toEqual(ExperienceEnum.Croissance);
        expect(workInfo2.blob).toEqual(99);

        let workInfo3 = workInfoParser.parse("conj2crb3");
        expect(workInfo3.groupe).toEqual(GroupeEnum.Controle);
        expect(workInfo3.jour).toEqual(2);
        expect(workInfo3.experience).toEqual(ExperienceEnum.Croissance);
        expect(workInfo3.blob).toEqual(3);

        let workInfo4 = workInfoParser.parse("ExpJ25Cr");
        expect(workInfo4.groupe).toEqual(GroupeEnum.Experimental);
        expect(workInfo4.jour).toEqual(25);
        expect(workInfo4.experience).toEqual(ExperienceEnum.Croissance);
        expect(workInfo4.blob).toBeNull();

        expect(workInfoParser.parse("ConJ1ExB2.jpg")).toBeNull();
        expect(workInfoParser.parse("ConJExB")).toBeNull();
        expect(workInfoParser.parse("J1ExB2")).toBeNull();
        expect(workInfoParser.parse("DumJ25CrB99")).toBeNull();
    });
});