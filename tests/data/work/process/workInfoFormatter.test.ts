import {ExperienceEnum, GroupeEnum} from "../../../../src/data/work/workInfo";
import {WorkInfoParser} from "../../../../src/data/work/process/workInfoParser";
import {WorkInfoFormatter} from "../../../../src/data/work/process/workInfoFormatter";
import {ObjectUtils} from "../../../../src/utils/objectUtils";

describe('Testing WorkInfoFormatter...', () => {

    /**
     * Class under test
     */
    let workInfoFormatter = new WorkInfoFormatter();

    it('Work session formatting is correct', () => {
        let workInfo1 = {groupe: GroupeEnum.Controle, jour: 5, experience: ExperienceEnum.Croissance, blob: 22};
        expect(workInfoFormatter.format(workInfo1)).toEqual("ConJ5CrB22");

        let workInfo2 = ObjectUtils.deepClone(workInfo1);
        workInfo2.blob = null;
        expect(workInfoFormatter.format(workInfo2)).toEqual("ConJ5Cr");
    });

});