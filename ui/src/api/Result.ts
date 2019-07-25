import {EmptyElement} from "./EmptyElement";

/**
 * Representation of an Answer returned from the API.
 */
export interface Result {
    ok: boolean;
    text: string;
    elements: EmptyElement[];
}
