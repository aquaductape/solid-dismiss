import { Show } from "solid-js";
import { Portal } from "solid-js/web";
import { dismissStack } from "./dismissStack";
import { TState } from "./state";

const render = (state: TState, props: any, children: any) => (
  <Show when={props.open()}>
    <div
      id={state.id}
      class={props.class}
      classList={props.classList || {}}
      onFocusIn={state.onFocusInContainer}
      onFocusOut={state.onFocusOutContainer}
      style={state.overlay ? `z-index: ${1000 + dismissStack.length}` : ""}
      ref={state.refContainerCb}
    >
      {state.overlay && (
        <Portal>
          <div
            class={
              typeof state.overlay === "object"
                ? state.overlay.className
                : undefined
            }
            classList={
              typeof state.overlay === "object"
                ? state.overlay.classList || {}
                : {}
            }
            role="presentation"
            data-solid-dismiss-overlay-backdrop-level={dismissStack.length}
            onClick={state.onClickOverlay}
            style={`position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: ${
              999 + dismissStack.length
            };`}
            ref={state.refOverlayCb}
          ></div>
        </Portal>
      )}
      <div
        tabindex="0"
        onFocus={state.onFocusSentinel}
        style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
        aria-hidden="true"
        ref={state.focusSentinelFirstEl}
      ></div>
      {children}
      <div
        tabindex={state.hasFocusSentinels ? "0" : "-1"}
        onFocus={state.onFocusSentinel}
        style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none; width: 0; height: 0;"
        aria-hidden="true"
        ref={state.focusSentinelLastEl}
      ></div>
    </div>
  </Show>
);
