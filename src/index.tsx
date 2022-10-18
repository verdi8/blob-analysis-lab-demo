import "./lab.scss"

// Init de font-awesome
// Voir https://fontawesome.com/v6/docs/apis/javascript/methods#dom-i2svg-params
import {dom, library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
// Init de paper.js
import * as paper from "paper";
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {Lab} from './lab';

library.add(fas, far);
dom.i2svg();
dom.watch();

// Create an empty project and a view for the canvas:
paper.install(window);

ReactDOM.render(
    <React.StrictMode>
        <Lab />
    </React.StrictMode>,
document.getElementById('lab')
);
