// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"ZCfc":[function(require,module,exports) {
//1. ???????????????
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    eraserEnabled = false,
    pen = document.getElementById("pen"),
    eraser = document.getElementById("eraser"),
    color = document.getElementById("color"),
    thickness = document.getElementById("thickness"),
    actions = document.getElementById("actions"); //2. ??????????????????????????????

autoSetCanvasSize(canvas); //3. ??????????????????

painting(canvas);
color.addEventListener("click", changeColor);
thickness.addEventListener("click", changeThickness);
actions.addEventListener("click", function (e) {
  if (e.target.tagName === "svg") {
    takeAction(e.target.id);
  } else {
    if (e.target.tagName === "use") {
      takeAction(e.target.parentElement.id);
    } else {
      if (e.target.tagName === "LI") {
        takeAction(e.target.children[0].id);
      }
    }
  }
});
/****************************/

/* ???????????? */

function painting(canvas) {
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.lineWidth = 2;
  ctx.radius = 1;
  var isUsing = false; //??????????????????

  var previousPoint = {}; //????????????

  if (document.body.ontouchstart !== undefined) {
    //?????????
    canvas.addEventListener("touchstart", touchStart.bind(null, previousPoint));
    canvas.addEventListener("touchmove", touchMove.bind(null, previousPoint));
    canvas.addEventListener("touchcancel", touchCancel);
  } else {
    //PC???
    canvas.onmousedown = function (e) {
      isUsing = true;
      var x = e.clientX;
      var y = e.clientY;

      if (!eraserEnabled) {
        previousPoint = {
          x: x,
          y: y
        };
        drawPoint(x, y, ctx.radius);
      } else {
        ctx.clearRect(x - 5, y - 5, 10, 10);
      }
    };

    canvas.onmousemove = function (e) {
      if (isUsing) {
        var x = e.clientX;
        var y = e.clientY;
        var newPoint = {
          x: x,
          y: y
        };

        if (!eraserEnabled) {
          drawPoint(x, y, ctx.radius);
          drawLine(previousPoint.x, previousPoint.y, newPoint.x, newPoint.y);
          previousPoint = newPoint;
        } else {
          ctx.clearRect(x - 5, y - 5, 10, 10);
        }
      }
    };

    canvas.onmouseup = function () {
      isUsing = false;
    };
  }
}

function touchStart(point, e) {
  e.preventDefault();
  var x, y;

  for (var _i = 0, _a = e.changedTouches; _i < _a.length; _i++) {
    var touch = _a[_i];
    x = Math.floor(touch.clientX);
    y = Math.floor(touch.clientY);

    if (!eraserEnabled) {
      point[touch.identifier] = {
        x: x,
        y: y
      };
      drawPoint(x, y, ctx.radius);
    } else {
      ctx.clearRect(x - 5, y - 5, 10, 10);
    }
  }
}

function touchMove(originalPoint, e) {
  e.preventDefault();
  var x,
      y,
      newPoint = {};

  for (var _i = 0, _a = e.changedTouches; _i < _a.length; _i++) {
    var touch = _a[_i];
    x = Math.floor(touch.clientX);
    y = Math.floor(touch.clientY);

    if (!eraserEnabled) {
      newPoint[touch.identifier] = {
        x: x,
        y: y
      };
      drawPoint(x, y, ctx.radius); // ?????????lineWidth??????????????????

      drawLine(originalPoint[touch.identifier].x, originalPoint[touch.identifier].y, newPoint[touch.identifier].x, newPoint[touch.identifier].y);
      originalPoint[touch.identifier] = newPoint[touch.identifier];
    } else {
      ctx.clearRect(x - 8, y - 8, 16, 16);
    }
  }
}

function touchCancel() {
  alert("??????????????????????????????????????????????????????");
}
/* ??????????????? */


function changeColor(e) {
  var selectedColor = e.target.id;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  whichActived(selectedColor, "color");
}
/* ??????????????? */


function changeThickness(e) {
  var selectedThickness = e.target.id;

  if (selectedThickness === "thin") {
    ctx.lineWidth = 2;
    ctx.radius = 1;
  } else if (selectedThickness === "middle") {
    ctx.lineWidth = 6;
    ctx.radius = 3;
  } else if (selectedThickness === "thick") {
    ctx.lineWidth = 10;
    ctx.radius = 5;
  }

  whichActived(selectedThickness, "thickness");
}

function whichActived(target, parentID) {
  var parentNode;

  if (parentID === "color") {
    parentNode = color;
  } else if (parentID === "thickness") {
    parentNode = thickness;
  }

  for (var i = 0; i < parentNode.children.length; i++) {
    if (target === parentNode.children[i].id) {
      parentNode.children[i].className = "active";
    } else if (target !== parentID) {
      parentNode.children[i].className = "";
    }
  }
}
/* ????????? */


function drawPoint(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}
/* ????????????????????? */


function drawLine(x1, y1, x2, y2) {
  // ??????IOS???????????????ctx???????????????
  if (ctx.lineWidth === 1) {
    ctx.lineWidth = 2;
    ctx.radius = 1;
  }

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
/* ?????????????????? */


function takeAction(element) {
  if (element === "pen") {
    eraserEnabled = false;
    pen.classList.add("active");
    eraser.classList.remove("active");
    color.className = "active";
    thickness.className = "active";
  } else if (element === "eraser") {
    eraserEnabled = true;
    pen.classList.remove("active");
    eraser.classList.add("active");
    color.className = "remove";
    thickness.className = "remove";
  } else if (element === "clearall") {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //??????

    eraserEnabled = false;
    pen.classList.add("active");
    eraser.classList.remove("active");
    color.className = "active";
    thickness.className = "active";
  } else if (element === "save") {
    var a = document.createElement("a");
    a.href = canvas.toDataURL(); //??????????????????

    a.target = "_blank";
    a.download = "image.png";
    a.click();
  }
}
/* ???????????????????????? */


function autoSetCanvasSize(canvas) {
  setCanvasSize(canvas);

  window.onresize = function () {
    setCanvasSize(canvas);
  }; //??????????????????


  function setCanvasSize(canvas) {
    var pageWidth = document.documentElement.clientWidth;
    var pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
  }
}
},{}]},{},["ZCfc"], null)
//# sourceMappingURL=main.b8adaea3.js.map