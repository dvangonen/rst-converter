import { PNG } from "pngjs";
import fs from 'fs'

const t = `
14:45:56 [200] / 7ms
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Alerts-I-have-a-custom-script-that-generates-alerts-how-do-i-run-it-on-many-symbols-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Alerts-How-can-i-send-alerts-from-my-script-to-discord-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Alerts-How-can-i-send-alerts-from-my-script-to-discord-2.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Alerts-How-can-i-run-my-alert-on-a-timer-or-delay-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Alerts-How-can-i-trigger-an-alert-only-once-when-the-condition-is-true-the-first-time-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-What-are-the-primary-data-structues-available-in-the-pine-script-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-What-are-the-primary-data-structues-available-in-the-pine-script-2.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-How-do-i-create-and-use-arrays-in-pine-script-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-What-does-queue-stack-mean-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-What-does-queue-stack-mean-2.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-How-can-i-perform-operations-on-all-elements-in-an-array-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-How-do-i-debug-arrays-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-How-can-i-debug-objects-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Functions-How-can-i-calculate-values-depending-on-variable-lengths-that-reset-on-a-condition-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Functions-How-can-i-calculate-an-average-only-when-a-certain-condition-is-true-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Programming-How-can-i-examine-the-value-of-a-string-in-my-script-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Strategy-basics-How-can-i-turn-my-indicator-into-a-strategy-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Strategy-basics-How-do-i-set-a-stop-loss-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Strategy-basics-How-do-i-implement-date-time-range-filtering-in-strategies-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Order-execution-and-management-How-can-i-set-up-multiple-take-profit-levels-to-gradually-close-out-a-position-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Order-execution-and-management-How-can-i-set-up-multiple-take-profit-levels-to-gradually-close-out-a-position-2.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Order-execution-and-management-How-can-i-execute-a-trade-midway-through-a-bar-before-it-fully-closes-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-order-types-and-conditions-How-do-i-move-my-stop-loss-to-breakeven-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-order-types-and-conditions-How-do-i-implement-a-trailing-stop-loss-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-order-types-and-conditions-How-can-i-set-a-time-based-condition-to-close-out-a-position-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-order-types-and-conditions-How-can-i-configure-a-bracket-order-with-a-specific-risk-to-reward-rr-ratio-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-order-types-and-conditions-How-can-i-adjust-my-position-size-to-ensure-that-i-risk-a-fixed-percentage-of-my-equity-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-features-and-integration-How-can-i-implement-a-time-delay-between-orders-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-features-and-integration-How-can-i-calculate-custom-statistics-in-a-strategy-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strings-and-formatting-How-can-i-position-text-on-either-side-of-a-single-bar-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strings-and-formatting-How-can-i-lift-plotshape-text-up-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-trigger-a-condition-only-when-a-number-of-bars-have-elapsed-since-the-last-condition-occured-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-plot-the-charts-visible-high-and-low-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-count-the-occurences-of-a-condition-in-the-last-x-bars-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-implement-an-on-off-switch-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-allow-transitions-from-condition-ab-or-ba-but-not-aa-nor-bb-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-rescale-an-indicator-from-one-scale-to-another-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-count-touches-of-a-specific-level-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-display-plot-values-in-the-charts-scale-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-reset-a-sum-on-a-condition-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-accumulate-a-value-for-two-exclusive-states-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-know-how-many-days-are-in-the-current-month-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-plot-a-value-starting-n-months-years-back-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-track-highs-lows-for-a-specific-timeframe-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-track-the-highs-lows-within-a-specific-session-or-time-of-day-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-track-highs-lows-between-specific-intrabar-hours-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-detect-a-specific-date-time-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-know-the-date-when-the-highest-value-was-found-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-Can-i-time-the-duration-of-a-condition-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-identify-the-nth-occurance-of-a-weekday-in-the-month-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-implement-a-countdown-timer-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Variables-and-operators-What-is-a-varip-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Variables-and-operators-Why-do-the-ohlc-built-ins-sometimes-return-different-values-than-the-ones-shown-on-the-chart-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-Why-cant-i-use-a-plot-in-an-if-or-for-statement-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-Can-i-plot-diagonals-between-two-points-on-the-chart-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-do-i-plot-a-line-using-start-stop-criteria-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-do-i-plot-a-support-or-a-trend-line-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-do-i-plot-a-support-or-a-trend-line-2.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-can-i-use-colors-in-my-indicator-plots-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-can-i-use-colors-in-my-indicator-plots-2.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-can-i-draw-lines-or-labels-into-the-future-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-Is-it-possible-to-draw-geometric-shapes-1.png\`. Does it exist?
2:46:02 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-Is-it-possible-to-draw-geometric-shapes-2.png\`. Does it exist?
2:46:03 PM [vite] Error when evaluating SSR module /src/pages/_faq_updated.mdx: failed to import "@assets/images/Alerts-I-have-a-custom-script-that-generates-alerts-how-do-i-run-it-on-many-symbols-1.png"
|- Error: Cannot find module '@assets/images/Alerts-I-have-a-custom-script-that-generates-alerts-how-do-i-run-it-on-many-symbols-1.png' imported from '/Users/dvangonen/Documents/projects/pine_script_docs/src/pages/_faq_updated.mdx'
    at nodeImport (file:///Users/dvangonen/Documents/projects/pine_script_docs/node_modules/vite/dist/node/chunks/dep-cNe07EU9.js:55089:25)
    at ssrImport (file:///Users/dvangonen/Documents/projects/pine_script_docs/node_modules/vite/dist/node/chunks/dep-cNe07EU9.js:54998:30)
    at eval (/Users/dvangonen/Documents/projects/pine_script_docs/src/pages/_faq_updated.mdx:7:37)
    at async instantiateModule (file:///Users/dvangonen/Documents/projects/pine_script_docs/node_modules/vite/dist/node/chunks/dep-cNe07EU9.js:55058:9)

14:46:03 [ERROR] Cannot find module '@assets/images/Alerts-I-have-a-custom-script-that-generates-alerts-how-do-i-run-it-on-many-symbols-1.png' imported from '/Users/dvangonen/Documents/projects/pine_script_docs/src/pages/_faq_updated.mdx'
  Stack trace:
    at nodeImport (file:///Users/dvangonen/Documents/projects/pine_script_docs/node_modules/vite/dist/node/chunks/dep-cNe07EU9.js:55089:25)
    at eval (/Users/dvangonen/Documents/projects/pine_script_docs/src/pages/_faq_updated.mdx:7:37)
14:46:03 [ERROR] Cannot find module '@assets/images/Alerts-I-have-a-custom-script-that-generates-alerts-how-do-i-run-it-on-many-symbols-1.png' imported from '/Users/dvangonen/Documents/projects/pine_script_docs/src/pages/_faq_updated.mdx'
  Stack trace:
    at nodeImport (file:///Users/dvangonen/Documents/projects/pine_script_docs/node_modules/vite/dist/node/chunks/dep-cNe07EU9.js:55089:25)
    at eval (/Users/dvangonen/Documents/projects/pine_script_docs/src/pages/_faq_updated.mdx:7:37)
14:46:10 [200] / 81ms
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Alerts-I-have-a-custom-script-that-generates-alerts-how-do-i-run-it-on-many-symbols-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Alerts-How-can-i-send-alerts-from-my-script-to-discord-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Alerts-How-can-i-send-alerts-from-my-script-to-discord-2.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Alerts-How-can-i-run-my-alert-on-a-timer-or-delay-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Alerts-How-can-i-trigger-an-alert-only-once-when-the-condition-is-true-the-first-time-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-What-are-the-primary-data-structues-available-in-the-pine-script-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-What-are-the-primary-data-structues-available-in-the-pine-script-2.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-How-do-i-create-and-use-arrays-in-pine-script-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-What-does-queue-stack-mean-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-What-does-queue-stack-mean-2.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-How-can-i-perform-operations-on-all-elements-in-an-array-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-How-do-i-debug-arrays-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Data-structures-How-can-i-debug-objects-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Functions-How-can-i-calculate-values-depending-on-variable-lengths-that-reset-on-a-condition-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Functions-How-can-i-calculate-an-average-only-when-a-certain-condition-is-true-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Programming-How-can-i-examine-the-value-of-a-string-in-my-script-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Strategy-basics-How-can-i-turn-my-indicator-into-a-strategy-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Strategy-basics-How-do-i-set-a-stop-loss-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Strategy-basics-How-do-i-implement-date-time-range-filtering-in-strategies-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Order-execution-and-management-How-can-i-set-up-multiple-take-profit-levels-to-gradually-close-out-a-position-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Order-execution-and-management-How-can-i-set-up-multiple-take-profit-levels-to-gradually-close-out-a-position-2.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Order-execution-and-management-How-can-i-execute-a-trade-midway-through-a-bar-before-it-fully-closes-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-order-types-and-conditions-How-do-i-move-my-stop-loss-to-breakeven-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-order-types-and-conditions-How-do-i-implement-a-trailing-stop-loss-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-order-types-and-conditions-How-can-i-set-a-time-based-condition-to-close-out-a-position-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-order-types-and-conditions-How-can-i-configure-a-bracket-order-with-a-specific-risk-to-reward-rr-ratio-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-order-types-and-conditions-How-can-i-adjust-my-position-size-to-ensure-that-i-risk-a-fixed-percentage-of-my-equity-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-features-and-integration-How-can-i-implement-a-time-delay-between-orders-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strategies-Advanced-features-and-integration-How-can-i-calculate-custom-statistics-in-a-strategy-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strings-and-formatting-How-can-i-position-text-on-either-side-of-a-single-bar-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Strings-and-formatting-How-can-i-lift-plotshape-text-up-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-trigger-a-condition-only-when-a-number-of-bars-have-elapsed-since-the-last-condition-occured-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-plot-the-charts-visible-high-and-low-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-count-the-occurences-of-a-condition-in-the-last-x-bars-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-implement-an-on-off-switch-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-allow-transitions-from-condition-ab-or-ba-but-not-aa-nor-bb-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-rescale-an-indicator-from-one-scale-to-another-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-count-touches-of-a-specific-level-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-display-plot-values-in-the-charts-scale-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-reset-a-sum-on-a-condition-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Techniques-How-can-i-accumulate-a-value-for-two-exclusive-states-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-know-how-many-days-are-in-the-current-month-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-plot-a-value-starting-n-months-years-back-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-track-highs-lows-for-a-specific-timeframe-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-track-the-highs-lows-within-a-specific-session-or-time-of-day-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-track-highs-lows-between-specific-intrabar-hours-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-detect-a-specific-date-time-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-know-the-date-when-the-highest-value-was-found-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-Can-i-time-the-duration-of-a-condition-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-identify-the-nth-occurance-of-a-weekday-in-the-month-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Times-dates-sessions-How-can-i-implement-a-countdown-timer-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Variables-and-operators-What-is-a-varip-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Variables-and-operators-Why-do-the-ohlc-built-ins-sometimes-return-different-values-than-the-ones-shown-on-the-chart-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-Why-cant-i-use-a-plot-in-an-if-or-for-statement-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-Can-i-plot-diagonals-between-two-points-on-the-chart-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-do-i-plot-a-line-using-start-stop-criteria-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-do-i-plot-a-support-or-a-trend-line-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-do-i-plot-a-support-or-a-trend-line-2.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-can-i-use-colors-in-my-indicator-plots-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-can-i-use-colors-in-my-indicator-plots-2.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-How-can-i-draw-lines-or-labels-into-the-future-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-Is-it-possible-to-draw-geometric-shapes-1.png\`. Does it exist?
2:46:11 PM [vite] Pre-transform error: Could not find requested image \`@assets/images/Visuals-Is-it-possible-to-draw-geometric-shapes-2.png\`. Does it exist?
2:46:11 PM [vite] Error when evaluating SSR module /src/pages/_faq_updated.mdx: failed to import "@assets/images/Alerts-I-have-a-custom-script-that-generates-alerts-how-do-i-run-it-on-many-symbols-1.png"
|- Error: Cannot find module '@assets/images/Alerts-I-have-a-custom-script-that-generates-alerts-how-do-i-run-it-on-many-symbols-1.png' imported from '/Users/dvangonen/Documents/projects/pine_script_docs/src/pages/_faq_updated.mdx'
    at nodeImport (file:///Users/dvangonen/Documents/projects/pine_script_docs/node_modules/vite/dist/node/chunks/dep-cNe07EU9.js:55089:25)
    at ssrImport (file:///Users/dvangonen/Documents/projects/pine_script_docs/node_modules/vite/dist/node/chunks/dep-cNe07EU9.js:54998:30)
    at eval (/Users/dvangonen/Documents/projects/pine_script_docs/src/pages/_faq_updated.mdx:7:37)
    at async instantiateModule (file:///Users/dvangonen/Documents/projects/pine_script_docs/node_modules/vite/dist/node/chunks/dep-cNe07EU9.js:55058:9)

14:46:11 [ERROR] Cannot find module '@assets/images/Alerts-I-have-a-custom-script-that-generates-alerts-how-do-i-run-it-on-many-symbols-1.png' imported from '/Users/dvangonen/Documents/projects/pine_script_docs/src/pages/_faq_updated.mdx'
  Stack trace:`;

const main = () => {
	t.replaceAll(/`@assets\/images\/(.*?)`/g, (m, p1) => {
		console.log(p1);

		// Function to create a mock transparent PNG image and save it to a folder
		function createAndSaveMockTransparentPng(
			name,
			width,
			height,
			outputPath = './img'
		) {
			// Ensure the output directory exists
			fs.mkdirSync(outputPath, { recursive: true });

			// Create a PNG instance
			const png = new PNG({ width, height, bgColor: '#ff0000' });

			// Set all pixels to transparent
			for (let y = 0; y < png.height; y++) {
				for (let x = 0; x < png.width; x++) {
					png.data[y * png.width + x] = 0x00; // Alpha channel value for transparency
				}
			}

			// Write the PNG data to a file
			const filePath = `${outputPath}/${name}`;
			png.pack().pipe(fs.createWriteStream(filePath));

			console.log(`Created transparent PNG: ${filePath}`);
		}

		// Example usage
		createAndSaveMockTransparentPng(p1, 500, 500);
	});
};

main();
