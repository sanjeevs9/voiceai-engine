import express from "express";
import http from "http";
import WebSocket from "ws";
import rateLimit from "express-rate-limit";
import router from "./routes/Routes";
import { initializeWebSocket } from "./WebSocket";
import { errorHandler } from "./middlewares/ErrorHandler";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ server });

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1); // Trust the first proxy (ngrok/nginx)
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://voiceai.sanjeevdev.in"], // Add your frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
}));

// Initializing Websocket Server
initializeWebSocket(wss);

// App router
app.use("/", router);
app.use(errorHandler);

server.listen(port, () => {
  console.log(`Listening at Port ${port}`);
});
