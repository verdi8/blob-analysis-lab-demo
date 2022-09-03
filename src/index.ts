
import 'bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// Voir https://fontawesome.com/v6/docs/apis/javascript/methods#dom-i2svg-params
import { dom, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas)

dom.i2svg()


import '../node_modules/paper/dist/paper-core';
import * as paper from "paper";

// Create an empty project and a view for the canvas:
paper.install(window);


/**
 * Le lab
 */
class Lab {

}