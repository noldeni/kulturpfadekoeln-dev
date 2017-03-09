var map, featureList, boroughSearch = [], markerSearch = [];
var sidebarState;

function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  if (sidebarState == 0)
    animateSidebar();
  else {
    if (document.getElementById('features').style.display == 'block')
      animateSidebar();
    else {
      toggle_visibility('features', 'block');
      toggle_visibility('text', 'none');
    }
  }
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  if (sidebarState == 0)
    animateSidebar();
  else {
    if (document.getElementById('features').style.display == 'block')
      animateSidebar();
    else {
      toggle_visibility('features', 'block');
      toggle_visibility('text', 'none');
    }
  }
  return false;
});

$("#sidebar-hide-btn").click(function() {
  // fix this
  animateSidebar();
  return false;
});

function animateSidebar() {
  sidebarState = ~ sidebarState;
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function toggle_visibility(id, display='') {
   var e = document.getElementById(id);
   if (display == '')
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
   else
     e.style.display = display;
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markers.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();  
  /* Loop through markers layer and add only features which are in the map bounds */
  markers.eachLayer(function (layer) {
    if (map.hasLayer(markerLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td class="feature-name">' + layer.feature.properties.search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var mapnik = L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
              attribution: '<h4>Beitragende</h4><a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a target="_blank" href="https://commons.wikimedia.org">Wikimedia Commons</a>, <a target="_blank" href="http://www.offenedaten-koeln.de/">Offene Daten Köln</a>, <a target="_blank" href="https://github.com/bmcbride/bootleaf">Bootleaf</a>, <a target="_blank" href="http://leafletjs.com/">Leaflet</a>, <a target="_blank" href="http://getbootstrap.com/">Bootstrap 3</a>, <a target="_blank" href="http://twitter.github.io/typeahead.js/">typeahead.js</a>, <a target="_blank" href="http://www.walterzorn.de/tooltip/tooltip.htm">wz_tooltip</a>'
          });

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  radius: 8,
  color: "#000000",
  fill: false,
  weight: 3,
  opacity: 1,
};

var boroughs = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#000000",
      fill: false,
      weight: 2,
      opacity: 0.7,
      clickable: false
      
    };
  },
  onEachFeature: function (feature, layer) {
    boroughSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Boroughs",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/boroughs.geojson", function (data) {
  boroughs.addData(data);
});

var tracks = L.geoJson(null, {
  style: function (feature) {
      return {
        color: feature.properties.color,
        weight: 3,
        opacity: 1,
        clickable: false
      };
  },
  onEachFeature: function (feature, layer) {
  }
});
$.getJSON("data/tracks.geojson", function (data) {
  tracks.addData(data);
});

var testTracksFile = getQueryVariable("tracks");
if (testTracksFile.length > 0) {
    $.getJSON(testTracksFile, function (data) {
      tracks.addData(data);
    });
}

var buildings = L.geoJson(null, {
  style: function (feature) {
      return {
        color: feature.properties.color,
        weight: 3,
        opacity: 0.8,
        clickable: false
      };
  },
  onEachFeature: function (feature, layer) {
  }
});
$.getJSON("data/buildings.geojson", function (data) {
  buildings.addData(data);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove markers to markerClusters layer */
var markerLayer = L.geoJson(null);
var markers = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
        radius: 8,
        fillColor: feature.properties.color,
        color: "#000",
        weight: 0,
        opacity: 1,
        fillOpacity: 0.8
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = feature.properties.description;
      if (feature.properties && feature.properties.notes) {
        content += "<br/><br/><i>Hinweise der Redaktion</i>:<br/>";
        content += feature.properties.notes;
      }
      if (feature.properties && feature.properties.wiki) {
        content += "<br/><br/><i>Weitere Informationen</i>:<br/><ul>";
        content += "<li><a target=\"new\" href=\"" + feature.properties.wiki + "\">Wikipedia</a></li>";
        content += "</ul>";
      }
      var title = "<b>" + feature.properties.title1 + "</b> - " + feature.properties.title2;

      layer.on({
        click: function (e) {
          $("#text-title").html(title);
          $("#text-body").html(content);
          toggle_visibility('features', 'none');
          toggle_visibility('text', 'block');
          if (sidebarState == 0)
            animateSidebar();
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        },
        mouseover: function (e, feature) {
          Tip(title);
        },
        mouseout: function (e) {
          UnTip();
        }
      });
      
      layer.on({
      
    });
      
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><td class="feature-name">' + layer.feature.properties.search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      markerSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADDRESS1,
        source: "Markers",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/markers.geojson", function (data) {
  markers.addData(data);
  map.addLayer(markerLayer);
});

var testMarkersFile = getQueryVariable("markers");
if (testMarkersFile.length > 0) {
    $.getJSON(testMarkersFile, function (data) {
      markers.addData(data);
    });
}


map = L.map("map", {
  layers: [mapnik, tracks, buildings, highlight, markers],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */

map.on("overlayadd", function(e) {
  if (e.layer === markerLayer) {
    markerClusters.addLayer(markers);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === markerLayer) {
    markerClusters.removeLayer(markers);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Entwickelt von <a target=\"new\" href='http://codefor.de/koeln/'>OK Lab Köln</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Beitragende</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: true,
  strings: {
    title: "Wo bin ich?",
    popup: "Du befindest dich {distance} {unit} um diesen Punkt.",
    outsideMapBoundsMsg: "Du befindest dich anscheinend außerhalb der Karte"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
  sidebarState = 0;
} else {
  var isCollapsed = false;
  sidebarState = -1;
}

var baseLayers = {
  "mapnik": mapnik
};

var groupedOverlays = {
  "Stadtgebiet": {
    "Stadtbezirke": boroughs,
  },
  "Kulturpfade": {
    "Routen": tracks,
    "Gebäude": buildings
  }
};

var layerControl = L.control.groupedLayers({}, groupedOverlays, {
  collapsed: true // isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to boroughs bounds */
  map.fitBounds(boroughs.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var boroughsBH = new Bloodhound({
    name: "Boroughs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: boroughSearch,
    limit: 10
  });

  var markersBH = new Bloodhound({
    name: "Markers",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: markerSearch,
    limit: 10
  });

  boroughsBH.initialize();
  markersBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Stadtbezirke",
    displayKey: "name",
    source: boroughsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Stadtbezirke</h4>"
    }
  }, {
    name: "Markers",
    displayKey: "name",
    source: markersBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/marker.png' width='24' height='28'>&nbsp;Infotafeln</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Boroughs") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Markers") {
      if (!map.hasLayer(markerLayer)) {
        map.addLayer(markerLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});


// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

