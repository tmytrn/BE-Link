Element.prototype.remove = function () {
  this.parentElement.removeChild(this);
};

NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
};

var toggle, canvas, sizeSlider, spacingSlider;

var gridRows, gridColumns;

var radius, gap, size;

var isPortrait;

var prevSize;

function init() {
  toggle = document.getElementById("toggle-dots");
  canvas = document.getElementById("dots");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  sizeSlider = document.getElementById("size");
  spacingSlider = document.getElementById("spacing");

  size = dotRadius();
  setDotRadius(size);

  isPortrait = window.matchMedia("(orientation: portrait)").matches;

  if (window.innerWidth <= 600 || isPortrait) {
    //mobile breakpoint
    radius = window.innerWidth / 6;
    gap = window.innerHeight / 10;

    gridRows = `${gap * 2}px ${gap * 2}px ${gap * 2}px ${gap * 2}px ${
      gap * 2
    }px `;

    gridColumns = `${radius * 2}px ${radius * 2}px ${radius * 2}px `;
  } else {
    radius = window.innerWidth / 10;
    gap = window.innerHeight / 6;

    gridRows = `${gap * 2}px ${gap * 2}px ${gap * 2}px  `;
    gridColumns = `${radius * 2}px ${radius * 2}px ${radius * 2}px ${
      radius * 2
    }px ${radius * 2}px `;
  }
}

init();
draw();

toggle.onclick = function () {
  if (dots.style.display === "none") {
    dots.style.display = "grid";
  } else {
    dots.style.display = "none";
  }
};

window.addEventListener("resize", () => {
  init();
  setGrid();
});

function dotRadius() {
  var index;

  var sizes = [36, 48, 64, 81, 128];

  if (window.innerWidth <= 600) {
    index = 0;
  } else if (window.innerWidth > 600 && window.innerWidth <= 1023) {
    index = 1;
  } else if (window.innerWidth > 1023 && window.innerWidth <= 1270) {
    index = 2;
  } else if (window.innerWidth > 1270 && window.innerWidth <= 1920) {
    index = 3;
  } else if (window.innerWidth > 1920 && window.innerWidth <= 2560) {
    index = 3;
  } else if (window.innerWidth > 2560) {
    index = 4;
  }

  return sizes[index];
}

function setDotRadius(size) {
  var dots = document.querySelectorAll("[id=dot]");
  for (i = 0; i < dots.length; i++) {
    dots[i].setAttribute("width", size * 2);
    dots[i].setAttribute("height", size * 2);
    dots[i].innerHTML =
      "<circle cx=" +
      "50%" +
      " cy=" +
      "50%" +
      " r= " +
      size +
      " fill=#000 id=circle />";
  }
}

function sizeChange() {
  var dots = document.querySelectorAll("[id=dot]");
  var circles = document.querySelectorAll("[id=circle]");
  for (i = 0; i < dots.length; i++) {
    dots[i].setAttribute("width", size * 2);
    dots[i].setAttribute("height", size * 2);
    circles[i].setAttribute("cx", size);
    circles[i].setAttribute("cy", size);
    circles[i].setAttribute("r", size);
  }
  canvas.style.gridTemplateRows = gridRows;

  canvas.style.gridTemplateColumns = gridColumns;

  document.getElementById("size-value").innerHTML = size;
}

function spaceChange() {
  canvas.style.padding = `${gap}px`;

  canvas.style.columnGap = `${gap}px`;
  canvas.style.rowGap = `${gap}px`;
  document.getElementById("spacing-value").innerHTML = gap;
}

function setGrid() {
  canvas.style.gridTemplateColumns = gridColumns;
  canvas.style.gridTemplateRows = gridRows;
}

function draw() {
  document.getElementById("size-value").innerHTML = sizeSlider.value;
  document.getElementById("spacing-value").innerHTML = spacing.value;

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.innerHTML =
    "<circle cx=" +
    "50%" +
    " cy=" +
    "50%" +
    " r= " +
    size +
    " fill=#000 id=circle />";

  svg.setAttribute("width", size * 2);
  svg.setAttribute("height", size * 2);
  svg.id = "dot";

  for (i = 0; i < 15; i++) {
    var clone = svg.cloneNode(true);
    clone.style.placeSelf = "center";
    document.getElementById("dots").appendChild(clone);
  }

  setGrid();

  return null;
}
