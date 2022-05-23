module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      lightblue: "#CAEFFF",
      lightgreen: "#E1F7D7",
      lightyellow: "#FFF8D4",
      lightred: "#FFE9E3",
    },
    fontFamily: {
      gotham: "Gotham",
      "orator-std": "Orator Std",
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#CAEFFF",
          secondary: "#E1F7D7",
          accent: "#FFF8D4",
          neutral: "#000000",
          info: "#E1F7D7",
          success: "#FFF4C5",
        },
      },
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#000000",
          secondary: "#000000",
          accent: "#000000",
          neutral: "#FFF8D4",
          info: "#FFF8D4",
          success: "#232323",
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
