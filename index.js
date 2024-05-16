// In ES-6 (ES-2015)
import nodePandoc from 'node-pandoc';

let src = './bar_plotting.rst';

// Arguments can be either a single String or in an Array
let args = '-f rst -t markdown -o ./bar_plotting.mdx';

// Set your callback function
const callback = (err, result) => {
	if (err) console.error('Oh Nos: ', err);
	return console.log(result), result;
};

// Call pandoc
nodePandoc(src, args, callback);
