const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const productRoutes = require("./routes/ProductRoutes");
const  http = require('http');
const https = require("https");
const fs = require("fs");

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World');
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes API
app.use("/api/products", productRoutes);

// Servir le frontend React
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Connexion à MongoDB
mongoose.set("strictQuery", false);
const mongoURI ="mongodb://mongo:27017/msldb";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connecté à MongoDB");

    // Démarrer le serveur HTTP
    const PORT =  80;
  http.createServer((req, res) => {
  const host = req.headers.host.replace(/:\d+$/, ''); // remove port if any
  res.writeHead(301, { "Location": `https://${host}${req.url}` });
  res.end();
}).listen(80, () => {
  console.log("🌐 HTTP server listening on port 80 (redirecting to HTTPS)");
});
   const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
};

// 🚀 Start HTTPS server
https.createServer(httpsOptions, app).listen(443, () => {
  console.log("🚀 Serveur HTTPS démarré sur le port 443");
});

  })
  .catch((error) => {
    console.error("❌ Erreur de connexion MongoDB:", error);
  });
