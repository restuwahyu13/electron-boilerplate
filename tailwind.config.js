module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {},
  animation: {
    wiggle: 'wiggle 2s ease-in-out infinite',
    movehorizontal: 'movehorizontal 2s ease-in-out infinite',
    bounce: 'bounce 2s ease-in-out infinite'
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  }
}
