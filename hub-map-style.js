// The EPCG basemap: OpenFreeMap's Positron style (OpenStreetMap data), restyled in the EPCG palette.
// Copied from the Heritage Hunt's map-style.js (2 Nov 2026) so the two apps share one basemap; the only change
// is that it is a plain script setting window.EPCG_MAP_STYLE, because the Hub pages do not load modules.
// Layers are matched by what they draw (type and source layer), not by id, so an upstream rename still lands.
// Palette: design system tokens. Type colours on the map are Grey and Ink only (the contrast rule).
(function () {
var STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';

var C = {
  ground: '#EEF5F8',     // --epcg-pale
  block: '#E3ECF0',      // --epcg-line-soft: city blocks and residential land
  building: '#DBE7EE',   // --epcg-line
  water: '#BFE5F4',      // Sky at about 40 per cent on the ground
  park: '#D2EFE9',       // Teal at about 20 per cent on the ground
  road: '#FFFFFF',
  roadEdge: '#D6E7EF',   // --epcg-chip-border
  path: '#9DB2BC',       // --epcg-faint
  label: '#5E7986',      // --epcg-grey
  labelMajor: '#12303F', // --epcg-ink
};

function setPaint(l, k, v) { l.paint = l.paint || {}; l.paint[k] = v; }

function restyle(style) {
  var out = [];
  for (var i = 0; i < style.layers.length; i++) {
    var l = style.layers[i];
    var sl = l['source-layer'] || '';
    if (l.type === 'raster') continue;                                   // Natural Earth shading
    if (sl === 'poi' || sl === 'aerodrome_label' || sl === 'mountain_peak' || sl === 'boundary') continue; // clutter: we have our own pins
    if (sl === 'housenumber') continue;
    if (l.type === 'background') setPaint(l, 'background-color', C.ground);
    else if (l.type === 'fill') {
      if (sl === 'water') setPaint(l, 'fill-color', C.water);
      else if (sl === 'park' || (sl === 'landcover' && /wood|grass|park/.test(l.id))) { setPaint(l, 'fill-color', C.park); setPaint(l, 'fill-opacity', 1); }
      else if (sl === 'building') { setPaint(l, 'fill-color', C.building); if (l.paint['fill-outline-color']) setPaint(l, 'fill-outline-color', C.roadEdge); }
      else if (sl === 'landuse') setPaint(l, 'fill-color', C.block);
      else if (sl === 'transportation') setPaint(l, 'fill-color', C.road);
    } else if (l.type === 'line') {
      if (sl === 'waterway') setPaint(l, 'line-color', C.water);
      else if (sl === 'transportation') {
        var id = l.id;
        if (/casing/.test(id)) setPaint(l, 'line-color', C.roadEdge);
        else if (/path|pedestrian|footway|track/.test(id)) setPaint(l, 'line-color', C.path);
        else if (/rail/.test(id)) setPaint(l, 'line-color', C.building);
        else setPaint(l, 'line-color', C.road);
      }
    } else if (l.type === 'symbol') {
      var major = /place|city|town|suburb/.test(l.id) || sl === 'place';
      setPaint(l, 'text-color', sl === 'water_name' ? '#004F71' : major ? C.labelMajor : C.label);
      setPaint(l, 'text-halo-color', '#FFFFFF');
      setPaint(l, 'text-halo-width', 1.4);
      if (l.paint['icon-opacity'] !== undefined) setPaint(l, 'icon-opacity', 0);
    }
    out.push(l);
  }
  style.layers = out;
  return style;
}

window.EPCG_MAP_STYLE = { STYLE_URL: STYLE_URL, restyle: restyle };
})();
