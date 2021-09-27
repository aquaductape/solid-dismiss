let os = require("os");

const path = "tests";
module.exports = {
  skipJsErrors: false,
  hostname: os.hostname(),
  browsers: ["chrome"],
  src: [
    `${path}/nested-mounted.ts`,
    `${path}/basic-dropdown.ts`,
    `${path}/nested-overlay.ts`,
    `${path}/iframes.ts`,
    `${path}/mixed.ts`,
    `${path}/nested-regular.ts`,
  ],
  // speed: 0.8,
  concurrent: 3,
};
