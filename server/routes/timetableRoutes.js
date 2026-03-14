import express from 'express';
import {
  createTimetable,
  getAllTimetables,
  getTimetableById,
  updateTimetable,
  deleteTimetable,
} from '../controllers/timetableController.js';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getAllTimetables)
  .post(protect, authorizeRoles('teacher', 'admin'), createTimetable);

router
  .route('/:id')
  .get(protect, getTimetableById)
  .put(protect, updateTimetable)
  .delete(protect, authorizeRoles('admin'), deleteTimetable);

export default router;