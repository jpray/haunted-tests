import {usePromise} from "./use-promise";
import { getSharedState, setSharedState, hasSharedState, useSharedState } from "./use-shared-state";

const stateKeyPromiseMap = new Map();

export const useSharedStateLoader = (stateKey: string, asyncFunc: () => Promise<any>): [any, boolean, boolean] => {
    //if sharedState is updated from somewhere else, this will ensure the component is rerendered
    useSharedState(stateKey);

    //if state already loaded, return state with same signature as usePromise
    if (hasSharedState(stateKey)) {
        return usePromise(Promise.resolve(getSharedState(stateKey)), getSharedState(stateKey));
    }
    //if no promise is in progress, call the async function and store promise;
    if (!stateKeyPromiseMap.has(stateKey)) {
        const promise = asyncFunc().then((result) => {
            //data is loaded, save to shared state, reset the promise, return user
            setSharedState(stateKey, result);
            stateKeyPromiseMap.delete(stateKey);
            return result;
        }).catch((err) => {
            stateKeyPromiseMap.delete(stateKey);
            throw(err);
        });
        stateKeyPromiseMap.set(stateKey, promise);
    }
    //promise is pending, return it
    return usePromise(stateKeyPromiseMap.get(stateKey));
}