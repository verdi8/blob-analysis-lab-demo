/**
 * Le boîte de blob
 */
export enum GroupeEnum {
    Experimental = 'Exp',
    Controle = 'Con'
}

/**
 * La phase du blob
 */
export enum ExperienceEnum {
    Croissance = 'Cr',
    Exploration = 'Ex'
}

/**
 * Informations sur la photo
 */
export interface WorkInfo {
    groupe : GroupeEnum,
    jour : number,
    experience : ExperienceEnum,
    blob: number;
}