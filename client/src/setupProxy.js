const createProxyMiddleware = require('http-proxy-middleware');

const EXPRESS_HOST = process.env.EXPRESS_HOST;
const EXPRESS_PORT = process.env.EXPRESS_PORT;

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${EXPRESS_HOST}:${EXPRESS_PORT}`,
    })
  );
};
