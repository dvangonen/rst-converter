// In ES-6 (ES-2015)
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from 'fs';
import nodePandoc from 'node-pandoc';

const advanced = `<figure class="align-right">
<img src="/images/logo/Pine_Script_logo.svg" width="100" height="100"
alt="/images/logo/Pine_Script_logo.svg" />
<figcaption>..</figcaption>
</figure>

![Advanced logo](/images/logo/Advanced_logo.svg){.align-bottom
width="100px" height="100px"}`;

function generateMdx(fileName, dir) {
	// Arguments can be either a single String or in an Array
	let args = '-f rst -t markdown';

	// Set your callback function
	const callback = (err, result) => {
		if (err) console.error('Oh Nos: ', err);
		try {
			let res = result.replace(/(?<=!\[.*\]\()images/gs, `@assets/${dir}`);

			//
			res = res.replace(
				/\[\!\[Pine Script™ logo\].*\Introduction.html\)\n/s,
				''
			);
			res = res.replace(/\n:::.*:::/s, '');
			// res = res.replace(/{\..*}/gs, '');
			res = res.replace(/{#.*}/g, '');
			res = res.replace(/{\.title-ref}/g, '');
			res = res.replace(/\:   /g, '    ');
			res = res.replace(/..    include:: \<isonum.txt\>/g, '');
			res = res.replace(/{\.interpreted-text\n*\s*role=".*"}/g, '');
			res = res.replace(/{height=.*}/g, '');
			res = res.replace(
				/\[!\[image\]\(\/images\/logo\/TradingView_Logo_Block\.svg\).*tradingview\.com\/\)/s,
				''
			);

			const isAdvanced = res.includes(advanced);
			if (isAdvanced) {
				res = res.replace(advanced, '');
			}

			if (!existsSync(`./src/${dir}`)) {
				mkdirSync(`./src/${dir}`);
			}

			const file = `./src/${dir}/${fileName.toLowerCase()}.mdx`;

			const match = /(?<=# ).*/.exec(res);
			let name = '';

			if (match?.length) {
				name = match[0].trim();
			}
			const title = capitalizeFirstLetter(dir);

			const prev = `---
layout: '@layouts/Docs.astro'
sidebar-title: ${name}
page-title: ${title} / ${name}
${isAdvanced ? 'labels: advanced' : ''}
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
	const dir = 'language';

	const files = readdirSync(`./source/${dir}`);

	// Iterate over the files
	files.forEach((fileName) => {
		if (!/.*\.rst/.test(fileName)) {
			return;
		}

		const text = readFileSync(`./source/${dir}/${fileName}`, {
			encoding: 'utf-8',
		});
		let res = text.replace(/^::$/gm, '.. code-block:: pine');
		writeFileSync(`./source/${dir}/${fileName}`, res);

		generateMdx(fileName.replace('.rst', ''), dir);
	});
};

function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

main();
