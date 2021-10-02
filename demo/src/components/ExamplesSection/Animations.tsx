import { onMount } from "solid-js";
import Anchor from "../Anchor/Anchor";
import CodeEditor from "../CodeEditor/CodeEditor";
import {
  PopupWithCSSAnimation,
  PopupWithJSAnimation,
} from "../Examples/Animations";
import FocusGutter from "../FocusGutter";

const Popup = () => {
  const codeCSSAnimationContentCSS = `<pre class=" language-jsx" tabindex="0"><code class=" language-css"><span class="token selector">.fade-enter</span> <span class="token punctuation">{</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span>25px<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 0.1<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.fade-enter-to</span> <span class="token punctuation">{</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span>0<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.fade-exit</span> <span class="token punctuation">{</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span>0<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.fade-exit-to</span> <span class="token punctuation">{</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span>25px<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.fade-enter-to, .fade-exit, .fade-exit-to</span> <span class="token punctuation">{</span>
  <span class="token property">transition</span><span class="token punctuation">:</span> transform 200ms<span class="token punctuation">,</span> opacity 200ms<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>`;

  const codeCSSAnimationContentJSX = `<pre class=" language-jsx" tabindex="0"><code class="  language-jsx"><span class="token keyword">import</span> Dismiss <span class="token keyword">from</span> <span class="token string">"solid-dismiss"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"solid-js"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">Popup</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>open<span class="token punctuation">,</span> setOpen<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> btnEl<span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>position: relative;<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Button</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Dismiss</span></span>
        <span class="token attr-name">menuButton</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span>
        <span class="token attr-name">open</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>open<span class="token punctuation">}</span></span>
        <span class="token attr-name">setOpen</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>setOpen<span class="token punctuation">}</span></span>
        <span class="token attr-name">animation</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">"fade"</span> <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
      <span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>popup<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Popup text!</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text"> Lorem, </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>#<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text"> ipsum </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">&gt;</span></span><span class="token plain-text"> dolor.</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Dismiss</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>`;

  const codeJSAnimationContent = `<pre class=" language-jsx" tabindex="0"><code class="  language-jsx"><span class="token keyword">import</span> Dismiss <span class="token keyword">from</span> <span class="token string">"solid-dismiss"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"solid-js"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">Popup</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>open<span class="token punctuation">,</span> setOpen<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> btnEl<span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>position: relative;<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Button</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      &lt;Dismiss
        menuButton=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span><span class="token plain-text">
        open=</span><span class="token punctuation">{</span>open<span class="token punctuation">}</span><span class="token plain-text">
        setOpen=</span><span class="token punctuation">{</span>setOpen<span class="token punctuation">}</span><span class="token plain-text">
        animation=</span><span class="token punctuation">{</span><span class="token punctuation">{</span>
          <span class="token function-variable function">onEnter</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> done</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> a <span class="token operator">=</span> el<span class="token punctuation">.</span><span class="token function">animate</span><span class="token punctuation">(</span>
              <span class="token punctuation">[</span>
                <span class="token punctuation">{</span>
                  transform<span class="token operator">:</span> <span class="token string">"translateY(25px)"</span><span class="token punctuation">,</span>
                  opacity<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token punctuation">{</span>
                  transform<span class="token operator">:</span> <span class="token string">"translateY(0)"</span><span class="token punctuation">,</span>
                  opacity<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
              <span class="token punctuation">]</span><span class="token punctuation">,</span>
              <span class="token punctuation">{</span> duration<span class="token operator">:</span> <span class="token number">300</span> <span class="token punctuation">}</span>
            <span class="token punctuation">)</span><span class="token punctuation">;</span>

            a<span class="token punctuation">.</span><span class="token function-variable function">onfinish</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token function-variable function">onExit</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> done</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> animation <span class="token operator">=</span> el<span class="token punctuation">.</span><span class="token function">animate</span><span class="token punctuation">(</span>
              <span class="token punctuation">[</span>
                <span class="token punctuation">{</span>
                  transform<span class="token operator">:</span> <span class="token string">"translateY(0)"</span><span class="token punctuation">,</span>
                  opacity<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
                <span class="token punctuation">{</span>
                  transform<span class="token operator">:</span> <span class="token string">"translateY(25px)"</span><span class="token punctuation">,</span>
                  opacity<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
                <span class="token punctuation">}</span><span class="token punctuation">,</span>
              <span class="token punctuation">]</span><span class="token punctuation">,</span>
              <span class="token punctuation">{</span> duration<span class="token operator">:</span> <span class="token number">300</span> <span class="token punctuation">}</span>
            <span class="token punctuation">)</span><span class="token punctuation">;</span>

            animation<span class="token punctuation">.</span><span class="token function-variable function">onfinish</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token plain-text">
      &gt;
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>dropdown<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Popup text!</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text"> Lorem, </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>#<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text"> ipsum </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">&gt;</span></span><span class="token plain-text"> dolor.</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Dismiss</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>`;

  return (
    <div class="section">
      <h3>Animations</h3>

      <p>
        Animations with CSS classes. The CSS class name will be generated into
        transition class names, in this example "fade" will expand into
        "fade-enter", "fade-enter-to", ect.
      </p>
      <p>
        By default the element that recieves the CSS classes and passed to
        callbacks, is the root container of Dismiss. You can change the element
        by using <code class="code">appendToElement</code> where you can set a
        Node or a selector.
      </p>
      <div class="split-view">
        <div>
          <div class="dropdown-area">
            <FocusGutter />
            <PopupWithCSSAnimation></PopupWithCSSAnimation>
            <FocusGutter />
          </div>
        </div>
        <CodeEditor
          contentJSX={codeCSSAnimationContentJSX}
          contentCSS={codeCSSAnimationContentCSS}
        ></CodeEditor>
      </div>
      <p>
        Animations with JavaScript. The animation provides callbacks such as
        "onEnter", and author can easily hook{" "}
        <Anchor
          class="page-anchor"
          href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API"
          target="_blank"
        >
          Web Animations
        </Anchor>{" "}
        inside it.
      </p>
      <div class="split-view">
        <div>
          <div class="dropdown-area">
            <FocusGutter />
            <PopupWithJSAnimation></PopupWithJSAnimation>
            <FocusGutter />
          </div>
        </div>
        <CodeEditor contentJSX={codeJSAnimationContent}></CodeEditor>
      </div>
    </div>
  );
};

export default Popup;
