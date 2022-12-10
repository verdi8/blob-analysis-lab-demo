import {ExperienceEnum, GroupeEnum, WorkInfo} from "../workInfo";


const WORK_REGEXP = /^(?<groupe>Con|Exp)J(?<jour>[0-9]+)(?<experience>Cr|Ex)(B(?<blob>[0-9]+))?$/i;

/**
 * Parsing de code de travail en cours
 */
export class WorkInfoParser {

    /**
     * Valide le bom de fichier
     */
    public parse(name : string) : WorkInfo | null {
        let match = name.match(WORK_REGEXP);
        if(match == null) {
            return null;
        } else {
            return {
                groupe:  match.groups.groupe.toLowerCase() == 'Con'.toLowerCase() ?  GroupeEnum.Controle : GroupeEnum.Experimental,
                jour: parseInt(match.groups.jour),
                experience: match.groups.experience.toLowerCase() == 'Cr'.toLowerCase() ?  ExperienceEnum.Croissance : ExperienceEnum.Exploration,
                blob:  match.groups.blob != null ? parseInt(match.groups.blob) : null,
            }
        }
    }

}