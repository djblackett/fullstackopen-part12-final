const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://backend:8080',  // Replace with your backend service address
            changeOrigin: true,
        })
    );
    app.use(
        '/sockjs-node',
        createProxyMiddleware({
            target: 'http://frontend:3000',  // Replace with your frontend dev server address
            ws: true,
            changeOrigin: true,
        })
    );

    app.use(
        '/ws',
        createProxyMiddleware({
            target: 'ws://frontend:3000',
            ws: true
        })
    );
};