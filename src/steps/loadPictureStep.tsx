import {Step, StepProps} from "./step";
import * as React from "react";
import {ChangeEvent} from "react";

/**
 * Etape de chargement du fichier
 */
export class LoadPictureStep extends Step {

    public constructor(props : StepProps) {
        super(props);
    }

    private fileChanged(event : ChangeEvent<HTMLInputElement>) : boolean {
        if(event.target.files != null) {
            const img = new Image();
            img.src = URL.createObjectURL(event.target.files[0]);
            let that = this;
            img.onload = function () {
                if(that.props.lab.new(img)) {
                    that.terminate();
                }
            }
        }
        return true;
    }

    onActivation(): void {
    }

    onDeactivation(): void {
    }

    render() : React.ReactNode {
        return <div>
            <div className="mb-3">
                <input className="form-control" type="file" disabled={!this.state.active} aria-disabled={!this.state.active} onChange={(e) => this.fileChanged(e)}></input>
            </div>
        </div>
    }


}