import CodeEditor from "../CodeEditor/CodeEditor";
import _ModalOverflowingViewportHeight from "../Examples/ModalOverflowingViewportHeight";
import FocusGutter from "../FocusGutter";
import { H3Anchor } from "../HeaderAnchor/HeaderAnchor";

const ModalOverflowingViewportHieght = () => {
  const codeContentCSS = `
<pre class="language-css" tabindex="0"><code class="language-css"><span class="token selector">// relevant CSS ...

.modal</span> <span class="token punctuation">{</span>
  <span class="token property">min-height</span><span class="token punctuation">:</span> 150vh<span class="token punctuation">;</span>
  <span class="token property">max-width</span><span class="token punctuation">:</span> 900px<span class="token punctuation">;</span>
  <span class="token property">margin</span><span class="token punctuation">:</span> 0 auto<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 90%<span class="token punctuation">;</span>
  <span class="token property">margin-top</span><span class="token punctuation">:</span> 12vh<span class="token punctuation">;</span>
  <span class="token property">margin-bottom</span><span class="token punctuation">:</span> 60px<span class="token punctuation">;</span>
  <span class="token property">padding</span><span class="token punctuation">:</span> 16px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.overlay</span> <span class="token punctuation">{</span>
  <span class="token property">background</span><span class="token punctuation">:</span> #01093138<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">// overlay animation

.fade-overlay-enter</span> <span class="token punctuation">{</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 0.1<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.fade-overlay-enter-to</span> <span class="token punctuation">{</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.fade-overlay-exit</span> <span class="token punctuation">{</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 1<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.fade-overlay-exit-to</span> <span class="token punctuation">{</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.fade-overlay-enter-to, .fade-overlay-exit, .fade-overlay-exit-to</span> <span class="token punctuation">{</span>
  <span class="token property">transition</span><span class="token punctuation">:</span> opacity 200ms<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">// modal animation

.slide-modal-enter</span> <span class="token punctuation">{</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span>100vh<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.slide-modal-enter-to</span> <span class="token punctuation">{</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span>0<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.slide-modal-exit</span> <span class="token punctuation">{</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span>0<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.slide-modal-exit-to</span> <span class="token punctuation">{</span>
  <span class="token comment">/* css variable updated onBeforeExit callback
  to determine whether modal slides up or down */</span>
  <span class="token property">transform</span><span class="token punctuation">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span><span class="token function">var</span><span class="token punctuation">(</span>--slide-exit-y<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.slide-modal-enter-to, .slide-modal-exit, .slide-modal-exit-to</span> <span class="token punctuation">{</span>
  <span class="token property">transition</span><span class="token punctuation">:</span> transform 300ms<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>
  `;

  const codeContentModalJSX = `
  <pre class="language-css" tabindex="0"><code class="language-tsx"><span class="token keyword">const</span> <span class="token function-variable function">ModalOverflowingViewportHeight</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>open<span class="token punctuation">,</span> setOpen<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> btnEl<span class="token punctuation">;</span>
  <span class="token keyword">let</span> containerEl<span class="token punctuation">;</span>
  <span class="token keyword">let</span> dialogEl<span class="token punctuation">;</span>
  <span class="token keyword">let</span> rootApp<span class="token punctuation">;</span>

  <span class="token keyword">let</span> prevScrollY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">changePageLayout</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> rootAppBCR <span class="token operator">=</span> rootApp<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> scrollY <span class="token punctuation">}</span> <span class="token operator">=</span> window<span class="token punctuation">;</span>

    rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>position <span class="token operator">=</span> <span class="token string">"fixed"</span><span class="token punctuation">;</span>
    rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>top <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>rootAppBCR<span class="token punctuation">.</span>top<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
    rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>left <span class="token operator">=</span> <span class="token string">"0"</span><span class="token punctuation">;</span>
    rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>right <span class="token operator">=</span> <span class="token string">"0"</span><span class="token punctuation">;</span>

    prevScrollY <span class="token operator">=</span> scrollY<span class="token punctuation">;</span>
    window<span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span><span class="token punctuation">{</span> top<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">restorePageLayout</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>position <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
    rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>top <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
    rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>left <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
    rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>right <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
    window<span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span><span class="token punctuation">{</span> top<span class="token operator">:</span> prevScrollY <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">getScrollPercentage</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> scrollTop <span class="token operator">=</span> window<span class="token punctuation">.</span>scrollY<span class="token punctuation">;</span>
    <span class="token keyword">const</span> docHeight <span class="token operator">=</span> document<span class="token punctuation">.</span>documentElement<span class="token punctuation">.</span>scrollHeight<span class="token punctuation">;</span>
    <span class="token keyword">const</span> winHeight <span class="token operator">=</span> window<span class="token punctuation">.</span>innerHeight<span class="token punctuation">;</span>
    <span class="token keyword">const</span> scrollPercent <span class="token operator">=</span> scrollTop <span class="token operator">/</span> <span class="token punctuation">(</span>docHeight <span class="token operator">-</span> winHeight<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> scrollPercent<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token comment">// This is used to determine on animation exit, whether modal slides down or up</span>
  <span class="token keyword">const</span> <span class="token function-variable function">updateModalSlideExitDirectionCSSVariable</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> scrollPercent <span class="token operator">=</span> <span class="token function">getScrollPercentage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> innerHeight <span class="token operator">=</span> window<span class="token punctuation">.</span>innerHeight<span class="token punctuation">;</span>
    <span class="token keyword">const</span> scrollY <span class="token operator">=</span> window<span class="token punctuation">.</span>scrollY<span class="token punctuation">;</span>
    <span class="token keyword">const</span> dialogBCR <span class="token operator">=</span> dialogEl<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> bottomShadowHeight <span class="token operator">=</span> <span class="token number">20</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> position <span class="token operator">=</span> innerHeight <span class="token operator">+</span> scrollY <span class="token operator">-</span> <span class="token punctuation">(</span>dialogBCR<span class="token punctuation">.</span>top <span class="token operator">+</span> scrollY<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> value <span class="token operator">=</span>
      scrollPercent <span class="token operator">&lt;</span> <span class="token number">0.5</span> <span class="token operator">?</span> position <span class="token operator">:</span> <span class="token operator">-</span>dialogBCR<span class="token punctuation">.</span>bottom <span class="token operator">-</span> bottomShadowHeight<span class="token punctuation">;</span>

    <span class="token comment">// update css variable --slide-exit-y that is used in "slide-modal-exit-to" class</span>
    <span class="token class-name">document</span><span class="token punctuation">.</span>documentElement<span class="token punctuation">.</span>style<span class="token punctuation">.</span><span class="token function">setProperty</span><span class="token punctuation">(</span><span class="token string">"--slide-exit-y"</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>value<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token function">onMount</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    rootApp <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"root"</span><span class="token punctuation">)</span><span class="token operator">!</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>btn-primary<span class="token punctuation">"</span></span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        Button
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Dismiss</span></span>
        <span class="token attr-name">menuButton</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span>
        <span class="token attr-name">open</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>open<span class="token punctuation">}</span></span>
        <span class="token attr-name">setOpen</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>setOpen<span class="token punctuation">}</span></span>
        <span class="token attr-name">removeScrollbar</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token boolean">false</span><span class="token punctuation">}</span></span>
        <span class="token attr-name">modal</span>
        <span class="token attr-name">overlayElement</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span>
          <span class="token keyword">class</span><span class="token operator">:</span> <span class="token string">"overlay"</span><span class="token punctuation">,</span>
          animation<span class="token operator">:</span> <span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">"fade-overlay"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
        <span class="token attr-name">animation</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span>
          name<span class="token operator">:</span> <span class="token string">"slide-modal"</span><span class="token punctuation">,</span>
          <span class="token function">onEnter</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">changePageLayout</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token function-variable function">onBeforeExit</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token function">updateModalSlideExitDirectionCSSVariable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token function-variable function">onAfterExit</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token function">restorePageLayout</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
        <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>containerEl<span class="token punctuation">}</span></span>
      <span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>modal<span class="token punctuation">"</span></span> <span class="token attr-name">role</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>dialog<span class="token punctuation">"</span></span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>dialogEl<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token punctuation">{</span><span class="token comment">/* ... */</span><span class="token punctuation">}</span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Dismiss</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
`;

  return (
    <div class="section">
      <H3Anchor>Modal Overflowing Viewport Height</H3Anchor>
      <div class="explaination">
        <p>
          Here's an aesthetic alternative where you don't want Modal's height to
          be fixed to viewport, and instead overflow the page viewport height,
          as if the modal is part of document flow.
        </p>
      </div>
      <div class="split-view">
        <div>
          <div class="dropdown-area">
            <FocusGutter />
            <_ModalOverflowingViewportHeight />
            <FocusGutter />
          </div>
        </div>

        <CodeEditor
          contentJSX={codeContentModalJSX}
          contentCSS={codeContentCSS}
        ></CodeEditor>
      </div>
    </div>
  );
};

export default ModalOverflowingViewportHieght;
