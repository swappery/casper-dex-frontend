module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: ["dark", "light"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
