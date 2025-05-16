// src/index.ts
var config = {
  api: {
    baseUrl: process.env.API_BASE_URL || "http://localhost:3000",
    timeout: 3e4
  },
  auth: {
    tokenExpiration: "30m",
    refreshTokenExpiration: "7d"
  }
};
var src_default = config;
export {
  config,
  src_default as default
};
