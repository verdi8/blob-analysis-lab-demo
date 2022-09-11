import * as React from "react";
import {Lab} from "../lab";

/**
 * Les propriétés des StepComponent
 */
export interface StepProps {
    code : string,
    title : string,
    lab : Lab;
}

/**
 * L'état des StepComponent
 */
export interface StepState {
    active : boolean,
}

/**
 * Une étape du process
 */
export abstract class Step extends React.Component<StepProps, StepState> {

    public onTerminated : (stepComponent : Step) => void = () => { console.log("Aïe"); };

    protected constructor(props : StepProps) {
        super(props);
        this.state = { active: false }; // Inactif par défaut
    }

    /**
     * Lorsque l'étape est activée
     */
    public activate() : void {
        console.info("[Step] Activation de l'étape " + this.props.code);
        this.setState({active: true},
            () => {
                this.onActivation();
            });
    }

    /**
     * Lorsque l'étape est désactivée
     */
    public deactivate() : void {
        console.info("[Step] Désactivation de l'étape " + this.props.code);
        this.setState({active: false},
            () => {
                this.onDeactivation();
            });
    }

    /**
     * Appelé suite à désactivation
     */
    abstract onActivation(): void;

    /**
     * Appelé suite à activation
     */
    abstract onDeactivation(): void;

    /**
     * A déclencher lors l'étape est terminée
     */
    public terminate() {
        this.onTerminated(this);
    }
}