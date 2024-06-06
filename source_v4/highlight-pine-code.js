window.addEventListener("DOMContentLoaded", () => {
	let codeItems = document.querySelectorAll(".highlight > pre");
	let codeTableItems = document.querySelectorAll(".highlight .code pre");

	const highlight = (item) => {
		item.firstElementChild.remove();
		window?.colorizePineCode(item, "pine_v4");
	};

	codeItems.forEach(highlight);
	codeTableItems.forEach(highlight);
});
