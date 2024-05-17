const dir = 'concepts';
const str = `Alerts
Backgrounds
Bar_coloring
Bar_plotting
Bar_states
Chart_information
Colors
Fills
Inputs
Levels
Libraries
Lines_and_boxes
Non-standard_charts_data
Other_timeframes_and_data
Plots
Repainting
Sessions
Strategies
Tables
Text_and_shapes
Time
Timeframes`;

let res = str.split(/\s/).map((i) => i.replace(/_/g, '-'));
// console.log(res);
res = res.map((item) => `[${item}](${dir}/${item})`).join('\n\n');
console.log(res);
