var r;

var toggle, canvas, sizeSlider, spacingSlider;

var hideButton;

var gridRows, gridColumns;

var radius, gap, size;

var colRatio, rowRatio, colSpaceRatio;

var isPortrait;

var throttled = false;
var delay = 100;

var dotWidthRatio = 0.5;
var dotHeightRatio = 0.5;
var dotWidthGapRatio = 1 - dotWidthRatio;
var dotHeightGapRatio = 1 - dotHeightRatio;

init();
setSizes();
draw();

function init() {
  toggle = document.getElementById("toggle-dots");
  canvas = document.getElementById("dots");
  isPortrait = window.matchMedia("(orientation: portrait)").matches;
  r = document.querySelector(":root");
}

function setSizes() {
  size = dotRadius();
  setDotRadius(size);
  if (window.innerWidth <= 600 || isPortrait) {
    colRatio = divideIntoNSpaces(window.innerWidth, 3, dotWidthRatio);
    rowRatio = divideIntoNSpaces(window.innerHeight, 5, dotHeightRatio);
    colSpaceRatio = divideIntoNSpaces(window.innerWidth, 4, dotWidthGapRatio);
    rowSpaceRatio = divideIntoNSpaces(window.innerHeight, 6, dotHeightGapRatio);

    gridRows = `${rowRatio}px ${rowRatio}px ${rowRatio}px ${rowRatio}px ${rowRatio}px`;
    gridColumns = `${colRatio}px ${colRatio}px ${colRatio}px`;
  } else {
    colRatio = divideIntoNSpaces(window.innerWidth, 5, dotWidthRatio);
    rowRatio = divideIntoNSpaces(window.innerHeight, 3, dotHeightRatio);
    colSpaceRatio = divideIntoNSpaces(window.innerWidth, 6, dotWidthGapRatio);
    rowSpaceRatio = divideIntoNSpaces(window.innerHeight, 4, dotHeightGapRatio);
    gridRows = `${rowRatio}px ${rowRatio}px ${rowRatio}px  `;
    gridColumns = `${colRatio}px ${colRatio}px ${colRatio}px ${colRatio}px ${colRatio}px `;
  }

  r.style.setProperty(
    "--gridPadding",
    `${rowSpaceRatio}px ${colSpaceRatio}px `
  );
  r.style.setProperty("--gridGap", `${rowSpaceRatio}px ${colSpaceRatio}px`);
  r.style.setProperty("--gridRows", gridRows);
  r.style.setProperty("--gridCols", gridColumns);
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
  if (!throttled) {
    //actual callback action
    setSizes();
    // we're throttled!
    throttled = true;
    // set a timeout to un-throttle
    setTimeout(function () {
      throttled = false;
    }, delay);
  }
});

function dotRadius() {
  var widthRatio = divideIntoNSpaces(window.innerWidth, 5, dotWidthRatio);
  var heightRatio = divideIntoNSpaces(window.innerHeight, 3, dotHeightRatio);
  return Math.min(widthRatio, heightRatio) / 2;
}

function setDotRadius(size) {
  var circles = document.querySelectorAll("[class=circle]");
  for (i = 0; i < circles.length; i++) {
    circles[i].setAttribute("r", size);
  }
}

function draw() {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.innerHTML =
    "<circle cx=" +
    "50%" +
    " cy=" +
    "50%" +
    " r= " +
    size +
    " fill=#000 class=circle />";

  svg.classList.add("dot");

  for (i = 0; i < 15; i++) {
    var clone = svg.cloneNode(true);
    clone.style.placeSelf = "center";
    document.getElementById("dots").appendChild(clone);
  }

  return null;
}
