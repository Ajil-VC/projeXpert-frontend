import { Observable } from "rxjs";


export interface CanComponentDeactivate {

    canDeactivate: () => boolean;
}