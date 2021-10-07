let os = require("os");

const path = "tests";
module.exports = {
  skipJsErrors: false,
  hostname: os.hostname(),
  browsers: ["firefox"],
  src: [
    `${path}/basic-dropdown.ts`,
    `${path}/popup-no-focusable-items.ts`,
    `${path}/nested-mounted.ts`,
    `${path}/nested-regular.ts`,
    `${path}/nested-overlay.ts`,
    `${path}/programmatic.ts`,
    `${path}/iframes.ts`,
    `${path}/mixed.ts`,
  ],
  // speed: 0.8,
  current: 3,
};
