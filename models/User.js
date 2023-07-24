const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const CounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

const counter = mongoose.model('counter', CounterSchema);

const UserSchema = new mongoose.Schema({
    _id: {type: Number},
    username: { type: String, required: true, minlength: 6, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    password: { type: String, required: true, minlength: 6 },
    vehicleRegNo: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emergencyContactNumber: { type: String, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    vehicleType: { type: String, required: true },
    fcmToken: { type: String, required: false }
});

// Hash the password before saving it to the database
UserSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

UserSchema.pre('save', async function(next) {
    if (this.isNew) {  // Check if document is new
        const doc = this;
        const countDoc = await counter.findByIdAndUpdate({_id: 'userId'}, {$inc: {seq: 1}}, {new: true, upsert: true});
        doc._id = countDoc.seq;
    }
    next();
});



module.exports = mongoose.model('User', UserSchema);
