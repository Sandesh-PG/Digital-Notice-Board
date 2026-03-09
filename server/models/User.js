import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["student", "teacher", "admin"],
			default: "student",
		},
	},
	{
		timestamps: true,
	}
);

// Hash password only when it is created or updated.
userSchema.pre("save", async function hashPassword() {
	if (!this.isModified("password")) {
		return;
	}

	// Skip re-hashing if password is already a bcrypt hash from controller.
	if (typeof this.password === "string" && this.password.startsWith("$2")) {
		return;
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
