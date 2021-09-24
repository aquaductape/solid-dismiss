let os = require("os");

const path = "tests";
module.exports = {
  skipJsErrors: false,
  hostname: os.hostname(),
  browsers: ["chrome", "firefox", "safari"],
  src: [
    `${path}/nested-mounted.ts`,
    `${path}/basic-dropdown.ts`,
    `${path}/nested-overlay.ts`,
    `${path}/iframes.ts`,
    `${path}/mixed.ts`,
    `${path}/nested-regular.ts`,
  ],
  concurrent: 3,
};
