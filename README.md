<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=Solid%20Dismiss&background=tiles&project=%20" alt="Solid Primitives">
</p>
<h1 align="center">Solid Dismiss
<img src="assets/logo.svg" width="40px" height="35px" style="position: relative; top: 5px; pointer-events: none;">
</h1>

[![size](https://img.shields.io/bundlephobia/minzip/solid-dismiss?style=for-the-badge&label=size)](https://bundlephobia.com/package/solid-dismiss)

Handles "click outside" behavior for popup menu. Closing is triggered by click/focus outside of popup element or pressing "Escape" key. It can also deal with stacks/layers of popups.

## Install

```
npm i solid-dismiss
```

```
yarn add solid-dismiss
```

```
pnpm add solid-dismiss
```

## Example

### Popup

```js
import Dismiss from "solid-dismiss";
import { createSignal } from "solid-js";

const Popup = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl;

  return (
    <div style="position: relative;">
      <button ref={btnEl}>Open</button>
      <Dismiss menuButton={btnEl} open={open} setOpen={setOpen}>
        <div class="popup">
          <p>Popup text!</p>
          <p>
            Lorem, <a href="#">ipsum</a> dolor.
          </p>
        </div>
      </Dismiss>
    </div>
  );
};
```

## [Demo Site](https://aquaductape.github.io/solid-dismiss/)

## Using SSR

**Note:** on solid-start version `0.1.1` and above, no need update vite config with ssr.noExternal, it happens automatically.

On SSR frameworks such as [Astro](https://docs.astro.build/en/guides/integrations-guide/solid-js/) or [solid-start](https://github.com/solidjs/solid-start), you need to include `["solid-dismiss"]` value to the `noExternal` property in the vite config file.

```js
// solid-start vite.config.js
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid()],
  ssr: {
    noExternal: ["solid-dismiss"],
  },
});
```

```js
// astro astro.config.mjs
import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";

export default defineConfig({
  integrations: [solidJs()],
  vite: {
    ssr: {
      noExternal: ["solid-dismiss"],
    },
  },
});
```

## Caveat

For iOS Safari: when clicking outside, without overlay, and the element that happened to be clicked upon was an iframe, there's a chance that the popup won't close. iframe detection interaction is feasible by checking if window blurs, but in iOS, unless the user taps on a clickable element inside iframe, window won't blur because the main page focus hasn't been blurred.

If the iframe body element has click listener, then tapping anywhere on iframe will blur window, thus closing the popup as intended. Thus if author is dealing with same domain iframes, the author can easily add empty click event listener to the body.

```js
const iframeEl = document.querySelector("iframe");
const doc = iframeEl.contentWindow.document;

doc.body.addEventListener("click", () => {});
```

## Other

For better visual user experience, when using custom overlay elements in overlayElement prop,

```js
<Dismiss
  // ...
  modal
  overlayElement={{
    element: <div style="position: fixed; inset: 0; z-index: 1000; background: rgba(0, 0, 0, 0.5)"/>
  }}
```

extend the overlay's height (that has the value of viewport height either 100% or 100vh) by 100px or more. What happens is that on mobile devices, there's a lag of updating viewport dimensions when dynamic URL bar toggles, therefore showing a large gap at bottom of the page that the overlay doesn't cover. So the overlay's height should be `calc(100vh + 100px)` or `calc(100% + 100px)`, depending how you style the overlay, tailwind equivalent would be `h-[calc(100vh+100px)]`.

```js
<Dismiss
 // ...
 modal
 overlayElement={{
   element: <div style="position: fixed; inset: 0; height: calc(100vh + 100px); z-index: 1000; background: rgba(0, 0, 0, 0.5)"/>
 }}
```

## Docs

Dismiss

```ts
/**
 * sets id attribute for root component
 */
id?: string;
ref?: JSX.Element;
class?: string;
classList?: { [key: string]: boolean };
open: Accessor<boolean>;
setOpen: (v: boolean) => void;
/**
 * callback when setOpen signal changes
 */
onOpen?: OnOpenHandler;
/**
 * CSS selector, queried from document, to get menu button element. Or pass JSX element
 *
 * @remark There are situations where there are multiple JSX menu buttons that open the same menu popup, but only one of them is rendered based on device width. Use signal if JSX menu buttons are conditionally rendered. Use array if all menu buttons are rendered, when all but one, are hidden via CSS `display: none;` declaration.
 */
menuButton:
  | string
  | JSX.Element
  | Accessor<JSX.Element>
  | (string | JSX.Element)[];
/**
 *
 * CSS selector, queried from document, to get menu popup element. Or pass JSX element
 *
 * @defaultValue root component element queries first child element
 */
menuPopup?: string | JSX.Element | (() => JSX.Element);
/**
 *
 * Have the behavior to move through a list of "dropdown items" using cursor keys.
 *
 * @defaultValue `false`
 */
cursorKeys?:
  | boolean
  | {
      /**
       * When focused on the last dropdown item, when continueing in the same direction, the first item will be focused.
       *
       * @defaultValue `false`
       */
      wrap: boolean;
      onKeyDown?: (props: {
        currentEl: HTMLElement | null;
        prevEl: HTMLElement | null;
      }) => void;
    };
/**
 *
 * Focus will remain inside menuPopup when pressing Tab key
 *
 * @defaultValue `false`
 */
trapFocus?: boolean;
/**
 *
 * which element, via selector*, to recieve focus after popup opens.
 *
 * *CSS string queried from menuPopup element. If string value is `"menuPopup"` uses menuPopup element. `"firstChild"` uses first tabbable element inside menuPopup. `"none"` focus remains on `"menuButton"`, even if `Dismiss.modal` is true.
 *
 * @defaultValue focus remains on `"menuButton"`. But if there's no menu button, focus remains on document's activeElement.
 */
focusElementOnOpen?:
  | "menuPopup"
  | "firstChild"
  | "none"
  | JSX.Element
  | (() => JSX.Element)
  | {
      target:
        | "menuPopup"
        | "firstChild"
        | "none"
        | JSX.Element
        | (() => JSX.Element);
      preventScroll?: boolean;
    };
/**
 *
 * Which element, via selector*, to recieve focus after popup closes.
 *
 * *CSS string queried from document, or if string value is `"menuButton"` uses menuButton element
 *
 * @remarks
 *
 * If menuPopup is mounted elsewhere in the DOM or doesn't share the same parent as menuButton, when tabbing outside menuPopup, this library programmatically grabs the correct next tabbable element after menuButton. However if that next tabbable element is inside an iframe that has different origin, then this library won't be able to grab tabbable elements inside it, instead the iframe will be focused.
 *
 *
 * @defaultValue
 *
 * When Tabbing forwards, focuses on tabbable element after menuButton. When Tabbing backwards, focuses on menuButton. When pressing Escape key, menuButton will be focused. When programmatically closed, such as clicking close button, then menuButton will be focused. When "click" outside, user-agent determines which element recieves focus, however if `Dismiss.overlay` or `Dismiss.overlayElement` are set, then menuButton will be focused instead.
 */
focusElementOnClose?:
  | "menuButton"
  | JSX.Element
  | {
      /**
       *
       * focus on element when exiting menuPopup via tabbing backwards ie "Shift + Tab".
       *
       * @defaultValue `"menuButton"`
       *
       */
      tabBackwards?: "menuButton" | JSX.Element;
      /**
       *
       * focus on element when exiting menuPopup via tabbing forwards ie "Tab".
       *
       * @remarks
       *
       *  If popup is mounted elsewhere in the DOM, when tabbing outside, this library is able to grab the correct next tabbable element after menuButton, except for tabbable elements inside iframe with cross domain.
       *
       * @defaultValue next tabbable element after menuButton;
       */
      tabForwards?: "menuButton" | JSX.Element;
      /**
       * focus on element when exiting menuPopup via click outside popup.
       *
       * If mounted overlay present, and popup closes via click, then menuButton will be focused.
       *
       * @remarks
       *
       * When clicking, user-agent determines which element recieves focus.
       */
      click?: "menuButton" | JSX.Element;
      /**
       *
       * focus on element when exiting menuPopup via "Escape" key
       *
       * @defaultValue `"menuButton"`
       */
      escapeKey?: "menuButton" | JSX.Element;
      /**
       *
       * focus on element when exiting menuPopup via scrolling, from scrollable container that contains menuButton
       *
       * @dafaultValue `"menuButton"`
       */
      scrolling?: "menuButton" | JSX.Element;
    };
/**
 * @default `true`
 *
 * Set to `false` if you want to switch focus from menuButton to menuPopup input element while keeping virtual keyboard opened in iOS. However end-user must also provide additional logic to fire inside menuButton onclick for behavior to work.
 */
focusMenuButtonOnMouseDown?: boolean;
/**
 * When `true`, clicking or focusing on menuButton doesn't toggle menuPopup. However the menuButton is still used as reference from `focusElementOnClose`
 *
 * @defaultValue `false`
 */
deadMenuButton?: boolean;
/**
 *
 * When `true`, after focusing within menuPopup, if focused back to menu button via keyboard (Tab key), the menuPopup will close.
 *
 * @defaultValue `false`
 */
closeWhenMenuButtonIsTabbed?: boolean;
/**
 *
 * If `overlay` is `true`, menuPopup will always close when menu button is clicked
 *
 * @defaultValue `true`
 */
closeWhenMenuButtonIsClicked?: boolean;
/**
 *
 * Closes menuPopup when any scrollable container (except inside menuPopup) is scrolled
 *
 * @remark
 *
 * Even when `true`, scrolling in "outside" scrollable iframe won't be able to close menuPopup.
 *
 * @defaultValue `false`
 */
closeWhenScrolling?: boolean;
/**
 *
 * If `false`, menuPopup won't close when overlay backdrop is clicked. When overlay clicked, menuPopup will recieve focus.
 *
 * @defaultValue `true`
 */

closeWhenOverlayClicked?: boolean;
/**
 *
 * Closes menuPopup when escape key is pressed
 *
 * @defaultValue `true`
 */
closeWhenEscapeKeyIsPressed?: boolean;
/**
 *
 * If `true`, closes menuPopup when the document "blurs". This would happen when interacting outside of the page such as Devtools, changing browser tabs, or switch different applications. Also if the page with the menuPopup, is inside an iframe, interacting outside the iframe, will close it.
 *
 * @remarks This doesn't effect overlays, if `Dimsiss.overlay` or `Dismiss.overlayElement` are set.
 *
 * @defaultValue `false`
 *
 */
closeWhenDocumentBlurs?: boolean;
/**
 * If `false`, when clicking outside, menuPopup remains open.
 *
 * Clicking other menuButtons that aren't part of the menuPopup stack will close those menuPopups.
 *
 * Only to be used with non overlay/modal popups, for them use `closeWhenOverlayClicked`.
 *
 * @defaultValue `true`
 */
closeWhenClickingOutside?: boolean;
/**
 *
 * If `true`, sets "overflow: hidden" declaration to Document.scrollingElement.
 *
 * @defaultValue `false`
 */
removeScrollbar?: boolean;
/**
 *
 * Customize the removal of the scrollbar to prevent visual page "jank".
 *
 * @defaultValue `false`
 */
onToggleScrollbar?: {
  onRemove: () => void;
  onRestore: () => void;
};
/**
 * Prevent page interaction when clicking outside to close menuPopup
 *
 * Author must create overlay element within menuPopup, this way page elements underneath the menuPopup can't be interacted with.
 *
 *
 * @defaultValue `false`
 */
overlay?: boolean;
/**
 * Prevent page interaction when clicking outside to close menuPopup
 *
 * Adds root level div that acts as a layer. This removes interaction of the page elements that's underneath the overlay element, that way menuPopup is the only element that can be interacted with.
 *
 * @defaultValue `false`
 */
overlayElement?:
  | boolean
  | {
      ref?: (el: HTMLElement) => void;
      class?: string;
      classList?: { [key: string]: boolean };
      animation?: DismissAnimation;
      element?: JSX.Element;
    };
/**
 * Shorthand for `Dismiss.overlay` to `true`, `Dismiss.overlayElement` to `true`, `Dismiss.trapFocus` to `true`, `Dismiss.removeScrollbar` to `true`, and `Dismiss.mount` to `"body"`. Does not override the values of already setted properties.
 *
 * Also adds `pointer-events: none;` css declaration to menuPopup element and then `pointer-events: all;` to either element that has role="dialog" attribute or first child of menuPopup element.
 *
 * @defaultValue `false`
 */
modal?: boolean;
/**
 *
 * activates sentinel element as last tabbable item in menuPopup, that way when Tabbing "forwards" out of menuPopup, the next logical tabblable element after menuButton will be focused.
 *
 *
 * @defaultValue `false` unless `Dismiss.mount` is set, `Dismiss.focusElementOnClosed` is set, `Dismiss.overlay` prop is `true`, or this component's root container is not an adjacent sibling of menuButton.
 */
enableLastFocusSentinel?: boolean;
/**
 *
 * Inserts menuPopup in the mount node. Useful for inserting menuPopup outside of page layout. Events still propagate through the Component Hierarchy.
 */
mount?: string | Node;
/**
 * Place CSS class names or JS Web Animation to fire animation as menuPopup enters/exits
 *
 * @defaultValue none
 */
animation?: DismissAnimation;
/**
 * Determine whether children are rendered always, or conditionally.
 *
 * If `true`, children are rendered.
 *
 * @defaultValue `false`, children are conditionally rendered based on `Dismiss.open` value.
 */
show?: boolean;
/**
 * If `true`, when pressing Tab key, all tabbable elements in menuPopup are ignored, and the next focusable element is based on `focusElementOnClose`.
 *
 * @defaultValue `false`
 */
// disableTabbingInMenuPopup?: boolean;
ignoreMenuPopupWhenTabbing?: boolean;
/**
 * Pass CSS selector strings in array, which then are queried from document, then if those elements are interacted, it won't trigger stacks to close
 *
 * When there are other popups or interactive tooltips, that are mounted to the
      body, this library isn't aware of them, so interacting them by clicking
      them, will close all open stacks and cause other unintended consequences. If that
      third-party popup is closed by Escape key, the expectation is that only
      that popup will close, but Dismiss will close its topmost stack which
      happens to contain that mounted popup, so "2 stacks" will be closed.
  *
  * @defaultValue empty array
  */
mountedPopupsSafeList?: string[];
```

DismissAnimation

```ts
/**
 * Used to automatically generate transition CSS class names. e.g. name: 'fade' will auto expand to .fade-enter, .fade-enter-active, etc.
 */
name?: string;
enterActiveClass?: string;
enterClass?: string;
enterToClass?: string;
exitActiveClass?: string;
exitClass?: string;
exitToClass?: string;
onBeforeEnter?: (el: Element) => void;
onEnter?: (el: Element, done: () => void) => void;
onAfterEnter?: (el: Element) => void;
onBeforeExit?: (el: Element) => void;
onExit?: (el: Element, done: () => void) => void;
onAfterExit?: (el: Element) => void;
/**
 * Change element where CSS classes are appended and passed to callbacks.
 *
 * Pass CSS selector, queried from root component, `"menuPopup"` uses menuPopup element, or pass JSX element.
 *
 * @defaultValue The element is the root element of the component, where CSS classes are appended to, and it is also passed to callbacks
 */
appendToElement?: "menuPopup" | string | JSX.Element;
/**
 * Whether to apply transition on initial render.
 *
 * @defaultValue `false`
 */
appear?: boolean;
```
