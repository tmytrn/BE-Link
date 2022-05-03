var r;

var toggle, canvas, sizeSlider, spacingSlider;

var hideButton;

var gridRows, gridColumns;

var radius, gap, size;

var colRatio, rowRatio, colSpaceRatio;

var screenOrientation;

var throttled = false;

var delay = 10;

var dotRatio = 0.5;
var dotSpaceRatio = 1 - dotRatio;

var initialWidth = window.innerWidth;

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
}

function isPortrait() {
  return (
    window.orientation == 0 ||
    window.orientation == 180 ||
    screen.orientation == "portrait-secondary" ||
    screen.orientation == "portrait-primary"
  );
}

function setSizes() {
  setDotRadius(dotRadius());
  console.log("isPortrait", isPortrait());
  if (window.innerWidth <= 600 || isPortrait()) {
    colRatio = divideIntoNSpaces(window.innerWidth, 3, dotRatio);
    rowRatio = divideIntoNSpaces(window.innerHeight, 5, dotRatio);
    colSpaceRatio = divideIntoNSpaces(window.innerWidth, 4, dotSpaceRatio);
    rowSpaceRatio = divideIntoNSpaces(window.innerHeight, 6, dotSpaceRatio);

    gridRows = `${rowRatio}px ${rowRatio}px ${rowRatio}px ${rowRatio}px ${rowRatio}px`;
    gridColumns = `${colRatio}px ${colRatio}px ${colRatio}px`;
  } else {
    colRatio = divideIntoNSpaces(window.innerWidth, 5, dotRatio);
    rowRatio = divideIntoNSpaces(window.innerHeight, 3, dotRatio);
    colSpaceRatio = divideIntoNSpaces(window.innerWidth, 6, dotSpaceRatio);
    rowSpaceRatio = divideIntoNSpaces(window.innerHeight, 4, dotSpaceRatio);
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
  return (value / spaces).toFixed();
}

// toggle.onclick = function () {
//   if (dots.style.display === "none") {
//     dots.style.display = "grid";
//   } else {
//     dots.style.display = "none";
//   }
// };

window.addEventListener("resize", () => {
  if (!throttled) {
    //actual callback action
    if (isMobileDevice) {
      //dont move when address bar stuff moves
      if (window.innerWidth != initialWidth) {
        setSizes();
        initialWidth = window.innerWidth;
      }
      return;
    }

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
  if (window.innerWidth <= 600) {
    var widthRatio = divideIntoNSpaces(window.innerWidth, 3, dotRatio);
    var heightRatio = divideIntoNSpaces(window.innerHeight, 5, dotRatio);
  } else {
    var widthRatio = divideIntoNSpaces(window.innerWidth, 5, dotRatio);
    var heightRatio = divideIntoNSpaces(window.innerHeight, 3, dotRatio);
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
