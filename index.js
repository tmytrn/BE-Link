var r;

var toggle, canvas, sizeSlider, spacingSlider;

var hideButton;

var gridRows, gridColumns;

var radius, gap, size;

var colRatio, rowRatio, colSpaceRatio;

var screenOrientation;

var throttled = false;

var delay = 50;

var dotRatio;
var dotSpaceRatio;

var initialWidth, width, height;

var colSpaceMargins, rowSpaceMargins, colSpaceBetween, rowSpaceBetween;

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
  initialWidth = width;
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
  if (isMobileDevice) {
    height = screen.height - 64;
  } else {
    height = window.innerHeight;
  }
}

function setSizes() {
  setDotRadius(dotRadius());
  // console.log("isPortrait", isPortrait());
  if (width <= 600 || isPortrait()) {
    colRatio = divideIntoNSpaces(width, 3, dotRatio);
    rowRatio = divideIntoNSpaces(height, 5, dotRatio);
    colSpaceRatio = divideIntoNSpaces(width, 4, dotSpaceRatio);
    rowSpaceRatio = divideIntoNSpaces(height, 6, dotSpaceRatio);

    colSpaceMargins = divideIntoNSpaces(colSpaceRatio * 4, 2, 0.25);
    colSpaceBetween = divideIntoNSpaces(colSpaceRatio * 4, 2, 0.75);

    rowSpaceMargins = divideIntoNSpaces(rowSpaceRatio, 2, 1);
    rowSpaceBetween = divideIntoNSpaces(rowSpaceRatio * 5, 4, 1);

    gridRows = `${rowRatio}px ${rowRatio}px ${rowRatio}px ${rowRatio}px ${rowRatio}px`;
    gridColumns = `${colRatio}px ${colRatio}px ${colRatio}px`;
  } else {
    colRatio = divideIntoNSpaces(width, 5, dotRatio);
    rowRatio = divideIntoNSpaces(height, 3, dotRatio);
    colSpaceRatio = divideIntoNSpaces(width, 6, dotSpaceRatio);
    rowSpaceRatio = divideIntoNSpaces(height, 4, dotSpaceRatio);

    colSpaceMargins = divideIntoNSpaces(colSpaceRatio, 2, 1);
    colSpaceBetween = divideIntoNSpaces(colSpaceRatio * 5, 4, 1);
    rowSpaceMargins = divideIntoNSpaces(rowSpaceRatio * 4, 2, 0.25);
    rowSpaceBetween = divideIntoNSpaces(rowSpaceRatio * 4, 2, 0.75);

    // console.log("rowSpace: ", colSpaceRatio * 6);
    // console.log("rowSpaceMargin: ", colSpaceMargins * 2);
    // console.log("rowSpaceBetween", colSpaceBetween * 4);

    gridRows = `${rowRatio}px ${rowRatio}px ${rowRatio}px  `;
    gridColumns = `${colRatio}px ${colRatio}px ${colRatio}px ${colRatio}px ${colRatio}px `;
  }

  r.style.setProperty(
    "--gridPadding",
    `${rowSpaceMargins}px ${colSpaceMargins}px `
  );
  r.style.setProperty("--gridGap", `${rowSpaceBetween}px ${colSpaceBetween}px`);
  r.style.setProperty("--gridRows", gridRows);
  r.style.setProperty("--gridCols", gridColumns);
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
  if (!throttled) {
    //actual callback action
    if (isMobileDevice) {
      //dont move when address bar stuff moves
      if (width != initialWidth) {
        setSizes();
        initialWidth = width;
      }
      return;
    }
    updateWindowDimensions();

    setSizes();
    // we're throttled!
    throttled = true;
    // set a timeout to un-throttle

    setTimeout(function () {
      throttled = false;
    }, delay);
  }
});

// window.addEventListener("orientationchange", function () {
//   // Announce the new orientation number
//   console.log("orientation change");
//   // isPortrait = window.matchMedia("(orientation: portrait)").matches;
//   // console.log(
//   //   "isPortrait: ",
//   //   window.matchMedia("(orientation: portrait)").matches
//   // );
//   setSizes();
// });

function dotRadius() {
  if (width <= 600) {
    dotRatio = 0.5;
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

  size = (value / 2).toFixed();
}

function setDotRadius() {
  var circles = document.querySelectorAll("[class=circle]");
  for (i = 0; i < circles.length; i++) {
    circles[i].setAttribute("r", size - 1);
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
    (size - 1) +
    " fill=#000 class=circle />";

  svg.classList.add("dot");

  for (i = 0; i < 15; i++) {
    var clone = svg.cloneNode(true);
    clone.style.placeSelf = "center";
    document.getElementById("dots").appendChild(clone);
  }

  return null;
}
