# 📦 Service Area Management – Samudra Paket ERP

## Overview

Service Area Management is a critical module for the logistics ERP system of **PT. Sarana Mudah Raya** (Samudra Paket). It allows the company to:

- Define geographic service areas
- Assign branches to specific areas
- Configure pricing based on area, distance, and package weight
- Optimize delivery routes
- Track changes in area boundaries and pricing rules

---

## 🌐 Geographic Data Format

- **Use:** `GeoJSON`
- **Why:**
  - Widely supported by Mapbox, Leaflet, Google Maps
  - Ideal for polygons, multipolygons, points, and lines

---

## 🗺️ Area Granularity

- **Level:** *District (Kecamatan)* or *Sub-district (Kelurahan)*
- **Reference:** Use BPS administrative codes (e.g., `kode_kecamatan`)
- **Geometry:** Polygon boundaries for each area

---

## ⚠️ Overlap Policy

- **Allowed with priority control**
- **Implementation:**
  - Add `priority_level` to the `branch_service_areas` relation
  - Multiple branches can serve the same area, but with defined priority

---

## 💰 Pricing Configuration

Pricing can be determined using a combination of:

| Factor         | Description                               |
|----------------|-------------------------------------------|
| Distance       | In kilometers or via Maps API             |
| Package Weight | In kilograms                              |
| Service Type   | Regular, Express, Same Day, etc.          |
| Area Type      | Inner-city, Out-of-city, Remote Area      |
| Minimum Charge | Minimum fee for any delivery              |
| Maximum Charge | Cap on delivery cost                      |

### Example Pricing Rule (JSON)
```json
{
  "service_area_id": "XYZ123",
  "service_type": "express",
  "base_price": 10000,
  "price_per_km": 2000,
  "price_per_kg": 1500,
  "min_charge": 15000,
  "max_charge": 100000
}
```
### Map Providers

| Provider          | Benefits                                                |
| ----------------- | ------------------------------------------------------- |
| **Mapbox**        | Professional UI, interactive features, high-performance |
