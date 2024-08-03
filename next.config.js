module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "media0.giphy.com",
      "media1.giphy.com",
      "media2.giphy.com",
      "media3.giphy.com",
      "media4.giphy.com",
    ],
  },
  env: {
    GIPHY_API_KEY: process.env.GIPHY_API_KEY,
  },
};
