import { onMount } from "solid-js";
import Anchor from "../Anchor/Anchor";
import CodeEditor from "../CodeEditor/CodeEditor";
import {
  Popper as _Popper,
  PopperConditionalRender,
} from "../Examples/Popper/Popper";
import FocusGutter from "../FocusGutter";
import SimpleBar from "simplebar";

const Popup = () => {
  const popperJSX = `<pre class="  language-css" tabindex="0"><code class=" language-jsx"><span class="token keyword">import</span> Dismiss <span class="token keyword">from</span> <span class="token string">"solid-dismiss"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> usePopper <span class="token keyword">from</span> <span class="token string">"solid-popper"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"solid-js"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">Popper</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>anchor<span class="token punctuation">,</span> setAnchor<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>popper<span class="token punctuation">,</span> setPopper<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>open<span class="token punctuation">,</span> setOpen<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> btnEl<span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">refCb</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">el</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">setAnchor</span><span class="token punctuation">(</span>el<span class="token punctuation">)</span><span class="token punctuation">;</span>
    btnEl <span class="token operator">=</span> el<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> popperInstance <span class="token operator">=</span> <span class="token function">usePopper</span><span class="token punctuation">(</span>anchor<span class="token punctuation">,</span> popper<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    placement<span class="token operator">:</span> <span class="token string">"bottom"</span><span class="token punctuation">,</span>
    modifiers<span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">"eventListeners"</span><span class="token punctuation">,</span> enabled<span class="token operator">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        name<span class="token operator">:</span> <span class="token string">"offset"</span><span class="token punctuation">,</span>
        options<span class="token operator">:</span> <span class="token punctuation">{</span>
          offset<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">onOpen</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">open</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token function">popperInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>open<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// Enable the event listeners</span>
      instance<span class="token punctuation">.</span><span class="token function">setOptions</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token operator">...</span>options<span class="token punctuation">,</span>
        modifiers<span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token operator">...</span>options<span class="token punctuation">.</span>modifiers<span class="token punctuation">,</span>
          <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">"eventListeners"</span><span class="token punctuation">,</span> enabled<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// Update its position</span>
      instance<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// Disable the event listeners</span>
      instance<span class="token punctuation">.</span><span class="token function">setOptions</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token operator">...</span>options<span class="token punctuation">,</span>
        modifiers<span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token operator">...</span>options<span class="token punctuation">.</span>modifiers<span class="token punctuation">,</span>
          <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">"eventListeners"</span><span class="token punctuation">,</span> enabled<span class="token operator">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>refCb<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Button</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Dismiss</span></span>
        <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>container<span class="token punctuation">"</span></span>
        <span class="token attr-name">classList</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> active<span class="token operator">:</span> <span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
        <span class="token attr-name">menuButton</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span>
        <span class="token attr-name">open</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>open<span class="token punctuation">}</span></span>
        <span class="token attr-name">setOpen</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>setOpen<span class="token punctuation">}</span></span>
        <span class="token attr-name">onOpen</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>onOpen<span class="token punctuation">}</span></span>
        <span class="token attr-name">show</span>
      <span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>setPopper<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          This is a tooltip.
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Dismiss</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>`;

  const popperCSS = `<pre class="  language-css" tabindex="0"><code class="  language-css"><span class="token selector">// relevant CSS ...

.container</span> <span class="token punctuation">{</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">transition</span><span class="token punctuation">:</span> opacity 200ms<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.container.active</span> <span class="token punctuation">{</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>`;

  const popperConditionalRenderJSX = `<pre class="  language-jsx" tabindex="0"><code class="  language-jsx"><span class="token keyword">import</span> Dismiss <span class="token keyword">from</span> <span class="token string">"solid-dismiss"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> usePopper <span class="token keyword">from</span> <span class="token string">"solid-popper"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"solid-js"</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">Popper</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>anchor<span class="token punctuation">,</span> setAnchor<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>popper<span class="token punctuation">,</span> setPopper<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>open<span class="token punctuation">,</span> setOpen<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> btnEl<span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">refCb</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">el</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">setAnchor</span><span class="token punctuation">(</span>el<span class="token punctuation">)</span><span class="token punctuation">;</span>
    btnEl <span class="token operator">=</span> el<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> popperInstance <span class="token operator">=</span> <span class="token function">usePopper</span><span class="token punctuation">(</span>anchor<span class="token punctuation">,</span> popper<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    placement<span class="token operator">:</span> <span class="token string">"bottom"</span><span class="token punctuation">,</span>
    modifiers<span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        name<span class="token operator">:</span> <span class="token string">"offset"</span><span class="token punctuation">,</span>
        options<span class="token operator">:</span> <span class="token punctuation">{</span>
          offset<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">animationOnAfterExit</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token function">popperInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    instance<span class="token punctuation">.</span><span class="token function">destroy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>refCb<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Button</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Dismiss</span></span>
        <span class="token attr-name">menuButton</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span>
        <span class="token attr-name">open</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>open<span class="token punctuation">}</span></span>
        <span class="token attr-name">setOpen</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>setOpen<span class="token punctuation">}</span></span>
        <span class="token attr-name">animation</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">"fade"</span><span class="token punctuation">,</span> onAfterExit<span class="token operator">:</span> animationOnAfterExit <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
      <span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>setPopper<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          This is a tooltip.
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Dismiss</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>`;
  const popperConditionalRenderCSS = `<pre class="  language-css" tabindex="0"><code class="  language-css"><span class="token selector">// relevant CSS ...

.fade-enter</span> <span class="token punctuation">{</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 0.1<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.fade-enter-to</span> <span class="token punctuation">{</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.fade-exit</span> <span class="token punctuation">{</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.fade-exit-to</span> <span class="token punctuation">{</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.fade-enter-to, .fade-exit, .fade-exit-to</span> <span class="token punctuation">{</span>
  <span class="token property">transition</span><span class="token punctuation">:</span> opacity 200ms<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>`;

  let scrollContainerEl1!: HTMLDivElement;
  let scrollContainerEl2!: HTMLDivElement;

  onMount(() => {
    const el1 = new SimpleBar(scrollContainerEl1, {
      autoHide: false,
      clickOnTrack: true,
    });
    const el2 = new SimpleBar(scrollContainerEl2, {
      autoHide: false,
      clickOnTrack: true,
    });

    const scrollToMiddle = (scrollContainerEl: HTMLElement) => {
      const scrollTop =
        (scrollContainerEl.scrollHeight - scrollContainerEl.clientHeight) / 2;
      scrollContainerEl.scrollTop = scrollTop;
    };

    [el1, el2].forEach((el) => {
      scrollToMiddle(el.getScrollElement());
    });

    setTimeout(() => {
      scrollContainerEl1.classList.add("border-radius");
      scrollContainerEl2.classList.add("border-radius");
    });
  });

  return (
    <div class="section">
      <h3 id="tooltip/popover">Tooltip/Popover</h3>
      <div class="explaination">
        <p>
          Here's how to use{" "}
          <Anchor
            class="page-anchor"
            href="https://popper.js.org/"
            target="_blank"
          >
            popper.js
          </Anchor>
          , a tooltip position engine, with Dismiss.
        </p>
        <p>
          Luckly, there's a Solid binding for popper.js,{" "}
          <Anchor
            class="page-anchor"
            href="https://github.com/LXSMNSYC/solid-popper"
            target="_blank"
          >
            solid-popper
          </Anchor>{" "}
          which we will use for this example.
        </p>
        <p>
          Dismiss has <code class="code">show</code> prop, since the tooltip
          must exist in the DOM when Popper is instantiated.
        </p>
      </div>
      <div class="split-view">
        <div
          class="popper-scroll-container"
          data-simplebar-match-webkit
          ref={scrollContainerEl1}
        >
          <div class="dropdown-area" style="margin: 500px 0;">
            <FocusGutter />
            <_Popper></_Popper>
            <FocusGutter />
          </div>
        </div>
        <CodeEditor contentJSX={popperJSX} contentCSS={popperCSS}></CodeEditor>
      </div>
      <div class="explaination">
        <p>
          It's also possible to conditionally render the tooltip and it's easily
          done thanks to solid-popper's <code class="code">usePopper</code>{" "}
          effect. <code class="code">usePopper</code> won't run core popper
          instantiation until both anchor and tooltip signals are DOM elements,
          and since it subscribes to those signals, it will automatically
          instantiate, when the tooltip element is rendered.
        </p>
        <p>
          It's good to destroy the popper instance, when the tooltip is no
          longer rendered, and it could be done in{" "}
          <code class="code">onOpen</code> callback or createEffect. But since
          we're using Dismiss animation, destroying during animation will remove
          tooltip's styling, which will cause intended visual result. To run
          destroy after animation is done, we use{" "}
          <code class="code">onAfterExit</code> callback in{" "}
          <code class="code">animation</code> prop.
        </p>
      </div>
      <div class="split-view">
        <div
          class="popper-scroll-container"
          data-simplebar-match-webkit
          ref={scrollContainerEl2}
        >
          <div class="dropdown-area" style="margin: 500px 0;">
            <FocusGutter />
            <PopperConditionalRender></PopperConditionalRender>
            <FocusGutter />
          </div>
        </div>
        <CodeEditor
          contentJSX={popperConditionalRenderJSX}
          contentCSS={popperConditionalRenderCSS}
        ></CodeEditor>
      </div>
    </div>
  );
};

export default Popup;
