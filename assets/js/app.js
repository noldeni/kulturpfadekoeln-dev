var map, featureList, boroughSearch = [], markerSearch = [];

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

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
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
              attribution: '<h4>Beitragende</h4><a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a target="_blank" href="https://commons.wikimedia.org">Wikimedia Commons</a>, <a target="_blank" href="http://www.offenedaten-koeln.de/">Offene Daten Köln</a>, <a target="_blank" href="https://github.com/bmcbride/bootleaf">Bootleaf</a>, <a target="_blank" href="http://leafletjs.com/">Leaflet</a>, <a target="_blank" href="http://getbootstrap.com/">Bootstrap 3</a>, <a target="_blank" href="http://twitter.github.io/typeahead.js/">typeahead.js</a>'
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
    /*
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Line);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({  
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        tracks.resetStyle(e.target);
      }
    });
    */
  }
});
$.getJSON("data/tracks.geojson", function (data) {
  tracks.addData(data);
});

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
    /*
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Line);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        buildings.resetStyle(e.target);
      }
    });
    */
  }
});
$.getJSON("data/buildings.geojson", function (data) {
  buildings.addData(data);
});

/* Single marker cluster layer to hold all clusters */
/*
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});
*/

/* Empty layer placeholder to add to layer control for listening when to add/remove markers to markerClusters layer */
var markerLayer = L.geoJson(null);
var markers = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    /*
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/marker.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
    */
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

      layer.on({
        click: function (e) {
          $("#feature-title").html("<b>" + feature.properties.title1 + "</b> - " + feature.properties.title2);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
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

map = L.map("map", {
  //zoom: 10,
  //center: [40.702222, -73.979378],
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
} else {
  var isCollapsed = false;
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

