// postcss.config.cjs
module.exports = {
  plugins: [
    require('tailwindcss'),    // ← use the tailwindcss PostCSS plugin
    require('autoprefixer'),
  ],
}
