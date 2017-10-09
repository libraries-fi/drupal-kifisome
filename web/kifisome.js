(function() {
  "use strict";

  var config = {
    home: "https://www.kirjastot.fi/kifisome/share",
    icons: "some.svg",
    style: "css/kifisome.css",
    services: {
      facebook: "https://www.facebook.com/sharer.php?u={mysite}",
      twitter: "https://twitter.com/intent/tweet?url={mysite}"
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

    call_home(service, shared_page);
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
    var target_url = config.services[service_id].replace("{mysite}", shared_page);

    var features = "center=1,width=650,height=400,toolbar=0";
    var popup = window.open(target_url, "kifisome_share", features);
  };

  function init_config(config, script) {
    if (script.dataset.home) {
      config.home = script.dataset.home;
    }

    config.basedir = script.src.substr(0, script.src.lastIndexOf("/"));

    if (config.icons.indexOf("://") == -1) {
      config.icons = config.basedir + "/" + config.icons;
    }

    if (config.style.indexOf("://") == -1) {
      config.style = config.basedir + "/" + config.style;
    }
  }

  // Enable only on modern enough browsers.
  if ("currentScript" in document) {
    var script = document.currentScript;
    var enabled = "facebook,twitter".split(",");

    init_config(config, script);
    load_css(config.style);

    /*
     * It isn't allowed to embed SVG from external URLs, so we have to load it using AJAX and
     * embed the SVG object inlined.
     */
    load_svg(config.icons, function(svg) {
      var some = document.createElement("div");
      some.className = "kifisome";
      some.setAttribute("aria-hidden", "true");

      enabled.forEach(function(sid) {
        var button = document.createElement("a");
        button.role = "button";
        button.className = "kifisome " + sid;
        button.dataset.id = sid;
        button.addEventListener("click", on_share);

        var icon = extract_icon(svg, sid);

        button.appendChild(icon);
        // icon.setAttribute("width", "64");
        // icon.setAttribute("height", "64");
        some.appendChild(button);
      });

      if (script.dataset.id) {
        some.id = script.dataset.id;
      }

      if (script.dataset.class) {
        some.className += " ";
        some.className += script.dataset.class;
      }

      if (script.dataset.target) {
        var target_id = script.dataset.target.substring(1);
        document.getElementById(target_id).appendChild(some);
      } else {
        document.body.appendChild(some);
      }
    });
  }

}());
