import {Step, StepProps, StepState} from "./step";
import * as React from "react";
import {Alert, Button} from "react-bootstrap";

/**
 * Étape de placement de la boîte de petri
 */
export class PlacePetriDishStep extends Step<StepState> {

    public constructor(props : StepProps) {
        super(props, { active: false, activable : false });
    }

    canBeActivated(): boolean {
        return this.props.lab.data != null;
    }

    onActivation(): void {
        this.props.lab.petriDish.activate();
        this.props.lab.zoomFit();
    }

    onDeactivation(): void {
        this.props.lab.petriDish.deactivate();
    }

    private zoomOnPetriDishCenter() : void {
        this.props.lab.zoomIn(this.props.lab.data.petriDishCoords.center);
    }

    render() : React.ReactNode {
        return <div>
            <div>
                <Alert show={!this.state.activable} variant="warning" className={"p-1"}>Veuillez charger une photo.</Alert>
                <p>Déplacez et redimensionnez le cercle à l'aide des poignées blanches pour placer la boîte de petri.</p>
                <p>Appuyez ici <Button disabled={!this.state.active} onClick={this.zoomOnPetriDishCenter.bind(this)} size={"sm"}><i className={"fa-solid fa-magnifying-glass-location"}></i></Button> pour placer la boîte de petri avec précision.</p>
                <Button variant={"success"} disabled={!this.state.active} onClick={this.terminate.bind(this)}>C'est fait !</Button>
            </div>
        </div>
    }



}

