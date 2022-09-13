import {Step, StepProps, StepState} from "./step";
import * as React from "react";
import {Alert, Button} from "react-bootstrap";

/**
 * Etape de placement de la règle
 */
export class RulerStep extends Step<StepState> {

    public constructor(props : StepProps) {
        super(props, { active: false, activable : false });
    }

    canBeActivated(): boolean {
        return this.props.lab.data != null;
    }

    onActivation(): void {
        this.props.lab.ruler.activate();
        this.props.lab.zoomFit();
    }

    onDeactivation(): void {
        this.props.lab.ruler.deactivate();
    }

    private zoomOnRuler() : void {
        this.props.lab.zoomIn(this.props.lab.data.rulerCoords.bounds().center);
    }

    render() : React.ReactNode {
        return <div>
            <div>
                <Alert show={!this.state.activable} variant="warning" className={"p-1"}>Veuillez charger une photo.</Alert>
                <p>Positionnez la règle sur la photo. La règle doit couvrir 9 cm.</p>
                <p>Appuyez ici <Button disabled={!this.state.active} onClick={this.zoomOnRuler.bind(this)} size={"sm"}><i className={"fa-solid fa-magnifying-glass-location"}></i></Button> pour placer la règle avec précision.</p>
                <Button variant={"success"} disabled={!this.state.active} onClick={this.terminate.bind(this)}>Terminé !</Button>
            </div>
        </div>
    }



}

