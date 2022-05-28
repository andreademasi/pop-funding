const plugin = require('tailwindcss/plugin')

module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                radial: 'radial-gradient( circle at 75% 30%,#fefefe 5px,aqua 8%,#3b2d60 60%,#3b2d60 100%)',
            },
            boxShadow: {
                radial: 'inset 0 0 20px #fff, inset 10px 0 46px #e78dd2e5,inset 88px 0px 60px #e78dd2e5, inset -20px -60px 100px #e78dd2e5,inset 0 50px 140px #e78dd2e5, 0 0 90px #e78dd2e5',
            },
            animation: {
                float: 'float 10s linear infinite',
                pop1: 'pop 10s 5s ease-in-out infinite',
                pop2: 'pop 10s 5.5s ease-in-out infinite',
                pop3: 'pop 10s 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%': { top: '100vh', opacity: '0' },
                    '50%': { top: '50vh', opacity: '1' },
                    '100%': { top: '-100%', opacity: '1' },
                },
                pop: {
                    '0%': { transform: 'none' },
                    '4%': { transform: 'translateY(-1rem)' },
                    '8%': { transform: 'none' },
                },
                boing: {
                    '0%': {
                        transform: 'translateY(-15%)',
                    },
                    '50%': {
                        transform: 'none',
                    },
                    '100%': {
                        transform: 'translateY(-15%)',
                    },
                },
            },
            fontFamily: {
                mont: ['Montserrat'],
            },
            fontSize: {
                smallH1: '2.5rem',
                bigH1: '4.5rem',

                smallH2: '1.5rem',
                bigH2: '2.5rem',

                smallA: '1rem',
                bigA: '1.2rem',

                smallButton: '1.2rem',
                bigButton: '1.5rem',
            },
            colors: {
                purple: '#3b2d60',
                pink: '#e78dd2',
                white: '#fefefe',
                brown: '#dfb59c',
                blue: '#dde6ff',
                transparentBrown: '#dfb59c20',
                transparentBlue: '#dde6ff60',
            },
        },
        plugins: [
            /*plugin(function({ addBase, config }) {
                                              addBase({
                                                  h1: {
                                                      fontFamily: config('theme.fontFamily.mont'),
                                                      fontWeight: '100',
                                                      //fontWeight: 'bold',
                                                  },
                                                  h2: {
                                                      fontWeight: '400',
                                                      //fontWeight: 'bold',
                                                  },
                                              })
                                          }),*/
        ],
    },
}