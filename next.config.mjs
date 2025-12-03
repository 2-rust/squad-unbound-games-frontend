/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore optional dependencies that aren't needed for web builds
    config.resolve.alias = {
      ...config.resolve.alias,
      // Ignore optional React Native dependencies (not needed for web)
      '@react-native-async-storage/async-storage': false,
      // Ignore optional pino-pretty dependency (only needed for development logging)
      'pino-pretty': false,
    };
    
    return config;
  },
};

export default nextConfig;
