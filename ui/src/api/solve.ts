import axios, { AxiosPromise } from 'axios';

import { Result } from './Result';

/**
 * This method fetches an answer by hitting /api/solve, which is defined in
 * api.py. The provided query is serialized and sent across the wire as JSON.
 *
 * Axios is a library for making HTTP requests that works across older browsers.
 * You can find more about it here:
 * @see https://github.com/axios/axios
 *
 * @param {string}  question
 * @param {string}  firstAnswer
 * @param {string}  secondAnswer
 *
 * @returns {Promise<Answer>}
 */
export function solve(txt: string): Promise<Result> {
    return (
        axios.post('/api/getempty', {txt})
             .then(resp => resp.data)
    );
}
