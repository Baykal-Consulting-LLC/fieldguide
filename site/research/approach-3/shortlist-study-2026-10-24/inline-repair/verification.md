# Inline startup repair

- Removed the inert JSON script and embedded the unchanged dataset in the single executable script. This removes the dependency on preservation of data-only script nodes by inline script extraction.
- Original all-script extraction reproduced a JavaScript parse failure: Unexpected token colon.
- Fixed script extraction compiles successfully.
- Dataset equality checked: all 2,000 model results and 473 loss records unchanged.
- Hardened optional state persistence so a non-Promise or unavailable host response does not break filter interaction.
- Sandboxed browser preview rendered both coverage charts and separate cohort totals.
- Verified Grok filter, case selection, seven ranking-only college cases, and reset to all missed college cases.
- Browser console errors after those interactions: none.
- No prototype or matching code changed.
