import {Step, StepProps, StepState} from "./step";
import * as React from "react";
import {Alert, Button, InputGroup} from "react-bootstrap";
import {IoUtils} from "../utils/ioUtils";
import {DataExporter} from "../data/dataExporter";
import * as paper from "paper";
import {ImageDataWrapper, Rgba} from "../render/ImageDataWrapper";

export interface DownloadButtonProps {
    downloading: boolean,
    onClick : () => void,
    disabled: boolean,
}

export class DownloadButton extends React.Component<DownloadButtonProps, any> {

    constructor(props : DownloadButtonProps) {
        super(props);
    }

    render() : React.ReactNode {
        let faIcon = this.props.downloading ? "fa-solid fas fa-cog fa-spin" : "fa-solid fa-download";
        let key = this.props.downloading ? "downloading" : "notDownloading";
        return <Button key={key} onClick={this.props.onClick} disabled={this.props.disabled || this.props.downloading} variant={"primary"} size={"sm"}>
            <i className={faIcon}></i>
        </Button>
    }

}

export interface DownloadStepState extends  StepState {
    petriDishDataFilename: string | null,
    blobMaskDataFilename: string | null,
    blobMaskFilename: string | null,
    resultsFilename: string | null,
    downloading: boolean
}



/**
 * Etape de téléchargement des fichiers
 */
export class DownloadStep extends Step<DownloadStepState> {

    /**
     * Outil d'export de données
     */
    private dataExporter: DataExporter = new DataExporter();

    public constructor(props: StepProps) {
        super(props, { active: false, activable: false, petriDishDataFilename : null,  blobMaskDataFilename: null,  blobMaskFilename: null, resultsFilename: null, downloading: false });
    }

    canBeActivated(): boolean {
        return this.props.lab.data != null
            && this.props.lab.ruler.hasBeenStarted()
            && this.props.lab.petriDish.hasBeenStarted()
            && this.props.lab.blobMask.hasBeenStarted()
            && this.props.lab.data.blobMaskCoords.isClosed();
    }

    onActivation(): void {
        this.setState({
            petriDishDataFilename: IoUtils.basename(this.props.lab.data.filename) + "_Coord_Boite.txt",
            blobMaskDataFilename: IoUtils.basename(this.props.lab.data.filename) + "_Coord_Blob.txt",
            blobMaskFilename: IoUtils.basename(this.props.lab.data.filename) + "_Mask.png",
            resultsFilename: "Results_" + IoUtils.basename(this.props.lab.data.filename) + ".csv",
        });
    }

    onDeactivation(): void {
    }

    /**
     * Téléchargement des données de la boîte de Petri
     */
    private downloadPetriDishData() : void {
        let data = this.dataExporter.exportPathPointsAsXYCsv(this.props.lab.data.petriDishCoords, true);
        IoUtils.downloadData(this.state.petriDishDataFilename, "text/plain;charset=UTF-8", data);
    }

    /**
     * Téléchargement des données du mask
     */
    private downloadBlobMaskData() : void {
        let data = this.dataExporter.exportPathSegmentsAsXYCsv(this.props.lab.data.blobMaskCoords, true);
        IoUtils.downloadData(this.state.blobMaskDataFilename, "text/plain;charset=UTF-8", data);
    }

    /**
     * Téléchargement des données du mask
     */
    private downloadBlobMask() : void {
        let path = this.props.lab.data.blobMaskCoords.toRemovedPath();
        path.closed = true;
        path.fillColor = new paper.Color("white");
        path.strokeColor = null;
        path.scale(1 / paper.view.pixelRatio, path.bounds.point);

        let raster = path.rasterize({ insert: false});
        raster.smoothing = "off";

        var newCanvas = document.createElement('canvas');
        const w = this.props.lab.data.pictureSize.width;
        newCanvas.width = w;
        const h = this.props.lab.data.pictureSize.height;
        newCanvas.height = h;

        var newContext = newCanvas.getContext('2d');
        newContext.fillStyle = "black";
        newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);
        newContext.drawImage(raster.canvas, path.bounds.x, path.bounds.y);

        // Re-aliasing
        const imageDataWrapper = new ImageDataWrapper(newContext.getImageData(0, 0, w, h));

        // Supprime les nuances de gris en se basant sur la valeur rouge (on est sur d'avoir du gris)
        imageDataWrapper.apply((rgba: Rgba) => {
            let l = rgba.r >= 128 ? 255 : 0;
            // let l = rgba.r == 255 ? 255 : 0;
            return {r: l, g: l, b: l, a: 255};
        }).andStore(newContext);

        IoUtils.downloadDataUrl(this.state.blobMaskFilename, newCanvas.toDataURL("image/png"));

        newCanvas.remove();
    }

    /**
     * Téléchargement de la description du blob
     */
    private downloadResults() : void {
        this.downloading( () => {
            let data = this.dataExporter.exportPathDescriptorsAsCsv(this.props.lab.data, this.props.lab.data.blobMaskCoords);
            IoUtils.downloadData(this.state.resultsFilename, "text/plain;charset=UTF-8", data);
        });
    }

    /**
     * Execute une tâche en indiquant un chargement en cours
     */
    private downloading(task : () => void) {
        this.setState({downloading : true}, () => {
            setTimeout(() => {
                task();
                this.setState({downloading: false});
            },500);
        });
    }

    render() : React.ReactNode {
        return <div>
            <Alert show={!this.state.activable} variant="warning" className={"p-1"}>Veuillez terminer les étapes précédentes.</Alert>
            <p>Téléchargez les fichiers d'analyse de la photo.</p>
            <InputGroup className="mb-1">
                <DownloadButton key="downloadPetriDishDataButtonKey" downloading={false} onClick={this.downloadPetriDishData.bind(this)} disabled={!this.state.active}/>
                <InputGroup.Text className={"col"}>{ this.state.petriDishDataFilename }</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-1">
                <DownloadButton key="downloadBlobMaskDataButtonKey" downloading={false} onClick={this.downloadBlobMaskData.bind(this)} disabled={!this.state.active}/>
                <InputGroup.Text className={"col"}>{ this.state.blobMaskDataFilename }</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-1">
                <DownloadButton key="downloadBlobMaskButtonKey" downloading={false} onClick={this.downloadBlobMask.bind(this)} disabled={!this.state.active}/>
                <InputGroup.Text className={"col"}>{ this.state.blobMaskFilename }</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-1">
                <DownloadButton key="downloadResultsButtonKey" downloading={this.state.downloading} onClick={this.downloadResults.bind(this)} disabled={!this.state.active}></DownloadButton>
                <InputGroup.Text className  ={"col"}>{ this.state.resultsFilename }</InputGroup.Text>
            </InputGroup>
        </div>
    }

}
