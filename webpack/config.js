const hotServerHost = 'localhost';
const hotServerPort = 8081;

module.exports = {
  devServerUrl: 'http://localhost:8080',
  hotServerPort,
  hotServerHost,
  hotServerUrl: `http://${hotServerHost}:${hotServerPort}`,
  productionServerUrl: 'https://localhost'
};
