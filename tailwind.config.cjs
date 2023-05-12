/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "background": "#f9f9f9",
      "primary-black": "#000000",
      "primary-white": "#ffffff",
      "primary-grey": "#F9F9F9",
      "primary-green": "#B1D18B",
      "primary-pink": "#FD6B8E",
      "primary-blue": "#65C6FD",
      "primary-orange": "#F7A07B",
      "secondary-turquoise": "#058194",
      "secondary-darker-turquoise": "#036c7c",
      "secondary-blue": "#236FC8",
      "secondary-grey": "#707070",
      "signal-red": "#D1333A",
      "signal-yellow": "#F4B54F",
      "signal-green": "#01C281",
      "libris-green": "#81b864",
      "transparent": "transparent",
    },
    fontFamily: {
      'sans': ['"Open Sans"'],
    },
    extend: {
      // https://github.com/Kungbib/styles/blob/master/src/styles/_variables.scss
    },
  },
  plugins: [],
}