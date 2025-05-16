// src/index.ts
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["ADMIN"] = "admin";
  UserRole2["MANAGER"] = "manager";
  UserRole2["COURIER"] = "courier";
  UserRole2["DRIVER"] = "driver";
  UserRole2["COLLECTOR"] = "collector";
  UserRole2["WAREHOUSE"] = "warehouse";
  UserRole2["CUSTOMER"] = "customer";
  return UserRole2;
})(UserRole || {});
var ShipmentService = /* @__PURE__ */ ((ShipmentService2) => {
  ShipmentService2["REGULAR"] = "regular";
  ShipmentService2["EXPRESS"] = "express";
  ShipmentService2["SAME_DAY"] = "same_day";
  return ShipmentService2;
})(ShipmentService || {});
var ShipmentStatus = /* @__PURE__ */ ((ShipmentStatus2) => {
  ShipmentStatus2["PENDING"] = "pending";
  ShipmentStatus2["PICKED_UP"] = "picked_up";
  ShipmentStatus2["IN_TRANSIT"] = "in_transit";
  ShipmentStatus2["OUT_FOR_DELIVERY"] = "out_for_delivery";
  ShipmentStatus2["DELIVERED"] = "delivered";
  ShipmentStatus2["FAILED"] = "failed";
  ShipmentStatus2["RETURNED"] = "returned";
  return ShipmentStatus2;
})(ShipmentStatus || {});
var src_default = {
  UserRole,
  ShipmentService,
  ShipmentStatus
};
export {
  ShipmentService,
  ShipmentStatus,
  UserRole,
  src_default as default
};
