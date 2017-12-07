(function() {
  "use strict";

  var config = {
    home: "/kifisome/share",
    icons: "some.svg",
    style: "css/kifisome.css",
    buttons: [],
    services: {
      facebook: "https://www.facebook.com/sharer.php?u={mypage}",
      twitter: "https://twitter.com/intent/tweet?url={mypage}"
    }
  };

  function load_css(url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;

    document.head.appendChild(link);
  }

  function load_svg(url, callback) {
    var request = new XMLHttpRequest;
    request.addEventListener("load", function() {
      var parser = new DOMParser;
      var svg = parser.parseFromString(this.responseText, "image/svg+xml");

      callback(svg);
    });

    request.open("GET", url);
    request.send();
  }

  function extract_icon(svg, icon_id) {
    var xlink = document.createElementNS("http://www.w3.org/2000/svg", "use");
    xlink.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + icon_id);

    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.appendChild(svg.getElementById(icon_id));
    icon.appendChild(xlink);

    return icon;
  }

  function merge_config(target, another) {
    Object.keys(another).forEach(function(key) {
      if (another.hasOwnProperty(key)) {
        target[key] = another[key];
      }
    });
  }

  function on_share(event) {
    var shared_page = window.location;
    var service = event.currentTarget.dataset.id;

    popup_share(service, shared_page);
  }

  function call_home(service_id, shared_url) {
    var query = [
      's=' + encodeURIComponent(service_id),
      'u=' + encodeURIComponent(shared_url),
    ];

    var url = config.home + "?" + query.join("&");

    var request = new XMLHttpRequest;
    request.open("POST", url);
    request.send();
  }

  function popup_share(service_id, shared_page) {
    var target_url = config.services[service_id].replace("{mypage}", shared_page);
    var features = "center=1,width=650,height=400,toolbar=0";
    var popup = window.open(target_url, "kifisome_share", features);

    setTimeout(function() {
      if (!popup.closed) {
        call_home(service_id, shared_page);
      }
    }, 5000);
  }

  function to_absolute_url(path, config) {
    if (path.indexOf("://") != -1) {
      return path;
    } else if (path[0] == "/") {
      return config.root + path;
    } else {
      return config.basedir + "/" + path;
    }
  }

  function init_config(config, script) {
    if (script.dataset.home) {
      config.home = script.dataset.home;
    }

    if ("buttons" in script.dataset && script.dataset.buttons.trim()) {
      config.buttons = script.dataset.buttons.trim().split(/\s+/);
    }

    if (config.buttons.length == 0) {
      config.buttons = Object.keys(config.services);
    }

    config.basedir = script.src.substr(0, script.src.lastIndexOf("/"));
    config.root = script.src.substr(0, script.src.indexOf("://") + 3) + script.src.split("/")[2];

    config.icons = script.dataset.icons || to_absolute_url(config.icons, config);
    config.style = script.dataset.style || to_absolute_url(config.style, config);
    config.home = script.dataset.home || to_absolute_url(config.home, config);
  }

  // Enable only on modern enough browsers.
  if ("currentScript" in document) {
    var script = document.currentScript;

    init_config(config, script);
    load_css(config.style);

    /*
     * It is forbidden to embed SVG from external URLs, so we have to load it using AJAX and
     * inline the SVG object.
     */
    load_svg(config.icons, function(svg) {
      var some = document.createElement("div");
      some.className = "kifisome";
      some.setAttribute("aria-hidden", "true");

      config.buttons.forEach(function(sid) {
        var button = document.createElement("a");
        button.role = "button";
        button.className = "ks-icon " + sid;
        button.dataset.id = sid;
        button.addEventListener("click", on_share);

        button.appendChild(extract_icon(svg, sid));
        some.appendChild(button);
      });

      if (script.dataset.id) {
        some.id = script.dataset.id;
      }

      if (script.dataset.class) {
        some.className += " ";
        some.className += script.dataset.class;
      }

      var target = document.body;

      if (script.dataset.target) {
        var target_id = script.dataset.target.substring(1);
        target = document.getElementById(target_id);
      }

      if (script.dataset.title) {
        var title = document.createElement("span");
        title.className = "ks-title";
        title.innerText = script.dataset.title;
        some.insertBefore(title, some.firstChild);
      }

      target.appendChild(some);
    });
  }
}());
