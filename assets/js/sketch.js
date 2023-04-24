// TODO: Edit code (consistent order of functions and for loop variable names and variable names in general)
// TODO: Comment the code
// TODO: Titles & keyboard shortcuts
// TODO: when a cell is drawn with a less recent color, make it the most recent color????? -> add to drawcell?
// TODO: general animation stuff
// TODO: Fix color picker height

// TODO: Change drawGridToCanvas so that it only redraws affected cells (put in drawcell & undo, redo)

// TODO: save as image
// TODO: cookies (& last saved button settings)

// TODO: error handling

// TODO: color input size

const Color = class {
	#rgb;
	#hex;
	#title;

    static colorNames = {"Black": "#000000", "Gray": "#808080", "Silver": "#c0c0c0", "White": "#ffffff", "Fuchsia": "#ff00ff", "Deep Pink": "#ff1493", "Maroon": "#800000", "Fire Brick": "#b22222", "Red": "#ff0000", "Coral": "#ff4500", "Orange": "#ff8000", "Gold": "#ffd700", "Yellow": "#ffff00", "Chartreuse": "#80ff00", "Lime": "#00ff00", "Lime Green": "#32cd32", "Olive Drab": "#6b8e23", "Green": "#008000", "Teal": "#008080", "Deep Sky Blue": "#00bfff", "Aquamarine": "#7fffd4", "Cyan": "#00ffff", "Blue": "#0000ff", "Navy": "#000080", "Indigo": "#4b0082", "Dark Violet": "#9400d3", "Violet": "#ee82ee", "Pink": "#ffc0cb", "Tan": "#d2b48c", "Khaki": "#f0e68c", "Sienna": "#a0522d", "Saddle Brown": "#8b4513"};

    
	constructor(colorData) {
		if (Array.isArray(colorData) && colorData.length == 3 && colorData.every(k => Number.isInteger(k) && k >= 0 && k < 256)) {
			this.#rgb = colorData;
			this.#hex = "#" + colorData.map(k => (k < 16 ? "0" : "") + k.toString(16)).join("").upper();
		} else if (typeof(colorData) === "string") {
            if (colorData.slice(0, 1) === "#") {
                this.#hex = colorData;
                this.#rgb = new Array(3)
					.fill(parseInt(colorData.slice(1), 16))
					.map((k, i) => Math.floor(k / (256 ** (2 - i))) % 256);
            }
		}
        this.#title = this.#hex;
		Object.entries(Color.colorNames).forEach(colorEntry => { if (this.#hex === colorEntry[1]) this.#title = colorEntry[0]; });
	}


	get rgb() {
        return this.#rgb;
    }
	get hex() {
        return this.#hex;
    }
	get title() {
        return this.#title;
    }


	isEqual(otherColor) {
        return this.#hex === otherColor.hex;
    }
};

PALETTE = Object.values(Color.colorNames).map(hex => new Color(hex));
const BLACK = new Color("#000000");
const SILVER = new Color("#c0c0c0");
const WHITE = new Color("#ffffff");


const Grid = class {
	#size;
	#arr;

	constructor(size) {
		this.#size = size;
		this.#arr = Array(size ** 2).fill(BLACK);
	}

	get size() { return this.#size; }

	at(i, j) {
		return this.#arr[i * this.#size + j];
	}
	put(i, j, c) {
		this.#arr[i * this.#size + j] = c;
	}
	toString() {
		return JSON.stringify(this.#arr.map(c => c.rgb).flat());
	}
	fromString(s) {
		const newArr = JSON.parse(s);
		for (let idx = 0; idx < this.#size ** 2; idx++) {
			const newArrIdx = idx * 3;
			this.#arr[idx] = new Color([newArr[newArrIdx], newArr[newArrIdx + 1], newArr[newArrIdx + 2]]);
		}
	}
	isEmpty() {
		return this.#arr.every(c => c.isEqual(BLACK));
	}

	drawFrame(canvas) {
		const ctx = canvas.getContext("2d");
		const pixelWidth = N * FRAME_PIXEL_DILATION;
		const imgData = ctx.createImageData(pixelWidth, pixelWidth);
	
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				const [r, g, b] = grids.curr.at(i, j).rgb;
				for (let byteI = i * FRAME_PIXEL_DILATION; byteI < (i + 1) * FRAME_PIXEL_DILATION; byteI++) {
					for (let byteJ = j * (FRAME_PIXEL_DILATION * 4); byteJ < (j + 1) * (FRAME_PIXEL_DILATION * 4); byteJ += 4) {
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

let drawMode = 0;
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

const framesSection = document.querySelector("#frames-section");
const frames = framesSection.querySelector("#frames");

const sketchSection = document.querySelector("#sketch-section");
const sketch = sketchSection.querySelector("#sketch");


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
			drawCell(i, j, c, actionID);
		}
	};
	
	img.remove();
	canvas.remove();
};
const uploadHelper = file => {
	if (grids.curr.isEmpty() || confirm("Are you sure you want to upload a file? (Doing so will erase your current drawing.)")) {
		const reader = new FileReader();
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
	if (!newColor.isEqual(grids.curr.at(i, j))) {
		const action = [i, j, grids.curr.at(i, j), newColor, actionID];
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
		grids.drawCurr();
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
	grids.curr.put(i, j, c);
	const btn = sketch.querySelector(`#grid-${i}-${j}`);
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
				setDrawColor(grids.curr.at(i, j));
			} else {
				const newColor = drawColor.isEqual(grids.curr.at(i, j)) ? BLACK : drawColor;
				drawCell(i, j, newColor);
				pressedCell = [i, j];
			}
		};
		gridBtn.onmouseover = e => {
			if (pressedCell !== null) {
				const pi = pressedCell[0];
				const pj = pressedCell[1];
				const c = grids.curr.at(pi, pj);
				if (drawMode === 0) {
					drawCell(i, j, c);
				} else if (drawMode === 1) {
					undo();
					drawLine(pi, pj, i, j, c);
				} else if (drawMode === 2) {
					undo();
					drawRect(pi, pj, i, j, c);
				} else if (drawMode === 3) {
					undo();
					drawFilledRect(pi, pj, i, j, c);
				}
			}
		};
		gridRow.appendChild(gridBtn);
	}
	sketch.appendChild(gridRow);
}


/* ONCLICK FUNCTIONS */
const translateUp = () => {
	const actionID = uniqueActionID();
	for (let i = 1; i < N; i++) {
		for (let j = 0; j < N; j++) {
			drawCell(i - 1, j, grids.curr.at(i, j), actionID);
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
			drawCell(i, j + 1, grids.curr.at(i, j), actionID);
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
			drawCell(i + 1, j, grids.curr.at(i, j), actionID);
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
			drawCell(i, j - 1, grids.curr.at(i, j), actionID);
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
			const temp = grids.curr.at(i, N - j - 1);
			drawCell(i, N - j - 1, grids.curr.at(i, j), actionID);
			drawCell(i, j, temp, actionID);
		}
	}
};
const reflectVertically = () => {
	const actionID = uniqueActionID();
	for (let i = 0; i < Math.floor(N / 2); i++) {
		for (let j = 0; j < N; j++) {
			const temp = grids.curr.at(N - i - 1, j);
			drawCell(N - i - 1, j, grids.curr.at(i, j), actionID);
			drawCell(i, j, temp, actionID);
		}
	}
};
const rotateClockwise = () => {
	const actionID = uniqueActionID();
	for (let i = 0; i < Math.floor(N / 2); i++) {
		for (let j = i; j < N - i - 1; j++) {
			const temp = grids.curr.at(i, j);
			drawCell(i, j, grids.curr.at(N - j - 1, i), actionID);
			drawCell(N -j - 1, i, grids.curr.at(N - i - 1, N - j - 1), actionID);
			drawCell(N - i - 1, N - j - 1, grids.curr.at(j, N - i - 1), actionID);
			drawCell(j, N - i - 1, temp, actionID);
		}
	}
};
const rotateCounterclockwise = () => {
	const actionID = uniqueActionID();
	for (let i = 0; i < Math.floor(N / 2); i++) {
		for (let j = i; j < N - i - 1; j++) {
			const temp = grids.curr.at(i, j);
			drawCell(i, j, grids.curr.at(j, N - i - 1), actionID);
			drawCell(j, N - i - 1, grids.curr.at(N - i - 1, N - j - 1), actionID);
			drawCell(N - i - 1, N - j - 1, grids.curr.at(N - j - 1, i), actionID);
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
	grids.drawCurr();
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
	grids.drawCurr();
};

const handleDrawMode = el => {
	drawMode = +el.dataset["mode"];
	updateDrawModeButtons();
};

const updateDrawModeButtons = () => {
	for (const drawModeButton of drawModeButtons) drawModeButton.classList.remove("checked");
	drawModeButtons[drawMode].classList.add("checked");
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
	const href = `data:text/plain;charset=utf-8, ${encodeURIComponent(grids.curr.toString())}`;
	downloadHelper(sketchName, "txt", href);
};
const downloadIno = () => {
	const fileName = sketchName.replace(/\s+/g, "-").toLowerCase().substring(0, 8);
	const gridDataStr = grids.curr.toString().slice(1, -1);
	const addFileContent = `#include <avr/pgmspace.h>\n#include <SPI.h>\n #include <SD.h>\nFile f;\nconst byte IMG[] PROGMEM = {${gridDataStr}};\nvoid setup() {\n\tSerial.begin(9600);\n\twhile (!Serial) { ; }\n\tif (!SD.begin(10)) { while (1); }\n\tif (SD.exists("${fileName}.txt")) { Serial.println("File already exists."); }\n\telse {\n\t\tf = SD.open("${fileName}.txt", FILE_WRITE);\n\t\tif (f) {\n\t\t\tfor (int i = 0; i < 768; i++) { f.write(pgm_read_byte(&IMG[i])); }\n\t\t\tf.close();\n\t\t}\n\t}\n}\nvoid loop() {}`;
	const showFileContent = `#include <SPI.h>\n#include <SD.h>\n#include "FastLED.h"\n#define NUM_LEDS 256\n#define DATA_PIN 9\nCRGB leds[NUM_LEDS];\nFile f;\nString fileName;\nlong color;\nvoid setup() {\n\tFastLED.addLeds<NEOPIXEL,DATA_PIN>(leds, NUM_LEDS);\n\tFastLED.setBrightness(12);\n\tSerial.begin(9600);\n\twhile (!Serial) { ; }\n\tif (!SD.begin(10)) { while(1); }\n\tf = SD.open("${fileName}.txt");\n\tif (f) {\n\t\tfor (size_t i = 0; i < NUM_LEDS; i++) {\n\t\t\tcolor = 0;\n\t\t\tcolor += currFile.read();\n\t\t\tcolor <<= 8;\n\t\t\tcolor += currFile.read();\n\t\t\tcolor <<= 8;\n\t\t\tcolor += currFile.read();\n\t\t\tleds[i] = color;\n\t\t}\n\t\tf.close();\n\t}\n\tFastLED.show();\n}\nvoid loop() {}`;
	
	const zip = JSZip();
	const zipFolder = zip.folder(fileName);
	zipFolder.folder(`add-${fileName}`).file(`add-${fileName}.ino`, addFileContent);
	zipFolder.folder(`show-${fileName}`).file(`show-${fileName}.ino`, showFileContent);
	
	let zipFile = null;
	zip.generateAsync({type: "base64"}).then(content => {
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
		} else if (e.key === "ArrowLeft") {
			drawMode--;
			if (drawMode < 0) drawMode = drawModeButtons.length - 1;
			updateDrawModeButtons();
		} else if (e.key === "ArrowRight") {
			drawMode++;
			if (drawMode >= drawModeButtons.length) drawMode = 0;
			updateDrawModeButtons();
		}
	} else if (e.key === "ArrowRight") {
		translateRight();
	} else if (e.key === "ArrowLeft") {
		translateLeft();
	} else if (e.key === "ArrowUp") {
		translateUp();
	} else if (e.key === "ArrowDown") {
		translateDown();
	} else if (e.key === "f") {
		fillGrid();
	} else if (e.key === "c") {
		clearGrid();
	}
};


document.onkeydown = handleKeyDown;
document.onmouseup = e => {
	pressedCell = null;
};





const MAX_FRAMES_SHOWN = 8;
const FRAME_PIXEL_DILATION = 4;

for (let i = 0; i < MAX_FRAMES_SHOWN; i++) {
	const frameCanvas = document.createElement("canvas");
	frameCanvas.classList.add("frame-item");
	frameCanvas.width = 4 * N;
	frameCanvas.height = 4 * N;
	frameCanvas.id = `frame-${i}`;

	/*const ctx = frameCanvas.getContext("2d");
	const pixelWidth = N * FRAME_PIXEL_DILATION;
	ctx.beginPath();
	ctx.rect(0, 0, pixelWidth, pixelWidth);
	ctx.fillStyle = "gray";
	ctx.fill();*/
	frames.appendChild(frameCanvas);
}

const GridArray = class {
	#size;

	#ptr;
	#offset;

	#arr;

	#times;
	#clipboard;

	constructor(size) {
		this.#size = size;
		this.#ptr = -1;
		this.#offset = 0;
		this.#arr = [];
		this.#times = [];
		this.#clipboard = null;
	}

	get ptr() {
		return this.#ptr;
	}
	get curr() {
		return this.#arr[this.#ptr] ?? null;
	}
	get length() {
		return this.#arr.length;
	}
	get currCanvas() {
		return frames.querySelector(`#frame-${this.#ptr - this.#offset}`);
	}

	addFrame() {
		this.#arr.splice(this.#ptr, 0, new Grid(this.#size));
		this.#ptr++;
	}
	removeFrame() {
		this.#arr = this.#arr.splice(this.#ptr, 1);
		if (this.#ptr === this.length) this.#ptr--;
		if (this.length <= 0) this.#ptr = -1;
	}
	copyFrame(idx) {
		if (idx >= 0 && idx < this.length) this.#clipboard = this.#arr[idx].toString();
	}
	pasteFrame(idx) {
		if (idx >= 0 && idx < this.length) this.#arr[idx].fromString(this.#clipboard);
	}
	prevFrame() {
		if (this.#ptr > 0) this.#ptr--;
	}
	nextFrame() {
		if (this.#ptr < this.length - 1) this.#ptr++;
	}
	select(idx) {
		if (idx >= 0 && idx < this.length) this.#ptr = idx;
	}

	drawFrames() {
		for (let canvasIdx = 0; canvasIdx < MAX_FRAMES_SHOWN; canvasIdx++) {
			const canvas = frames.querySelector(`#frame-${canvasIdx}`);
			const idx = canvasIdx + this.#offset;
			if (idx < this.length) {
				this.#arr[idx].drawFrame(canvas);
				canvas.classList.remove("curr");
				if (idx === this.#ptr) {
					canvas.classList.add("curr");
				}
			} else {
				this.drawNullFrame(canvas);
			}
		}
	}

	drawCurr() {
		this.curr.drawFrame(this.currCanvas);
	}

	drawNullFrame(canvas) {
		const ctx = canvas.getContext("2d");
		const pixelWidth = this.#size * FRAME_PIXEL_DILATION;

		ctx.beginPath();
		ctx.rect(0, 0, pixelWidth, pixelWidth);
		ctx.fillStyle = "gray";
		ctx.fill();
	}
};

const drawGridToCanvas = canvas => {
	const ctx = canvas.getContext("2d");
	const pixelWidth = N * FRAME_PIXEL_DILATION;
	const imgData = ctx.createImageData(pixelWidth, pixelWidth);

	for (let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
			const [r, g, b] = grids.curr.at(i, j).rgb;
			for (let byteI = i * FRAME_PIXEL_DILATION; byteI < (i + 1) * FRAME_PIXEL_DILATION; byteI++) {
				for (let byteJ = j * (FRAME_PIXEL_DILATION * 4); byteJ < (j + 1) * (FRAME_PIXEL_DILATION * 4); byteJ += 4) {
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


const addFrame = () => {
	grids.addFrame();
	grids.drawFrames();
};
const removeFrame = () => {
	grids.removeFrame();
	grids.drawFrames();
};
const copyFrame = () => {
	grids.copyFrame();
};
const pasteFrame = () => {
};
const prevFrame = () => {

};
const nextFrame = () => {

};






let grids = new GridArray(N);
addFrame();





