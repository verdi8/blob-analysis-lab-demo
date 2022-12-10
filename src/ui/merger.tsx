import * as React from "react";
import {ChangeEvent} from "react";
import {Alert, Button, Col, InputGroup, ListGroup, Modal, Row} from "react-bootstrap";
import {IoUtils} from "../utils/ioUtils";
import {MeasurementImport} from "../data/measurement/process/measurementImport";
import {ExperienceEnum, GroupeEnum} from "../data/work/workInfo";
import {DownloadButton} from "./steps/downloadStep";
import {MeasurementWorks} from "../data/measurement/measurementWorks";
import {MeasurementMerge} from "../data/measurement/process/measurementMerge";
import {MeasurementExport} from "../data/measurement/process/measurementExport";
import {Measurement} from "../data/measurement/measurement";

/**
 * L'état de l'affichage de l'outil de merge
 */
export interface MergerState {
    visible : boolean,
    measurementWorks: MeasurementWorks
}

/**
 * Outil de merge des fichiers de mesures
 */
export class Merger extends React.Component<{}, MergerState> {

    /**
     * Pour importer des données
     */
    private measurementImport = new MeasurementImport();

    /**
     * Pour exporter des données
     */
    private measurementExport = new MeasurementExport();

    /**
     * Pour merger les données
     */
    private measurementMerge = new MeasurementMerge();

    public constructor(props: {}) {
        super(props);
        this.state = {visible: false, measurementWorks: {} }
    }

    /**
     * Affiche l'outil de merge
     */
    public show() {
        this.setState({visible: true});
    }

    /**
     * Masque l'outil de merge
     */
    public hide() {
        this.setState({visible: false});
    }

    /**
     *
     * @private
     */
    private addFiles(event : ChangeEvent<HTMLInputElement>) {
        if(event.target.files != null) {
            for (let file of event.target.files) {
                IoUtils.readTextFile(file, text => {
                    let filename = file.name;
                    try {
                        let {work, measurements} = this.measurementImport.readMeasures(filename, text);
                        let measurementWorks = this.measurementMerge.mergeInto(this.state.measurementWorks, filename, work, measurements);
                        this.setState({measurementWorks: measurementWorks});
                    } catch (error) {
                        alert(error.message);
                    }
                });
            }
        }
        return true;
    }

    /**
     * Téléchargement de la description du blob
     */
    private download(workCode: string) : void {
        let measurements: Measurement[] = Object.keys(this.state.measurementWorks[workCode].files)
            .flatMap(filename => this.state.measurementWorks[workCode].files[filename]);

        let { filename, csv } = this.measurementExport.exportMeasurements(this.state.measurementWorks[workCode].work, measurements);
        IoUtils.downloadData(filename, "text/plain;charset=UTF-8", csv);
    }


    public render() {
        let that = this;
        return <Modal
            show={this.state.visible}
            backdrop="static"
            keyboard={false}
            size={"lg"}
            onHide={this.hide.bind(this)}
            scrollable={true}
        >
            <Modal.Header closeButton={true} closeVariant={"white"}>
                <Modal.Title as={"h6"}>Fusionner les CSV</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert className={"p-2"} variant={"success"}><b>A la fin de l'analyse d'une séquence de photos </b>, regroupez ici les fichiers .csv générés par photo (par ex.: <em>Results_ExpJ1CrB10.csv</em>) pour générer le fichier attendu dans l'espace blob (par ex.: <em>Results_ExpJ1Cr.csv</em>).</Alert>
                <Row>
                    <Col>
                        <b>Sélectionner les fichiers en vrac à regrouper :</b>
                        <div className="mb-3 mt-1">
                            <input className="form-control" type="file" accept={".csv"} multiple={true} onChange={(e) => this.addFiles(e)}></input>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <b>Fichiers fusionnés :</b>
                        <ListGroup>
                            {Object.keys(this.state.measurementWorks).map((workCode) => {
                                return <ListGroup.Item key={workCode}>
                                    <div className={"mb-2"}>
                                        <span className={"ms-0"}><span className={"small text-dark"}>Groupe : </span><b>{this.state.measurementWorks[workCode].work.groupe == GroupeEnum.Experimental ? "Expérimental" : "Contrôle"}</b></span>
                                        <span className={"ms-2"}><span className={"small text-dark"}>Jour : </span><b>{this.state.measurementWorks[workCode].work.jour}</b></span>
                                        <span className={"ms-2"}><span className={"small text-dark"}>Expérience : </span><b>{this.state.measurementWorks[workCode].work.experience == ExperienceEnum.Exploration ? "Exploration" : "Croissance"}</b></span>
                                    </div>
                                    <div className={"mb-2"}>
                                        { Object.keys(this.state.measurementWorks[workCode].files).map(value =><span key={value} className={"me-1 p-1 rounded border bg-light font-monospace"}>{value}</span>)}
                                    </div>
                                    <div className={"col-5"}>
                                        <InputGroup size={"sm"}>
                                            <DownloadButton downloading={false} disabled={false} onClick={() => {this.download(workCode)}}/>
                                            <InputGroup.Text className={"col"}>{ that.measurementExport.exportDryMeasures(this.state.measurementWorks[workCode].work).filename }</InputGroup.Text>
                                        </InputGroup>
                                    </div>
                                </ListGroup.Item>
                            })}
                        </ListGroup>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.hide.bind(this)}>Fermer</Button>
            </Modal.Footer>
        </Modal>
    }
}