// In ES-6 (ES-2015)
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from 'fs';
import nodePandoc from 'node-pandoc';

const pdfReplace = `## Download this manual

Available versions:

-   [\`PDF\`](downloads/Pine_Script_v5_User_Manual.pdf)`;

const pdf = `Download this manual \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--

Available versions:

-   \`PDF <../downloads/Pine_Script_v5_User_Manual.pdf>\``;

const advanced = `<figure class="align-right">
<img src="/images/logo/Pine_Script_logo.svg" width="100" height="100"
alt="/images/logo/Pine_Script_logo.svg" />
<figcaption>..</figcaption>
</figure>

![Advanced logo](/images/logo/Advanced_logo.svg){.align-bottom
width="100px" height="100px"}`;

const noteStart = `:::: note
::: title
Note
:::
`;

const src_v4 = './source';
const src = './src';

function spliceString(str, index, deleteCount, insertStr = '') {
	return str.slice(0, index) + insertStr + str.slice(index + deleteCount);
}

function toSnakeCase(str) {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

// :ref:`chart points <PageTypeSystem_Types_ChartPoints>`
// /pine-script-docs/concepts/bar-coloring#bar-coloring
function changeRefs(res) {
	res = res.replaceAll(/:ref:`.*?`/g, (repace) => {
		try {
			const value = /:ref:`(.*?)\s*?</.exec(repace)[1];
			let href = /Page(.*)?>/.exec(repace)[1];
			const arr = href.split('_');
			const origin = toSnakeCase(arr[0]);
			let other = '';

			if (arr.length > 1) {
				other = '#' + toSnakeCase(arr[arr.length - 1]);
			}

			return `\`${value} <http://localhost:4321/pine-script-docs/${origin}${other}>\``;
		} catch (err) {
			console.log(repace);
		}

		return '';
	});

	return res;
}

function generateMdx(path, dir) {
	// Arguments can be either a single String or in an Array
	let args = '-f rst -t markdown';

	// Set your callback function
	const callback = (err, result) => {
		if (err) console.error('Oh Nos: ', err);
		try {
			const isRoot = dir === src_v4;
			const curDir = dir.replace(src_v4 + '/', '');

			let res = result.replace(
				/(?<=!\[.*\]\()images/gs,
				`@assets/${isRoot ? 'images' : curDir}`
			);

			res.replace(pdf, pdfReplace);
			res = res.replace(
				/\[\!\[Pine Script™ logo\].*Introduction.html\)\n/s,
				''
			);

			const frst = res.search('::: {.contents');
			const scnd = res.search(/:::$/m);

			if (frst !== -1 && scnd !== -1) {
				res = spliceString(res, frst, scnd + 3 - frst);
			}

			while (res.search(noteStart) !== -1) {
				const nStart = res.search(noteStart);
				const nEnd = res.search(/::::$/m);
				let content = res.slice(nStart, nEnd);
				content = content.replace(noteStart, '');
				content = `:::warning[Notice!]${content}:::`;

				res = spliceString(res, nStart, nEnd + 4 - nStart, content);
			}

			// res = res.replace(/{\..*}/gs, '');
			res = res.replace(/{#.*}/g, '');
			res = res.replace(/{\.title-ref}/g, '');
			res = res.replace(/\:   /g, '    ');
			res = res.replace(/..    include:: \<isonum.txt\>/g, '');
			res = res.replace(/{\.interpreted-text\n*\s*role=".*"}/g, '');
			res = res.replace(/{height=.*}/g, '');
			res = res.replace(/``` ahk/g, '``` txt');
			res = res.replace(/{.pine linenos=""}/g, 'pine');
			res = res.replace(/{.align-right\n\s*width="240px" height="240px"}/g, '');
			res = res.replace(
				/\[!\[image\]\(\/images\/logo\/TradingView_Logo_Block\.svg\).*tradingview\.com\/\)/s,
				''
			);

			const isAdvanced = res.includes(advanced);
			if (isAdvanced) {
				res = res.replace(advanced, '');
			}

			const newDir = dir.replace(src_v4, src).replace(/_/g, '-');

			if (!existsSync(newDir)) {
				mkdirSync(newDir);
			}

			const outputPath = path
				.replace(src_v4, src)
				.replace('.rst', '.mdx')
				.replace(/_/g, '-')
				.toLowerCase();

			const match = /(?<=# ).*/.exec(res);
			let name = '';

			if (match?.length) {
				name = match[0].trim();
			}
			const title = capitalizeFirstLetter(dir.replace(src_v4 + '/', ''));

			const prev = `---
layout: '@layouts/Docs.astro'
sidebar-title: ${name}
page-title: ${!isRoot ? title + ' /' : ''} ${name}
${isAdvanced ? 'labels: advanced' : ''}
---
`;
			res = prev + res;

			writeFileSync(outputPath, res, {
				encoding: 'utf8',
				flag: 'w', // Ensures the file is overwritten
			});
		} catch (err) {
			console.log('err ', err);
		}
	};

	// Call pandoc
	nodePandoc(path, args, callback);
}

// generateMdx('bar_plotting');

const main = (dir) => {
	const files = readdirSync(dir);

	// Iterate over the files
	files.forEach((fileName) => {
		if (fileName === 'Tests.rst' || fileName === 'images') {
			return;
		}

		const path = dir + '/' + fileName;

		if (!/.*\.rst/.test(path)) {
			main(path);
			return;
		}

		const text = readFileSync(path, {
			encoding: 'utf-8',
		});
		let res = text.replace(/^::$/gm, '.. code-block:: pine');
		// res = changeRefs(res);

		// res = res.replaceAll(/^\+[-+]*\+$(.*?)^\+[-+]*\+$.[^\|]/gms, (v, p1) => {
		// 	let r = p1.replace(/\+[\+=]*\+/g, (match) => {
		// 		return match.replace(/=/g, '-').replace(/\+/g, '|');
		// 	});
		// 	r = r.replace(/\+[\+-]*\+/g, '');
		// 	return r;
		// });

		writeFileSync(path, res, {
			encoding: 'utf-8',
		});

		generateMdx(path, dir);
	});
};

function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

main(src_v4);
