import Dismiss from "solid-dismiss";
import c from "./Modal.module.scss";
import { createComputed, createSignal, onMount } from "solid-js";
import { scopeModuleClasses } from "../../utils/scopModuleClasses";
import netflixModalOverflowPageViewportMP4 from "../../assets/netflix-modal-overflow-page-viewport-height.mp4";
import fixedContentOnFrameworkRootImg from "../../assets/fixed-content-on-framework-root.png";
import targetedContentHasMarginsPaddingImg from "../../assets/targeted-content-has-margins-padding.png";
import targetedContentHasBleedingMarginsImg from "../../assets/targeted-content-has-bleeding-margins.png";
import targetedContentContainsMarginsImg from "../../assets/targeted-content-contains-margins.png";
import targetedContentAncestorPaddingRelativeUnitsImg from "../../assets/targeted-content-ancestor-padding-relative-units.png";
import { Component } from "solid-js";

const s = scopeModuleClasses(c);

const ModalOverflowingViewportHeight = () => {
  const [open, setOpen] = createSignal(false);
  let btnEl!: HTMLButtonElement;
  let containerEl!: HTMLElement;
  let dialogEl!: HTMLDivElement;
  let rootApp!: HTMLElement;

  let prevScrollY = 0;

  const changePageLayout = () => {
    const rootAppBCR = rootApp.getBoundingClientRect();
    const { scrollY } = window;

    rootApp.style.position = "fixed";
    rootApp.style.top = `${rootAppBCR.top}px`;
    rootApp.style.left = "0";
    rootApp.style.right = "0";

    // or
    // const documentWidth = document.documentElement.clientWidth;
    // rootApp.style.left = `${rootAppBCR.left}px`;
    // rootApp.style.right = `${documentWidth - rootAppBCR.right}px`;

    prevScrollY = scrollY;
    window.scrollTo({ top: 0 });
  };

  const restorePageLayout = () => {
    rootApp.style.position = "";
    rootApp.style.top = "";
    rootApp.style.left = "";
    rootApp.style.right = "";
    window.scrollTo({ top: prevScrollY });
  };

  const getScrollPercentage = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = scrollTop / (docHeight - winHeight);
    return scrollPercent;
  };

  const updateModalSlideExitDirectionCSSVariable = () => {
    // This is used to determine on animation exit, whether modal slides down or up
    const scrollPercent = getScrollPercentage();
    const innerHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const dialogBCR = dialogEl.getBoundingClientRect();
    const bottomShadowHeight = 20;
    const position = innerHeight + scrollY - (dialogBCR.top + scrollY);
    const value =
      scrollPercent < 0.5 ? position : -dialogBCR.bottom - bottomShadowHeight;

    // update css variable --slide-exit-y that is used in "slide-modal-exit-to" class
    document.documentElement.style.setProperty("--slide-exit-y", `${value}px`);
  };

  const onClickClose = () => {
    setOpen(false);
  };

  onMount(() => {
    rootApp = document.getElementById("root")!;
  });

  return (
    <>
      <button class="btn-primary" ref={btnEl}>
        Button
      </button>
      <Dismiss
        menuButton={btnEl}
        open={open}
        setOpen={setOpen}
        removeScrollbar={false}
        modal
        overlayElement={{
          class: s("overlay"),
          animation: { name: "fade-opacity" },
        }}
        animation={{
          name: "slide-modal",
          onEnter() {
            changePageLayout();
          },
          onBeforeExit: () => {
            updateModalSlideExitDirectionCSSVariable();
          },
          onAfterExit: () => {
            restorePageLayout();
          },
        }}
        ref={containerEl}
      >
        <div class={s("modal-overflow")} role="dialog" ref={dialogEl}>
          <h3>Modal Overflowing Viewport Height</h3>
          <p>
            Here's an aesthetic alternative where you don't want Modal's height
            to be fixed to viewport, and instead overflow the page viewport
            height, as if the modal is part of document flow.
          </p>
          <p>
            This is similar on how Netflix displays their movie info modals.
          </p>
          <video
            autoplay
            loop
            muted
            playsinline
            controls={false}
            onLoadStart={(e) => {
              const target = e.currentTarget;
              target.style.opacity = "0";
            }}
            onLoadedData={(e) => {
              const target = e.currentTarget;
              target.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 200,
              });
              target.style.opacity = "";
            }}
            src={netflixModalOverflowPageViewportMP4}
          ></video>

          <p>
            The trick to preserve main content position and make Modal
            scrollable by body scroll, is by setting the main content position
            fixed and its top value based current scroll position.
          </p>
          <p>
            This current Modal example that you are viewing and scrolling
            through right now, the content where its position is set to fixed on
            a div container where Solid's client is mounted in which is #root.
            This container happens to contain header that is also fixed to
            viewport, nested fixed elements won't change behavior, the fixed
            decendants are still fixed to viewport.
          </p>
          <p>Following code:</p>

          <CodeSnippet code={codeSnippet1} />

          <img src={fixedContentOnFrameworkRootImg} alt="" />
          <p>
            However every website layout is different. If your root container
            has margins or its ancestor has paddings, then you can no longer set
            its left and right position to zero, which would incorrectly set the
            container to the same size of viewport width.
          </p>
          <p>
            Instead you must set the root container's left and right position to
            it's boundingClientRect.
          </p>
          <p>
            Note 'right' from boundingClientRect is actually{" "}
            <a
              href="https://javascript.info/coordinates#element-coordinates-getboundingclientrect"
              class="page-anchor focusable anchor"
              rel="noopener"
              target="_blank"
            >
              'left' + element's 'width'
            </a>
            , so to get it relative to viewport's right side is by subtracking
            viewport's width with 'right'. So getting relative 'right' is done
            as so below.{" "}
          </p>
          <pre>
            {`
right = document.documentElement.clientWidth - rootApp.getBoundingClientRect().right`}
          </pre>

          <CodeSnippet code={codeSnippet2} />
          <img src={targetedContentHasMarginsPaddingImg} alt="" />
          <p>
            Make sure that root container doesn't have any bleeding margins,
            because it will result in incorrect top position when setting the
            root to fixed position
          </p>
          <img src={targetedContentHasBleedingMarginsImg} alt="" />
          <p>
            The reason is because when an element is fixed, the element
            generates a block element box that establishes a{" "}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context"
              class="page-anchor focusable anchor"
              rel="noopener"
              target="_blank"
            >
              new block formatting context
            </a>
            , causing the child margins to be part of content size
          </p>
          <p>
            To avoid this make sure root container has padding or has "display:
            flow-root;"
          </p>
          <img src={targetedContentContainsMarginsImg} alt="" />
          <p>
            A caveat of using a root container with margins or ancestor
            paddings, if that ancestor's padding value are relative, such as
            "padding: 0 20vw",
          </p>

          <img src={targetedContentAncestorPaddingRelativeUnitsImg} alt="" />
          <p>
            then when target container position becomes fixed, if the browser
            page width is resized, when closing the modal and target container
            position values are removed, there could be a flash of mismatched
            layout.
          </p>
          <button class={s("dismiss-btn")} onClick={onClickClose}>
            Dismiss
          </button>

          <button
            class={s("x-btn")}
            aria-label="close modal"
            onClick={onClickClose}
          >
            <div class={s("inner")}>
              <div></div>
              <div></div>
            </div>
          </button>
        </div>
      </Dismiss>
    </>
  );
};

const CodeSnippet: Component<{ code: string }> = ({ code }) => {
  return <div class={s("code-editor")} innerHTML={code}></div>;
};

const codeSnippet1 = `
<pre class="language-tsx" tabindex="0"><code class="language-tsx"><span class="token keyword">const</span> rootApp <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"root"</span><span class="token punctuation">)</span><span class="token operator">!</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> prevScrollY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">change</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> rootAppBCR <span class="token operator">=</span> rootApp<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> documentWidth <span class="token operator">=</span> document<span class="token punctuation">.</span>documentElement<span class="token punctuation">.</span>clientWidth<span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> scrollY <span class="token punctuation">}</span> <span class="token operator">=</span> window<span class="token punctuation">;</span>

  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>position <span class="token operator">=</span> <span class="token string">"fixed"</span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>top <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>rootAppBCR<span class="token punctuation">.</span>top<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>left <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>rootAppBCR<span class="token punctuation">.</span>left<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>right <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>documentWidth <span class="token operator">-</span> rootAppBCR<span class="token punctuation">.</span>right<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>

  prevScrollY <span class="token operator">=</span> scrollY<span class="token punctuation">;</span>
  window<span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span><span class="token punctuation">{</span> top<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> <span class="token function-variable function">restore</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>position <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>top <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>left <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>right <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>

  window<span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span><span class="token punctuation">{</span> top<span class="token operator">:</span> prevScrollY <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>`;

const codeSnippet2 = `
<pre class="language-tsx" tabindex="0"><code class="language-tsx"><span class="token keyword">const</span> rootApp <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"root"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> prevScrollY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">change</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> rootAppBCR <span class="token operator">=</span> rootApp<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> scrollY <span class="token punctuation">}</span> <span class="token operator">=</span> window<span class="token punctuation">;</span>

  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>position <span class="token operator">=</span> <span class="token string">"fixed"</span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>top <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>rootAppBCR<span class="token punctuation">.</span>top<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>left <span class="token operator">=</span> <span class="token string">"0"</span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>right <span class="token operator">=</span> <span class="token string">"0"</span><span class="token punctuation">;</span>

  prevScrollY <span class="token operator">=</span> scrollY<span class="token punctuation">;</span>
  window<span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span><span class="token punctuation">{</span> top<span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> <span class="token function-variable function">restore</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>position <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>top <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>left <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>
  rootApp<span class="token punctuation">.</span>style<span class="token punctuation">.</span>right <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">;</span>

  window<span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span><span class="token punctuation">{</span> top<span class="token operator">:</span> prevScrollY <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>
`;

export default ModalOverflowingViewportHeight;
