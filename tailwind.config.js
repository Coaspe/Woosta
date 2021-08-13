module.exports = {
  purge: [],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    minHeight: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "60/60": "60%",
      "70/70": "70%",
      "3/4": "75%",
      full: "100%",
    },
    extend: {
      fontFamily: {
        serif: "Merriweather",
        stix: "STIX Two Text",
      },
    },
    fill: (theme) => ({
      red: theme("colors.red.primary"),
    }),
    colors: {
      white: "#ffffff",
      blue: {
        medium: "#00A2F8",
        facebook: "#385185",
        signupBtn: "#0095F6",
        aa: "#385899",
      },
      black: {
        light: "#262626",
        faded: "#00000059",
        normal: "#0000000",
      },
      gray: {
        base: "#616161",
        background: "#fafafa",
        primary: "#dbdbdb",
        postBack: "#EFEFEF",
        postBorder: "#C3C3B7",
      },
      red: {
        primary: "#ed4956",
      },
    },
  },
  variants: {
    display: ["group-hover"],
    extend: {},
  },
  plugins: [],
};
