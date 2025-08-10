/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary palette - blues as main theme
                'light-sky-blue': '#97d2fb',      // Main background
                'jordy-blue': '#83bcff',          // Primary accent
                'deep-sky-blue': '#4A9EFF',       // Darker accent
                'powder-blue': '#B8E6FF',         // Lighter variant
                charcoal: '#333333',
                'jordy-blue': '#75A9FF',
                'light-sky-blue': '#87CEFA',
                'coral-red': '#FF6F61',
                'forest-green': '#228B22',

                // Secondary palette - complementary colors
                'mimi-pink': '#FFB3D9',           // Brightened pink for better contrast
                'coral-accent': '#FF6B9D',        // Stronger coral for CTA
                'peach-cream': '#FFE8D6',         // Warm neutral

                // Neutral palette
                'charcoal': '#2D3748',            // Darkened for better contrast
                'slate-gray': '#4A5568',          // Mid-tone gray
                'light-gray': '#E2E8F0',         // Light gray
                'warm-white': '#FEFEFE',          // Slightly warm white

                // Accent colors
                'forest-green': '#38A169',        // Success/positive
                'emerald-green': '#48BB78',       // Lighter green variant
                'amber-yellow': '#F6AD55',        // Warning
                'sunset-orange': '#FF8C42',       // Energy/excitement

                // Dark mode colors
                'dark-bg': '#1A202C',
                'dark-card': '#2D3748',
                'dark-text': '#E2E8F0',
                'dark-accent': '#4299E1',

                // Status colors
                'success': '#38A169',
                'warning': '#F6AD55',
                'error': '#E53E3E',
                'info': '#3182CE',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'display': ['Poppins', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
                'medium': '0 4px 25px rgba(0, 0, 0, 0.12)',
                'strong': '0 8px 40px rgba(0, 0, 0, 0.16)',
                'glow': '0 0 20px rgba(131, 188, 255, 0.3)',
                'glow-pink': '0 0 20px rgba(255, 179, 217, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'bounce-subtle': 'bounceSubtle 2s infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' }
                },
                pulseGlow: {
                    '0%': { boxShadow: '0 0 5px rgba(131, 188, 255, 0.3)' },
                    '100%': { boxShadow: '0 0 20px rgba(131, 188, 255, 0.6)' }
                }
            },
            backdropBlur: {
                'xs': '2px',
            },
            borderRadius: {
                '4xl': '2rem',
            }
        },
    },
    plugins: [],
}