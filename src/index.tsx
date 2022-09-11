
import "./lab.scss"

// Init de font-awesome
// Voir https://fontawesome.com/v6/docs/apis/javascript/methods#dom-i2svg-params
import { dom, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);
dom.i2svg();
dom.watch();

// Init de paper.js
import '../node_modules/paper/dist/paper-core';
import * as paper from "paper";

// Create an empty project and a view for the canvas:
paper.install(window);

import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Lab } from './lab';


ReactDOM.render(
    <React.StrictMode>
        <Lab />
    </React.StrictMode>,
document.getElementById('lab')
);
