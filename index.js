var r;

var toggle, canvas;

var hideButton;

var dotsPerRow, dotsPerCol;

var currGridRows, currGridCols;
var prevGridRows, prevGridCols;

var size;

var currColRatio, currRowRatio;
var prevColRatio, prevRowRatio;

var currColSpaceRatio, currRowSpaceRatio;
var prevColSpaceRatio, prevRowSpaceRatio;

var currColSpaceMargins, currRowSpaceMargins;
var prevColSpaceMargins, prevRowSpaceMargins;

var currColSpaceBetween, currRowSpaceBetween;
var prevColSpaceBetween, prevRowSpaceBetween;

var currDotRadius, prevDotRadius;
var currGridPadding, prevGridPadding;

var screenOrientation;

var dotRatio;
var dotSpaceRatio;

var width, height;

var initialSize = dotRadius();

var sizeAnim, spacingAnim;
var doit;

var svg;

init();
draw();

function init() {
  toggle = document.getElementById("toggle-dots");
  canvas = document.getElementById("dots");
  screenOrientation = window.orientation;
  r = document.querySelector(":root");
  updateWindowDimensions();
  createSVG();
  setSizes();
  setPrevValues();
  initAnimations();
  setInitialState();
}

function initAnimations() {
  sizeAnim = anime({
    targets: ".dot circle",
    r: [prevDotRadius, currDotRadius],
    duration: 500,
    easing: "easeInOutExpo",
    autoplay: false,
  });

  //animate dot spacing change
  spacingAnim = anime({
    targets: "#dots",
    gridTemplateRows: [prevGridRows, currGridRows],
    gridTemplateColumns: [prevGridCols, currGridCols],
    rowGap: [prevRowSpaceBetween, currRowSpaceBetween],
    columnGap: [prevColSpaceBetween, currColSpaceBetween],
    padding: [prevGridPadding, currGridPadding],
    duration: 500,
    autoplay: false,
    easing: "easeInOutExpo",
    changeComplete: setPrevValues(),
  });
}

function updateWindowDimensions() {
  width = window.innerWidth;
  height = window.innerHeight;
  if (width > height) {
    dotsPerRow = 5;
    dotsPerCol = 3;
    return;
  }
  if (width > 450) {
    dotsPerRow = 4;
    dotsPerCol = 5;
    return;
  }
  dotsPerRow = 3;
  dotsPerCol = 5;
}

function divideIntoNSpaces(length, spaces, ratio) {
  var value = length * ratio;
  return value / spaces;
}

toggle.onclick = function () {
  if (dots.style.display === "none") {
    dots.style.display = "grid";
  } else {
    dots.style.display = "none";
  }
};

window.addEventListener("resize", () => {
  clearTimeout(doit);
  doit = setTimeout(updateScreen, 500);
});

function updateScreen() {
  updateWindowDimensions();
  if (width > height) {
    decreaseDots();
  } else {
    if (width > 450) {
      increaseDots();
    } else {
      decreaseDots();
    }
  }
  setSizes();
  initAnimations();
  spacingAnim.restart();
  sizeAnim.restart();
}

function dotRadius() {
  var widthRatio, heightRatio, value;
  //desktop
  if (width > height) {
    dotRatio = 0.6;
    dotSpaceRatio = 1 - dotRatio;
    widthRatio = divideIntoNSpaces(width, dotsPerRow, dotRatio);
    heightRatio = divideIntoNSpaces(height, dotsPerCol, dotRatio);
    value = Math.min(Math.min(widthRatio, heightRatio));
    return (value / 2).toFixed();
  }

  //tablet/mobile
  if (width > 450) {
    //iPad Portrait mode
    dotRatio = 0.55;
    dotSpaceRatio = 1 - dotRatio;
    widthRatio = divideIntoNSpaces(width, dotsPerRow, dotRatio);
    heightRatio = divideIntoNSpaces(height, dotsPerCol, dotRatio);
    value = Math.min(Math.min(widthRatio, heightRatio));
    console.log("iPad");
    return (value / 2).toFixed();
  } else if (width > 400) {
    //IPhone Pro Max Portrait mode
    dotRatio = 0.6;
    dotSpaceRatio = 1 - dotRatio;
  } else {
    //iPhone & iPhone mini
    dotRatio = 0.55;
    dotSpaceRatio = 1 - dotRatio;
  }

  widthRatio = divideIntoNSpaces(width, dotsPerRow, dotRatio);
  heightRatio = divideIntoNSpaces(height, dotsPerCol, dotRatio);
  value = Math.min(Math.min(widthRatio, heightRatio));

  return (value / 2).toFixed();
}

function setDotRadius() {
  currDotRadius = dotRadius() - 1;
}

function createSVG() {
  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.innerHTML =
    "<circle cx=" +
    "50%" +
    " cy=" +
    "50%" +
    " r=" +
    (dotRadius() - 1) +
    " fill=#1c1919 class=circle/>";
  svg.classList.add("dot");
}

function draw() {
  if (width < height && width > 450) {
    cloneDots(20);
  } else {
    cloneDots(15);
  }
}

function cloneDots(num) {
  for (i = 0; i < num; i++) {
    var clone = svg.cloneNode(true);
    clone.setAttribute("id", "n-" + i);
    clone.style.placeSelf = "center";
    document.getElementById("dots").appendChild(clone);
  }
}

function increaseDots() {
  var obj = document.getElementsByClassName("dot");
  if (obj.length > 15) {
    return;
  }
  for (i = 15; i < 20; i++) {
    var clone = svg.cloneNode(true);
    clone.setAttribute("id", "n-" + i);
    clone.style.placeSelf = "center";
    document.getElementById("dots").appendChild(clone);
  }
}

function decreaseDots() {
  var obj = document.getElementsByClassName("dot");
  if (obj.length <= 15) {
    return;
  }
  for (i = 15; i < 20; i++) {
    var dot = document.getElementById("n-" + i);
    dot.remove();
  }
}

function setPrevValues() {
  prevColRatio = currColRatio;
  prevRowRatio = currRowRatio;
  prevColSpaceRatio = currColSpaceRatio;
  prevRowSpaceRatio = currRowSpaceRatio;
  prevColSpaceMargins = currColSpaceMargins;
  prevRowSpaceMargins = currRowSpaceMargins;
  prevRowSpaceBetween = currRowSpaceBetween;
  prevColSpaceBetween = currColSpaceBetween;
  prevGridRows = currGridRows;
  prevGridCols = currGridCols;
  prevDotRadius = currDotRadius;
  prevGridPadding = currGridPadding;
}

function setInitialState() {
  r.style.setProperty(
    "--gridPadding",
    `${currRowSpaceMargins}px ${currColSpaceMargins}px `
  );
  r.style.setProperty(
    "--gridGap",
    `${currRowSpaceBetween}px ${currColSpaceBetween}px`
  );
  r.style.setProperty("--gridRows", currGridRows);
  r.style.setProperty("--gridCols", currGridCols);
}

function setSizes() {
  setDotRadius();
  currColRatio = divideIntoNSpaces(width, dotsPerRow, dotRatio);
  currRowRatio = divideIntoNSpaces(height, dotsPerCol, dotRatio);

  currColSpaceRatio = divideIntoNSpaces(width, dotsPerRow + 1, dotSpaceRatio);
  currRowSpaceRatio = divideIntoNSpaces(height, dotsPerCol + 1, dotSpaceRatio);

  currColSpaceMargins = currColSpaceRatio / 2;
  currColSpaceBetween = (currColSpaceRatio * dotsPerRow) / (dotsPerRow - 1);

  currRowSpaceMargins = currRowSpaceRatio / 2;
  currRowSpaceBetween = (currRowSpaceRatio * dotsPerCol) / (dotsPerCol - 1);

  currGridRows = "";
  currGridCols = "";

  for (i = 0; i < dotsPerCol; i++) {
    currGridRows += `${currRowRatio}px `;
  }
  for (i = 0; i < dotsPerRow; i++) {
    currGridCols += `${currColRatio}px `;
  }

  currGridPadding = ` ${currRowSpaceMargins}px ${currColSpaceMargins}px`;
}
