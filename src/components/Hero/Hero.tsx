import { IconLogo } from "../icons";

const Hero = () => {
  return (
    <div class="hero">
      <div class="title">
        <h1>
          Solid <span style="display: block">Dismiss</span>
        </h1>{" "}
        <div class="logo">
          <IconLogo />{" "}
        </div>
      </div>
      <p>
        Handle <strong>"click outside"</strong> behavior to close
        dropdowns/popups for{" "}
        <a href="https://www.solidjs.com/" target="_blank">
          Solid Framework
        </a>
      </p>
    </div>
  );
};

export default Hero;
