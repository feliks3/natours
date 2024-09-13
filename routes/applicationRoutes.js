const express = require('express');
const {
  getApplications,
  createApplication,
  deleteApplication,
  updateApplication,
} = require('../controllers/applicationController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications
 *     responses:
 *       200:
 *         description: List of applications
 */
router.get('/', authenticate, getApplications);

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Create a new application
 *     responses:
 *       201:
 *         description: Application created
 */
router.post('/', authenticate, createApplication);

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     summary: Delete an application
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The application ID
 *     responses:
 *       200:
 *         description: Application deleted
 */
router.delete('/:id', authenticate, deleteApplication);

/**
 * @swagger
 * /api/applications/{id}:
 *   put:
 *     summary: Update an application
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The application ID
 *     responses:
 *       200:
 *         description: Application updated
 */
router.put('/:id', authenticate, updateApplication);

module.exports = router;
