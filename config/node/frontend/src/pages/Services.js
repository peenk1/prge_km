import React from "react";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Services() {
  return (
    <div className="servicesPage">
      {/* Logo w lewym górnym rogu */}
      <div className="servicesLogo">
        <img src="/logo.png" alt="Logo" />
      </div>

      {/* Nagłówek */}
      <div className="servicesHeader">
        <Typography className="servicesTitle" component="h1">
          <span className="servicesTitleGeo">GEO</span>
          <span className="servicesTitleRest">Usługi</span>
        </Typography>
      </div>

      {/* Trzy karty */}
      <div className="servicesCards">
        {/* 1. Lista restauracji */}
        <div className="servicesCard">
          <div className="servicesCardImg">
            <img src="/restaurants.png" alt="Dostępne restauracje" />
          </div>

          <div className="servicesCardBody">
            <div className="servicesCardLabel">Dostępne restauracje</div>

            <Button
              className="servicesBtn"
              variant="contained"
              component={Link}
              to="/list"
            >
              Przeglądaj
            </Button>
          </div>
        </div>

        {/* 2. Mapa restauracji */}
        <div className="servicesCard">
          <div className="servicesCardImg">
            <img src="/world-map.png" alt="Mapa restauracji" />
          </div>

          <div className="servicesCardBody">
            <div className="servicesCardLabel">Mapa restauracji</div>

            <Button
              className="servicesBtn"
              variant="contained"
              component={Link}
              to="/map"
            >
              Przejdź
            </Button>
          </div>
        </div>

        {/* 3. Dodaj restaurację */}
        <div className="servicesCard">
          <div className="servicesCardImg">
            <img src="/add-place.png" alt="Dodaj restaurację" />
          </div>

          <div className="servicesCardBody">
            <div className="servicesCardLabel">Dodaj restaurację</div>

            <Button
              className="servicesBtn"
              variant="contained"
              component={Link}
              to="/add"
            >
              Dodaj
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
