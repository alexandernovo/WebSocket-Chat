// middleware.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (options) => {
    const proxyMiddleware = createProxyMiddleware(options);

    return (req, res, next) => {
        // Check if the request is targeting the React development server
        if (req.url.startsWith('/')) {
            // If it is, skip the proxy and let the request be handled by Vite
            next();
        } else {
            // If not, forward the request to the proxy server
            proxyMiddleware(req, res, next);
        }
    };
};
