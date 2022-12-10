/**
 * Contient les mesures métriques
 */
export interface Measurement {
    label: string, // le nom du fichier
    area: number,
    perimeter: number,
    circularity: number,
    ar: number,
    round: number,
    solid: number
}