import { useState, useMemo } from "haunted-w-microtask";
import { useDisconnected } from "./use-disconnected";
import { useTriggerUpdate } from "./use-trigger-update";

import createRouter from 'router5'
import browserPlugin from 'router5-plugin-browser'

// router5 doesn't want lots of individual instances, so use a singleton
const router = createRouter([{name: 'default', path: '*route'}])
router.usePlugin(browserPlugin({
  useHash: true
}));
router.start();

export function useRouter(options): any {
  const [timesDisconnected, setTimesDisconnected] = useState(0);
  const triggerUpdate = useTriggerUpdate();

  const routerApi = useMemo(function() {
    
    let route = ""; // the current partial route that this component cares about

    // router5 passes state into the handler with no hash.  
    // If default route is defined with it, we need to add it back when processing
    let useHash = options.defaultRoute[0] === '#';

    const handler = (routerState): void => {
      let _route = routerState.route.path;

      // If a defined route matches the current route, use it.
      if (options.routes[_route.replace(options.baseRoute, '')] ||
          options.routes[('#'+_route).replace(options.baseRoute, '')]) {
        route = _route
        triggerUpdate();
        return;
      }
      
      // If a defined route is a base for the current route, do return the base.
      // This is for parent routers to relax and be okay with what their kids are doing.
      const partialPath = Object.keys(options.routes).reduce((out, routePath) => {
        return _route.indexOf(routePath) === 0 ||
               ('#'+_route).indexOf(routePath) === 0 ? routePath : out;
      }, "");      
      if (partialPath) {
        route = partialPath;
        triggerUpdate();
        return;
      }

      // At this point, if this our baseRoute matches the currentRoute, it means 
      // the current route is invalid and we should handle it by redirecting to our default route.
      if (_route.indexOf(options.baseRoute) === 0 ||
          ('#'+_route).indexOf(options.baseRoute) === 0) {
        route = options.baseRoute + options.defaultRoute;        
        triggerUpdate();
        //router.navigate(route, {}, {replace:true});
        window.location.hash = route;
      }
    }

    //subscribe to future changes
    const routerUnsubscribe = router.subscribe(handler);
    
    //invoke the handler for the current route
    handler({
      route: router.getState()
    });

    //return methods to be invoked elsewhere
    return {
      getRoute : () => {
        // TODO: currently having to do some gymnastics to manage where '#' should be returned
        let tempRoute = route;
        if (tempRoute[0] !== '#' && options.baseRoute[0] === '#') {
          tempRoute = '#'+tempRoute;
        } else if (useHash && tempRoute[0] !== '#') {
          tempRoute = '#'+tempRoute;
        }
        return tempRoute.replace(options.baseRoute, '')
      },
      unsubscribe: routerUnsubscribe
    };

    // using timesDisconnected as a memo is one way to manage subscribing/unsubscribing
  }, [timesDisconnected]); 

  useDisconnected(() => {
    routerApi.unsubscribe();
    setTimesDisconnected(timesDisconnected + 1);
  });
  
  return routerApi.getRoute(); //return the valid partial route that the component will care about
};
