import { scopeModuleClasses } from "../../utils/scopModuleClasses";
import c from "../CodeEditor/CodeEditor.module.scss";
import { H3Anchor } from "../HeaderAnchor/HeaderAnchor";

const s = scopeModuleClasses(c);

const Caveat = () => {
  let codeEl = `<pre class=" language-jsx" tabindex="0"><code class=" language-javascript"><span class="token keyword">const</span> iframeEl <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">"iframe"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> doc <span class="token operator">=</span> iframeEl<span class="token punctuation">.</span>contentWindow<span class="token punctuation">.</span>document<span class="token punctuation">;</span>

doc<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>`;
  return (
    <div>
      <H3Anchor>Caveat</H3Anchor>

      <p>
        For iOS Safari: when clicking outside, without overlay, and the element
        that happened to be clicked upon was an iframe, there's a chance that
        the popup won't close. iframe detection interaction is feasible by
        checking if window blurs, but in iOS, unless the user taps on a
        clickable element inside iframe, window won't blur because the main page
        focus hasn't been blurred.
      </p>

      <p>
        If the iframe body element has click listener, then tapping anywhere on
        iframe will blur window, thus closing the popup as intended. Thus if
        author is dealing with same domain iframes, the author can easily add
        empty click event listener to the body.
      </p>

      <div
        class={s("code-editor")}
        data-simplebar
        data-simplebar-auto-hide="false"
        innerHTML={codeEl}
      ></div>
    </div>
  );
};

export default Caveat;
