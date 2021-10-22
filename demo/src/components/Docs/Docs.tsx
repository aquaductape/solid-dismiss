import { createSignal, Show, createEffect, onMount } from "solid-js";
import smoothScrollTo from "../../lib/smoothScrollTo";
import "./Docs.scss";

const Docs = () => {
  // document.querySelectorAll("h2").forEach((el) => el.remove());
  // document
  //   .querySelectorAll(
  //     ".tsd-panel.tsd-member.tsd-kind-type-alias > .tsd-signature.tsd-kind-icon"
  //   )
  //   .forEach((el) => el.remove());
  // document.querySelectorAll(".tsd-sources").forEach((el) => el.remove());
  // document.querySelectorAll("a[name].tsd-anchor").forEach((el) => el.remove());
  // document.querySelectorAll("h3").forEach((el) => {
  //   el.setAttribute("id", el.textContent);
  // });
  // document
  //   .querySelectorAll("a[href]")
  //   .forEach((el) =>
  //     el.setAttribute(
  //       "href",
  //       el.getAttribute("href").replace("modules.html", "")
  //     )
  //   );
  const onClick = (e: Event) => {
    const target = e.target as HTMLElement;

    if (!target.closest("a")) return;
    e.preventDefault();

    const hrefAttrValue = target.getAttribute("href")!.slice(1);
    const el = document.getElementById(hrefAttrValue)!;
    const url = `${location.origin}${location.pathname}#${hrefAttrValue}`;

    window.history.replaceState(null, "", url);

    smoothScrollTo({
      destination: el,
      padding: -100,
      duration: 500,
      onEnd: () => {
        el.focus();
      },
    });
  };

  return (
    <div id="docs-section" onClick={onClick}>
      <section className="tsd-panel tsd-member tsd-kind-type-alias">
        <h3 id="Dismiss" tabindex="-1">
          Dismiss
        </h3>
        <div className="tsd-type-declaration">
          <h4>Type declaration</h4>
          <ul className="tsd-parameters">
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> id
                <span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>sets id attribute for root component</p>
                </div>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> ref
                <span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">JSX.Element</span>
              </h5>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> class
                <span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
              </h5>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> class
                <wbr />
                List<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-symbol">
                  {"{"}
                  {"}"}
                </span>
              </h5>
              <ul className="tsd-parameters">
                <li className="tsd-parameter-index-signature">
                  <h5>
                    <span className="tsd-signature-symbol">[</span>key:{" "}
                    <span className="tsd-signature-type">string</span>
                    <span className="tsd-signature-symbol">]: </span>
                    <span className="tsd-signature-type">boolean</span>
                  </h5>
                </li>
              </ul>
            </li>
            <li className="tsd-parameter">
              <h5>
                open<span className="tsd-signature-symbol">: </span>
                <span className="tsd-signature-type">Accessor</span>
                <span className="tsd-signature-symbol">&lt;</span>
                <span className="tsd-signature-type">boolean</span>
                <span className="tsd-signature-symbol">&gt;</span>
              </h5>
            </li>
            <li className="tsd-parameter">
              <h5>
                set
                <wbr />
                Open<span className="tsd-signature-symbol">:</span>function
              </h5>
              <ul
                className="tsd-signatures tsd-kind-method tsd-parent-kind-type-literal"
                data-has-instance="true"
              >
                <li className="tsd-signature tsd-kind-icon">
                  set
                  <wbr />
                  Open<span className="tsd-signature-symbol">(</span>v
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">boolean</span>
                  <span className="tsd-signature-symbol">)</span>
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">void</span>
                </li>
              </ul>
              <ul className="tsd-descriptions">
                <li className="tsd-description">
                  <h4 className="tsd-parameters-title">Parameters</h4>
                  <ul className="tsd-parameters">
                    <li>
                      <h5>
                        v: <span className="tsd-signature-type">boolean</span>
                      </h5>
                    </li>
                  </ul>
                  <h4 className="tsd-returns-title">
                    Returns <span className="tsd-signature-type">void</span>
                  </h4>
                </li>
              </ul>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> on
                <wbr />
                Open<span className="tsd-signature-symbol">?: </span>
                <a
                  href="#OnOpenHandler"
                  className="tsd-signature-type"
                  data-tsd-kind="Type alias"
                >
                  OnOpenHandler
                </a>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>callback when setOpen signal changes</p>
                </div>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                menu
                <wbr />
                Button<span class="tsd-signature-symbol">: </span>
                <span class="tsd-signature-type">string</span>
                <span class="tsd-signature-symbol"> | </span>
                <span class="tsd-signature-type">JSX.Element</span>
                <span class="tsd-signature-symbol"> | </span>
                <span class="tsd-signature-type">Accessor</span>
                <span class="tsd-signature-symbol">&lt;</span>
                <span class="tsd-signature-type">JSX.Element</span>
                <span class="tsd-signature-symbol">&gt;</span>
                <span class="tsd-signature-symbol"> | </span>
                <span class="tsd-signature-symbol">(</span>
                <span class="tsd-signature-type">string</span>
                <span class="tsd-signature-symbol"> | </span>
                <span class="tsd-signature-type">JSX.Element</span>
                <span class="tsd-signature-symbol">)</span>
                <span class="tsd-signature-symbol">[]</span>
              </h5>

              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    css selector, queried from document, to get menu button
                    element. Or pass JSX element
                  </p>
                </div>
                <dl class="tsd-comment-tags">
                  <dt>remark</dt>
                  <dd>
                    <p>
                      There are situations where there are multiple JSX menu
                      buttons that open the same menu popup, but only one of
                      them is rendered based on device width. Use signal if JSX
                      menu buttons are conditionally rendered. Use array if all
                      menu buttons are rendered, when all but one, are hidden
                      via CSS <code>display: none;</code> declaration.
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> menu
                <wbr />
                Popup<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">JSX.Element</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-symbol">(</span>
                <span className="tsd-signature-symbol">(</span>
                <span className="tsd-signature-symbol">)</span>
                <span className="tsd-signature-symbol"> =&gt; </span>
                <span className="tsd-signature-type">JSX.Element</span>
                <span className="tsd-signature-symbol">)</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    css selector, queried from document, to get menu popup
                    element. Or pass JSX element
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>root component element queries first child element</p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span>{" "}
                cursor
                <wbr />
                Keys<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    Have the behavior to move through a list of "dropdown items"
                    using cursor keys.
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>false</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> trap
                <wbr />
                Focus<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    Focus will remain inside menuPopup when pressing Tab key
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>false</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span class="tsd-flag ts-flagOptional">Optional</span> focus
                <wbr />
                Element
                <wbr />
                On
                <wbr />
                Open<span class="tsd-signature-symbol">?: </span>
                <span class="tsd-signature-type">"menuPopup"</span>
                <span class="tsd-signature-symbol"> | </span>
                <span class="tsd-signature-type">"firstChild"</span>
                <span class="tsd-signature-symbol"> | </span>
                <span class="tsd-signature-type">string</span>
                <span class="tsd-signature-symbol"> | </span>
                <span class="tsd-signature-type">JSX.Element</span>
                <span class="tsd-signature-symbol"> | </span>
                <span class="tsd-signature-symbol">(</span>
                <span class="tsd-signature-symbol">(</span>
                <span class="tsd-signature-symbol">)</span>
                <span class="tsd-signature-symbol"> =&gt; </span>
                <span class="tsd-signature-type">JSX.Element</span>
                <span class="tsd-signature-symbol">)</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    which element, via selector*, to recieve focus after popup
                    opens.
                  </p>
                </div>
                <div>
                  <p>
                    *css string queried from root component, or if string value
                    is <code>"menuPopup"</code> uses menuPopup element, or if
                    string value is <code>"firstChild"</code> uses first
                    tabbable element inside menuPopup.
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      focus remains on <code>"menuButton"</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> focus
                <wbr />
                Element
                <wbr />
                On
                <wbr />
                Close<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">"menuButton"</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">string</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">JSX.Element</span>
                <span className="tsd-signature-symbol"> | </span>
                <a
                  href="#FocusElementOnCloseOptions"
                  className="tsd-signature-type"
                  data-tsd-kind="Type alias"
                >
                  FocusElementOnCloseOptions
                </a>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    Which element, via selector*, to recieve focus after popup
                    closes.
                  </p>
                </div>
                <div>
                  <p>
                    *selector: css string queried from document, or if string
                    value is <code>"menuButton"</code> uses menuButton element
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>remarks</dt>
                  <dd>
                    <p>
                      If menuPopup is mounted elsewhere in the DOM or doesn't
                      share the same parent as menuButton, when tabbing outside
                      menuPopup, this library programmatically grabs the correct
                      next tabbable element after menuButton. However if that
                      next tabbable element is inside an iframe that has
                      different origin, then this library won't be able to grab
                      tabbable elements inside it, instead the iframe will be
                      focused.
                    </p>
                  </dd>
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      When Tabbing forwards, focuses on tabbable element after
                      menuButton. When Tabbing backwards, focuses on menuButton.
                      When pressing Escape key, menuButton will be focused. When
                      programmatically closed, such as clicking close button,
                      then menuButton will be focused. When "click" outside,
                      user-agent determines which element recieves focus,
                      however if <code>Dismiss.overlay</code> or{" "}
                      <code>Dismiss.overlayElement</code> are set, then
                      menuButton will be focused instead.
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> close
                <wbr />
                When
                <wbr />
                Menu
                <wbr />
                Button
                <wbr />
                Is
                <wbr />
                Tabbed<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    When <code>true</code>, after focusing within menuPopup, if
                    focused back to menu button via keyboard (Tab key), the
                    menuPopup will close.
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>false</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> close
                <wbr />
                When
                <wbr />
                Menu
                <wbr />
                Button
                <wbr />
                Is
                <wbr />
                Clicked<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    If <code>overlay</code> is <code>true</code>, menuPopup will
                    always close when menu button is clicked
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>true</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> close
                <wbr />
                When
                <wbr />
                Scrolling<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    Closes menuPopup when any scrollable container (except
                    inside menuPopup) is scrolled
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>remark</dt>
                  <dd>
                    <p>
                      Even when <code>true</code>, scrolling in "outside"
                      scrollable iframe won't be able to close menuPopup.
                    </p>
                  </dd>
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>false</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> close
                <wbr />
                When
                <wbr />
                Overlay
                <wbr />
                Clicked<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    If <code>false</code>, menuPopup won't close when overlay
                    backdrop is clicked. When overlay clicked, menuPopup will
                    recieve focus.
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>true</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> close
                <wbr />
                When
                <wbr />
                Escape
                <wbr />
                Key
                <wbr />
                Is
                <wbr />
                Pressed<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>Closes menuPopup when escape key is pressed</p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>true</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> close
                <wbr />
                When
                <wbr />
                Document
                <wbr />
                Blurs<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>

              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    If <code>true</code>, closes menuPopup when the document
                    "blurs". This would happen when interacting outside of the
                    page such as Devtools, changing browser tabs, or switch
                    different applications. Also if the page with the menuPopup,
                    is inside an iframe, interacting outside the iframe, will
                    close it.
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>remark</dt>
                  <dd>
                    <p>
                      This doesn't effect overlays, if{" "}
                      <code>Dimsiss.overlay</code> or{" "}
                      <code>Dismiss.overlayElement</code> are set.
                    </p>
                  </dd>
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>false</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span>{" "}
                remove
                <wbr />
                Scrollbar<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    If <code>true</code>, sets "overflow: hidden" declaration to
                    Document.scrollingElement.
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>false</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span>{" "}
                overlay<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    Prevent page interaction when clicking outside to close
                    menuPopup
                  </p>
                </div>
                <div>
                  <p>
                    Author must create overlay element within menuPopup, this
                    way page elements underneath the menuPopup can't be
                    interacted with.
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>false</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span>{" "}
                overlay
                <wbr />
                Element<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-symbol">{"{"} </span>ref
                <span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">any</span>
                <span className="tsd-signature-symbol">; </span>class
                <span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
                <span className="tsd-signature-symbol">; </span>classList
                <span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-symbol">
                  {"{"}
                  {"}"}
                </span>
                <span className="tsd-signature-symbol">; </span>animation
                <span className="tsd-signature-symbol">?: </span>
                <a
                  href="#DismissAnimation"
                  className="tsd-signature-type"
                  data-tsd-kind="Type alias"
                >
                  DismissAnimation
                </a>
                <span className="tsd-signature-symbol"> {"}"}</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    Prevent page interaction when clicking outside to close
                    menuPopup
                  </p>
                </div>
                <div>
                  <p>
                    Adds root level div that acts as a layer. This removes
                    interaction of the page elements that's underneath the
                    overlay element, that way menuPopup is the only element that
                    can be interacted with.
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>false</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span>{" "}
                enable
                <wbr />
                Last
                <wbr />
                Focus
                <wbr />
                Sentinel<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    activates sentinel element as last tabbable item in
                    menuPopup, that way when Tabbing "forwards" out of
                    menuPopup, the next logical tabblable element after
                    menuButton will be focused.
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>false</code> unless <code>Dismiss.mount</code> is
                      set, <code>Dismiss.focusElementOnClosed</code> is set,{" "}
                      <code>Dismiss.overlay</code> prop is <code>true</code>, or
                      this component's root container is not an adjacent sibling
                      of menuButton.
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> mount
                <span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">Node</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    Inserts menuPopup in the mount node. Useful for inserting
                    menuPopup outside of page layout. Events still propagate
                    through the Component Hierarchy.
                  </p>
                </div>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span>{" "}
                animation<span className="tsd-signature-symbol">?: </span>
                <a
                  href="#DismissAnimation"
                  className="tsd-signature-type"
                  data-tsd-kind="Type alias"
                >
                  DismissAnimation
                </a>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    Place CSS class names or JS Web Animation to fire animation
                    as menuPopup enters/exits
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>none</p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> show
                <span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    Determine whether children are rendered always, or
                    conditionally.
                  </p>
                </div>
                <div>
                  <p>
                    If <code>true</code>, children are rendered.
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>false</code>, children are conditionally rendered
                      based on <code>Dismiss.open</code> value.
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section className="tsd-panel tsd-member tsd-kind-type-alias">
        <h3 id="FocusElementOnCloseOptions" tabindex="-1">
          Focus
          <wbr />
          Element
          <wbr />
          On
          <wbr />
          Close
          <wbr />
          Options
        </h3>
        <div className="tsd-type-declaration">
          <h4>Type declaration</h4>
          <ul className="tsd-parameters">
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> tab
                <wbr />
                Backwards<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">"menuButton"</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">string</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">JSX.Element</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    focus on element when exiting menuPopup via tabbing
                    backwards ie "Shift + Tab".
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>"menuButton"</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> tab
                <wbr />
                Forwards<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">"menuButton"</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">string</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">JSX.Element</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    focus on element when exiting menuPopup via tabbing forwards
                    ie "Tab".
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>remarks</dt>
                  <dd>
                    <p>
                      {" "}
                      If popup is mounted elsewhere in the DOM, when tabbing
                      outside, this library is able to grab the correct next
                      tabbable element after menuButton, except for tabbable
                      elements inside iframe with cross domain.
                    </p>
                  </dd>
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>next tabbable element after menuButton;</p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> click
                <span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">"menuButton"</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">string</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">JSX.Element</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    focus on element when exiting menuPopup via click outside
                    popup.
                  </p>
                </div>
                <div>
                  <p>
                    If mounted overlay present, and popup closes via click, then
                    menuButton will be focused.
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>remarks</dt>
                  <dd>
                    <p>
                      When clicking, user-agent determines which element
                      recieves focus.
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span>{" "}
                escape
                <wbr />
                Key<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">"menuButton"</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">string</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">JSX.Element</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    focus on element when exiting menuPopup via "Escape" key
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>"menuButton"</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span>{" "}
                scrolling<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">"menuButton"</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">string</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">JSX.Element</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    focus on element when exiting menuPopup via scrolling, from
                    scrollable container that contains menuButton
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>dafaultvalue</dt>
                  <dd>
                    <p>
                      <code>"menuButton"</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section className="tsd-panel tsd-member tsd-kind-type-alias">
        <h3 id="DismissAnimation" tabindex="-1">
          Dismiss
          <wbr />
          Animation
        </h3>
        <div className="tsd-type-declaration">
          <h4>Type declaration</h4>
          <ul className="tsd-parameters">
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> name
                <span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    Used to automatically generate transition CSS class names.
                    e.g. name: 'fade' will auto expand to .fade-enter,
                    .fade-enter-active, etc.
                  </p>
                </div>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> enter
                <wbr />
                Active
                <wbr />
                Class<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
              </h5>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> enter
                <wbr />
                Class<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
              </h5>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> enter
                <wbr />
                To
                <wbr />
                Class<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
              </h5>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> exit
                <wbr />
                Active
                <wbr />
                Class<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
              </h5>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> exit
                <wbr />
                Class<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
              </h5>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span> exit
                <wbr />
                To
                <wbr />
                Class<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
              </h5>
            </li>
            <li className="tsd-parameter">
              <h5>
                on
                <wbr />
                Before
                <wbr />
                Enter<span className="tsd-signature-symbol">?:</span>function
              </h5>
              <ul
                className="tsd-signatures tsd-kind-method tsd-parent-kind-type-literal"
                data-has-instance="true"
              >
                <li className="tsd-signature tsd-kind-icon">
                  on
                  <wbr />
                  Before
                  <wbr />
                  Enter<span className="tsd-signature-symbol">(</span>el
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">Element</span>
                  <span className="tsd-signature-symbol">)</span>
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">void</span>
                </li>
              </ul>
              <ul className="tsd-descriptions">
                <li className="tsd-description">
                  <h4 className="tsd-parameters-title">Parameters</h4>
                  <ul className="tsd-parameters">
                    <li>
                      <h5>
                        el: <span className="tsd-signature-type">Element</span>
                      </h5>
                    </li>
                  </ul>
                  <h4 className="tsd-returns-title">
                    Returns <span className="tsd-signature-type">void</span>
                  </h4>
                </li>
              </ul>
            </li>
            <li className="tsd-parameter">
              <h5>
                on
                <wbr />
                Enter<span className="tsd-signature-symbol">?:</span>function
              </h5>
              <ul
                className="tsd-signatures tsd-kind-method tsd-parent-kind-type-literal"
                data-has-instance="true"
              >
                <li className="tsd-signature tsd-kind-icon">
                  on
                  <wbr />
                  Enter<span className="tsd-signature-symbol">(</span>el
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">Element</span>, done
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-symbol">(</span>
                  <span className="tsd-signature-symbol">)</span>
                  <span className="tsd-signature-symbol"> =&gt; </span>
                  <span className="tsd-signature-type">void</span>
                  <span className="tsd-signature-symbol">)</span>
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">void</span>
                </li>
              </ul>
              <ul className="tsd-descriptions">
                <li className="tsd-description">
                  <h4 className="tsd-parameters-title">Parameters</h4>
                  <ul className="tsd-parameters">
                    <li>
                      <h5>
                        el: <span className="tsd-signature-type">Element</span>
                      </h5>
                    </li>
                    <li>
                      <h5>
                        done: <span className="tsd-signature-symbol">(</span>
                        <span className="tsd-signature-symbol">)</span>
                        <span className="tsd-signature-symbol"> =&gt; </span>
                        <span className="tsd-signature-type">void</span>
                      </h5>
                      <ul className="tsd-parameters">
                        <li className="tsd-parameter-signature">
                          <ul
                            className="tsd-signatures tsd-kind-type-literal"
                            data-has-instance="true"
                          >
                            <li className="tsd-signature tsd-kind-icon">
                              <span className="tsd-signature-symbol">(</span>
                              <span className="tsd-signature-symbol">)</span>
                              <span className="tsd-signature-symbol">: </span>
                              <span className="tsd-signature-type">void</span>
                            </li>
                          </ul>
                          <ul className="tsd-descriptions">
                            <li className="tsd-description">
                              <h4 className="tsd-returns-title">
                                Returns{" "}
                                <span className="tsd-signature-type">void</span>
                              </h4>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <h4 className="tsd-returns-title">
                    Returns <span className="tsd-signature-type">void</span>
                  </h4>
                </li>
              </ul>
            </li>
            <li className="tsd-parameter">
              <h5>
                on
                <wbr />
                After
                <wbr />
                Enter<span className="tsd-signature-symbol">?:</span>function
              </h5>
              <ul
                className="tsd-signatures tsd-kind-method tsd-parent-kind-type-literal"
                data-has-instance="true"
              >
                <li className="tsd-signature tsd-kind-icon">
                  on
                  <wbr />
                  After
                  <wbr />
                  Enter<span className="tsd-signature-symbol">(</span>el
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">Element</span>
                  <span className="tsd-signature-symbol">)</span>
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">void</span>
                </li>
              </ul>
              <ul className="tsd-descriptions">
                <li className="tsd-description">
                  <h4 className="tsd-parameters-title">Parameters</h4>
                  <ul className="tsd-parameters">
                    <li>
                      <h5>
                        el: <span className="tsd-signature-type">Element</span>
                      </h5>
                    </li>
                  </ul>
                  <h4 className="tsd-returns-title">
                    Returns <span className="tsd-signature-type">void</span>
                  </h4>
                </li>
              </ul>
            </li>
            <li className="tsd-parameter">
              <h5>
                on
                <wbr />
                Before
                <wbr />
                Exit<span className="tsd-signature-symbol">?:</span>function
              </h5>
              <ul
                className="tsd-signatures tsd-kind-method tsd-parent-kind-type-literal"
                data-has-instance="true"
              >
                <li className="tsd-signature tsd-kind-icon">
                  on
                  <wbr />
                  Before
                  <wbr />
                  Exit<span className="tsd-signature-symbol">(</span>el
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">Element</span>
                  <span className="tsd-signature-symbol">)</span>
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">void</span>
                </li>
              </ul>
              <ul className="tsd-descriptions">
                <li className="tsd-description">
                  <h4 className="tsd-parameters-title">Parameters</h4>
                  <ul className="tsd-parameters">
                    <li>
                      <h5>
                        el: <span className="tsd-signature-type">Element</span>
                      </h5>
                    </li>
                  </ul>
                  <h4 className="tsd-returns-title">
                    Returns <span className="tsd-signature-type">void</span>
                  </h4>
                </li>
              </ul>
            </li>
            <li className="tsd-parameter">
              <h5>
                on
                <wbr />
                Exit<span className="tsd-signature-symbol">?:</span>function
              </h5>
              <ul
                className="tsd-signatures tsd-kind-method tsd-parent-kind-type-literal"
                data-has-instance="true"
              >
                <li className="tsd-signature tsd-kind-icon">
                  on
                  <wbr />
                  Exit<span className="tsd-signature-symbol">(</span>el
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">Element</span>, done
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-symbol">(</span>
                  <span className="tsd-signature-symbol">)</span>
                  <span className="tsd-signature-symbol"> =&gt; </span>
                  <span className="tsd-signature-type">void</span>
                  <span className="tsd-signature-symbol">)</span>
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">void</span>
                </li>
              </ul>
              <ul className="tsd-descriptions">
                <li className="tsd-description">
                  <h4 className="tsd-parameters-title">Parameters</h4>
                  <ul className="tsd-parameters">
                    <li>
                      <h5>
                        el: <span className="tsd-signature-type">Element</span>
                      </h5>
                    </li>
                    <li>
                      <h5>
                        done: <span className="tsd-signature-symbol">(</span>
                        <span className="tsd-signature-symbol">)</span>
                        <span className="tsd-signature-symbol"> =&gt; </span>
                        <span className="tsd-signature-type">void</span>
                      </h5>
                      <ul className="tsd-parameters">
                        <li className="tsd-parameter-signature">
                          <ul
                            className="tsd-signatures tsd-kind-type-literal"
                            data-has-instance="true"
                          >
                            <li className="tsd-signature tsd-kind-icon">
                              <span className="tsd-signature-symbol">(</span>
                              <span className="tsd-signature-symbol">)</span>
                              <span className="tsd-signature-symbol">: </span>
                              <span className="tsd-signature-type">void</span>
                            </li>
                          </ul>
                          <ul className="tsd-descriptions">
                            <li className="tsd-description">
                              <h4 className="tsd-returns-title">
                                Returns{" "}
                                <span className="tsd-signature-type">void</span>
                              </h4>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <h4 className="tsd-returns-title">
                    Returns <span className="tsd-signature-type">void</span>
                  </h4>
                </li>
              </ul>
            </li>
            <li className="tsd-parameter">
              <h5>
                on
                <wbr />
                After
                <wbr />
                Exit<span className="tsd-signature-symbol">?:</span>function
              </h5>
              <ul
                className="tsd-signatures tsd-kind-method tsd-parent-kind-type-literal"
                data-has-instance="true"
              >
                <li className="tsd-signature tsd-kind-icon">
                  on
                  <wbr />
                  After
                  <wbr />
                  Exit<span className="tsd-signature-symbol">(</span>el
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">Element</span>
                  <span className="tsd-signature-symbol">)</span>
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">void</span>
                </li>
              </ul>
              <ul className="tsd-descriptions">
                <li className="tsd-description">
                  <h4 className="tsd-parameters-title">Parameters</h4>
                  <ul className="tsd-parameters">
                    <li>
                      <h5>
                        el: <span className="tsd-signature-type">Element</span>
                      </h5>
                    </li>
                  </ul>
                  <h4 className="tsd-returns-title">
                    Returns <span className="tsd-signature-type">void</span>
                  </h4>
                </li>
              </ul>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span>{" "}
                append
                <wbr />
                To
                <wbr />
                Element<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">string</span>
                <span className="tsd-signature-symbol"> | </span>
                <span className="tsd-signature-type">Node</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>
                    Change element where CSS classes are appended and passed to
                    callbacks.
                  </p>
                </div>
                <div>
                  <p>
                    css selector, queried from root component, to get menu popup
                    element. Or pass JSX element
                  </p>
                  <p>
                    Using <code>"container"</code> value will use root element
                    of the component
                  </p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      The element is the root element of the component, where
                      CSS classes are appended to, and it is also passed to
                      callbacks
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
            <li className="tsd-parameter">
              <h5>
                <span className="tsd-flag ts-flagOptional">Optional</span>{" "}
                appear<span className="tsd-signature-symbol">?: </span>
                <span className="tsd-signature-type">boolean</span>
              </h5>
              <div className="tsd-comment tsd-typography">
                <div className="lead">
                  <p>Whether to apply transition on initial render.</p>
                </div>
                <dl className="tsd-comment-tags">
                  <dt>defaultvalue</dt>
                  <dd>
                    <p>
                      <code>false</code>
                    </p>
                  </dd>
                </dl>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section className="tsd-panel tsd-member tsd-kind-type-alias">
        <h3 id="OnOpenHandler" tabindex="0">
          On
          <wbr />
          Open
          <wbr />
          Handler
        </h3>
        <div className="tsd-type-declaration">
          <h4>Type declaration</h4>
          <ul className="tsd-parameters">
            <li className="tsd-parameter-signature">
              <ul
                className="tsd-signatures tsd-kind-type-literal tsd-parent-kind-type-alias"
                data-has-instance="true"
              >
                <li className="tsd-signature tsd-kind-icon">
                  <span className="tsd-signature-symbol">(</span>open
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">boolean</span>, props
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-symbol">{"{"} </span>uniqueId
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">string</span>
                  <span className="tsd-signature-symbol">; </span>dismissStack
                  <span className="tsd-signature-symbol">: </span>
                  <a
                    href="#DismissStack"
                    className="tsd-signature-type"
                    data-tsd-kind="Type alias"
                  >
                    DismissStack
                  </a>
                  <span className="tsd-signature-symbol">[]</span>
                  <span className="tsd-signature-symbol"> {"}"}</span>
                  <span className="tsd-signature-symbol">)</span>
                  <span className="tsd-signature-symbol">: </span>
                  <span className="tsd-signature-type">void</span>
                </li>
              </ul>
              <ul className="tsd-descriptions">
                <li className="tsd-description">
                  <h4 className="tsd-parameters-title">Parameters</h4>
                  <ul className="tsd-parameters">
                    <li>
                      <h5>
                        open:{" "}
                        <span className="tsd-signature-type">boolean</span>
                      </h5>
                    </li>
                    <li>
                      <h5>
                        props:{" "}
                        <span className="tsd-signature-symbol">{"{"} </span>
                        uniqueId
                        <span className="tsd-signature-symbol">: </span>
                        <span className="tsd-signature-type">string</span>
                        <span className="tsd-signature-symbol">; </span>
                        dismissStack
                        <span className="tsd-signature-symbol">: </span>
                        <a
                          href="#DismissStack"
                          className="tsd-signature-type"
                          data-tsd-kind="Type alias"
                        >
                          DismissStack
                        </a>
                        <span className="tsd-signature-symbol">[]</span>
                        <span className="tsd-signature-symbol"> {"}"}</span>
                      </h5>
                      <ul className="tsd-parameters">
                        <li className="tsd-parameter">
                          <h5>
                            unique
                            <wbr />
                            Id<span className="tsd-signature-symbol">: </span>
                            <span className="tsd-signature-type">string</span>
                          </h5>
                        </li>
                        <li className="tsd-parameter">
                          <h5>
                            dismiss
                            <wbr />
                            Stack
                            <span className="tsd-signature-symbol">: </span>
                            <a
                              href="#DismissStack"
                              className="tsd-signature-type"
                              data-tsd-kind="Type alias"
                            >
                              DismissStack
                            </a>
                            <span className="tsd-signature-symbol">[]</span>
                          </h5>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <h4 className="tsd-returns-title">
                    Returns <span className="tsd-signature-type">void</span>
                  </h4>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </section>
      <section className="tsd-panel tsd-member tsd-kind-type-alias">
        <h3 id="DismissStack" tabindex="0">
          Dismiss
          <wbr />
          Stack
        </h3>
      </section>
    </div>
  );
};
export default Docs;
