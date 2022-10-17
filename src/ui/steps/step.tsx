import * as React from "react";
import {Lab} from "../../lab";

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
    activable : boolean
}

/**
 * Une étape du process
 */
export abstract class Step<S extends StepState> extends React.Component<StepProps, S> {

    public onTerminated : (stepComponent : Step<S>) => void = () => { };

    protected constructor(props : StepProps, defaultState : S) {
        super(props);
        this.state = defaultState;
    }

    /**
     * Lorsque l'étape est activée
     */
    public activate() : void {
        console.info("[Step] Activation de l'étape " + this.props.code);
        this.setState({active: true, activable: true},
            () => {
                this.onActivation();
            });
    }

    /**
     * Lorsque l'étape est activée
     */
    public markInactivable() : void {
        this.setState({activable: false});
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
     * Indique si les conditions permettent d'activer le step
     */
    abstract canBeActivated(): boolean;

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