const functions = require("@google-cloud/functions-framework");
const httpProxy = require("http-proxy");
const https = require("https");

const pass_target = "https://api.openai.com";

const httpsAgent = new https.Agent();
const proxy = httpProxy.createServer({
  target: pass_target,
  agent: httpsAgent,
  changeOrigin: true,
  proxyTimeout: 30000,
});

functions.http("pass_proxy", (req, res) => {
  proxy.on("error", function (err, req, res) {
    res.writeHead(500, {
      "Content-Type": "text/plain",
    });
    res.end(
      `Something went wrong. And we are reporting a custom error message.`
    );
  });

  proxy.on("proxyReq", function (proxyReq, req, res) {
    if (req.body && req.complete) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.write(bodyData);
    }
  });

  proxy.web(req, res);
});
