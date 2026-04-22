const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const fileRoutes = require('./routes/fileRoutes');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
const clientBuildPath = path.resolve(__dirname, '..', 'client', 'dist');

app.use(
  cors({
    origin: clientOrigin,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

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