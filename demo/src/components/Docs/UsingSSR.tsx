import { scopeModuleClasses } from "../../utils/scopModuleClasses";
import Anchor from "../Anchor/Anchor";
import c from "../CodeEditor/CodeEditor.module.scss";
import { H3Anchor } from "../HeaderAnchor/HeaderAnchor";

const s = scopeModuleClasses(c);

const UsingSSR = () => {
  let solidStartCodeEl = `<pre class="language-javascript" tabindex="0"><code class="language-javascript"><span class="token comment">// solid-start vite.config.js</span>
  <span class="token keyword">import</span> solid <span class="token keyword">from</span> <span class="token string">"solid-start/vite"</span><span class="token punctuation">;</span>
  <span class="token keyword">import</span> <span class="token punctuation">{</span> defineConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"vite"</span><span class="token punctuation">;</span>
  
  <span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token function">solid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">ssr</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">noExternal</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"solid-dismiss"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>`;
  let astroCodeEl = `<pre class="language-javascript" tabindex="0"><code class="language-javascript"><span class="token comment">// astro astro.config.mjs</span>
  <span class="token keyword">import</span> <span class="token punctuation">{</span> defineConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"astro/config"</span><span class="token punctuation">;</span>
  <span class="token keyword">import</span> solidJs <span class="token keyword">from</span> <span class="token string">"@astrojs/solid-js"</span><span class="token punctuation">;</span>
  
  <span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">integrations</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token function">solidJs</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">vite</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">ssr</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">noExternal</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"solid-dismiss"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>`;

  return (
    <div>
      <H3Anchor>Using SSR</H3Anchor>

      <p>
        On SSR frameworks such as{" "}
        <Anchor
          // class="page-anchor"
          href="https://docs.astro.build/en/guides/integrations-guide/solid-js/"
          target="_blank"
        >
          Astro
        </Anchor>{" "}
        or{" "}
        <Anchor
          // class="page-anchor"
          href="https://github.com/solidjs/solid-start"
          target="_blank"
        >
          solid-start
        </Anchor>
        , you need to include <code class="code">["solid-dismiss"]</code> value
        to the <code class="code">noExternal</code> property in the vite config
        file.
      </p>

      <div
        class={s("code-editor")}
        data-simplebar
        data-simplebar-auto-hide="false"
        innerHTML={solidStartCodeEl}
      ></div>
      <br />
      <div
        class={s("code-editor")}
        data-simplebar
        data-simplebar-auto-hide="false"
        innerHTML={astroCodeEl}
      ></div>
    </div>
  );
};

export default UsingSSR;
