import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/_list.scss";

function ListOfItems() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const API_CANDIDATES = useMemo(
    () => [
      "/api/restaurants",
      "/app/restaurants",
      "http://localhost:10000/app/restaurants",
    ],
    []
  );

  async function fetchJsonAny(urls, options) {
    let lastErr = null;
    for (const url of urls) {
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`${res.status} ${res.statusText} ${txt}`.trim());
        }
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) return await res.json();
        const t = await res.text();
        try { return JSON.parse(t); } catch { return t; }
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error("Brak odpowiedzi z API");
  }

  async function loadRestaurants() {
    try {
      setStatus("loading");
      setErrorMsg("");
      const data = await fetchJsonAny(API_CANDIDATES, { method: "GET" });
      setItems(Array.isArray(data) ? data : []);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setErrorMsg(String(e?.message || e));
    }
  }

  useEffect(() => {
    loadRestaurants();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Na pewno usunąć tę restaurację?")) return;

    const prev = items;
    setItems((cur) => cur.filter((x) => x.id !== id));

    try {
      const deleteUrls = API_CANDIDATES.map((u) => `${u}/${id}`);
      await fetchJsonAny(deleteUrls, { method: "DELETE" });
    } catch (e) {
      setItems(prev);
      alert("Nie udało się usunąć: " + String(e?.message || e));
    }
  }

  const getAddress = (r) => {
    const street = r.street || "";
    const bn = r.building_no || "";
    const city = r.city || "";
    return `${street} ${bn}, ${city}`.replace(/\s+/g, " ").trim();
  };

  return (
    <div className="list-page">
      <div className="list-page__logo">
        <img src="/logo.png" alt="logo" />
      </div>

      <div className="list-card">
        <h1 className="list-title">Lista restauracji</h1>

        <div className="list-actions">
          <Link className="btn" to="/">WRÓĆ</Link>
          <Link className="btn" to="/map">MAPA</Link>
          <Link className="btn" to="/add">DODAJ OBIEKT</Link>
          <button className="btn" onClick={loadRestaurants}>ODŚWIEŻ</button>
        </div>

        <div className="list-table">
          <div className="list-header">
            <div>Zdjęcie</div>
            <div>Nazwa</div>
            <div>Adres</div>
            <div style={{ textAlign: "right" }}>Akcje</div>
          </div>

          {items.map((r) => (
            <div className="list-row" key={r.id}>
              <div className="thumb">
                <img
                  src={r.image_url || ""}
                  alt={r.name || "restaurant"}
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;charset=utf-8," +
                      encodeURIComponent(
                        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="160">
                          <rect width="100%" height="100%" fill="#ddd"/>
                          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-family="Arial" font-size="18">
                            brak zdjęcia
                          </text>
                        </svg>`
                      );
                  }}
                />
              </div>

              <div className="cell-box">{r.name || "-"}</div>
              <div className="cell-box">{getAddress(r) || "-"}</div>

              <button className="btn-danger" onClick={() => handleDelete(r.id)}>
                USUŃ
              </button>
            </div>
          ))}
        </div>

        <div className="status-line">
          {status === "loading" && "Ładowanie danych..."}
          {status === "error" && `Błąd: ${errorMsg}`}
          {status === "ready" && `Rekordów: ${items.length}`}
        </div>
      </div>
    </div>
  );
}

export default ListOfItems;
