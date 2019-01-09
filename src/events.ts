/**
 * Callback is fired only if it's been longer than the specified 
 * time since the last time it was fired.
 *
 * For instance, if applied to a scroll event eith 800ms, the event
 * fires once every 800ms for as long as the user keeps scrolling.
 * 
 * Example usage:
 * 
 *    window.addEventListener("mousemove", throttle(handler, 800));
 * 
 * @param  callback is the function that is fired
 * @param  timeout is the interval at which callback is allowed to fire
 * @param  executeLastEvent specifies whether the last event is fired always
 * @return A function you can pass as an event handler
 */
export function throttle<T extends (...args: any[]) => void>(
  callback: T,
  timeout = 500,
  executeLastEvent = true,
  ...initArguments: any[]
) {
  let lastCall: number | undefined;
  let timer: number | undefined;
  return ((
    ...callArguments: any[]
  ) => {
    const timeNow = Date.now();
    if (lastCall === undefined || timeNow - lastCall > timeout) {
      lastCall = timeNow;
      callback(...callArguments);
      if (typeof timer === "number") {
        clearTimeout(timer);
        timer = undefined;
      }
    } else if (executeLastEvent && timer === undefined) {
      timer = setTimeout(() => callback(
        ...callArguments,
        ...initArguments,
      ), timeout);
    }
  }) as T;
}

/**
 * Callback is fired once after the specified timeout. If the
 * fucntion is called again before it times out, it resets 
 * the timeout instead of calling the function twice.
 *
 * For instance, if applied to a scroll event with a timeout of 
 * 800ms, the callback is fired once when the user stops scrolling
 * for at least 800ms.
 * 
 * Example usage:
 * 
 *    window.addEventListener("scroll", finalEvent(handler, 800));
 * 
 * @param  callback is the function that is fired
 * @param  timeout is the time the that's waited before firing
 * @return A function you can pass as an event handler
 */
export function finalEvent<T extends (...args: any[]) => void>(
  callback: T,
  timeout = 500,
) {
  let timer: number | undefined;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), timeout);
  }) as T;
}

/**
 * Callback is fired once and not again unless the last call
 * happened longer than the specified time ago.
 * 
 * For instance, when attached to mousemove with 800ms timeout,
 * it'll fire once when the user first starts moving their mouse
 * and not again unless the user stops moving their mouse for at
 * least 800ms.
 * 
 * Example usage:
 * 
 *    window.addEventListener("mousemove", initialEvent(handler, 800));
 * 
 * @param  callback The function to run
 * @param  timeout The timeframe within which the function is allowed to run only once
 * @return A function you can pass as an event handler
 */
export function initialEvent<T extends (...args: any[]) => void>(
  callback: T,
  timeout = 500,
  ...initArguments: any[]
) {
  let lastCall: number | undefined;
  return ((
    ...callArguments: any[]
  ) => {
    const now = Date.now();
    if (
      lastCall === undefined ||
      now - lastCall > timeout
    ) {
      callback(
        ...callArguments,
        ...initArguments,
      );
    }
    lastCall = now;
  }) as T;
}

/**
 * Syncs event call frequency with the screen refresh
 * rate.
 * 
 * Any parameters passed after the callback are passed first to the
 * callback when calling it. Any parameters passed to the returned
 * function are passed after those parameters. The time value of the
 * animation frame is passed after all the other parameters.
 * 
 * Example usage:
 * 
 *    canvas.addEventListener("mousemove", animationEvent(draw, "foo"));
 * 
 *    function draw(myString, event, time) {
 *      console.log(myString, event, time); //myString === "foo"
 *    }
 * 
 * Above example would fire whenever the user moves their mouse
 * _and_ the browser is ready to render another frame, and not
 * more.
 * 
 * @param   callback the event handler
 * @returns the throttled event handler
 */
export function animationEvent<T extends (...args: any[]) => void>(
  callback: T,
  ...initArguments: any[]
) {
  let frame: number | undefined;
  return ((
    ...callArguments: any[]
  ) => {
    if (typeof frame === "number") {
      cancelAnimationFrame(frame);
    }
    frame = requestAnimationFrame(time => callback(
      time,
      ...callArguments,
      ...initArguments,
    ));
  }) as T;
}

/**
 * Much like setInterval, but fires the first time
 * right away instead of waiting.
 * 
 * @param   handler is the function to be called
 * @param   timeout specifies how often the function should be called
 * @returns the setInterval id
 */
export function startInterval(
  handler: Function,
  timeout?: number | undefined,
  ...args: any[]
) {
  handler();
  return setInterval(handler, timeout, ...args);
}
