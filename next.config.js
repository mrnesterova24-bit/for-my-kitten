/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
 
}
webpack: (config) => {
  config.watchOptions = {
    ignored: ['**/node_modules', 'C:/$Recycle.Bin/**', 'C:/System Volume Information/**'],
  };
  return config;
},
module.exports = nextConfig
