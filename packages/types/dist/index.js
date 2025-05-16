"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ShipmentService: () => ShipmentService,
  ShipmentStatus: () => ShipmentStatus,
  UserRole: () => UserRole,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ShipmentService,
  ShipmentStatus,
  UserRole
});
