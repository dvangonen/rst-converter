// In ES-6 (ES-2015)
import { readdirSync, writeFileSync } from 'fs';
import nodePandoc from 'node-pandoc';

function generateMdx(fileName, dir) {
	// Arguments can be either a single String or in an Array
	let args = '-f rst -t markdown';

	// Set your callback function
	const callback = (err, result) => {
		if (err) console.error('Oh Nos: ', err);
		try {
			let res = result.replace(/(?<=!\[image\]\()images/s, '@assets/images');
			res = res.replace(/\[\!\[Pine Script™ logo].*\.html\)\n/s, '');
			res = res.replace(/\n:::.*:::/s, '');
			// res = res.replace(/{\..*}/gs, '');
			res = res.replace(/{#.*}/g, '');
			res = res.replace(
				/\[!\[image\]\(\/images\/logo\/TradingView_Logo_Block\.svg\).*tradingview\.com\/\)/s,
				''
			);
			const file = `./src/${dir}/${fileName}.mdx`;

			const match = /(?<=# ).*/.exec(res);
			let name = '';

			if (match?.length) {
				name = match[0].trim();
			}

			const prev = `---
layout: '@layouts/Docs.astro'
sidebar-title: ${name}
page-title: Concepts / ${name}
---
`;
			res = prev + res;

			writeFileSync(file, res, {
				encoding: 'utf8',
				flag: 'w', // Ensures the file is overwritten
			});
		} catch (err) {
			console.log('err ', err);
		}
	};

	// Call pandoc
	nodePandoc(`./source/${dir}/${fileName}.rst`, args, callback);
}

// generateMdx('bar_plotting');

const main = () => {
	// Read the directory synchronously
	const dir = 'concepts';
	const files = readdirSync(`./source/${dir}`);

	// Iterate over the files
	files.forEach((fileName) => {
		if (/.*\.rst/.test(fileName)) {
			console.log(fileName);
			generateMdx(fileName.replace('.rst', ''), dir);
		}
	});
};

main();
