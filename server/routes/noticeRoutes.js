import express from 'express';
import {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice,
} from '../controllers/noticeController.js';

const router = express.Router();

router.route('/').post(createNotice).get(getNotices);
router.route('/:id').put(updateNotice).delete(deleteNotice);

export default router;