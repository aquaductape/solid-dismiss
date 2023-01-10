# Test

## Notes

If testing Safari on Mac, make sure to enable tabbing on control elements

1. In System Preferences → Keyboard, in the Shortcuts pane, check the “all controls” radio at the bottom.

If testing Firefox on Mac, make sure enable tabbing control elements https://stackoverflow.com/a/11713537

1. In System Preferences → Keyboard, in the Shortcuts pane, check the “all controls” radio at the bottom.

2. In Firefox, type "about:config" in the URL bar. There is no accessibility.tabfocus preference on the mac, so you'll have to make one. Right click in the window, create a new "integer" pref, and set it to 7.
