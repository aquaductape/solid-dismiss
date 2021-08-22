import { createSignal, Show, onMount } from "solid-js";
import _Select from "../Examples/Select";

const Select = () => {
  let codeEl!: HTMLDivElement;
  onMount(() => {
    codeEl.innerHTML = `<pre class=" language-markup" tabindex="0"><code class="  language-tsx"><span class="token keyword">import</span> Dismiss <span class="token keyword">from</span> <span class="token string">"../../../package/index"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createSignal<span class="token punctuation">,</span> createEffect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"solid-js"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Portal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"solid-js/web"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">Select</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>toggle<span class="token punctuation">,</span> setToggle<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> btnEl<span class="token operator">!</span><span class="token operator">:</span> HTMLButtonElement<span class="token punctuation">;</span>
  <span class="token keyword">let</span> menuDropdown<span class="token operator">!</span><span class="token operator">:</span> HTMLElement<span class="token punctuation">;</span>

  <span class="token function">createEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">toggle</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> btnBCR <span class="token operator">=</span> btnEl<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    menuDropdown<span class="token punctuation">.</span>style<span class="token punctuation">.</span>position <span class="token operator">=</span> <span class="token string">"absolute"</span><span class="token punctuation">;</span>
    menuDropdown<span class="token punctuation">.</span>style<span class="token punctuation">.</span>width <span class="token operator">=</span> btnBCR<span class="token punctuation">.</span>width <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">;</span>
    menuDropdown<span class="token punctuation">.</span>style<span class="token punctuation">.</span>top <span class="token operator">=</span>
      btnBCR<span class="token punctuation">.</span>top <span class="token operator">+</span> btnBCR<span class="token punctuation">.</span>height <span class="token operator">+</span> window<span class="token punctuation">.</span>scrollY <span class="token operator">+</span> <span class="token number">10</span> <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">;</span>
    menuDropdown<span class="token punctuation">.</span>style<span class="token punctuation">.</span>left <span class="token operator">=</span> btnBCR<span class="token punctuation">.</span>left <span class="token operator">+</span> window<span class="token punctuation">.</span>scrollX <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>btn-select<span class="token punctuation">"</span></span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        Select... </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">V</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Portal</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Dismiss</span></span>
          <span class="token attr-name">menuButton</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span>
          <span class="token attr-name">toggle</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>toggle<span class="token punctuation">}</span></span>
          <span class="token attr-name">setToggle</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>setToggle<span class="token punctuation">}</span></span>
          <span class="token attr-name">withinMenuButtonParent</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token boolean">false</span><span class="token punctuation">}</span></span>
          <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>menuDropdown<span class="token punctuation">}</span></span>
        <span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">tabindex</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>0<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">cat</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">tabindex</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>0<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">dog</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">tabindex</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>0<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">fish</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">tabindex</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>0<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">hat</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
            </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">tabindex</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>0<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">car</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Dismiss</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Portal</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>`;
  });

  return (
    <div class="section">
      <h2>Change Dropdown location in the DOM</h2>

      <div class="split-view">
        <div>
          <p>
            Sometimes it's not possible to place the dropdown in the same markup
            area as the button, because it will be hidden/overlapped by other
            elements due to stacking context. It's possible to place the
            dropdown in different areas of the document.
          </p>
          <p>
            In this case we're using{" "}
            <a
              href="https://www.solidjs.com/docs/latest/api#%3Cportal%3E"
              target="_blank"
            >
              Solid's Portal
            </a>{" "}
            helper which places it in root level of the document.
          </p>
          <p>
            It's also necessay to set <code>withinMenuButtonParent</code> to{" "}
            <code>false</code>, that way when tabbing outside of dropdown it
            will correctly get the next focusable element after the menu button.
          </p>
          <div class="dropdown-area">
            <button
              class="focus-gutter"
              aria-label="focus gutter, before dropdown button"
            ></button>
            <_Select></_Select>
            <button
              class="focus-gutter"
              aria-label="focus gutter, after dropdown button"
            ></button>
          </div>
        </div>
        <div
          class="code-editor"
          data-simplebar
          data-simplebar-auto-hide="false"
          ref={codeEl}
        ></div>
      </div>
    </div>
  );
};

export default Select;
