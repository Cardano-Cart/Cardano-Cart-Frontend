/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "charming-ninnetta-knust-028ea081.koyeb.app"],
  },
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true, // ✅ Enable WebAssembly support
      layers: true,
      
   
    };
    

    return config;
  },
  
};

export default nextConfig;