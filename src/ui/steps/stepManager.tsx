/**
 * Gestion des étapes
 */
import {Step, StepState} from "./step";
import * as React from "react";
import {ReactElement} from "react";
import {ArrayUtils} from "../../utils/arrayUtils";
import {Accordion} from "react-bootstrap";

/**
 * Propriétés du StepManager
 */
interface StepManagerProps {
    children?: React.ReactNode
}

/**
 * L'état d'affichage du StepManager
 */
interface StepManagerState {
    activeStep : Step<StepState> | null
}

/**
 * Permet de gérer les steps entre eux
 */
export class StepManager extends React.Component<StepManagerProps, StepManagerState> {

    private steps : Step<StepState>[] = [];

    /**
     * Création du StepManager
     */
    public constructor(props : StepManagerProps) {
        super(props);
        this.state = { activeStep : null };
    }

    /**
     * Post-init lorsque le lab est affiché
     */
    public componentDidMount() {
        // Active le premier step
        this.activateStep(this.steps[0]);
    }

    /**
     * Active une étape
     */
    private activateStep(step : Step<StepState>) {
        let previousStep = this.state.activeStep;
        if(step != previousStep) {
            this.setState( { activeStep : step }, () => {
                if(previousStep != null && previousStep.state.active) {
                    previousStep.deactivate();
                }
                if(step.canBeActivated()) {
                    step.activate();
                } else {
                    step.markInactivable();
                }
            });
        }
    }

    /**
     * Déclenché lors qu'un StepComponent est terminé.
     * Active le composant suivant
     */
    private onStepTerminated(step : Step<StepState>) : void {
        console.info("[StepManager] Étape " + step.props.code + " terminée")
        let nextStep = ArrayUtils.nextItem(this.steps, step);
        if(nextStep != null) {
            this.activateStep(nextStep);
        }
    }

    /**
     * Donne un step à partir de son code
     */
    private getStepByCode(code : string) : Step<StepState> | null {
        return this.steps.find((s) => s.props.code == code) ?? null;
    }

    /**
     * Enregistre un Step ajouté au StepManager
     */
    private registerStep(index : number, step : Step<StepState>) : void {
        // Ajout du hook : lorsqu'un étape est terminée, on active la suivante
        step.onTerminated = this.onStepTerminated.bind(this);
        this.steps[index] = step;
    }

    render() : React.ReactNode {
        this.steps = Array(React.Children.count(this.props.children));
        return <Accordion activeKey={ this.state.activeStep?.props.code }
                          onSelect={(eventKey : string) => { if(eventKey != null) { this.activateStep(this.getStepByCode(eventKey)); }}}
        className={"mt-1"}>
            {
                React.Children.map(this.props.children, (child: ReactElement, index) => {
                    return <Accordion.Item  eventKey={ child.props.code }>
                        <Accordion.Header><i className={"fa-solid fa-" + (index + 1) + " me-1 text-primary"}></i>{child.props.title}</Accordion.Header>
                        <Accordion.Body>
                            {React.cloneElement(child, {ref: (step : Step<StepState>) => {  if(step != null) this.registerStep(index, step) }})}
                        </Accordion.Body>
                    </Accordion.Item>
                })
            }
        </Accordion>
    }

}
