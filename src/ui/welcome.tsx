import * as React from "react";
import Here from "../assets/images/here.svg";
import {Button} from "react-bootstrap";

/**
 * L'état de l'affichage de l'accueil
 */
export interface WelcomeState {
    visible : boolean
}

/**
 * Le bloc d'accueil flottant affiché en surimpression
 */
export class Welcome extends React.Component<{}, WelcomeState>{

    public constructor() {
        super({});
        this.state = {visible: true}
    }

    public render() {
        return  <div hidden={!this.state.visible} className={"mt-4 col text-center position-absolute top-0 start-0 w-100"}>
            <div className={"position-absolute top-0 end-0 col-2"}>
                <Here></Here>
            </div>
            <h1 className={"text-warning"}>Bienvenue</h1>
            <p>
                <strong>Cet outil vous accompagne</strong> - pas à pas - dans <strong>l'analyse
                <br/>des photos de blobs </strong> dans le cadre de l'expérience <br/><a href={"https://www.cnrs.fr/fr/cnrsinfo/le-blob-et-la-demarche-scientifique"}><strong>Derrière le blob, la recherche</strong></a><br/>
                organisée par le CNRS.<br/>
            </p>
            <p>Pour commencer</p>
            <p><span className={"lead"}>chargez une photo et laissez-vous guider</span></p>
            <p>ou</p>
            <p><Button href={"docs/index.html"} target="_blank" variant={"outline-dark"} size={"lg"}>consultez le tutoriel<i className="ms-2 fa-solid fa-book"></i></Button></p>
        </div>;
    }

}