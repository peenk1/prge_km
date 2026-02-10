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

      {/* Dwie karty */}
      <div className="servicesCards">
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
      </div>
    </div>
  );
}

export default Services;
