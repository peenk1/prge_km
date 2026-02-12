import React, { useEffect, useRef } from "react";
import "ol/ol.css";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";

import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";

import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import Overlay from "ol/Overlay";
import { useGeographic } from "ol/proj";

import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

function MapComponent() {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markersLayerRef = useRef(null);
  const popupOverlayRef = useRef(null);
  const popupElRef = useRef(null);

  useGeographic();

  useEffect(() => {
    const markersSource = new VectorSource();

    const markersLayer = new VectorLayer({
      source: markersSource,
      style: new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: "rgba(255, 0, 0, 0.9)" }),
          stroke: new Stroke({ color: "white", width: 2 }),
        }),
      }),
    });

    const popupEl = document.createElement("div");
    popupEl.style.position = "relative";
    popupEl.style.background = "white";
    popupEl.style.border = "1px solid rgba(0,0,0,0.25)";
    popupEl.style.borderRadius = "8px";
    popupEl.style.boxShadow = "0 8px 22px rgba(0,0,0,0.25)";
    popupEl.style.padding = "10px";
    popupEl.style.minWidth = "240px";
    popupEl.style.maxWidth = "280px";
    popupEl.style.fontSize = "14px";
    popupEl.style.lineHeight = "1.25";
    popupEl.style.display = "none";

    const caret = document.createElement("div");
    caret.style.position = "absolute";
    caret.style.left = "50%";
    caret.style.bottom = "-8px";
    caret.style.transform = "translateX(-50%)";
    caret.style.width = "0";
    caret.style.height = "0";
    caret.style.borderLeft = "8px solid transparent";
    caret.style.borderRight = "8px solid transparent";
    caret.style.borderTop = "8px solid white";
    popupEl.appendChild(caret);

    const overlay = new Overlay({
      element: popupEl,
      positioning: "bottom-center",
      stopEvent: true,
      offset: [0, -12],
    });

    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() }), markersLayer],
      view: new View({
        center: [21, 52],
        zoom: 6,
      }),
    });

    map.addOverlay(overlay);

    mapObjRef.current = map;
    markersLayerRef.current = markersLayer;
    popupOverlayRef.current = overlay;
    popupElRef.current = popupEl;

    map.on("click", (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);

      if (!feature) {
        popupEl.style.display = "none";
        overlay.setPosition(undefined);
        return;
      }

      const props = feature.getProperties();
      const coord = evt.coordinate;

      const name = props.name ?? "";
      const street = props.street ?? "";
      const buildingNo = props.building_no ?? "";
      const city = props.city ?? "";
      const imageUrl = props.image_url ?? "";

      popupEl.innerHTML = `
        <div style="color:#333; font-weight:700; margin-bottom:6px;">${escapeHtml(name)}</div>
        <div style="color:#333; margin-bottom:8px;">
          ${escapeHtml(street)} ${escapeHtml(buildingNo)}, ${escapeHtml(city)}
        </div>
        ${
          imageUrl
            ? `<img src="${escapeAttr(
                imageUrl
              )}" alt="restaurant" style="width:100%; height:140px; object-fit:cover; border-radius:6px; background:#eee;" />`
            : `<div style="width:100%; height:140px; border-radius:6px; background:#eee; display:flex; align-items:center; justify-content:center; color:#777;">
                 brak zdjęcia
               </div>`
        }
        <div style="position:absolute; top:6px; right:8px; cursor:pointer; font-weight:700; color:#666;" id="popupCloseBtn">×</div>
        <div style="position:absolute; left:50%; bottom:-8px; transform:translateX(-50%); width:0; height:0; border-left:8px solid transparent; border-right:8px solid transparent; border-top:8px solid white;"></div>
      `;

      popupEl.style.display = "block";
      overlay.setPosition(coord);

      const closeBtn = popupEl.querySelector("#popupCloseBtn");
      if (closeBtn) {
        closeBtn.onclick = () => {
          popupEl.style.display = "none";
          overlay.setPosition(undefined);
        };
      }
    });

    return () => map.setTarget(null);
  }, []);

  useEffect(() => {
    const API_CANDIDATES = [
      "/api/restaurants",
      "/app/restaurants",
      "http://localhost:10000/app/restaurants",
    ];

    const fetchFromCandidates = async () => {
      for (const url of API_CANDIDATES) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          if (Array.isArray(data)) return data;
        } catch (e) {}
      }
      return null;
    };

    const geocodeAddress = async (street, buildingNo, city) => {
      const q = `${street} ${buildingNo}, ${city}, Poland`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        q
      )}`;

      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) return null;

      const arr = await res.json();
      if (!Array.isArray(arr) || arr.length === 0) return null;

      const lat = Number(arr[0].lat);
      const lon = Number(arr[0].lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

      return [lon, lat];
    };

    const loadMarkers = async () => {
      const restaurants = await fetchFromCandidates();
      if (!restaurants || !markersLayerRef.current) return;

      const source = markersLayerRef.current.getSource();
      source.clear();

      for (const r of restaurants) {
        const coord = await geocodeAddress(r.street, r.building_no, r.city);
        if (!coord) continue;

        const feature = new Feature({
          geometry: new Point(coord),
        });

        feature.setProperties({
          id: r.id,
          name: r.name,
          street: r.street,
          building_no: r.building_no,
          city: r.city,
          image_url: r.image_url || "",
        });

        source.addFeature(feature);
      }

      const extent = source.getExtent();
      if (extent && extent[0] !== Infinity && mapObjRef.current) {
        mapObjRef.current.getView().fit(extent, {
          padding: [40, 40, 40, 40],
          maxZoom: 14,
          duration: 250,
        });
      }
    };

    loadMarkers();
  }, []);

  return <div className="mapComponent" ref={mapRef} />;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str) {
  return escapeHtml(str).replaceAll("`", "&#096;");
}

export default MapComponent;
