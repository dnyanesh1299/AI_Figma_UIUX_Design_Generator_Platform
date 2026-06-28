import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "passport";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { AppError } from "./utils/errors.js";
import "./config/passport.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const imagesDir = join(__dirname, "images");
const backendOrigin = `http://localhost:${env.port}`;
const loopbackBackendOrigin = `http://127.0.0.1:${env.port}`;
const allowedOrigins = new Set([
  env.frontendUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]);
const localhostOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools and requests without Origin header.
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.has(origin) || localhostOriginPattern.test(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS origin denied: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", "data:", backendOrigin, loopbackBackendOrigin],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(passport.initialize());
app.use("/assets/images", express.static(imagesDir));

app.use("/api", routes);

app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode ?? 500;
  const message = statusCode >= 500 ? "Internal server error" : error.message;
  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  res.status(statusCode).json({ message });
});

export default app;
