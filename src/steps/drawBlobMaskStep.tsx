import {Step, StepProps} from "./step";
import * as React from "react";
import {Button} from "react-bootstrap";

/**
 * Etape de placement de la règle
 */
export class DrawBlobMaskStep extends Step {

    public constructor(props : StepProps) {
        super(props);
    }

    onActivation(): void {
        this.props.lab.blobMask.activate();
        let dishBounds = this.props.lab.petriDish.bounds();
        if(dishBounds != null) {
            this.props.lab.zoomOn(dishBounds, 0.05);
        }
    }

    onDeactivation(): void {
        this.props.lab.blobMask.deactivate();
    }

    render() : React.ReactNode {
        return <div>
            <div>
                <p>Entourez le blob jusqu'à rejoindre le point de départ.</p>
                <Button variant={"success"} disabled={!this.state.active} onClick={this.terminate.bind(this)}>Fini !</Button>
            </div>
        </div>
    }



}

