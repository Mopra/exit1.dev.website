export default ({ env }) => ({
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(env === 'production' ? { cssnano: {} } : {}),
  },
});
