
import {Coords} from "../coords";

/**
 * Interface de transformation de coordonnées
 */
export interface Transformation<FROM extends Coords, TO extends Coords> {

    transform(from: FROM): TO;

}