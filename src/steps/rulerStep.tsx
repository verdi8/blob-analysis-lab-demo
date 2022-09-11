import {Step, StepProps} from "./step";
import * as React from "react";
import {Button} from "react-bootstrap";
import {Ruler} from "../instruments/ruler";

/**
 * Etape de placement de la règle
 */
export class RulerStep extends Step {

    public constructor(props : StepProps) {
        super(props);
    }

    onActivation(): void {
        this.props.lab.ruler.activate();
        this.props.lab.zoomFit();
    }

    onDeactivation(): void {
        this.props.lab.ruler.deactivate();
    }

    private zoomOnRuler() : void {
        if(this.props.lab.ruler.coords != null) {
            this.props.lab.zoomIn(this.props.lab.ruler.coords.getMiddle());
        }
    }

    render() : React.ReactNode {
        return <div>
            <div>
                <p>Positionnez la règle sur la photo. La règle doit couvrir 9 cm.</p>
                <p>Appuyez ici <Button disabled={!this.state.active} onClick={this.zoomOnRuler.bind(this)} size={"sm"}><i className={"fa-solid fa-magnifying-glass-location"}></i></Button> pour placer la règle avec précision.</p>
                <Button variant={"success"} disabled={!this.state.active} onClick={this.terminate.bind(this)}>Terminé !</Button>
            </div>
        </div>
    }



}

