import {Step, StepProps} from "./step";
import * as React from "react";
import {Button} from "react-bootstrap";

/**
 * Étape de placement de la boîte de petri
 */
export class PlacePetriDishStep extends Step {

    public constructor(props : StepProps) {
        super(props);
    }

    onActivation(): void {
        this.props.lab.petriDish.activate();
        this.props.lab.zoomFit();
    }

    onDeactivation(): void {
        this.props.lab.petriDish.deactivate();

    }

    private zoomOnPetriDishCenter() : void {
        if(this.props.lab.petriDish.coords != null) {
            this.props.lab.zoomIn(this.props.lab.petriDish.coords.center);
        }
    }

    render() : React.ReactNode {
        return <div>
            <div>
                <p>Déplacez la poignée jaune du centre pour déplacer le cercle, utilisez les poignées sur le cercle pour le redimensionner.</p>
                <p>Appuyez ici <Button disabled={!this.state.active} onClick={this.zoomOnPetriDishCenter.bind(this)} size={"sm"}><i className={"fa-solid fa-magnifying-glass-location"}></i></Button> pour placer la boîte de petri avec précision.</p>
                <Button variant={"success"} disabled={!this.state.active} onClick={this.terminate.bind(this)}>C'est fait !</Button>
            </div>
        </div>
    }



}

