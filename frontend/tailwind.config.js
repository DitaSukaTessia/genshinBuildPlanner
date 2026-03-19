/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#090B13',
        lunar: '#161A2B',
        star: '#7AA2F7',
        gold: '#F5D58B'
      },
      boxShadow: {
        glow: '0 0 30px rgba(122, 162, 247, 0.18)'
      },
      backgroundImage: {
        'radial-celestial': 'radial-gradient(circle at top, rgba(122,162,247,0.22), transparent 40%), radial-gradient(circle at bottom right, rgba(245,213,139,0.15), transparent 30%)'
      }
    }
  },
  plugins: []
};
