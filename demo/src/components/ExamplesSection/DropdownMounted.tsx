import CodeEditor from "../CodeEditor/CodeEditor";
import _DropdownMounted from "../Examples/DropdownMounted";
import FocusGutter from "../FocusGutter";
import { H3Anchor } from "../HeaderAnchor/HeaderAnchor";

const DropdownMounted = () => {
  const codeContent = `<pre class=" language-jsx" tabindex="0"><code class="  language-jsx"><span class="token keyword">import</span> Dismiss <span class="token keyword">from</span> <span class="token string">"solid-dismiss"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"solid-js"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">DropdownMounted</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>open<span class="token punctuation">,</span> setOpen<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">createSignal</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> btnEl<span class="token punctuation">;</span>
  <span class="token keyword">let</span> dropdownEl<span class="token punctuation">;</span>

  <span class="token function">createEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> bottom<span class="token punctuation">,</span> left<span class="token punctuation">,</span> width <span class="token punctuation">}</span> <span class="token operator">=</span> btnEl<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> scrollX<span class="token punctuation">,</span> scrollY <span class="token punctuation">}</span> <span class="token operator">=</span> window<span class="token punctuation">;</span>

      dropdownEl<span class="token punctuation">.</span>style<span class="token punctuation">.</span>position <span class="token operator">=</span> <span class="token string">"absolute"</span><span class="token punctuation">;</span>
      dropdownEl<span class="token punctuation">.</span>style<span class="token punctuation">.</span>top <span class="token operator">=</span> bottom <span class="token operator">+</span> scrollY <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">;</span>
      dropdownEl<span class="token punctuation">.</span>style<span class="token punctuation">.</span>left <span class="token operator">=</span> left <span class="token operator">+</span> scrollX <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">;</span>
      dropdownEl<span class="token punctuation">.</span>style<span class="token punctuation">.</span>width <span class="token operator">=</span> width <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">;</span>
      dropdownEl<span class="token punctuation">.</span>style<span class="token punctuation">.</span>zIndex <span class="token operator">=</span> <span class="token string">"100"</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">Button</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Dismiss</span></span>
        <span class="token attr-name">menuButton</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>btnEl<span class="token punctuation">}</span></span>
        <span class="token attr-name">open</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>open<span class="token punctuation">}</span></span>
        <span class="token attr-name">setOpen</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>setOpen<span class="token punctuation">}</span></span>
        <span class="token attr-name">mount</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>body<span class="token punctuation">"</span></span>
        <span class="token attr-name">cursorKeys</span>
        <span class="token attr-name">ref</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span>dropdownEl<span class="token punctuation">}</span></span>
      <span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>dropdown<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>#<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">cat</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>#<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">dog</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
          </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>#<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">fish</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token class-name">Dismiss</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span></span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>`;

  return (
    <div class="section">
      <H3Anchor>Dropdown Mounted</H3Anchor>
      <div class="explaination">
        <p>
          The dropdown doesn't live in the same markup area as the button, but
          is mounted at the body.
        </p>
        <p>
          This is so that the dropdown isn't covered by other elements and be
          the topmost interacted element.
        </p>
        <p>
          When exiting the dropdown through Tabbing, even though the "Tabbable"
          items inside it are not in the natural tab order, this library is able
          to get next Tabbable element relative to menuButton.
        </p>
      </div>
      <div class="split-view">
        <div>
          <div class="dropdown-area">
            <FocusGutter />
            <_DropdownMounted></_DropdownMounted>
            <FocusGutter />
          </div>
        </div>
        <CodeEditor contentJSX={codeContent}></CodeEditor>
      </div>
    </div>
  );
};

export default DropdownMounted;
