import Timetable from '../models/Timetable.js';

const validateTimetablePayload = (payload) => {
	const { department, semester, section, academicYear, timeSlots, schedule } = payload;

	if (!department || typeof department !== 'string' || !department.trim()) {
		return 'Department is required';
	}

	if (semester === undefined || semester === null || Number.isNaN(Number(semester))) {
		return 'Semester is required';
	}

	const parsedSemester = Number(semester);
	if (parsedSemester < 1 || parsedSemester > 9) {
		return 'Semester must be between 1 and 9';
	}

	if (!section || typeof section !== 'string' || !section.trim()) {
		return 'Section is required';
	}

	if (!academicYear || typeof academicYear !== 'string' || !academicYear.trim()) {
		return 'Academic year is required';
	}

	if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
		return 'timeSlots must be a non-empty array';
	}

	if (!schedule || typeof schedule !== 'object' || Array.isArray(schedule)) {
		return 'Schedule is required';
	}

	const requiredDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
	for (const day of requiredDays) {
		if (!Array.isArray(schedule[day])) {
			return `Schedule for ${day} must be an array`;
		}

		if (schedule[day].length !== timeSlots.length) {
			return `Schedule for ${day} must have the same number of entries as timeSlots`;
		}
	}

	return null;
};

export const createTimetable = async (req, res) => {
	try {
		if (!req.user || !['teacher', 'admin'].includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: 'Only teachers and admins can create timetables',
			});
		}

		const validationError = validateTimetablePayload(req.body);
		if (validationError) {
			return res.status(400).json({
				success: false,
				message: validationError,
			});
		}

		const timetable = await Timetable.create({
			...req.body,
			createdBy: req.user._id,
		});

		return res.status(201).json({
			success: true,
			message: 'Timetable created successfully',
			data: timetable,
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: 'Failed to create timetable',
			error: error.message,
		});
	}
};

export const getAllTimetables = async (req, res) => {
	try {
		const { department, semester, section, academicYear } = req.query;
		const filter = {};

		if (department) {
			filter.department = department;
		}

		if (semester) {
			filter.semester = Number.parseInt(semester, 10);
		}

		if (section) {
			filter.section = section;
		}

		if (academicYear) {
			filter.academicYear = academicYear;
		}

		const timetables = await Timetable.find(filter)
			.populate('createdBy', 'name role')
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			count: timetables.length,
			data: timetables,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch timetables',
			error: error.message,
		});
	}
};

export const getTimetableById = async (req, res) => {
	try {
		const timetable = await Timetable.findById(req.params.id).populate('createdBy', 'name role');

		if (!timetable) {
			return res.status(404).json({
				success: false,
				message: 'Timetable not found',
			});
		}

		return res.status(200).json({
			success: true,
			data: timetable,
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: 'Failed to fetch timetable',
			error: error.message,
		});
	}
};

export const updateTimetable = async (req, res) => {
	try {
		const timetable = await Timetable.findById(req.params.id);

		if (!timetable) {
			return res.status(404).json({
				success: false,
				message: 'Timetable not found',
			});
		}

		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: 'Not authorized',
			});
		}

		const isCreator = timetable.createdBy?.toString() === req.user._id.toString();
		const isAdmin = req.user.role === 'admin';

		if (!isCreator && !isAdmin) {
			return res.status(403).json({
				success: false,
				message: 'Only the creator or an admin can update this timetable',
			});
		}

		const validationError = validateTimetablePayload(req.body);
		if (validationError) {
			return res.status(400).json({
				success: false,
				message: validationError,
			});
		}

		const updatedTimetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		}).populate('createdBy', 'name role');

		return res.status(200).json({
			success: true,
			message: 'Timetable updated successfully',
			data: updatedTimetable,
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: 'Failed to update timetable',
			error: error.message,
		});
	}
};

export const deleteTimetable = async (req, res) => {
	try {
		if (req.user?.role !== 'admin') {
			return res.status(403).json({
				success: false,
				message: 'Only admins can delete timetables',
			});
		}

		const deletedTimetable = await Timetable.findByIdAndDelete(req.params.id);

		if (!deletedTimetable) {
			return res.status(404).json({
				success: false,
				message: 'Timetable not found',
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Timetable deleted successfully',
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: 'Failed to delete timetable',
			error: error.message,
		});
	}
};
