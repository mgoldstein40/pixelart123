// TODO: Edit code (consistent order of functions and for loop variable names and variable names in general)
// TODO: Comment the code
// TODO: Titles & keyboard shortcuts
// TODO: when a cell is drawn with a less recent color, make it the most recent color?????
// TODO: general animation stuff
// TODO: Fix color picker height

// TODO: save as image
// TODO: cookies (& last saved CSS)

// TODO: error handling

// TODO: what if someone adds a named color from file?
// TODO: color input size

//const PASSWORD =  "[255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,0,0,0,0,0,0,0,255,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,128,0,255,255,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,0,0,0,0,0,0,0,255,128,0,255,128,0,0,0,0,0,0,0,0,0,0,255,128,0,255,128,0,255,255,0,0,0,0,255,255,0,0,0,0,0,0,0,0,0,0,255,255,0,0,0,0,0,0,0,255,128,0,0,0,0,255,128,0,0,0,0,255,128,0,0,0,0,255,128,0,255,255,0,0,0,0,0,0,0,255,255,0,0,0,0,0,0,0,255,255,0,0,0,0,0,0,0,255,128,0,0,0,0,0,0,0,255,128,0,0,0,0,0,0,0,255,128,0,255,255,0,0,0,0,0,0,0,0,0,0,255,255,0,0,0,0,255,255,0,0,0,0,0,0,0,255,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,128,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,0,255,255,0,0,0,0,0,0,0,255,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,128,0,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,0,0,0,0,0,0,0,255,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,128,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,255,0,0,0,0,0,0,0,0,255,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,255,0,0,255,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]";




const Color = class {
	#rgb;
	#hex;
	#title;

	constructor(colorData, title = null) {
		if (Array.isArray(colorData) && colorData.length == 3 && colorData.every(k => Number.isInteger(k) && k >= 0 && k < 256)) {
			this.#rgb = colorData;
			this.#hex = "#" + colorData.map(k => (k < 16 ? "0" : "") + k.toString(16)).join("");
		} else if (typeof(colorData) === "string") {
			this.#hex = colorData;
			this.#rgb = new Array(3)
				.fill(parseInt(colorData.slice(1), 16))
				.map((k, i) => Math.floor(k / (256 ** (2 - i))) % 256);
		}
		this.#title = title;
	}

	get rgb() {
		return this.#rgb;
	}

	get hex() {
		return this.#hex;
	}

	get title() {
		return (this.#title === null) ? this.#hex : this.#title;
	}

	isEqual(otherColor) {
		return this.#rgb.every((k, i) => k === otherColor.rgb[i]);
	}
};

const BLACK = new Color([0, 0, 0], "Black");
const SILVER = new Color([192, 192, 192], "Silver");
const WHITE = new Color([255, 255, 255], "White");
const RED = new Color([255, 0, 0], "Red");
const ORANGE = new Color([255, 128, 0], "Orange");
const YELLOW = new Color([255, 255, 0], "Yellow");
const PALETTE = [
	BLACK,
	new Color([128, 128, 128], "Gray"),
	SILVER,
	WHITE,
	new Color([255, 0, 255], "Fuchsia"),
	new Color([255, 20, 147], "Deep Pink"),
	new Color([128, 0, 0], "Maroon"),
	new Color([178, 34, 34], "Fire Brick"),
	RED,
	new Color([255, 69, 0], "Coral"),
	ORANGE,
	new Color([255, 215, 0], "Gold"),
	YELLOW,
	new Color([128, 255, 0], "Chartreuse"),
	new Color([0, 255, 0], "Lime"),
	new Color([50, 205, 50], "Lime Green"),
	new Color([107, 142, 35], "Olive Drab"),
	new Color([0, 128, 0], "Green"),
	new Color([0, 128, 128], "Teal"),
	new Color([0, 191, 255], "Deep Sky Blue"),
	new Color([127, 255, 212], "Aquamarine"),
	new Color([0, 255, 255], "Cyan"),
	new Color([0, 0, 255], "Blue"),
	new Color([0, 0, 128], "Navy"),
	new Color([75, 0, 130], "Indigo"),
	new Color([148, 0, 211], "Dark Violet"),
	new Color([238, 130, 238], "Violet"),
	new Color([255, 192, 203], "Pink"),
	new Color([210, 180, 140], "Tan"),
	new Color([240, 230, 140], "Khaki"),
	new Color([160, 82, 45], "Sienna"),
	new Color([139, 69, 19], "Saddle Brown")
];

const Grid = class {
	#size;
	#arr;

	constructor(size) {
		this.#size = size;
		this.#arr = Array(size ** 2).fill(BLACK);
	}

	at(i, j) {
		return this.#arr[i * this.#size + j];
	}

	put(i, j, c) {
		this.#arr[i * this.#size + j] = c;
	}

	toString() {
		return JSON.stringify(this.#arr.map(c => c.rgb).flat());
	}

	isEmpty() {
		return this.#arr.every(c => c.isEqual(BLACK));
	}

	get size() {
		return this.#size;
	}
};

const GridArray = class {
	#size;
	#ptr;
	#arr;
	#delays;
	#clipboard;

	constructor(size) {
		this.#size = size;
		this.#ptr = 0;
		this.#arr = [new Grid(size)];
		this.delays = [1000];
		this.#clipboard = null;
	}

	get curr() {
		return this.#arr[this.#ptr] ?? null;
	}

	addGrid() {
		this.#arr.push(new Grid(this.#size));
	}

	copyGrid(idx) {
		if (idx >= 0 && idx < this.length) this.#clipboard = this.#arr[idx].toString();
	}

	removeGrid() {
		this.#arr.splice(this.#ptr, 1);
		if (this.#ptr === this.length) this.#ptr--;
	}

	prev() {
		if (this.#ptr > 0) this.#ptr--;
	}

	next() {
		if (this.#ptr < this.length - 1) this.#ptr++;
	}

	select(idx) {
		if (idx >= 0 && idx < this.length) this.#ptr = idx;
	}

	get length() {
		return this.#arr.length;
	}
};


/* CONSTANTS DECLARATIONS */
const N = 16;
const MAX_STACK_SIZE = 100;
const MAX_RECENT_COLORS = 8;


/* VARIABLE INITIALIZATIONS */
let sketchName = "My Pixel Sketch";

//let grid = Array.from(Array(N), () => new Array(N).fill(BLACK));
let drawColor = WHITE;
let pressedCell = null;

let drawMode = "p";
let actionStack = [];
let actionPtr = -1;

let recentColors = [];

let uniqueID = 0;


/* CSS VARIABLES */
const GRID_CELL_SIZE = 32;

const root = document.documentElement;
root.style.setProperty("--grid-cell-size", `${GRID_CELL_SIZE}px`);


/* DOM ELEMENT DECLARATIONS */
const header = document.querySelector("header");

const sidebar = document.querySelector("#sidebar");
const transformationsSection = sidebar.querySelector("#transformations");
const drawModeSection = sidebar.querySelector("#draw-mode");
const drawColorSection = sidebar.querySelector("#draw-color");
const filesSection = sidebar.querySelector("#files");

const main = document.querySelector("#main");
const gridContainer = main.querySelector("#grid-container");
const framesContainer = main.querySelector("#frames-container");


/* FILE HELPER FUNCTIONS */
const handleTxtUpload = e => {
	const actionID = uniqueActionID();
	
	const gridArr = JSON.parse(e.target.result);
	for (let idx = 0; idx < N * N * 3; idx += 3) {
		const i = Math.floor((idx / 3) / N);
		const j = (idx / 3) % N;
		const c = new Color(gridArr.slice(idx, idx + 3));
		drawCell(i, j, c, actionID);
	}
};
const handleImgUpload = e => {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	const img = document.createElement("img");

	img.src = e.target.result;
	img.onload = e => {
		ctx.drawImage(img, 0, 0, N, N);
		const loadedImgArr = ctx.getImageData(0, 0, N, N).data;
		
		const actionID = uniqueActionID();
		for (let idx = 0; idx < N * N * 4; idx += 4) {
			const i = Math.floor((idx / 4) / N);
			const j = (idx / 4) % N;
			const c = new Color([loadedImgArr[idx], loadedImgArr[idx + 1], loadedImgArr[idx + 2]]);
			console.log(i, j, c);
			drawCell(i, j, c, actionID);
		}
		console.log(loadedImgArr.length);
	};
	
	img.remove();
	canvas.remove();
};
const uploadHelper = file => {
	if (gridList[gridPtr].isEmpty() || confirm("Are you sure you want to upload a file? (Doing so will erase your current drawing.)")) {
		const reader = new FileReader();		
		console.log(file.type);
		if (file.type && file.type.startsWith("text")) {
			reader.onload = handleTxtUpload;
			reader.readAsText(file);
		} else if (file.type && file.type.startsWith("image")) {
			reader.onload = handleImgUpload;
			reader.readAsDataURL(file);
		}

		const fileName = file.name.split(".")[0];
		sketchName = fileName;
		sketchNameInput.value = sketchName;
	}
};
const downloadHelper = (name, suffix, href) => {
	const anchor = document.createElement("a");
	anchor.style.display = "none";
	anchor.href = href;
	anchor.download = `${name}.${suffix}`;
	
	anchor.click();
	anchor.remove();
};


/* DRAWING HELPER FUNCTIONS */
const drawCell = (i, j, newColor, actionID = null) => {
	if (!newColor.isEqual(gridList[gridPtr].at(i, j))) {
		const action = [i, j, gridList[gridPtr].at(i, j), newColor, actionID];
		setBtnColor(i, j, newColor);
	
		// If stack is full, forget bottom of stack.
		if (actionStack.length === MAX_STACK_SIZE) {
			actionStack.shift();
			actionPtr -= 1;
		}

		if (
			(drawMode === "p" && pressedCell != null) ||
			(actionID !== null && (actionStack[actionPtr]?.at(-1)[4] ?? -1) === actionID)
		) {
			// Add action to an ongoing action at the top of the array.
			actionStack[actionPtr].push(action);
		} else {
			actionPtr++;

			if (actionPtr === actionStack.length) {
				// If at top of stack, add action.
				actionStack.push([action]);
			} else {
				// If in the middle of stack, add action and forget above the inserted action.
				actionStack[actionPtr] = [action];
				actionStack.splice(actionPtr + 1);
			}
		}
		/*if (gridList[gridPtr].toString().trim() === PASSWORD) {
			console.log("hooray");
		}*/
		//updateCurrentCanvas();
	}
};

const drawRect = (ai, aj, bi, bj, c) => {
	const actionID = uniqueActionID();

	const si = (bi < ai) ? -1 : 1;
	const sj = (bj < aj) ? -1 : 1;

	for (let i = ai; i != bi + si; i += si) {
		drawCell(i, aj, c, actionID);
		drawCell(i, bj, c, actionID);
	}
	for (let j = aj; j != bj + sj; j += sj) {
		drawCell(ai, j, c, actionID);
		drawCell(bi, j, c, actionID);
	}
};
const drawFilledRect = (ai, aj, bi, bj, c) => {
	const actionID = uniqueActionID();

	const si = (bi < ai) ? -1 : 1;
	const sj = (bj < aj) ? -1 : 1;

	for (let i = ai; i != bi + si; i += si) {
		for (let j = aj; j != bj + sj; j += sj) {
			drawCell(i, j, c, actionID);
		}
	}
};

const lineHelperLow = (ai, aj, bi, bj, c) => {
	const uniqueID = uniqueActionID();

	const di = Math.abs(bi - ai);
	const dj = bj - aj;
	const si = (bi < ai) ? -1 : 1;

	let D = (2 * di) - dj;
	let i = ai;

	for (let j = aj; j <= bj; j++) {
		drawCell(i, j, c, uniqueID);
		if (D > 0) {
			i += si;
			D += 2 * (di - dj);
		} else {
			D += 2 * di;
		}
	}
};
const lineHelperHigh = (ai, aj, bi, bj, c) => {
	const uniqueID = uniqueActionID();

	const di = bi - ai;
	const dj = Math.abs(bj - aj);
	const sj = (bj < aj) ? -1 : 1;

	let D = (2 * dj) - di;
	let j = aj;

	for (let i = ai; i <= bi; i++) {
		drawCell(i, j, c, uniqueID);
		if (D > 0) {
			j += sj;
			D += 2 * (dj - di);
		} else {
			D += 2 * dj;
		}
	}
};
const drawLine = (ai, aj, bi, bj, c) => {
	const uniqueID = uniqueActionID();

	const di = bi - ai;
	const dj = bj - aj;

	const si = (bi < ai) ? -1 : 1;
	const sj = (bj < aj) ? -1 : 1;
	
	if (di === 0) {
		for (let j = aj; j != bj + sj; j += sj) drawCell(ai, j, c, uniqueID);
	} else if (dj === 0) {
		for (let i = ai; i != bi + si; i += si) drawCell(i, aj, c, uniqueID);
	} else if (Math.abs(di) > Math.abs(dj)) {
		if (si < 0) {
			lineHelperHigh(bi, bj, ai, aj, c);
		} else {
			lineHelperHigh(ai, aj, bi, bj, c);
		}
	} else {
		if (sj < 0) {
			lineHelperLow(bi, bj, ai, aj, c);
		} else {
			lineHelperLow(ai, aj, bi, bj, c);
		}
	}
};

const uniqueActionID = () => uniqueID++;
const setBtnColor = (i, j, c) => {
	gridList[gridPtr].put(i, j, c);
	const btn = gridContainer.querySelector(`#grid-${i}-${j}`);
	btn.title = c.title;
	btn.style.backgroundColor = c.hex;
}
const setDrawColor = c => {
	drawColor = c;
	drawColorPicker.value = c.hex
	addRecentColor(c);
};
const handleRecentColor = e => {
	const idx = +e.target.id.slice(-1);
	if (idx < recentColors.length) setDrawColor(recentColors[idx]);
};
const addRecentColor = c => {
	if (
		!PALETTE.some(otherColor => c.isEqual(otherColor)) &&
		!recentColors.some(otherColor => c.isEqual(otherColor))
	) {
		const len = recentColors.unshift(c);
		if (len > MAX_RECENT_COLORS) recentColors.splice(MAX_RECENT_COLORS);

		for (let i = 0; i < len; i++) {
			const recentColorBtn = recentColorGrid.querySelector(`#recent-colors-${i}`);
			recentColorBtn.title = recentColors[i].title;
			recentColorBtn.style.backgroundColor = recentColors[i].hex;
		}
	}
};
const updateDropdownButton = () => {
	dropdownButton.innerHTML = `<i class='fas fa-caret-${(dropdownMenu.classList.contains("show")) ? 'up' : 'down'}'></i>`;
};


/* HEADER HTML ELEMENTS */
const sketchNameInput = header.querySelector("#sketch-name");
sketchNameInput.value = sketchName;
sketchNameInput.onblur = e => {
	if (e.target.value === "") {
		e.target.value = sketchName;
	} else {
		sketchName = e.target.value;
	}
};
sketchNameInput.onkeydown = e => {
	if (e.key === "Enter") e.target.blur();
};


/* SIDEBAR HTML ELEMENTS */
const drawModeButtons = drawModeSection.querySelectorAll(".draw-mode");

const drawColorPicker = drawColorSection.querySelector("#draw-color-picker");
drawColorPicker.value = drawColor.hex;
drawColorPicker.oninput = e => {
	drawColor = new Color(e.target.value);
};
drawColorPicker.onchange = e => {
	addRecentColor(new Color(e.target.value));
};

const colorGrid = drawColorSection.querySelector("#color-grid");
PALETTE.forEach(c => {
	const colorBtn = document.createElement("button");
	colorBtn.classList.add("color-btn");
	colorBtn.title = c.title;
	colorBtn.style.backgroundColor = c.hex;
	colorBtn.onclick = e => {
		setDrawColor(c);
	}
	colorGrid.appendChild(colorBtn);
});

const recentColorGrid = drawColorSection.querySelector("#recent-color-grid");
for (let i = 0; i < MAX_RECENT_COLORS; i++) {
	const recentColorBtn = document.createElement("button");
	recentColorBtn.id = `recent-colors-${i}`;
	recentColorBtn.classList.add("color-btn");
	recentColorBtn.classList.add("recent");
	recentColorBtn.style.backgroundColor = SILVER.hex;
	recentColorBtn.onclick = handleRecentColor;
	recentColorGrid.appendChild(recentColorBtn);
}

const fileInput = filesSection.querySelector("#file-input");
fileInput.onchange = e => uploadHelper(e.target.files[0]);

const downloadWrapper = filesSection.querySelector("#download-wrapper");
const dropdownButton = downloadWrapper.querySelector("#dropdown-button");
const dropdownMenu = downloadWrapper.querySelector("#dropdown-menu");

downloadWrapper.onmouseleave = e => {
	dropdownMenu.classList.remove("show");
	updateDropdownButton();
};


/* MAIN HTML ELEMENTS */
for (let i = 0; i < N; i++) {
	const gridRow = document.createElement("div");
	gridRow.classList.add("grid-row");

	for (let j = 0; j < N; j++) {
		const gridBtn = document.createElement("button");
		gridBtn.id = `grid-${i}-${j}`;
		gridBtn.classList.add("grid-btn");
		gridBtn.title = BLACK.title;
		gridBtn.style.backgroundColor = BLACK.hex;

		gridBtn.onmousedown = e => {
			if (e.ctrlKey || e.metaKey) {
				setDrawColor(gridList[gridPtr].at(i, j));
			} else {
				const newColor = drawColor.isEqual(gridList[gridPtr].at(i, j)) ? BLACK : drawColor;
				drawCell(i, j, newColor);
				pressedCell = [i, j];
			}
		};
		gridBtn.onmouseover = e => {
			if (pressedCell !== null) {
				const pi = pressedCell[0];
				const pj = pressedCell[1];
				const c = gridList[gridPtr].at(pi, pj);
				if (drawMode === "p") {
					drawCell(i, j, c);
				} else if (drawMode === "r") {
					undo();
					drawRect(pi, pj, i, j, c);
				} else if (drawMode === "rf") {
					undo();
					drawFilledRect(pi, pj, i, j, c);
				} else if (drawMode === "l") {
					undo();
					drawLine(pi, pj, i, j, c);
				} else if (drawMode === "e") {
					undo();
					drawEllipse(pi, pj, i, j, c);
				}
				
			}
		};
		gridRow.appendChild(gridBtn);
	}
	gridContainer.appendChild(gridRow);
}


/* ONCLICK FUNCTIONS */
const translateUp = () => {
	const actionID = uniqueActionID();
	for (let i = 1; i < N; i++) {
		for (let j = 0; j < N; j++) {
			drawCell(i - 1, j, gridList[gridPtr].at(i, j), actionID);
		}
	}
	for (let j = 0; j < N; j++) {
		drawCell(N - 1, j, BLACK, actionID);
	}
};
const translateRight = () => {
	const actionID = uniqueActionID();
	for (let i = 0; i < N; i++) {
		for (let j = N - 2; j >= 0; j--) {
			drawCell(i, j + 1, gridList[gridPtr].at(i, j), actionID);
		}
	}
	for (let i = 0; i < N; i++) {
		drawCell(i, 0, BLACK, actionID);
	}
};
const translateDown = () => {
	const actionID = uniqueActionID();
	for (let i = N - 2; i >= 0; i--) {
		for (let j = 0; j < N; j++) {
			drawCell(i + 1, j, gridList[gridPtr].at(i, j), actionID);
		}
	}
	for (let j = 0; j < N; j++) {
		drawCell(0, j, BLACK, actionID);
	}
};
const translateLeft = () => {
	const actionID = uniqueActionID();
	for (let i = 0; i < N; i++) {
		for (let j = 1; j < N; j++) {
			drawCell(i, j - 1, gridList[gridPtr].at(i, j), actionID);
		}
	}
	for (let i = 0; i < N; i++) {
		drawCell(i, N - 1, BLACK, actionID);
	}
};
const reflectHorizontally = () => {
	const actionID = uniqueActionID();
	for (let i = 0; i < N; i++) {
		for (let j = 0; j < Math.floor(N / 2); j++) {
			const temp = gridList[gridPtr].at(i, N - j - 1);
			drawCell(i, N - j - 1, gridList[gridPtr].at(i, j), actionID);
			drawCell(i, j, temp, actionID);
		}
	}
};
const reflectVertically = () => {
	const actionID = uniqueActionID();
	for (let i = 0; i < Math.floor(N / 2); i++) {
		for (let j = 0; j < N; j++) {
			const temp = gridList[gridPtr].at(N - i - 1, j);
			drawCell(N - i - 1, j, gridList[gridPtr].at(i, j), actionID);
			drawCell(i, j, temp, actionID);
		}
	}
};
const rotateClockwise = () => {
	const actionID = uniqueActionID();
	for (let i = 0; i < Math.floor(N / 2); i++) {
		for (let j = i; j < N - i - 1; j++) {
			const temp = gridList[gridPtr].at(i, j);
			drawCell(i, j, gridList[gridPtr].at(N - j - 1, i), actionID);
			drawCell(N -j - 1, i, gridList[gridPtr].at(N - i - 1, N - j - 1), actionID);
			drawCell(N - i - 1, N - j - 1, gridList[gridPtr].at(j, N - i - 1), actionID);
			drawCell(j, N - i - 1, temp, actionID);
		}
	}
};
const rotateCounterclockwise = () => {
	const actionID = uniqueActionID();
	for (let i = 0; i < Math.floor(N / 2); i++) {
		for (let j = i; j < N - i - 1; j++) {
			const temp = gridList[gridPtr].at(i, j);
			drawCell(i, j, gridList[gridPtr].at(j, N - i - 1), actionID);
			drawCell(j, N - i - 1, gridList[gridPtr].at(N - i - 1, N - j - 1), actionID);
			drawCell(N - i - 1, N - j - 1, gridList[gridPtr].at(N - j - 1, i), actionID);
			drawCell(N - j - 1, i, temp, actionID);
		}
	}
};

const undo = () => {
	if (actionPtr > -1) {
		const currActions = actionStack[actionPtr];
		for (let k = currActions.length - 1; k > -1; k--) {
			const [i, j, oldColor, ,] = currActions[k];
			setBtnColor(i, j, oldColor);
		}
		actionPtr--;
	}
	//updateCurrentCanvas();
};
const redo = () => {
	if (actionPtr < actionStack.length - 1) {
		actionPtr++;
		const currActions = actionStack[actionPtr];
		for (let k = 0; k < currActions.length; k++) {
			const [i, j, , newColor] = currActions[k];
			setBtnColor(i, j, newColor);
		}
	}
	//updateCurrentCanvas();
};

const handleDrawMode = el => {
	for (const drawModeButton of drawModeButtons) drawModeButton.classList.remove("checked");
	drawMode = el.dataset["mode"];
	el.classList.add("checked");
};

const clearGrid = () => {
	const actionID = uniqueActionID();
	for (let i = 0; i < N; i ++) {
		for (let j = 0; j < N; j ++) {
			drawCell(i, j, BLACK, actionID);
		}
	}
};
const fillGrid = () => {
	const actionID = uniqueActionID();
	for (let i = 0; i < N; i ++) {
		for (let j = 0; j < N; j ++) {
			drawCell(i, j, drawColor, actionID);
		}
	}
};

const upload = () => {
	fileInput.click();
}
const handleDropdown = () => {
	dropdownMenu.classList.toggle("show");
	updateDropdownButton();
};

const downloadTxt = () => {
	const href = `data:text/plain;charset=utf-8, ${encodeURIComponent(gridList[gridPtr].toString())}`;
	downloadHelper(sketchName, "txt", href);
};
const downloadIno = () => {
	const fileName = sketchName.replace(/\s+/g, "-").toLowerCase().substring(0, 8);
	const gridDataStr = gridList[gridPtr].toString().slice(1, -1);
	const addFileContent = `#include <avr/pgmspace.h>\n#include <SPI.h>\n #include <SD.h>\nFile f;\nconst byte IMG[] PROGMEM = {${gridDataStr}};\nvoid setup() {\n\tSerial.begin(9600);\n\twhile (!Serial) { ; }\n\tif (!SD.begin(10)) { while (1); }\n\tif (SD.exists("${fileName}.txt")) { Serial.println("File already exists."); }\n\telse {\n\t\tf = SD.open("${fileName}.txt", FILE_WRITE);\n\t\tif (f) {\n\t\t\tfor (int i = 0; i < 768; i++) { f.write(pgm_read_byte(&IMG[i])); }\n\t\t\tf.close();\n\t\t}\n\t}\n}\nvoid loop() {}`;
	const showFileContent = `#include <SPI.h>\n#include <SD.h>\n#include "FastLED.h"\n#define NUM_LEDS 256\n#define DATA_PIN 9\nCRGB leds[NUM_LEDS];\nFile f;\nString fileName;\nlong color;\nvoid setup() {\n\tFastLED.addLeds<NEOPIXEL,DATA_PIN>(leds, NUM_LEDS);\n\tFastLED.setBrightness(12);\n\tSerial.begin(9600);\n\twhile (!Serial) { ; }\n\tif (!SD.begin(10)) { while(1); }\n\tf = SD.open("${fileName}.txt");\n\tif (f) {\n\t\tfor (size_t i = 0; i < NUM_LEDS; i++) {\n\t\t\tcolor = 0;\n\t\t\tcolor += currFile.read();\n\t\t\tcolor <<= 8;\n\t\t\tcolor += currFile.read();\n\t\t\tcolor <<= 8;\n\t\t\tcolor += currFile.read();\n\t\t\tleds[i] = color;\n\t\t}\n\t\tf.close();\n\t}\n\tFastLED.show();\n}\nvoid loop() {}`;
	
	const zip = JSZip();
	const zipFolder = zip.folder(fileName);
	zipFolder.folder(`add-${fileName}`).file(`add-${fileName}.ino`, addFileContent);
	zipFolder.folder(`show-${fileName}`).file(`show-${fileName}.ino`, showFileContent);
	
	let zipFile = null;
	zip.generateAsync({type: "base64"}).then(content => {
		console.log(content);
		zipFile = `data:application/zip;base64, ${encodeURIComponent(content)}`;

		if (confirm(`Due to Arduino file name restrictions, your file name may not match your current sketch name.\n\nYour sketch will be downloaded as: ${fileName}.ino`)) {
			downloadHelper(fileName, "zip", zipFile);
		}
	});
};
const downloadImg = suffix => {
	const pixelWidth = GRID_CELL_SIZE * N;
	const canvas = document.createElement("canvas");
	canvas.width = pixelWidth;
	canvas.height = pixelWidth;

	/*if (suffix === "ico") {
		drawGridToCanvas(canvas, gridPtr, )
	}*/
	drawGridToCanvas(canvas, gridPtr, GRID_CELL_SIZE);
	const src = canvas.toDataURL(`image/${suffix}`, 1.0);
	downloadHelper(sketchName, suffix, src);
	canvas.remove();
};


/* GLOBAL EVENT HANDLERS */
const handleKeyDown = e => {
	if (e.ctrlKey || e.metaKey) {
		e.preventDefault();
		if (e.key === "s") {
			//saveGrid();
		} else if (e.key === "z") {
			if (e.shiftKey) {
				redo();
			} else {
				undo();
			}
		}
	} else if (e.key === "ArrowRight") {
		translateRight();
	} else if (e.key === "ArrowLeft") {
		translateLeft();
	} else if (e.key === "ArrowUp") {
		translateUp();
	} else if (e.key === "ArrowDown") {
		translateDown();
	}
};


main.onkeydown = handleKeyDown;
sidebar.onkeydown = handleKeyDown;
document.onmouseup = e => {
	pressedCell = null;

};




//const MAX_FRAMES_SHOWN= 8;

let gridList = [new Grid(N)];
let gridPtr = 0;

/*
const createFrame = () => {
	const frameContainer = document.createElement("div");
	frameContainer.classList.add("frame-container");

	const canvas = document.createElement("canvas");
	canvas.width = 4 * N;
	canvas.height = 4 * N;
	canvas.id = `canvas-${gridPtr}`;
	frameContainer.appendChild(canvas);

	const idxDiv = document.createElement("div");
	idxDiv.innerHTML = `${gridPtr + 1}`;
	frameContainer.appendChild(idxDiv);

	framesContainer.appendChild(frameContainer);
};*/

const drawGridToCanvas = (canvas, gridIdx, pixelDilation) => {
	const ctx = canvas.getContext("2d");
	const pixelWidth = pixelDilation * N;
	const imgData = ctx.createImageData(pixelWidth, pixelWidth);

	for (let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
			const [r, g, b] = gridList[gridIdx].at(i, j).rgb;
			for (let byteI = i * pixelDilation; byteI < (i + 1) * pixelDilation; byteI++) {
				for (let byteJ = j * (pixelDilation * 4); byteJ < (j + 1) * (pixelDilation * 4); byteJ += 4) {
					const idx = byteI * pixelWidth * 4 + byteJ;
					imgData.data[idx] = r;
					imgData.data[idx + 1] = g;
					imgData.data[idx + 2] = b;
					imgData.data[idx + 3] = 255;
				}
			}
		}
	}
	ctx.putImageData(imgData, 0, 0);
};
/*
const updateCurrentCanvas = () => {
	const canvas = framesContainer.querySelector(`#canvas-${gridPtr}`);
	drawGridToCanvas(canvas, gridPtr, 4);
};

createFrame();
updateCurrentCanvas();*/
/*

for (let i = 0; i < MAX_FRAMES_SHOWN; i++) {
	const frameContainer = document.createElement("div");
	
	recentColorBtn.id = `recent-colors-${i}`;
	recentColorBtn.classList.add("color-btn");
	recentColorBtn.classList.add("recent");
	recentColorBtn.style.backgroundColor = rgbToHex(SILVER);
	recentColorBtn.onclick = handleRecentColor;


	framesContainer.appendChild(frame);
}

const GridList = class {

};
*/