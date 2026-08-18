const path = require("path");

/** World CSS has no Tailwind utilities — skip the content scan on those files. */
function useTailwind(filePath) {
  if (!filePath) return true;
  const base = path.basename(String(filePath).split("?")[0]);
  return base !== "base.css" && base !== "mansi-world-of-data.css";
}

module.exports = (ctx) => {
  const filePath = ctx?.file || ctx?.from || ctx?.options?.from;
  if (!useTailwind(filePath)) {
    return { plugins: [] };
  }
  return {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  };
};
