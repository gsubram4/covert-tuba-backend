var Button = function(title, callback, options) {
  var color;
  var btn = document.createElement("button");
  btn.style.border = "0px solid transparent";
  btn.style.borderRadius = ".25rem";
  btn.style.outline = "none";
  btn.style.margin = "0 5px";
  btn.onclick = callback;
  btn.innerText = title;
  applyStyle(btn, TextStyle);
  
  // Hover Options
  if (options && options.hover) {
    btn.onmouseover = function() {
      color = btn.style.backgroundColor;
      btn.style.backgroundColor = options.hover;
    }
    btn.onmouseout = function() {
      btn.style.backgroundColor = color;
    }
  }
  
  return btn;
}

var ShareLink = function(url) {
  var container = document.createElement("div");
  
  var input = document.createElement("input");
  input.value = url;
  var copy = new Button("Copy invite", function() {
    input.select();
    document.execCommand("copy");
  });
  
  container.appendChild(input);
  container.appendChild(copy);
  
  return {
    element: container,
    api: {
      updateUrl: function(url) {
        input.value = url;
      }
    }
  };
}

var Panel = function() {
  var panel = document.createElement("div");
  panel.style.backgroundColor = "white";
  panel.style.boxShadow = "0 1px 4px rgba(0,0,0,.15)";
  return panel;
  //panel.styl
}


var TextStyle = {
  fontFamily: "Consolas,monaco,\"Ubuntu Mono\",courier,monospace",
  fontWeight: 300
};

var InputStyle = {};

function applyStyle(target, style) {
  Object.assign(target.style, style);
}