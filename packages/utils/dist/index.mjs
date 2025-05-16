// src/index.ts
var formatDate = (date, format = "yyyy-MM-dd") => {
  return date.toISOString().split("T")[0];
};
var generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};
var src_default = {
  formatDate,
  generateId
};
export {
  src_default as default,
  formatDate,
  generateId
};
