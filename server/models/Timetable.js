import mongoose from 'mongoose';

const dayScheduleSchema = {
  type: [String],
  default: [],
};

const timetableSchema = new mongoose.Schema({
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [9, 'Semester cannot exceed 9'],
  },
  section: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: [true, 'Section is required'],
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true,
  },
  includeSaturday: {
    type: Boolean,
    default: false,
  },
  timeSlots: {
    type: [String],
    default: [],
  },
  schedule: {
    monday: dayScheduleSchema,
    tuesday: dayScheduleSchema,
    wednesday: dayScheduleSchema,
    thursday: dayScheduleSchema,
    friday: dayScheduleSchema,
    saturday: dayScheduleSchema,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

timetableSchema.index(
  { department: 1, semester: 1, section: 1, academicYear: 1 },
  { unique: true }
);

const Timetable = mongoose.model('Timetable', timetableSchema);

export default Timetable;
