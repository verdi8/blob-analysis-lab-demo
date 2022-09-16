import * as React from 'react';
import * as paper from "paper";
import {StepManager} from "./steps/stepManager";
import {LoadPictureStep} from "./steps/loadPictureStep";
import {RulerStep} from "./steps/rulerStep";
import {Button, ButtonGroup, Container, Form, Navbar, Row} from "react-bootstrap";
import {Ruler} from "./instruments/ruler";
import {PlacePetriDishStep} from "./steps/placePetriDishStep";
import {PetriDish} from "./instruments/petriDish";
import {DrawBlobMaskStep} from "./steps/drawBlobMaskStep";
import {BlobMask} from "./instruments/blobMask";
import {VectorCoords} from "./data/coords/vectorCoords";
import {PathCoords} from "./data/coords/pathCoords";
import {DownloadStep} from "./steps/downloadStep";
import {PaperUtils} from "./utils/paperUtils";
import {EllipseCoords} from "./data/coords/ellipseCoords";

/**
 * Debug mode (ou pas)
 */
export const DEBUG_MODE = false;

export interface LabData {

    pictureSize : paper.Size,

    filename : string,

    rulerTickCount : number,

    rulerCoords : VectorCoords,

    petriDishCoords : EllipseCoords,

    blobMaskCoords : PathCoords
}


/**
 * Le lab
 */
export class Lab extends React.Component<{}> {

    /**
     * Récolte des données
     */
    public data : LabData | null;

    /**
     * Le canvas sur lequel est dessiné la photo
     */
    private canvas : HTMLCanvasElement | null = null;

    /**
     * La photo du blob
     */
    public raster : null | paper.Raster = null;

    /**
     * La règle
     */
    public ruler: Ruler;

    /**
     * La boîte de petri
     */
    public petriDish: PetriDish;

    /**
     * Le contour du blob
     */
    public blobMask: BlobMask;

    public constructor(props : {}) {
        super(props);
    }

    /**
     * Post-init lorsque le lab est affiché
     */
    public componentDidMount() {
        if(this.canvas == null) {
            throw new Error("Canvas should have been initiated");
        }

        paper.setup(this.canvas);
        new paper.Tool();
        paper.tool.activate();

        // Ajout du zoom avec la molette
        this.canvas.addEventListener('wheel', (event) => {
            let target = paper.view.viewToProject(new paper.Point(event.offsetX, event.offsetY));
            if (event.deltaY > 0) {
                this.zoomOut(target);
            } else {
                this.zoomIn(target);
            }
        });

        // Ajout des déplacements
        paper.tool.onKeyDown = (event : paper.KeyEvent) => {
            if(event.key == "control") {
                PaperUtils.changeCursor("move");
            }
        }
        paper.tool.onKeyUp = (event : paper.KeyEvent) => {
            if(event.key == "control") {
                PaperUtils.changeCursor(null);
            }
        }
        paper.tool.onMouseDrag = function(event) {
            if(event.modifiers.control) {
                let delta = event.point.subtract(event.downPoint);
                paper.view.center = paper.view.center.subtract(delta);
                event.preventDefault();
            }
        }


        // this.canvas.width  = this.canvas.offsetWidth;
        // this.canvas.height = this.canvas.offsetHeight;
    }

    /**
     * Lance une nouvelle session de travail
     */
    public new(image : HTMLImageElement, filename : string) : boolean {
        console.info("Nouvelle session de travail")
        if(this.raster != null) {
            if(window.confirm("Écraser le travail en cours ?")) {
                this.reset();
            } else {
                return false;
            }
        }

        // Init du Raster de l'image
        this.raster = new paper.Raster();
        this.raster.image = image;
        this.raster.bounds.point = new paper.Point(0, 0);
        this.raster.smoothing = 'off';

        // Init des données
        let width = image.naturalWidth;
        let height = image.naturalHeight;
        this.data = {

            pictureSize: new paper.Size(width, height),

            filename: filename,

            rulerTickCount : 9,

            rulerCoords: new VectorCoords(new paper.Point(width * 0.25, height / 2), new paper.Point(width * 0.75, height / 2)),

            petriDishCoords: new EllipseCoords(new paper.Point(width / 2, height / 2), width * 0.75 / 2, width * 0.75 / 2, 0),

            blobMaskCoords: new PathCoords(new paper.Path()),

        };

        // Le plus en dessous en premier
        this.blobMask = new BlobMask(this, this.data.blobMaskCoords);
        this.petriDish = new PetriDish(this, this.data.petriDishCoords);
        this.ruler = new Ruler(this, this.data.rulerCoords, this.data.rulerTickCount);

        // Zoom global
        this.zoomFit();

        // Petit  refresh
        paper.view.update();

        return true;
    }

    /**
     * Remet à zéro l'espace de travail
     */
    private reset() : void {
        if(this.raster != null) {
            this.raster.remove();
        }
        this.raster = null;

        // Vidage des instruments
        this.ruler.clear();
        this.petriDish.clear();
        this.blobMask.clear();

    }

    /**
     * Zoom au plus près de la photo
     */
    public zoomFit() : void {
        if(this.raster != null && this.canvas != null && this.data.pictureSize != null) {
            this.zoomOn(new paper.Rectangle(0, 0, this.data.pictureSize.width, this.data.pictureSize.height))
        }
    }

    /**
     * Zoom sur une zone
     */
    public zoomOn(rectangle : paper.Rectangle, marginPercent : number = 0) {
        paper.view.center = rectangle.center;
        let xZoomFactor = Math.min(1, this.canvas.width / rectangle.width);
        let yZoomFactor = Math.min(1, this.canvas.height / rectangle.height);
        paper.view.zoom = Math.min(xZoomFactor, yZoomFactor) * (1 - marginPercent) / paper.view.pixelRatio;
        paper.view.update();
        this.onZoomChanged();
    }

    /**
     * Plus de zoom
     */
    public zoomIn(target? : paper.Point) : void {
        this.zoom(1.10, target);
    }

    /**
     * Moins de zoom
     */
    public zoomOut(target? : paper.Point) : void {
        this.zoom(0.90, target);
    }

    /**
     * Pas de zoom 1:1
     */
    public zoomNone() : void {
        paper.view.zoom = 1;
        this.onZoomChanged();
    }

    /**
     * Centralise le zoom
     */
    private zoom(zoomFactor : number, target? : paper.Point) {
        let oldZoom = paper.view.zoom;
        let newZoom = oldZoom * zoomFactor;

        if(typeof target !== "undefined") {
            // let viewPosition = paper.view.viewToProject(target);
            let viewPosition = target;
            let mpos = viewPosition;
            let ctr = paper.view.center;

            let pc = mpos.subtract(ctr);
            let offset = mpos.subtract(pc.multiply(0.95 / zoomFactor)).subtract(ctr);

            paper.view.center = paper.view.center.add(offset);
        }
        paper.view.zoom = newZoom;
        this.onZoomChanged();
    }

    /**
     * Appelé lorsque le zoom a changé
     */
    private onZoomChanged() {
        this.ruler.refresh();
        this.petriDish.refresh();
        this.blobMask.refresh();
    }

    render(): React.ReactNode {
        return <Container fluid={true} className={"vh-100 d-flex flex-column"}>
            <Navbar bg="light" expand="lg" className={"p-0"}>
                <Container fluid={true}>
                    <Row className={"col-md-8"}>
                        <div className="d-flex d-flex justify-content-between">
                            <Navbar.Brand className={"p-0"}><i className={"fa-solid fa-flask me-2"}></i>Blob Analysis Lab Demo</Navbar.Brand>
                            <Form className={"inline-form"}>
                                <Form.Group controlId="zoomGroup">
                                    <Form.Label>Zoom :</Form.Label>
                                    <ButtonGroup aria-label="Zoom" className={"ms-2"}>
                                        <Button onClick={() => this.zoomIn()} variant={"primary"} size={"sm"}><i className="fa-solid fa-magnifying-glass-plus"></i></Button>
                                        <Button onClick={() => this.zoomOut()} variant={"primary"} size={"sm"}><i className="fa-solid fa-magnifying-glass-minus"></i></Button>
                                        <Button onClick={() => this.zoomFit()} variant={"primary"} size={"sm"}><i className="fa-regular fa-image"></i></Button>
                                        <Button onClick={() => this.zoomNone()} variant={"primary"} size={"sm"}>1:1</Button>
                                    </ButtonGroup>
                                    <Form.Label className={"ms-3"}>[CTRL] + <i className="fa-solid fa-computer-mouse"></i> = <i className="fa-solid fa-arrows-up-down-left-right"></i></Form.Label>
                                </Form.Group>
                            </Form>
                        </div>
                    </Row>
                </Container>
            </Navbar>
            <Row className="flex-grow-1">
                <div className="col">
                    <canvas ref={(canvas : HTMLCanvasElement)=> this.canvas = canvas} data-paper-resize="false"  className="h-100 w-100 d-block" onContextMenu={() => false}></canvas>
                </div>
                <div className="col-md-4 border-2">
                    <div className="mb-3">
                        <StepManager>
                            <LoadPictureStep lab={this} code="loadPicture" title="Charger une photo"/>
                            <RulerStep lab={this} code="placeRuler" title="Positionner la règle"/>
                            <PlacePetriDishStep  lab={this} code="placePetriDish" title="Positionner la boîte de petri"/>
                            <DrawBlobMaskStep  lab={this} code="drawBlobMask" title="Détourer le blob"/>
                            <DownloadStep  lab={this} code="download" title="Télécharger les résultats"/>
                        </StepManager>
                    </div>
                </div>
            </Row>
        </Container>
    }
}