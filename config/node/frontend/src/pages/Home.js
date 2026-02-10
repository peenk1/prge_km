import React from "react";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
        <div className="homePage">
          {/* GÓRNY PASEK */}
          <header className="homeTopbar">
      <div className="homeLogo">
        <img src="/logo.png" alt="Logo" />
      </div>

      <Button className="homeLoginBtn" variant="contained">
        Login
      </Button>
    </header>


      {/* TŁO / “PLANSZA” */}
      <main className="homeCard">
        <div className="homeCardInner">
          {/* LEWA STRONA – IKONA MAPY */}
          <div className="homeMapIconWrapper">
            <img
              src="/map-icon.png"
              alt="Mapa"
              className="homeMapIcon"
            />
          </div>

          {/* PRAWA STRONA – TEKST */}
          <div className="homeHero">
            <Typography className="homeTitle" component="h1">
              <span className="homeTitleGeo">GEO</span>
              <span className="homeTitlePortal">Portal</span>
            </Typography>

            <Button
              className="homeStartBtn"
              variant="contained"
              component={Link}
              to="/services"
            >
              START
            </Button>

            <Typography className="homeSubtitle">
              Geoportal tematyczny poświęcony restauracjom
            </Typography>
          </div>
        </div>


        {/* DOLNY PASEK */}
        <div className="homeBottomStrip" />
      </main>
    </div>
  );
}

export default Home;
