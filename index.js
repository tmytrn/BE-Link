var r;

var toggle, canvas;

var hideButton;

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

var isMobileDevice =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

init();
setSizes();
draw();

function init() {
  toggle = document.getElementById("toggle-dots");
  canvas = document.getElementById("dots");
  screenOrientation = window.orientation;
  r = document.querySelector(":root");
  updateWindowDimensions();
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

function isPortrait() {
  return (
    window.orientation == 0 ||
    window.orientation == 180 ||
    screen.orientation == "portrait-secondary" ||
    screen.orientation == "portrait-primary"
  );
}

function updateWindowDimensions() {
  width = window.innerWidth;
  height = window.innerHeight;
}

function divideIntoNSpaces(length, spaces, ratio) {
  var value = length * ratio;
  return (value / spaces).toFixed();
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
  setSizes();
  initAnimations();
  spacingAnim.restart();
  sizeAnim.restart();
}

function dotRadius() {
  if (width < height) {
    if (width > 450) {
      //iPad Portrait mode
      dotRatio = 0.7;
    } else if (width > 400) {
      //IPhone Pro Max Portrait mode
      dotRatio = 0.6;
    } else {
      //iPhone & iPhone mini
      dotRatio = 0.45;
    }
    dotSpaceRatio = 1 - dotRatio;
    var widthRatio = divideIntoNSpaces(width, 3, dotRatio);
    var heightRatio = divideIntoNSpaces(height, 5, dotRatio);
  } else {
    dotRatio = 0.6;
    dotSpaceRatio = 1 - dotRatio;
    var widthRatio = divideIntoNSpaces(width, 5, dotRatio);
    var heightRatio = divideIntoNSpaces(height, 3, dotRatio);
  }

  var value = Math.min(Math.min(widthRatio, heightRatio));

  return (value / 2).toFixed();
}

function setDotRadius() {
  currDotRadius = dotRadius() - 1;
}

function draw() {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.innerHTML =
    "<circle cx=" +
    "50%" +
    " cy=" +
    "50%" +
    " r=" +
    (dotRadius() - 1) +
    " fill=#1c1919 class=circle/>";

  svg.classList.add("dot");

  anim = document.querySelector("animate");

  for (i = 0; i < 15; i++) {
    var clone = svg.cloneNode(true);
    clone.style.placeSelf = "center";
    document.getElementById("dots").appendChild(clone);
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
  if (width <= height) {
    currColRatio = divideIntoNSpaces(width, 3, dotRatio);
    currRowRatio = divideIntoNSpaces(height, 5, dotRatio);

    currColSpaceRatio = divideIntoNSpaces(width, 4, dotSpaceRatio);
    currRowSpaceRatio = divideIntoNSpaces(height, 6, dotSpaceRatio);

    currColSpaceMargins = divideIntoNSpaces(currColSpaceRatio * 4, 2, 0.25);
    currColSpaceBetween = divideIntoNSpaces(currColSpaceRatio * 4, 2, 0.75);

    currRowSpaceMargins = divideIntoNSpaces(currRowSpaceRatio, 2, 1);
    currRowSpaceBetween = divideIntoNSpaces(currRowSpaceRatio * 5, 4, 1);

    currGridRows = `${currRowRatio}px ${currRowRatio}px ${currRowRatio}px ${currRowRatio}px ${currRowRatio}px`;
    currGridCols = `${currColRatio}px ${currColRatio}px ${currColRatio}px`;
  } else {
    currColRatio = divideIntoNSpaces(width, 5, dotRatio);
    currRowRatio = divideIntoNSpaces(height, 3, dotRatio);

    currColSpaceRatio = divideIntoNSpaces(width, 6, dotSpaceRatio);
    currRowSpaceRatio = divideIntoNSpaces(height, 4, dotSpaceRatio);

    currColSpaceMargins = divideIntoNSpaces(currColSpaceRatio, 2, 1);
    currColSpaceBetween = divideIntoNSpaces(currColSpaceRatio * 5, 4, 1);
    currRowSpaceMargins = divideIntoNSpaces(currRowSpaceRatio * 4, 2, 0.25);
    currRowSpaceBetween = divideIntoNSpaces(currRowSpaceRatio * 4, 2, 0.75);

    currGridRows = `${currRowRatio}px ${currRowRatio}px ${currRowRatio}px  `;
    currGridCols = `${currColRatio}px ${currColRatio}px ${currColRatio}px ${currColRatio}px ${currColRatio}px `;
  }
  currGridPadding = ` ${currRowSpaceMargins}px ${currColSpaceMargins}px`;
}
