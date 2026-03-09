import express from 'express';
import {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice,
} from '../controllers/noticeController.js';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getNotices).post(protect, authorizeRoles('teacher', 'admin'), createNotice);
router
  .route('/:id')
  .put(protect, authorizeRoles('teacher', 'admin'), updateNotice)
  .delete(protect, authorizeRoles('teacher', 'admin'), deleteNotice);

export default router;