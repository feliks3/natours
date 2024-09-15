require('./loadEnv');
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const logger = require('./config/logger');

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Application API',
      version: '1.0.0',
      description: 'API Documentation for Application Management',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:8000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}
