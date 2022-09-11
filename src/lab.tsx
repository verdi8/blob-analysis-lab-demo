import * as React from 'react';
import * as paper from "paper";
import {StepManager} from "./steps/stepManager";
import {LoadPictureStep} from "./steps/loadPictureStep";
import {RulerStep} from "./steps/rulerStep";
import {Button, ButtonGroup, Container, Form, InputGroup, Nav, Navbar, NavDropdown, Row} from "react-bootstrap";
import {Ruler} from "./instruments/ruler";
import {PlacePetriDishStep} from "./steps/placePetriDishStep";
import {PetriDish} from "./instruments/petriDish";
import {DrawBlobMaskStep} from "./steps/drawBlobMaskStep";
import {BlobMask} from "./instruments/blobMask";
import {view} from "paper";

export interface LabData {
    pictureSize : paper.Size;
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
        this.ruler = new Ruler(this);
        this.petriDish = new PetriDish(this);
        this.blobMask = new BlobMask(this);
    }

    /**
     * Post-init lorsque le lab est affiché
     */
    public componentDidMount() {
        if(this.canvas == null) {
            throw new Error("Canvas should have been initiated");
        }

        paper.setup(this.canvas);

        // this.canvas.width  = this.canvas.offsetWidth;
        // this.canvas.height = this.canvas.offsetHeight;
    }

    /**
     * Lance une nouvelle session de travail
     */
    public new(image : HTMLImageElement) : boolean {
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
        this.data = {
            pictureSize : new paper.Size(image.naturalWidth, image.naturalHeight)
        };

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
        this.zoom(1.05, target);
    }

    /**
     * Moins de zoom
     */
    public zoomOut(target? : paper.Point) : void {
        this.zoom(0.95, target);
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
                                </Form.Group>
                            </Form>
                        </div>
                    </Row>
                </Container>
            </Navbar>
            <Row className="flex-grow-1">
                <div className="col">
                    <canvas ref={(canvas : HTMLCanvasElement)=> this.canvas = canvas} data-paper-resize="true"  className="h-100 w-100 d-block" onContextMenu={() => false}></canvas>
                </div>
                <div className="col-md-4 border-2">
                    <div className="mb-3">
                        <StepManager>
                            <LoadPictureStep lab={this} code="loadPictureStep" title="Charger une photo"/>
                            <RulerStep lab={this} code="placeRulerStep" title="Positionner la règle"/>
                            <PlacePetriDishStep  lab={this} code="placePetriDish" title="Positionner la boîte de petri"/>
                            <DrawBlobMaskStep  lab={this} code="drawBlobMask" title="Détourer le blob"/>
                        </StepManager>
                    </div>
                </div>
            </Row>
        </Container>
    }
}