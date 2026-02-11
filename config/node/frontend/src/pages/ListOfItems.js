import React, { useEffect, useMemo, useState } from "react";
import { Typography, Button } from "@mui/material";
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

  const loadRestaurants = async () => {
    setStatus("loading");
    setErrorMsg("");

    for (const url of API_CANDIDATES) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
        setStatus("ok");
        return;
      } catch (e) {}
    }

    setStatus("error");
    setErrorMsg("Nie udało się pobrać danych z backendu.");
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const openDetails = (row) => {
    alert(
      `${row?.name}\n${row?.street} ${row?.building_no}\n${row?.city}`
    );
  };

  return (
    <div className="list2Page">

      {/* 🔥 LOGO W LEWYM GÓRNYM ROGU */}
      <div className="globalLogo">
        <img src="/logo.png" alt="logo" />
      </div>


      <div className="list2Card">

        <h1 className="list2Title">Lista restauracji</h1>

        <div className="list2Actions">
          <Button component={Link} to="/" variant="contained">
            Wróć
          </Button>

          <Button component={Link} to="/map" variant="contained">
            Mapa
          </Button>

          <Button component={Link} to="/add" variant="contained">
            Dodaj obiekt
          </Button>

          <Button onClick={loadRestaurants} variant="contained">
            Odśwież
          </Button>
        </div>

        <div className="list2TableWrap">
          <div className="list2TableHead">
            <div>Zdjęcie</div>
            <div>Nazwa</div>
            <div>Adres</div>
            <div>Akcje</div>
          </div>

          <div className="list2Table">
            {status === "loading" && (
              <div className="list2State">Ładowanie danych…</div>
            )}

            {status === "error" && (
              <div className="list2State">{errorMsg}</div>
            )}

            {status === "ok" &&
              items.map((row) => {
                const address = `${row.street} ${row.building_no}, ${row.city}`;

                return (
                  <div className="list2Row" key={row.id}>
                    <div className="list2Img">
                      {row.image_url ? (
                        <img src={row.image_url} alt={row.name} />
                      ) : (
                        <img
                          src="https://via.placeholder.com/320x180.png?text=Brak+zdj%C4%99cia"
                          alt="brak"
                        />
                      )}
                    </div>

                    <div className="list2Cell list2Name">
                      {row.name}
                    </div>

                    <div className="list2Cell list2Address">
                      {address}
                    </div>

                    <div>
                      <Button
                        className="list2Btn"
                        onClick={() => openDetails(row)}
                      >
                        Szczegóły
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListOfItems;
