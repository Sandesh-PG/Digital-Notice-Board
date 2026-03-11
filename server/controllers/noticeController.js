import Notice from '../models/Notice.js';


export const createNotice = async (req, res) => {
	try {
		const notice = await Notice.create({
			...req.body,
			author: req.user.id
		});

		return res.status(201).json({
			success: true,
			message: 'Notice created successfully',
			data: notice,
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: 'Failed to create notice',
			error: error.message,
		});
	}
};

export const getNotices = async (req, res) => {
	try {
		const notices = await Notice.find()
			.populate('author', 'name role')
			.sort({ pinned: -1, createdAt: -1 });

		return res.status(200).json({
			success: true,
			count: notices.length,
			data: notices,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch notices',
			error: error.message,
		});
	}
};

export const updateNotice = async (req, res) => {
	try {
		const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updatedNotice) {
			return res.status(404).json({
				success: false,
				message: 'Notice not found',
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Notice updated successfully',
			data: updatedNotice,
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: 'Failed to update notice',
			error: error.message,
		});
	}
};

export const deleteNotice = async (req, res) => {
	try {
		const deletedNotice = await Notice.findByIdAndDelete(req.params.id);

		if (!deletedNotice) {
			return res.status(404).json({
				success: false,
				message: 'Notice not found',
			});
		}

		return res.status(200).json({
			success: true,
			message: 'Notice deleted successfully',
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: 'Failed to delete notice',
			error: error.message,
		});
	}
};


