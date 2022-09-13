import {Step, StepProps, StepState} from "./step";
import * as React from "react";
import {Alert, Button} from "react-bootstrap";

/**
 * Etape de placement de la règle
 */
export class DrawBlobMaskStep extends Step<StepState> {

    public constructor(props : StepProps) {
        super(props, { active: false, activable : false });
    }

    canBeActivated(): boolean {
        return this.props.lab.data != null;
    }

    onActivation(): void {
        this.props.lab.blobMask.activate();
        this.props.lab.zoomOn( this.props.lab.data.petriDishCoords.bounds(), 0.05);
    }

    onDeactivation(): void {
        this.props.lab.blobMask.deactivate();
    }

    render() : React.ReactNode {
        return <div>
            <div>
                <Alert  show={!this.state.activable} variant="warning" className={"p-1"}><i className="ms-1 me-1 fa-solid fa-triangle-exclamation"></i>Veuillez charger une photo.</Alert>
                <p>Entourez le blob <span className={"fw-bold"}>jusqu'à rejoindre le point de départ</span>.</p>
                <Alert variant={"light"} className={"p-2"}><i className="ms-1 me-1 fa-solid fa-circle-info"></i>Un faux mouvement ? <br/>
                    Revenir en arrière  : <Button className={"me-2"} size={"sm"} disabled={!this.state.active} onClick={() => this.props.lab.blobMask.undo()}><i className="fa-solid fa-delete-left"></i></Button>
                    Tout effacer : <Button  className={"me-2"} size={"sm"} disabled={!this.state.active} onClick={() => this.props.lab.blobMask.undoAll()}><i className="fa-solid fa-trash-can"></i></Button>
                </Alert>
                <Button variant={"success"} disabled={!this.state.active} onClick={this.terminate.bind(this)}>Fini !</Button>
            </div>
        </div>
    }

}

