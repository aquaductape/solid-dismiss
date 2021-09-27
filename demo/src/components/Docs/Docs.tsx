import { createSignal, Show, createEffect, onMount } from "solid-js";

const Docs = () => {
  let codeEl!: HTMLDivElement;
  onMount(() => {
    codeEl.innerHTML = `<pre class=" language-markup" tabindex="0"><code class="  language-typescript"><span class="token keyword">type</span> <span class="token class-name">TDismiss</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
<span class="token comment">/**
 * sets id attribute for root component
 */</span>
id<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
ref<span class="token operator">?</span><span class="token operator">:</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element<span class="token punctuation">;</span>
<span class="token keyword">class</span><span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
classList<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">[</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
open<span class="token operator">:</span> Accessor<span class="token operator">&lt;</span><span class="token builtin">boolean</span><span class="token operator">&gt;</span><span class="token punctuation">;</span>
<span class="token function-variable function">setOpen</span><span class="token operator">:</span> <span class="token punctuation">(</span>v<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * callback when setOpen signal changes
 */</span>
onOpen<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">(</span>
  open<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">,</span>
  uniqueId<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span>
  dismissStack<span class="token operator">:</span> DismissStack<span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * css selector, queried from document, to get menu button element. Or pass JSX element
 */</span>
menuButton<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: root component element queries first child element
 * css selector, queried from document, to get menu popup element. Or pass JSX element
 */</span>
menuPopup<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: \`false\`
 *
 * Have the behavior to move through a list of "dropdown items" using cursor keys.
 *
 */</span>
cursorKeys<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: \`false\`
 *
 * Focus will remain inside menuPopup when pressing Tab key
 */</span>
trapFocus<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: focus remains on \`"menuButton"\`
 *
 * which element, via selector*, to recieve focus after popup opens.
 *
 * *css string queried from document, or if string value is \`"menuPopup"\` uses menuPopup element.
 */</span>
focusElementOnOpen<span class="token operator">?</span><span class="token operator">:</span> <span class="token string">"menuPopup"</span> <span class="token operator">|</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: When Tabbing forwards, focuses on tabbable element*¹ after menuButton. When Tabbing backwards, focuses on menuButton. When pressing Escape key, menuButton will be focused. When "click", user-agent determines which element recieves focus, however if overlay is \`true\`, then menuButton will be focused instead.
 *
 * Which element, via selector*², to recieve focus after popup closes.
 *
 * An example would be to emulate native &lt;select&gt; element behavior, set which sets focus to menuButton after dismiss.
 *
 * *¹ If menuPopup is mounted elsewhere in the DOM or doesn't share the same parent as menuButton, when tabbing outside menuPopup, this library programmatically grabs the correct next tabbable element after menuButton. However if that next tabbable element is inside an iframe that has different origin, then this library won't be able to grab tabbable elements inside it, instead the iframe will be focused.
 *
 * *² selector: css string queried from document, or if string value is \`"menuButton"\` uses menuButton element
 */</span>
focusElementOnClose<span class="token operator">?</span><span class="token operator">:</span>
  <span class="token operator">|</span> <span class="token string">"menuButton"</span>
  <span class="token operator">|</span> <span class="token builtin">string</span>
  <span class="token operator">|</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element
  <span class="token operator">|</span> <span class="token punctuation">{</span>
      <span class="token comment">/**
       * Default: menuButton
       *
       * focus on element when exiting menuPopup via tabbing backwards ie "Shift + Tab".
       *
       */</span>
      tabBackwards<span class="token operator">?</span><span class="token operator">:</span> <span class="token string">"menuButton"</span> <span class="token operator">|</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element<span class="token punctuation">;</span>
      <span class="token comment">/**
       * Default: next tabbable element after menuButton;
       *
       * focus on element when exiting menuPopup via tabbing forwards ie "Tab".
       *
       * Note: If popup is mounted elsewhere in the DOM, when tabbing outside, this library is able to grab the correct next tabbable element after menuButton, except for tabbable elements inside iframe with cross domain.
       */</span>
      tabForwards<span class="token operator">?</span><span class="token operator">:</span> <span class="token string">"menuButton"</span> <span class="token operator">|</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element<span class="token punctuation">;</span>
      <span class="token comment">/**
       * focus on element when exiting menuPopup via click outside popup.
       *
       * If overlay present, and popup closes via click, then menuButton will be focused.
       *
       * Note: When clicking, user-agent determines which element recieves focus, to prevent this, use \`overlay\` prop.
       */</span>
      click<span class="token operator">?</span><span class="token operator">:</span> <span class="token string">"menuButton"</span> <span class="token operator">|</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element<span class="token punctuation">;</span>
      <span class="token comment">/**
       * Default: menuButton
       *
       * focus on element when exiting menuPopup via "Escape" key
       */</span>
      escapeKey<span class="token operator">?</span><span class="token operator">:</span> <span class="token string">"menuButton"</span> <span class="token operator">|</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element<span class="token punctuation">;</span>
      <span class="token comment">/**
       * Default: menuButton
       *
       * focus on element when exiting menuPopup via scrolling, from scrollable container that contains menuButton
       */</span>
      scrolling<span class="token operator">?</span><span class="token operator">:</span> <span class="token string">"menuButton"</span> <span class="token operator">|</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token constant">JSX</span><span class="token punctuation">.</span>Element<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">/**
 * Default: \`false\`
 *
 * When \`true\`, after focusing within menuPopup, if focused back to menu button via keyboard (Tab key), the menuPopup will close.
 *
 */</span>
closeWhenMenuButtonIsTabbed<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: \`true\`
 *
 * If \`overlay\` is \`true\`, menuPopup will always close when menu button is clicked
 */</span>
closeWhenMenuButtonIsClicked<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: \`false\`
 *
 * Closes menuPopup when any scrollable container (except inside menuPopup) is scrolled
 *
 * Note: Even when \`true\`, scrolling in "outside" scrollable iframe won't be able to close menuPopup.
 */</span>
closeWhenScrolling<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: \`true\`
 *
 * If \`false\`, menuPopup won't close when overlay backdrop is clicked. When overlay clicked, menuPopup will recieve focus.
 */</span>
closeWhenOverlayClicked<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: \`true\`
 *
 * Closes menuPopup when escape key is pressed
 */</span>
closeWhenEscapeKeyIsPressed<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: \`false\`
 *
 * Closes when the document "blurs". This would happen when interacting outside of the page such as Devtools, changing browser tabs, or switch different applications.
 */</span>
closeWhenDocumentBlurs<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: \`false\`
 *
 * If \`true\`, sets "overflow: hidden" declaration to Document.scrollingElement.
 *
 * Use callback function if author wants customize how the scrollbar is removed.
 */</span>
removeScrollbar<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default \`false\`
 *
 * Adds root level div that acts as a layer. This removes interaction of the page elements that's underneath the overlay element, that way menuPopup is the only element that can be interacted with. Author must ensure that menuPopup is placed above overlay element, one of the ways, is to nest this Component inside Solid's {@link https://www.solidjs.com/docs/latest/api#%3Cportal%3E Portal}.
 *
 */</span>
overlay<span class="token operator">?</span><span class="token operator">:</span>
  <span class="token operator">|</span> <span class="token builtin">boolean</span>
  <span class="token operator">|</span> <span class="token punctuation">{</span>
      ref<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">(</span>el<span class="token operator">:</span> HTMLElement<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
      <span class="token keyword">class</span><span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
      classList<span class="token operator">?</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token punctuation">[</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">]</span><span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
      animation<span class="token operator">?</span><span class="token operator">:</span> TAnimation<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: \`false\`
 *
 * If \`true\` add aria attributes for generic expand/collapse dropdown.
 */</span>
useAriaExpanded<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token comment">/**
 * Default: \`false\`
 *
 * If \`true\` activates sentinel element as last tabbable item in menuPopup, that way when Tabbing "forwards" out of menuPopup, the next logical tabblable element after menuButton will be focused.
 *
 * Automatically set to \`true\` for the following:  \`overlay\` prop is \`true\`,  this component's root container is not an adjacent sibling of menuButton, or \`focusElWhenClosed\` prop has a value.
 */</span>
mountedElseWhere<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
mount<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> Node<span class="token punctuation">;</span>
animation<span class="token operator">?</span><span class="token operator">:</span> TAnimation<span class="token punctuation">;</span>
stopComponentEventPropagation<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>`;
  });

  return (
    <div
      class="code-editor"
      data-simplebar
      data-simplebar-auto-hide="false"
      style="max-height: unset;"
      ref={codeEl}
    ></div>
  );
};

export default Docs;
