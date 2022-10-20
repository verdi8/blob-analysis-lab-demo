import * as React from 'react';
import * as paper from "paper";
import {StepManager} from "./ui/steps/stepManager";
import {LoadPictureStep} from "./ui/steps/loadPictureStep";
import {RulerStep} from "./ui/steps/rulerStep";
import {Badge, Button, ButtonGroup, Col, Container, Form, Navbar, Row} from "react-bootstrap";
import {Ruler} from "./instruments/ruler";
import {PlacePetriDishStep} from "./ui/steps/placePetriDishStep";
import {PetriDish} from "./instruments/petriDish";
import {DrawBlobMaskStep} from "./ui/steps/drawBlobMaskStep";
import {BlobMask} from "./instruments/blobMask";
import {VectorCoords} from "./data/coords/vectorCoords";
import {PathCoords} from "./data/coords/pathCoords";
import {DownloadStep} from "./ui/steps/downloadStep";
import {PaperUtils} from "./utils/paperUtils";
import {EllipseCoords} from "./data/coords/ellipseCoords";
import {Welcome} from "./ui/welcome";

/**
 * Debug mode (ou pas)
 */
export const DEBUG_MODE = false;

/**
 * La taille par défaut de la règle
 */
export const DEFAULT_RULER_TICK_COUNT = 10;

/**
 * La taille minimum de la règle
 */
export const MIN_RULER_TICK_COUNT = 8;

/**
 * La taille maximum de la règle
 */
export const MAX_RULER_TICK_COUNT = 15;


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
     * Le canvas sur lequel est dessiné la photo
     */
    private welcome = React.createRef<Welcome>();

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

        // Prise en compte du redimensionnement navigateur (ou agrandissement/retrécissement de la vue)
        paper.view.onResize = (event) => {
            if(this.raster != null) {
                paper.view.center = this.raster.position;
            }
        }
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

        // Masque le composant d'accueil
        this.welcome.current.setState({visible: false });

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

            rulerTickCount : DEFAULT_RULER_TICK_COUNT,

            rulerCoords: new VectorCoords(new paper.Point(width * 0.25, height / 2), new paper.Point(width * 0.75, height / 2)),

            petriDishCoords: new EllipseCoords(new paper.Point(width / 2, height / 2), width * 0.75 / 2, width * 0.75 / 2, 0),

            blobMaskCoords: new PathCoords(),
        };

        // Le plus en dessous en premier
        this.blobMask = new BlobMask(this, this.data.blobMaskCoords);
        this.petriDish = new PetriDish(this, this.data.petriDishCoords);
        this.ruler = new Ruler(this, this.data.rulerCoords);

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

    // Zooms par delta

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

        if(target != undefined) {
            // let viewPosition = paper.view.viewToProject(target);
            let viewPosition = target;
            let mpos = viewPosition;
            let ctr = paper.view.center;

            let pc = mpos.subtract(ctr);
            let offset = mpos.subtract(pc.multiply(0.95 / zoomFactor)).subtract(ctr);

            paper.view.center = paper.view.center.add(offset);
        }

        // On borne les zooms pour ne pas que ça parte partout
        // Zoom minimum = zoom fit
        let minZoom =  0;
        if(this.data != null) {
            let xZoomFactor = Math.min(1, this.canvas.width / this.data.pictureSize.width)
            let yZoomFactor = Math.min(1, this.canvas.height / this.data.pictureSize.height);
            minZoom = Math.min(xZoomFactor, yZoomFactor)  / paper.view.pixelRatio;
        }
        let maxZoom =  10;
        paper.view.zoom = Math.min(maxZoom, Math.max(newZoom, minZoom));
        this.onZoomChanged();
    }

    /**
     * Appelé lorsque le zoom a changé
     */
    private onZoomChanged() {
        this.ruler?.refresh();
        this.petriDish?.refresh();
        this.blobMask?.refresh();
    }

    render(): React.ReactNode {
        return <Container fluid={true} className={"vh-100 d-flex flex-column"}>
            <Navbar bg="light" expand="lg" className={"p-0"}>
                <Container fluid={true}>
                    <Row className={"col-md-12"}>
                        <div className="d-flex d-flex justify-content-between">
                            <Navbar.Brand className={"p-0"}><i className={"fa-solid fa-flask me-2"}></i>Blob Analysis Lab <sup><Badge pill bg="secondary" text="primary">demo</Badge></sup></Navbar.Brand>
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
                            <div>
                                <Button href={"docs/index.html"} target="_blank" variant={"primary"} size={"sm"}>Tutoriel<i className="ms-2 fa-solid fa-book"></i></Button>
                            </div>
                        </div>
                    </Row>
                </Container>
            </Navbar>
            <Row className="flex-grow-1">
                <div className="col position-relative">
                   <Welcome ref={this.welcome}/>
                    <canvas ref={(canvas : HTMLCanvasElement)=> this.canvas = canvas} data-paper-resize="false"  className="h-100 w-100 d-block" onContextMenu={() => false}></canvas>
                </div>
                <Col md={4} className={"border-2"}  >
                    <div className="mb-3">
                        <StepManager>
                            <LoadPictureStep lab={this} code="loadPicture" title="Charger une photo"/>
                            <RulerStep lab={this} code="placeRuler" title="Positionner la règle"/>
                            <PlacePetriDishStep  lab={this} code="placePetriDish" title="Positionner la boîte de petri"/>
                            <DrawBlobMaskStep  lab={this} code="drawBlobMask" title="Détourer le blob"/>
                            <DownloadStep  lab={this} code="download" title="Télécharger les résultats"/>
                        </StepManager>
                    </div>
                </Col>
            </Row>
        </Container>
    }
}