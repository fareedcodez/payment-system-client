export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.REACT_APP_API_URL': JSON.stringify('http://localhost:8000/api'),
    'process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY': JSON.stringify('your-flutterwave-public-key'),
  }
});