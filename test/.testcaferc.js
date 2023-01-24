let os = require("os");

const path = "tests";
module.exports = {
  skipJsErrors: false,
  hostname: os.hostname(),
  browsers: ["chrome"],
  src: [
    // `${path}/basic-dropdown.ts`,
    // `${path}/popup-no-focusable-items.ts`,
    // `${path}/nested-mounted.ts`,
    // `${path}/nested-regular.ts`,
    // `${path}/nested-overlay.ts`,
    // `${path}/programmatic.ts`,
    // `${path}/multiple-menu-buttons.ts`,
    // `${path}/multiple-menu-buttons-css.ts`,
    // `${path}/modal.ts`,
    // `${path}/modal-2.ts`,
    // `${path}/tabbing.ts`,
    `${path}/iframes.ts`,
    // `${path}/mixed.ts`,
  ],
  speed: 1,
  current: 1,
  // current: 3,
};
