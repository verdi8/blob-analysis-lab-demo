import {Step, StepProps, StepState} from "./step";
import * as React from "react";
import {Alert, Button, Form, InputGroup} from "react-bootstrap";
import {DEBUG_MODE} from "../lab";

/**
 * Etape de placement de la règle
 */
export class RulerStep extends Step<StepState> {

    private rescaleInputRef = React.createRef<HTMLInputElement>();

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

    private rescale() {
        let ppcm = Number.parseFloat(this.rescaleInputRef.current.value);
        let rulerCoords = this.props.lab.data.rulerCoords;
        rulerCoords.end = rulerCoords.start.add(new paper.Point(ppcm * this.props.lab.data.rulerTickCount, 0));
        this.props.lab.ruler.refresh();
    }

    render() : React.ReactNode {
        return <div>
            <div>
                <Alert show={!this.state.activable} variant="warning" className={"p-1"}>Veuillez charger une photo.</Alert>
                <p>Positionnez la règle sur la photo. La règle doit couvrir 10 cm.</p>
                <Alert variant={"light"} className={"p-2"}><i className="ms-1 me-1 fa-solid fa-circle-info"></i> Appuyez ici <Button disabled={!this.state.active} onClick={this.zoomOnRuler.bind(this)} size={"sm"}><i className={"fa-solid fa-magnifying-glass-location"}></i></Button> pour placer la règle avec précision.</Alert>
                <div className={"d-flex flex-row"}>
                    <Button className={"col-3"} variant={"success"} disabled={!this.state.active} onClick={this.terminate.bind(this)}>Terminé&nbsp;!</Button>
                    {DEBUG_MODE ?
                        <>
                            <InputGroup className={"ms-2"}>
                                <Form.Control defaultValue={100} ref={this.rescaleInputRef} disabled={!this.state.active} type={"text"} aria-describedby="aria-describe-rescale"/>
                                <InputGroup.Text id="aria-describe-rescale">px/cm</InputGroup.Text>
                            </InputGroup>
                            <Button className={"col-3"} variant={"danger"} disabled={!this.state.active} onClick={this.rescale.bind(this)}><i className="fa-solid fa-bug"></i>&nbsp;Rescale</Button>
                        </>
                        : <></>
                    }
                </div>
            </div>
        </div>
    }



}

