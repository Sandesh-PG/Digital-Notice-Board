import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['academic', 'events', 'general'],
    required: [true, 'Category is required']
  },
  pinned: {
    type: Boolean,
    default: false
  },
  expiryDate: {
    type: Date
  }
}, {
  timestamps: true
});

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
