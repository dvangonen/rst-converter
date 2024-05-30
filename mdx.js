import { readFileSync, readdirSync, writeFileSync } from 'fs';

const pathfolderOverrides = {
	'/': [
		'welcome',
		'primer',
		'language',
		'concepts',
		'writing',
		'faq',
		'error-messages',
		'release-notes',
		'migration-guides',
		'more-information',
		'where-can-i-get-more-information',
	],
	'/primer': ['first-steps', 'first-indicator', 'next-steps'],
	'/writing': ['style-guide', 'debugging', 'publishing', 'limitations'],
	'/language': [
		'execution-model',
		'time-series',
		'script-structure',
		'identifiers',
		'operators',
		'variable-declarations',
		'conditional-structures',
		'loops',
		'type-system',
		'built-ins',
		'user-defined-functions',
		'objects',
		'methods',
		'arrays',
		'matrices',
		'maps',
	],
	'/migration-guides': [
		'to-pine-version-5',
		'to-pine-version-4',
		'to-pine-version-3',
	],
	'/concepts': [
		'alerts',
		'backgrounds',
		'bar-coloring',
		'bar-plotting',
		'bar-states',
		'chart-information',
		'colors',
		'fills',
		'inputs',
		'levels',
		'libraries',
		'lines-and-boxes',
		'non-standard-charts-data',
		'other-timeframes-and-data',
		'plots',
		'repainting',
		'sessions',
		'strategies',
		'tables',
		'text-and-shapes',
		'time',
		'timeframes',
	],
};

function toSnakeCase(str) {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function changeRefs(res, folder) {
	res = res.replaceAll(/`(.*?)<Page(.*?)>`/g, (repace, value, href) => {
		try {
			const arr = href.split('_');
			const origin = toSnakeCase(arr[0]);
			let other = '';
			let folder = '';

			Object.entries(pathfolderOverrides).forEach(([key, arr]) => {
				if (arr.includes(origin)) {
					folder = key;
				}
			});
			folder = folder.replace('/', '');
			const dir = folder ? `${folder}/` : '';

			if (arr.length > 1) {
				other = '#' + toSnakeCase(arr[arr.length - 1]);
			}

			// [intor](/pine-script-docs/concepts/bar-coloring#bar-coloring)
			return `[${value}](/pine-script-docs/${dir}${origin}${other})`;
		} catch (err) {
			console.log(repace);
		}

		return '';
	});

	return res;
}

const main = (dir) => {
	const files = readdirSync(dir);

	// Iterate over the files
	files.forEach((fileName) => {
		const path = dir + '/' + fileName;

		if (!/.*\.mdx/.test(path)) {
			main(path);
			return;
		}

		let text = readFileSync(path, {
			encoding: 'utf-8',
		});

		text = changeRefs(text, dir.replace('./src', '').replace('/', ''));
		console.log(fileName);

		writeFileSync(path, text);
	});
};

main('./src/primer');
