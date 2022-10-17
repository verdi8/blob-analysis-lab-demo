import {Step, StepProps, StepState} from "./step";
import * as React from "react";
import {ChangeEvent} from "react";

/**
 * Etape de chargement du fichier
 */
export class LoadPictureStep extends Step<StepState> {

    public constructor(props : StepProps) {
        super(props, { active: true, activable : false });
    }

    private fileChanged(event : ChangeEvent<HTMLInputElement>) : boolean {
        if(event.target.files != null) {
            const img = new Image();
            const file = event.target.files[0];
            img.src = URL.createObjectURL(file);
            let filename = file.name;
            let that = this;
            img.onload = function () {
                if(that.props.lab.new(img, filename)) {
                    that.terminate();
                }
            }
        }
        return true;
    }

    canBeActivated(): boolean {
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