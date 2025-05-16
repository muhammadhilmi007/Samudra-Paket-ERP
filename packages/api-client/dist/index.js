"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  apiClient: () => apiClient,
  default: () => src_default,
  removeAuthToken: () => removeAuthToken,
  setAuthToken: () => setAuthToken
});
module.exports = __toCommonJS(src_exports);
var import_axios = __toESM(require("axios"));
var baseURL = process.env.API_BASE_URL || "http://localhost:3000";
var apiClient = import_axios.default.create({
  baseURL,
  timeout: 3e4,
  headers: {
    "Content-Type": "application/json"
  }
});
var setAuthToken = (token) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
var removeAuthToken = () => {
  delete apiClient.defaults.headers.common["Authorization"];
};
var src_default = {
  apiClient,
  setAuthToken,
  removeAuthToken
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  apiClient,
  removeAuthToken,
  setAuthToken
});
