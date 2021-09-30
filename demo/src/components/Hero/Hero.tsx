import { onMount } from "solid-js";
import { setContext } from "../../global/global";
import Anchor from "../Anchor/Anchor";
import HeroDropdown from "../Examples/HeroDropdown";
import { IconLogo } from "../icons";
import PackageBtn from "./PackageBtn";

const Hero = () => {
  let titleEl!: HTMLDivElement;

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setContext((s) => {
          console.log("set!");
          s.nav.logoActive = !entry.isIntersecting;
        });
      });
    });
    observer.observe(titleEl);
  });

  return (
    <div class="hero">
      <div class="title">
        <h1>
          <div class="title-sentinel" ref={titleEl}></div>
          Solid <span style="display: block">Dismiss</span>
        </h1>{" "}
        <div class="logo">
          <IconLogo />{" "}
        </div>
      </div>
      <p class="content">
        Handle <strong>"click outside"</strong> behavior to close
        dropdowns/popups for <br />
        <Anchor
          class="page-anchor"
          href="https://www.solidjs.com/"
          target="_blank"
        >
          Solid Framework
        </Anchor>
      </p>
      <div class="demo">
        <HeroDropdown></HeroDropdown>
      </div>
      <PackageBtn />
    </div>
  );
};

export default Hero;
