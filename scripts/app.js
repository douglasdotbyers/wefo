var wefo;

var faeStation;
var taeStation;

var mapBoundaryLeft;
var mapBoundaryTop;
var mapBoundaryRight;
var mapBoundaryBottom;

var mapCornerLeftTop;
var mapCornerRightTop;
var mapCornerRightBottom;
var mapCornerLeftBottom;

var mapMidwayLeftRight;
var mapMidwayTopBottom;
var mapQuiteFarLeft;
var mapQuiteFarRight;
var mapCenter;

function getStations()
{
  var stations = [];

  $.each(wefo,function(key,val) { stations.push(key); });

  return stations;
}

function numberOfStationsOnOuterPath(faeStation,taeStation)
{
  var stations = getStations();

  return (stations.indexOf(taeStation) - stations.indexOf(faeStation) + stations.length) % stations.length;
}

function numberOfStationsOnInnerPath(faeStation,taeStation)
{
  var stations = getStations();

  return (stations.indexOf(faeStation) - stations.indexOf(taeStation) + stations.length) % stations.length;
}

function clearStationsOnOuterPath()
{
  $(".on-path").removeClass("on-path");
}

function clearStationsOnInnerPath()
{
  $(".on-path").removeClass("on-path");
}

function drawStationsOnOuterPath(faeStation,taeStation)
{
  var stations = getStations();

  for (var i = (stations.indexOf(faeStation) + 1 + 15) % 15 ; i != stations.indexOf(taeStation) ; i = (i + 1 + 15) % 15)
  {
    $("."+stations[i]+".station-underlay").addClass("on-path");
  }
}

function drawStationsOnInnerPath(faeStation,taeStation)
{
  var stations = getStations();

  for (var i = (stations.indexOf(faeStation) - 1 + 15) % 15 ; i != stations.indexOf(taeStation) ; i = (i - 1 + 15) % 15)
  {
    $("."+stations[i]+".station-underlay").addClass("on-path");
  }
}

function clearOuterPath()
{
  $("#outer-path-mask polygon").attr("points", "");
}

function clearInnerPath()
{
  $("#inner-path-mask polygon").attr("points", "");
}

function drawOuterPath(faeStation,taeStation)
{
  var faeCircle = $("#"+faeStation);
  var faeX = parseInt(faeCircle.attr("cx"));
  var faeY = parseInt(faeCircle.attr("cy"));
  var taeCircle = $("#"+taeStation);
  var taeX = parseInt(taeCircle.attr("cx"));
  var taeY = parseInt(taeCircle.attr("cy"));

  var points = mapCenter;
  points += " "+faeX+","+faeY;

  if (faeX < mapQuiteFarLeft)    { points += " "+(faeX-20)+","+faeY; }
  if (faeX > mapQuiteFarRight)   { points += " "+(faeX+20)+","+faeY; }
  if (faeY < mapMidwayTopBottom) { points += " "+faeX+","+mapBoundaryTop; }
  if (faeY > mapMidwayTopBottom) { points += " "+faeX+","+mapBoundaryBottom; }

  if (faeY < mapMidwayTopBottom && taeY > mapMidwayTopBottom) { points += " "+mapCornerRightTop+" "+mapCornerRightBottom; }
  if (faeY > mapMidwayTopBottom && taeY < mapMidwayTopBottom) { points += " "+mapCornerLeftBottom+" "+mapCornerLeftTop; }

  if (faeY < mapMidwayTopBottom && taeY < mapMidwayTopBottom && taeX < faeX) { points += " "+mapCornerRightTop+" "+mapCornerRightBottom+" "+mapCornerLeftBottom+" "+mapCornerLeftTop; }
  if (faeY > mapMidwayTopBottom && taeY > mapMidwayTopBottom && taeX > faeX) { points += " "+mapCornerLeftBottom+" "+mapCornerLeftTop+" "+mapCornerRightTop+" "+mapCornerRightBottom; }

  if (taeY > mapMidwayTopBottom) { points += " "+taeX+","+mapBoundaryBottom; }
  if (taeY < mapMidwayTopBottom) { points += " "+taeX+","+mapBoundaryTop; }
  if (taeX > mapQuiteFarRight)   { points += " "+(taeX+20)+","+taeY; }
  if (taeX < mapQuiteFarLeft)    { points += " "+(taeX-20)+","+taeY; }

  points += " "+taeX+","+taeY;
  points += " "+mapCenter;

  $("#outer-path-mask polygon").attr("points", points);
}

function drawInnerPath(faeStation,taeStation)
{
  var faeCircle = $("#"+faeStation);
  var faeX = parseInt(faeCircle.attr("cx"));
  var faeY = parseInt(faeCircle.attr("cy"));
  var taeCircle = $("#"+taeStation);
  var taeX = parseInt(taeCircle.attr("cx"));
  var taeY = parseInt(taeCircle.attr("cy"));

  var points = mapCenter;
  points += " "+faeX+","+faeY;

  if (faeX < mapQuiteFarLeft)    { points += " "+(faeX-20)+","+faeY; }
  if (faeX > mapQuiteFarRight)   { points += " "+(faeX+20)+","+faeY; }
  if (faeY < mapMidwayTopBottom) { points += " "+faeX+","+mapBoundaryTop; }
  if (faeY > mapMidwayTopBottom) { points += " "+faeX+","+mapBoundaryBottom; }

  if (faeY < mapMidwayTopBottom && taeY > mapMidwayTopBottom) { points += " "+mapCornerLeftTop+" "+mapCornerLeftBottom; }
  if (faeY > mapMidwayTopBottom && taeY < mapMidwayTopBottom) { points += " "+mapCornerRightBottom+" "+mapCornerRightTop; }

  if (faeY < mapMidwayTopBottom && taeY < mapMidwayTopBottom && taeX > faeX) { points += " "+mapCornerLeftTop+" "+mapCornerLeftBottom+" "+mapCornerRightBottom+" "+mapCornerRightTop; }
  if (faeY > mapMidwayTopBottom && taeY > mapMidwayTopBottom && taeX < faeX) { points += " "+mapCornerRightBottom+" "+mapCornerRightTop+" "+mapCornerLeftTop+" "+mapCornerLeftBottom; }

  if (taeY > mapMidwayTopBottom) { points += " "+taeX+","+mapBoundaryBottom; }
  if (taeY < mapMidwayTopBottom) { points += " "+taeX+","+mapBoundaryTop; }
  if (taeX > mapQuiteFarRight)   { points += " "+(taeX+20)+","+taeY; }
  if (taeX < mapQuiteFarLeft)    { points += " "+(taeX-20)+","+taeY; }

  points += " "+taeX+","+taeY;
  points += " "+mapCenter;

  $("#inner-path-mask polygon").attr("points", points);
}

function onStationHovered(station)
{
  $("."+station.id+".station-underlay").toggleClass("hovered");
}

function onStationClicked(station)
{
  switch ($(".clicked").length)
  {
    case 0:
      faeStation = station.id;
      $("."+station.id+".station-underlay").addClass("clicked");
      $(".instruction-label").text("TAE?");
      break;
    case 1:
      taeStation = station.id;
      $("."+station.id+".station-underlay").addClass("clicked");
      if (numberOfStationsOnOuterPath(faeStation,taeStation) < numberOfStationsOnInnerPath(faeStation,taeStation))
      {
        drawStationsOnOuterPath(faeStation,taeStation);
        drawOuterPath(faeStation,taeStation);
        faeStairs = wefo[faeStation]["outer"].charAt(0);
        taeStairs = wefo[taeStation]["outer"].charAt(0);
        $(".instruction-label").text((faeStairs == taeStairs) ? "HANG BACK" : "TAKE A WALK");
        $(".instruction-label-upper").text("OUTER CIRCLE");
        $(".instruction-label-lower").text("Board" + ((faeStairs == taeStairs) ? " near to " : " far from ") + "the stairs, to get out first at the other end.");
      }
      if (numberOfStationsOnInnerPath(faeStation,taeStation) < numberOfStationsOnOuterPath(faeStation,taeStation))
      {
        drawStationsOnInnerPath(faeStation,taeStation);
        drawInnerPath(faeStation,taeStation);
        faeStairs = wefo[faeStation]["inner"].charAt(0);
        taeStairs = wefo[taeStation]["inner"].charAt(0);
        $(".instruction-label").text((faeStairs == taeStairs) ? "HANG BACK" : "TAKE A WALK");
        $(".instruction-label-upper").text("INNER CIRCLE");
        $(".instruction-label-lower").text("Board" + ((faeStairs == taeStairs) ? " near to " : " far from ") + "the stairs, to get out first at the other end.");
      }
      break;
    case 2:
      reset();
      faeStation = station.id;
      $("."+station.id+".station-underlay").addClass("clicked");
      $(".instruction-label").text("TAE?");
      break;
  }
}

function reset()
{
  faeStation = null;
  taeStation = null;
  clearOuterPath();
  clearInnerPath();
  clearStationsOnOuterPath();
  clearStationsOnInnerPath();
  $(".clicked").removeClass("clicked");
  $(".instruction-label").text("FAE?");
  $(".instruction-label-upper").text("");
  $(".instruction-label-lower").text("");
}

$(document).ready(function() {
  wefo = { PA: { outer: "bl" , inner: "bl" },
           KH: { outer: "br" , inner: "br" },
           HH: { outer: "fl" , inner: "fl" },
           KB: { outer: "fr" , inner: "fr" },
           SG: { outer: "bl" , inner: "bl" },
           CO: { outer: "br" , inner: "br" },
           BU: { outer: "fl" , inner: "fl" },
           SE: { outer: "fr" , inner: "fr" },
           BS: { outer: "bl" , inner: "bl" },
           WS: { outer: "br" , inner: "br" },
           SR: { outer: "fl" , inner: "fl" },
           KP: { outer: "fr" , inner: "fr" },
           CE: { outer: "bl" , inner: "bl" },
           IB: { outer: "br" , inner: "br" },
           GO: { outer: "fl" , inner: "fl" } };

  faeStation = null;
  taeStation = null;

  mapBoundaryLeft   = 0;
  mapBoundaryTop    = 0;
  mapBoundaryRight  = $("#map").attr("width");
  mapBoundaryBottom = $("#map").attr("height");

  mapCornerLeftTop     = mapBoundaryLeft+","+mapBoundaryTop;
  mapCornerRightTop    = mapBoundaryRight+","+mapBoundaryTop;
  mapCornerRightBottom = mapBoundaryRight+","+mapBoundaryBottom;
  mapCornerLeftBottom  = mapBoundaryLeft+","+mapBoundaryBottom;

  mapMidwayLeftRight = $("#map").attr("width") / 2;
  mapMidwayTopBottom = $("#map").attr("height") / 2;
  mapQuiteFarLeft    = mapMidwayLeftRight-mapMidwayLeftRight+100;
  mapQuiteFarRight   = mapMidwayLeftRight+mapMidwayLeftRight-100;
  mapCenter          = mapMidwayLeftRight+","+mapMidwayTopBottom;

  $(".instruction-label").text("FAE?");
  $(".station-overlay").hover(function() { onStationHovered(this); });
  $(".station-overlay").click(function() { onStationClicked(this); });
  $(".instruction-overlay").click(function() { reset(); });
});
