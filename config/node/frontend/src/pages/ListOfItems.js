import React, { useEffect, useMemo, useState } from "react";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

function ListOfItems() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ TU ustawiasz endpoint backendu (dopasuj jeśli masz inaczej)
  // Przykłady:
  // const API_URL = "http://localhost:10000/restaurants";
  // const API_URL = "/api/restaurants";  // jeśli nginx robi proxy
  const API_URL = "/api/restaurants";

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setStatus("loading");
        setErrorMsg("");

        const res = await fetch(API_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        if (cancelled) return;

        // Obsługa dwóch popularnych formatów:
        // - backend zwraca tablicę: [...]
        // - backend zwraca obiekt: { items: [...] }
        const list = Array.isArray(data) ? data : data.items ?? [];

        setItems(list);
        setStatus("ok");
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setErrorMsg(e?.message || "Nie udało się pobrać danych");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  // Normalizacja pól – żeby działało nawet jeśli backend ma inne nazwy
  const rows = useMemo(() => {
    return items.map((x) => ({
      id: x.id ?? `${x.name}-${x.city}-${x.street}-${x.buildingNumber ?? x.building_number ?? ""}`,
      name: x.name ?? x.nazwa ?? "",
      street: x.street ?? x.ulica ?? "",
      buildingNumber: x.buildingNumber ?? x.building_number ?? x.nr ?? "",
      city: x.city ?? x.miasto ?? "",
      imageUrl: x.imageUrl ?? x.image_url ?? x.adres_url ?? "",
    }));
  }, [items]);

  return (
    <div className="list2Page">
      {/* Logo */}
      <div className="list2Logo">
        <img src="/logo.png" alt="Logo" />
      </div>

      {/* Tytuł */}
      <div className="list2Header">
        <Typography className="list2Title" component="h1">
          Lista restauracji
        </Typography>
      </div>

      {/* Panel / ramka */}
      <div className="list2Panel">
        <div className="list2PanelHead">
          <div className="list2Col list2ColName">Nazwa</div>
          <div className="list2Col list2ColAddr">Adres</div>
        </div>

        <div className="list2PanelBody">
          {status === "loading" && (
            <div className="list2State">Ładowanie danych…</div>
          )}

          {status === "error" && (
            <div className="list2State list2StateError">
              Błąd pobierania danych: {errorMsg}
              <div style={{ marginTop: 10 }}>
                <Button
                  variant="contained"
                  className="list2Btn"
                  onClick={() => window.location.reload()}
                >
                  Odśwież
                </Button>
              </div>
            </div>
          )}

          {status === "ok" && rows.length === 0 && (
            <div className="list2State">Brak obiektów w bazie.</div>
          )}

          {status === "ok" &&
            rows.map((r) => (
              <div className="list2Row" key={r.id}>
                <div className="list2Thumb">
                  {r.imageUrl ? (
                    <img src={r.imageUrl} alt={r.name} />
                  ) : (
                    <div className="list2ThumbPlaceholder">brak zdjęcia</div>
                  )}
                </div>

                <div className="list2Cell list2Name">{r.name}</div>

                <div className="list2Cell list2Addr">
                  {r.street} {r.buildingNumber}, {r.city}
                </div>
              </div>
            ))}
        </div>

        <div className="list2PanelFooter">
          <Button className="list2BtnSecondary" component={Link} to="/services">
            Wróć
          </Button>

          <Button className="list2Btn" variant="contained" component={Link} to="/add">
            Dodaj obiekt
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ListOfItems;
