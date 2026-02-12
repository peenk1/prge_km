import React, { useMemo, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function AddPlace() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    street: "",
    buildingNumber: "",
    city: "",
    imageUrl: "",
  });

  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Podaj nazwę";
    if (!form.street.trim()) e.street = "Podaj ulicę";
    if (!form.buildingNumber.trim()) e.buildingNumber = "Podaj numer budynku";
    if (!form.city.trim()) e.city = "Podaj miasto";

    if (form.imageUrl.trim()) {
      try {
        new URL(form.imageUrl.trim());
      } catch {
        e.imageUrl = "Podaj poprawny adres URL (np. https://...)";
      }
    }
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onBlur = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      street: true,
      buildingNumber: true,
      city: true,
      imageUrl: true,
    });

    if (!isValid || saving) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        street: form.street.trim(),
        building_no: form.buildingNumber.trim(),
        city: form.city.trim(),
        image_url: form.imageUrl.trim() || null,
      };

      const url = "http://localhost:10000/app/restaurants";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      let data = raw;

      const ct = res.headers.get("content-type") || "";
      if (raw && ct.includes("application/json")) {
        try {
          data = JSON.parse(raw);
        } catch {
        }
      }

      if (!res.ok) {
        const msg =
          (data && typeof data === "object" && (data.detail || data.message)) ||
          (typeof data === "string" && data) ||
          `Błąd HTTP: ${res.status}`;
        throw new Error(msg);
      }

      alert("Dodano restaurację ✅");
      navigate("/list");
    } catch (err) {
      alert(`Nie udało się dodać restauracji.\n\n${err?.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="addPage">
      <div className="addLogo">
        <img src={process.env.PUBLIC_URL + "/logo.png"} alt="Logo" />
      </div>

      <div className="addHeader">
        <Typography className="addTitle" component="h1">
          <span className="addTitleGeo">GEO</span>
          <span className="addTitleRest">Dodaj obiekt</span>
        </Typography>

        <Typography className="addSubtitle">
          Wprowadź dane restauracji. Zdjęcie podaj jako link (URL).
        </Typography>
      </div>

      <div className="addCard">
        <form className="addForm" onSubmit={onSubmit}>
          <div className="addGrid">
            <TextField
              label="Nazwa"
              value={form.name}
              onChange={onChange("name")}
              onBlur={onBlur("name")}
              error={!!touched.name && !!errors.name}
              helperText={touched.name ? errors.name : " "}
              fullWidth
            />

            <TextField
              label="Ulica"
              value={form.street}
              onChange={onChange("street")}
              onBlur={onBlur("street")}
              error={!!touched.street && !!errors.street}
              helperText={touched.street ? errors.street : " "}
              fullWidth
            />

            <TextField
              label="Numer budynku"
              value={form.buildingNumber}
              onChange={onChange("buildingNumber")}
              onBlur={onBlur("buildingNumber")}
              error={!!touched.buildingNumber && !!errors.buildingNumber}
              helperText={touched.buildingNumber ? errors.buildingNumber : " "}
              fullWidth
            />

            <TextField
              label="Miasto"
              value={form.city}
              onChange={onChange("city")}
              onBlur={onBlur("city")}
              error={!!touched.city && !!errors.city}
              helperText={touched.city ? errors.city : " "}
              fullWidth
            />

            <TextField
              label="Adres URL zdjęcia"
              value={form.imageUrl}
              onChange={onChange("imageUrl")}
              onBlur={onBlur("imageUrl")}
              error={!!touched.imageUrl && !!errors.imageUrl}
              helperText={touched.imageUrl ? errors.imageUrl : " "}
              fullWidth
            />
          </div>

          <div className="addActions">
            <Button className="addBtnSecondary" component={Link} to="/services">
              Wróć
            </Button>

            <Button
              className="addBtnPrimary"
              type="submit"
              variant="contained"
              disabled={!isValid || saving}
            >
              {saving ? "ZAPISYWANIE..." : "Zapisz"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPlace;
