const {
    createProxyMiddleware
} = require('http-proxy-middleware')

module.exports = (req, res) => {
    let target = ''
    let headers= {}
    // 代理目标地址
    if (req.url.startsWith('/mjapi')) { //这里使用/api可能会与vercel serverless 的 api 路径冲突，根据接口进行调整
        target = process.env.MJ_SERVER??'https://api.openai.com';
        headers= {
            'Mj-Api-Secret': process.env.MJ_API_SECRET // 添加自定义请求头
        }
    }else if(req.url.startsWith('/openapi')){
        target = process.env.OPENAI_API_BASE_URL??'https://api.openai.com';
        headers= {
            'Authorization': 'Bearer ' +process.env.OPENAI_API_KEY // 添加自定义请求头
        }
    }
    // 创建代理对象并转发请求
    createProxyMiddleware({
        target,
        changeOrigin: true,
        headers,
        pathRewrite: {
            // 通过路径重写，去除请求路径中的 `/api`
            '^/mjapi/': '/'
            ,'^/openapi/': '/'
        }
    })(req, res)
}

// module.exports = function(app) {
//   // 如果请求以/mjapi开头，将请求代理到MJ_SERVER
//   app.use('/mjapi', createProxyMiddleware({
//     target: process.env.MJ_SERVER || 'https://api.openai.com',
//     changeOrigin: true,
//     headers: {
//       'Mj-Api-Secret': process.env.MJ_API_SECRET
//     },
//     pathRewrite: { '^/mjapi/': '/' }
//   }));

//   // 如果请求以/openapi开头，将请求代理到OPENAI_API_BASE_URL
//   app.use('/openapi', createProxyMiddleware({
//     target: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com',
//     changeOrigin: true,
//     headers: {
//       'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
//     },
//     pathRewrite: { '^/openapi/': '/' }
//   }));

//   // 如果请求以/api开头，将请求代理到VITE_APP_API_BASE_URL
//   app.use('/api', createProxyMiddleware({
//     target: process.env.VITE_APP_API_BASE_URL || 'http://127.0.0.1:3002',
//     changeOrigin: true,
//     pathRewrite: { '^/api/': '/' }
//   }));
// };
