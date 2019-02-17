import { useEffect, useState } from "../haunted-custom/haunted.js";

export const usePromise = (promise, memo): [any, boolean, boolean] => {

  let isConnected = false;

  const [{value, isRejected, isLoading}, setState] = useState({
    value: undefined, 
    isRejected: false, 
    isLoading: true 
  });

  useEffect(() => {
    isConnected = true;
    promise.then((result) => {
      if (isConnected) {
          setState({value: result, isRejected: false, isLoading: false});
      }
    }).catch((err) => {
      if (isConnected) {
          setState({value: err, isRejected: true, isLoading: false});
      }
    })
    return () => {
      isConnected = false;
    };
  }, [memo ? memo : promise]);

  return [isRejected ? undefined : value, isRejected ? value : undefined, isLoading]
}