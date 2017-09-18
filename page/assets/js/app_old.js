/* -------------------------------------------------------------------*/
/* global variables ------------------------------------------------- */

var map, featureList, markerSearch2 = [];


/* -------------------------------------------------------------------*/
/* general helper methods ------------------------------------------- */

function toggleVisibility(id, show) {
   var e = document.getElementById(id);
   if (typeof e === 'undefined') {
       if(e.style.display == 'block')
          e.style.display = 'none';
       else
          e.style.display = 'block';
   } else
     e.style.display = show;
}

function search(id, array){
  for (var i=0; i < array.length; i++) {
    if (array[i].id === id) {
      return array[i];
    }
  }
  return false;
}

function showAttribution(){
  document.getElementById("attribution-nav").click();  
}

$('.modal-toggle').click(function (e) {
    var tab = e.target.hash; 
    $('li > a[href="' + tab + '"]').tab("show");
});

/* -------------------------------------------------------------------*/
/* url parser ------------------------------------------------------- */

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
     var pair = vars[i].split("=");
     if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

function extractHash(url){ 
  return url.substring(url.indexOf("#")+1);
}


/* -------------------------------------------------------------------*/
/* hash helper ------------------------------------------------------ */
var testHash;

function supportsHistoryApi() {
  return !!(window.history && history.pushState);
}

function updatePageByHash(h){
  if (!testHash) { return; }
  console.log('update page by hash: '+h);
  jumpToInfo(h)
}

function setNewHash(h, e){
    if (!testHash) { return; }
    console.log('set new hash: '+h);
    var url = "index.html#"+h;
    history.pushState(null, null, url);
    if (typeof e !== 'undefined') {
        e.preventDefault();
    }
}

function initHash(){
  console.log('init hash');
  testHash = false;
  if (!supportsHistoryApi()) { return; }
  
  var h = extractHash(window.location.hash);
  if (h.length > 0) {
    testHash = true;
    console.log('test hash active');
    //updatePageByHash(h);
  }
  window.setTimeout(function() {
    window.addEventListener("popstate", function(e) {
      if (!testHash) { return; }
      console.log('pop state');
      var h = extractHash(window.location.hash);
      if (h.length > 0)
        updatePageByHash(h);
    }, false);
  }, 1);
}


/* -------------------------------------------------------------------*/
/* info area helper ------------------------------------------------- */

function showInfoList(){
  toggleVisibility('info-list', 'block');
  toggleVisibility('info-text', 'none');
  clearHighlight();
}

function getInfoTextContent(feature){
  var content = "";
  if (typeof feature == 'undefined' || !feature.properties) {
    content += "\
<b>Herzlich Wilkommen!</b><br/>\
<p>Die Kulturpfade Köln sind eine Reihe von Rad- bzw. Wanderwegen im Kölner Stadtgebiet. Die Pfade sind mit Informationstafeln aufbereitet und führen an sehenswürdigen Plätzen und Gebäuden entlang.</p>\
<p>Allerdings ist der Weg nicht ausgeschildert und einige Informationstafeln existieren nicht mehr. Daher soll diese Seite die Informationen vervollständigen und in einer nutzbaren Form darstellen.</p>";
    content += news;
    content += "\
<br/><small><a onclick=\"showAttribution();\" href=\"#\">Quellen/Beitragende<a></small>";
  } else {
    content += "<b>" + feature.properties.title1 + "</b> - " + feature.properties.title2 + "<br/>";
     
    content += feature.properties.description;
    
    if (feature.properties.notes) {
      if (content.length > 0)
        content += "<br/><br/>";
      content += "<i>Hinweise der Redaktion</i>:<br/>";
      content += feature.properties.notes;
    }
    if (feature.properties.wiki || feature.properties.info) {
      if (content.length > 0)
        content += "<br/><br/>";
      content += "<i>Weitere Informationen</i>:<br/><ul>";
    }
    if (feature.properties.wiki) {
      content += "<li><a target=\"_blank\" href=\"" + feature.properties.wiki + "\">Wikipedia</a></li>";
    }
    if (feature.properties.info) {
      content += feature.properties.info;
    }
      
    if (feature.properties.wiki || feature.properties.info) {
      content += "</ul>";
    } else if (feature.properties.next) {
      content += "<br/><br/>";
    }
    if (feature.properties.next) {
      content += "Zur <a href=\"#\" accesskey=\"n\" onclick=\"jumpToInfo('" + feature.properties.next + "')\">nächsten</a> Station.";
    } 
  }
  return content;
}

function showInfoText(feature, layer){
  if (typeof layer !== 'undefined') {
    layer.bringToFront();
  }
  $("#info-text").html(getInfoTextContent(feature));
  $("#info-wrapper").scrollTop(0);
  toggleVisibility('info-list', 'none');
  toggleVisibility('info-text', 'block');
  if (typeof feature !== 'undefined') {
    highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
    setNewHash(feature.properties.id);
  }
}

function jumpToInfo(id){
  console.log('jump to info: '+id);
  var marker = search(id, markerSearch2);
  var layer = markers.getLayer(marker.layer);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng]);
  layer.fire("click");
}


/* -------------------------------------------------------------------*/
/* info list -------------------------------------------------------- */

function listClick(id) {
  var layer = markers.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
}

function syncList() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();  
  /* Loop through markers layer and add only features which are in the map bounds */
  markers.eachLayer(function (layer) {
    if (map.hasLayer(markerLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td class="feature-name">' + layer.feature.properties.title3 + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
}


/* -------------------------------------------------------------------*/
/* map functionality ------------------------------------------------ */



var markerLayer = L.geoJson(null);
var markers = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
        radius: 8,
        fillColor: feature.properties.color,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      
      layer.on({
        click: function (e) {
          showInfoText(feature, layer);
        },
        mouseover: function (e) {
          var title = "<b>" + feature.properties.title1 + "</b> - " + feature.properties.title2;
          Tip(title);
        },
        mouseout: function (e) {
          UnTip();
        }
      });
            
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><td class="feature-name">' + layer.feature.properties.search + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');

      markerSearch2.push({
        id: layer.feature.properties.id,
        layer: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    } // feature.properties
  }
});
$.getJSON("data/markers.geojson", function (data) {
  markers.addData(data);
  map.addLayer(markerLayer);
});
if (getQueryVariable('test') != false) {
  $.getJSON("data/markers_test.geojson", function (data) {
    markers.addData(data);
    map.addLayer(markerLayer);
  });
}

map = L.map("map", {
  layers: [mapnik, tracks, buildings, highlight, markers],
  zoomControl: false,
  attributionControl: false
});

map.on("overlayadd", function(e) {
  if (e.layer === markerLayer) {
    markerClusters.addLayer(markers);
    syncList();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === markerLayer) {
    markerClusters.removeLayer(markers);
    syncList();
  }
});

// Filter sidebar feature list to only show features in current map bounds
map.on("moveend", function (e) {
  syncList();
});

// Attribution control
var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Entwickelt im <a target=\"_blank\" href='http://codefor.de/koeln/'>OK Lab Köln</a> | </span><a onclick=\"showAttribution();\" href=\"#\">Beitragende</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

// GPS enabled geolocation control set to follow the user's location
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

var baseLayers = {
  "mapnik": mapnik
};

var groupedOverlays = {
  "Stadtgebiet": {
    "Stadtbezirke": boroughs,
  },
  "Kulturpfade": {
    "Pfade": tracks,
    "Gebäude": buildings
  }
};

var layerControl = L.control.groupedLayers({}, groupedOverlays, {
  collapsed: true
}).addTo(map);


/* -------------------------------------------------------------------*/
/* page initialisation ---------------------------------------------- */

$(document).one("ajaxStop", function () {
  initHash();
  showInfoText();
  $("#loading").hide();
  map.fitBounds(markers.getBounds());
  });
  

/* -------------------------------------------------------------------*/
/* fixes ------------------------------------------------------------ */

toggleVisibility('info-list', 'none'); // FIX this

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

//refresh page on browser resize as fix
var docRatio = 0;
$(window).bind('resize', function(e){
  var newDocRatio = $(document).width() - $(document).height();
  if (docRatio != 0 && docRatio * newDocRatio < 0) {
    console.log('orientation changed: '+docRatio+' -> '+newDocRatio);
    if (window.RT) clearTimeout(window.RT);
      window.RT = setTimeout(function() {
      this.location.reload(false);
    }, 200);
  }
  docRatio = newDocRatio;
});
