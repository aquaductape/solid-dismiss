import { onMount } from "solid-js";
import CodeEditor from "../CodeEditor/CodeEditor";
import _Nested from "../Examples/Nested";
import FocusGutter from "../FocusGutter";

const DropdownOverlay = () => {
  const codeContentCSS = `<pre class="language-jsx" tabindex="0"><code class="  language-jsx"><span class="token comment">// relevant CSS ...</span>

<span class="token punctuation">.</span>modal<span class="token operator">-</span>container <span class="token punctuation">{</span>
  position<span class="token operator">:</span> fixed<span class="token punctuation">;</span>
  top<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
  left<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
  width<span class="token operator">:</span> <span class="token number">100</span><span class="token operator">%</span><span class="token punctuation">;</span>
  height<span class="token operator">:</span> <span class="token number">100</span><span class="token operator">%</span><span class="token punctuation">;</span>
  display<span class="token operator">:</span> flex<span class="token punctuation">;</span>
  justify<span class="token operator">-</span>content<span class="token operator">:</span> center<span class="token punctuation">;</span>
  align<span class="token operator">-</span>items<span class="token operator">:</span> center<span class="token punctuation">;</span>
  z<span class="token operator">-</span>index<span class="token operator">:</span> <span class="token number">100</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token punctuation">.</span>modal <span class="token punctuation">{</span>
  position<span class="token operator">:</span> relative<span class="token punctuation">;</span>
  width<span class="token operator">:</span> <span class="token number">80</span>vw<span class="token punctuation">;</span>
  max<span class="token operator">-</span>width<span class="token operator">:</span> <span class="token number">800</span>px<span class="token punctuation">;</span>
  padding<span class="token operator">:</span> <span class="token number">25</span>px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// animations</span>

<span class="token punctuation">.</span>fade<span class="token operator">-</span>enter <span class="token punctuation">{</span>
  transform<span class="token operator">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span><span class="token number">25</span>px<span class="token punctuation">)</span><span class="token punctuation">;</span>
  opacity<span class="token operator">:</span> <span class="token number">0.1</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>enter<span class="token operator">-</span>to <span class="token punctuation">{</span>
  transform<span class="token operator">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  opacity<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>exit <span class="token punctuation">{</span>
  transform<span class="token operator">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  opacity<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>exit<span class="token operator">-</span>to <span class="token punctuation">{</span>
  transform<span class="token operator">:</span> <span class="token function">translateY</span><span class="token punctuation">(</span><span class="token number">25</span>px<span class="token punctuation">)</span><span class="token punctuation">;</span>
  opacity<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>enter<span class="token operator">-</span>to<span class="token punctuation">,</span> <span class="token punctuation">.</span>fade<span class="token operator">-</span>exit<span class="token punctuation">,</span> <span class="token punctuation">.</span>fade<span class="token operator">-</span>exit<span class="token operator">-</span>to <span class="token punctuation">{</span>
  transition<span class="token operator">:</span> transform <span class="token number">200</span>ms<span class="token punctuation">,</span> opacity <span class="token number">200</span>ms<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>enter <span class="token punctuation">{</span>
  opacity<span class="token operator">:</span> <span class="token number">0.1</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>enter <span class="token operator">&gt;</span> div <span class="token punctuation">{</span>
  transform<span class="token operator">:</span> <span class="token function">translateX</span><span class="token punctuation">(</span><span class="token number">50</span>px<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>enter<span class="token operator">-</span>to <span class="token punctuation">{</span>
  opacity<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>enter<span class="token operator">-</span>to <span class="token operator">&gt;</span> div <span class="token punctuation">{</span>
  transform<span class="token operator">:</span> <span class="token function">translateX</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>exit <span class="token punctuation">{</span>
  opacity<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>exit <span class="token operator">&gt;</span> div <span class="token punctuation">{</span>
  transform<span class="token operator">:</span> <span class="token function">translateX</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>exit<span class="token operator">-</span>to <span class="token punctuation">{</span>
  opacity<span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>exit<span class="token operator">-</span>to <span class="token operator">&gt;</span> div <span class="token punctuation">{</span>
  transform<span class="token operator">:</span> <span class="token function">translateX</span><span class="token punctuation">(</span><span class="token number">50</span>px<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>enter<span class="token operator">-</span>to<span class="token punctuation">,</span> <span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>exit<span class="token punctuation">,</span> <span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>exit<span class="token operator">-</span>to <span class="token punctuation">{</span>
  transition<span class="token operator">:</span> opacity <span class="token number">200</span>ms<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>enter<span class="token operator">-</span>to <span class="token operator">&gt;</span> div<span class="token punctuation">,</span> <span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>exit <span class="token operator">&gt;</span> div<span class="token punctuation">,</span> <span class="token punctuation">.</span>fade<span class="token operator">-</span>modal<span class="token operator">-</span>exit<span class="token operator">-</span>to <span class="token operator">&gt;</span> div <span class="token punctuation">{</span>
  transition<span class="token operator">:</span> transform <span class="token number">200</span>ms<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>`;

  const codeContentJSX = `<pre class="language-jsx" tabindex="0"><code class=" language-jsx"><span class="token keyword">import</span> Dismiss <span class="token keyword">from</span> <span class="token string">"solid-dismiss"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"solid-js"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">Nested</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Modal</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Modal</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Popup</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Popup</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">Modal</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>open<span class="token punctuation">,</span> setOpen<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> btnEl<span class="token punctuation">;</span>
  <span class="token keyword">let</span> modalEl<span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">onClickClose</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">setOpen</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">onClickOverlay</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>e<span class="token punctuation">.</span>target <span class="token operator">!==</span> e<span class="token punctuation">.</span>currentTarget<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token function">setOpen</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">onOpen</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">open<span class="token punctuation">,</span> <span class="token punctuation">{</span> dismissStack <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>open<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>dismissStack<span class="token punctuation">.</span>length <span class="token operator">&lt;=</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> scrollbarWidth <span class="token operator">=</span>
          window<span class="token punctuation">.</span>innerWidth <span class="token operator">-</span> document<span class="token punctuation">.</span>documentElement<span class="token punctuation">.</span>clientWidth<span class="token punctuation">;</span>
        <span class="token keyword">const</span> scrollingElement <span class="token operator">=</span> document<span class="token punctuation">.</span>scrollingElement<span class="token punctuation">;</span>
        <span class="token keyword">const</span> navbar <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"navbar-content"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        scrollingElement<span class="token punctuation">.</span>style<span class="token punctuation">.</span>overflow <span class="token operator">=</span> <span class="token string">"hidden"</span><span class="token punctuation">;</span>
        scrollingElement<span class="token punctuation">.</span>style<span class="token punctuation">.</span>marginRight <span class="token operator">=</span> scrollbarWidth <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">;</span>
        navbar<span class="token punctuation">.</span>style<span class="token punctuation">.</span>marginRight <span class="token operator">=</span> scrollbarWidth <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// if there happened to be a stack of modals,</span>
      <span class="token comment">// we don't want the scrollbar to return when</span>
      <span class="token comment">// the topmost modal is removed while</span>
      <span class="token comment">// there's more modals below.</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>dismissStack<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>

      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> scrollingElement <span class="token operator">=</span> document<span class="token punctuation">.</span>scrollingElement<span class="token punctuation">;</span>
        <span class="token keyword">const</span> navbar <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"navbar-content"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        scrollingElement<span class="token punctuation">.</span>style<span class="token punctuation">.</span>overflow <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
        scrollingElement<span class="token punctuation">.</span>style<span class="token punctuation">.</span>marginRight <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
        navbar<span class="token punctuation">.</span>style<span class="token punctuation">.</span>marginRight <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
        <span class="token comment">// remove scrollbar after animation is done</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">300</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Modal</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Dismiss</span></span>
        <span class="token attr-name">menuButton</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span>
        <span class="token attr-name">open</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>open<span class="token punctuation">}</span></span>
        <span class="token attr-name">setOpen</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>setOpen<span class="token punctuation">}</span></span>
        <span class="token attr-name">onOpen</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>onOpen<span class="token punctuation">}</span></span>
        <span class="token attr-name">mount</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>body<span class="token punctuation">"</span></span>
        <span class="token attr-name">trapFocus</span>
        <span class="token attr-name">overlay</span>
        <span class="token attr-name">focusElementOnClose</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>menuButton<span class="token punctuation">"</span></span>
        <span class="token attr-name">focusElementOnOpen</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> modalEl<span class="token punctuation">}</span></span>
        <span class="token attr-name">animation</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span>
          name<span class="token operator">:</span> <span class="token string">"fade-modal"</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
      <span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
          <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>modal-container<span class="token punctuation">"</span></span>
          <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>onClickOverlay<span class="token punctuation">}</span></span>
          <span class="token attr-name">role</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>presentation<span class="token punctuation">"</span></span>
        <span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
            <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>modal<span class="token punctuation">"</span></span>
            <span class="token attr-name">role</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>dialog<span class="token punctuation">"</span></span>
            <span class="token attr-name">aria-modal</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span>
            <span class="token attr-name">tabindex</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>-1<span class="token punctuation">"</span></span>
            <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>modalEl<span class="token punctuation">}</span></span>
          <span class="token punctuation">&gt;</span></span><span class="token plain-text">
            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h4</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Modal Text</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h4</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Lorem </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>#<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">ipsum</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">.</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Nested</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Nested</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span>
              <span class="token attr-name">class</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token function">s</span><span class="token punctuation">(</span><span class="token string">"x-btn"</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span>
              <span class="token attr-name">aria-label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>close modal<span class="token punctuation">"</span></span>
              <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>onClickClose<span class="token punctuation">}</span></span>
            <span class="token punctuation">&gt;</span></span><span class="token plain-text">
              ✕
            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Dismiss</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">Popup</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>open<span class="token punctuation">,</span> setOpen<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> btnEl<span class="token punctuation">;</span>
  <span class="token keyword">let</span> dropdownEl<span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">onClickClose</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">setOpen</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> <span class="token function-variable function">onOpen</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">open</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>open<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> bottom<span class="token punctuation">,</span> left <span class="token punctuation">}</span> <span class="token operator">=</span> btnEl<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> scrollX<span class="token punctuation">,</span> scrollY <span class="token punctuation">}</span> <span class="token operator">=</span> window<span class="token punctuation">;</span>

      dropdownEl<span class="token punctuation">.</span>style<span class="token punctuation">.</span>position <span class="token operator">=</span> <span class="token string">"absolute"</span><span class="token punctuation">;</span>
      dropdownEl<span class="token punctuation">.</span>style<span class="token punctuation">.</span>top <span class="token operator">=</span> bottom <span class="token operator">+</span> scrollY <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">;</span>
      dropdownEl<span class="token punctuation">.</span>style<span class="token punctuation">.</span>left <span class="token operator">=</span> left <span class="token operator">+</span> scrollX <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">;</span>
      dropdownEl<span class="token punctuation">.</span>style<span class="token punctuation">.</span>zIndex <span class="token operator">=</span> <span class="token string">"100"</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Popup</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Dismiss</span></span>
        <span class="token attr-name">menuButton</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span>
        <span class="token attr-name">open</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>open<span class="token punctuation">}</span></span>
        <span class="token attr-name">setOpen</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>setOpen<span class="token punctuation">}</span></span>
        <span class="token attr-name">onOpen</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>onOpen<span class="token punctuation">}</span></span>
        <span class="token attr-name">animation</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span>
          name<span class="token operator">:</span> <span class="token string">"fade"</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
        <span class="token attr-name">mount</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>body<span class="token punctuation">"</span></span>
      <span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>popup<span class="token punctuation">"</span></span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>dropdownEl<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h4</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Popup Text</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h4</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Lorem </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>#<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">ipsum</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">.</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Nested</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Nested</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span>
            <span class="token attr-name">class</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token function">s</span><span class="token punctuation">(</span><span class="token string">"x-btn"</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span>
            <span class="token attr-name">aria-label</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>close modal<span class="token punctuation">"</span></span>
            <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>onClickClose<span class="token punctuation">}</span></span>
          <span class="token punctuation">&gt;</span></span><span class="token plain-text">
            ✕
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Dismiss</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>`;

  return (
    <div class="section">
      <h3>Nested</h3>
      <div class="split-view">
        <div>
          <div class="dropdown-area">
            <FocusGutter />
            <_Nested></_Nested>
            <FocusGutter />
          </div>
        </div>
        <CodeEditor
          contentJSX={codeContentJSX}
          contentCSS={codeContentCSS}
        ></CodeEditor>
      </div>
    </div>
  );
};

export default DropdownOverlay;
