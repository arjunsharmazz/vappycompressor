const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const builderRoutes = require('./routes/builderRoutes');
const fileRoutes = require('./routes/fileRoutes');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const clientBuildPath = path.resolve(__dirname, '..', 'client', 'dist');

function parseConfiguredOrigins() {
  const configuredOrigins = [process.env.CLIENT_URLS, process.env.CLIENT_URL]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  if (configuredOrigins.length) {
    return configuredOrigins;
  }

  return ['http://localhost:5173'];
}

function normalizeOrigin(origin) {
  return origin.replace(/\/$/, '');
}

function createOriginMatcher(pattern) {
  const normalizedPattern = normalizeOrigin(pattern);

  if (normalizedPattern.includes('*')) {
    const escapedPattern = normalizedPattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*');

    return new RegExp(`^${escapedPattern}$`);
  }

  return normalizedPattern;
}

const allowedOriginMatchers = parseConfiguredOrigins().map(createOriginMatcher);

function isAllowedOrigin(origin) {
  const normalizedOrigin = normalizeOrigin(origin);

  return allowedOriginMatchers.some((matcher) => {
    if (matcher instanceof RegExp) {
      return matcher.test(normalizedOrigin);
    }

    return matcher === normalizedOrigin;
  });
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('This origin is not allowed to access the API.'));
    },
  }),
);
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '20mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/builder', builderRoutes);
app.use('/builder', builderRoutes);
app.use('/api', fileRoutes);

app.use((error, _request, response, _next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return response.status(400).json({ message: 'Each image must be 5 MB or smaller.' });
  }

  if (error.message) {
    return response.status(400).json({ message: error.message });
  }

  return response.status(500).json({ message: 'Unexpected server error.' });
});

if (require('fs').existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api')) {
      return next();
    }

    return response.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

module.exports = app;