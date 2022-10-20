// Init de paper.js
import * as paper from "paper";

// Create an empty project and a view for the canvas:
paper.install(window);

let canvas = document.createElement('canvas');
canvas.width  = 1224;
canvas.height = 768;

paper.setup(canvas);