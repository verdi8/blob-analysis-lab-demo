import {Step, StepProps, StepState} from "./step";
import * as React from "react";
import {Alert, Button, InputGroup} from "react-bootstrap";
import {IoUtils} from "../utils/ioUtils";
import {DataExporter} from "../data/dataExporter";


export interface DownloadStepState extends  StepState {
    petriDishDataFilename: string | null,
    blobMaskDataFilename: string | null,
    blobMaskFilename: string | null,
    resultsFilename: string | null,
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
        super(props, { active: false, activable: false, petriDishDataFilename : null,  blobMaskDataFilename: null,  blobMaskFilename: null, resultsFilename: null });
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
        let data = this.dataExporter.exportPathAsXYCsv(this.props.lab.data.petriDishCoords, true);
        IoUtils.downloadData(this.state.petriDishDataFilename, "text/plain;charset=UTF-8", data);
    }

    /**
     * Téléchargement des données du mask
     */
    private downloadBlobMaskData() : void {
        let path = new paper.Path(this.props.lab.data.blobMaskCoords.path.segments);
        path.closed = true; // ferme le contour
        let data = this.dataExporter.exportPathAsXYCsv(this.props.lab.data.blobMaskCoords, true);
        IoUtils.downloadData(this.state.petriDishDataFilename, "text/plain;charset=UTF-8", data);
    }

    /**
     * Téléchargement des données du mask
     */
    private downloadBlobMask() : void {
        let renderingGroup = new paper.Group();
        let background = new paper.Path.Rectangle(new paper.Point(0,0), this.props.lab.data.pictureSize);
        background.fillColor = new paper.Color("black");
        background.strokeColor = new paper.Color("black");
        renderingGroup.addChild(background)

        let path = this.props.lab.data.blobMaskCoords.toPath();
        path.closed = true;
        path.fillColor = new paper.Color("white");
        path.strokeColor = null;
        renderingGroup.addChild(path)

        let raster = renderingGroup.rasterize({ insert: false});
        raster.smoothing = "off";
        IoUtils.downloadDataUrl(this.state.blobMaskFilename, raster.toDataURL());
    }

    /**
     * Téléchargement de la description du blob
     */
    private downloadResults() : void {
        let data = this.dataExporter.exportPathDescriptorsAsCsv(this.props.lab.data, this.props.lab.data.blobMaskCoords);
        IoUtils.downloadData(this.state.resultsFilename, "text/plain;charset=UTF-8", data);
    }



    render() : React.ReactNode {
        return <div>
            <Alert show={!this.state.activable} variant="warning" className={"p-1"}>Veuillez terminer les étapes précédentes.</Alert>
            <p>Téléchargez les fichiers d'analyse de la photo.</p>
            <InputGroup className="mb-3">
                <Button onClick={this.downloadPetriDishData.bind(this)} disabled={!this.state.active} variant={"primary"} size={"sm"}><i className="fa-solid fa-download"></i></Button>
                <InputGroup.Text className={"col"}>{ this.state.petriDishDataFilename }</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
                <Button onClick={this.downloadBlobMaskData.bind(this)} disabled={!this.state.active} variant={"primary"} size={"sm"}><i className="fa-solid fa-download"></i></Button>
                <InputGroup.Text className={"col"}>{ this.state.blobMaskDataFilename }</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
                <Button onClick={this.downloadBlobMask.bind(this)} disabled={!this.state.active} variant={"primary"} size={"sm"}><i className="fa-solid fa-download"></i></Button>
                <InputGroup.Text className={"col"}>{ this.state.blobMaskFilename }</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
                <Button onClick={this.downloadResults.bind(this)} disabled={!this.state.active} variant={"primary"} size={"sm"}><i className="fa-solid fa-download"></i></Button>
                <InputGroup.Text className={"col"}>{ this.state.resultsFilename }</InputGroup.Text>
            </InputGroup>
        </div>
    }

}
