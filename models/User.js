const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
joiningFee: Number,
referralCode: String,
referrals : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],
referInCome: Number,
totalInCome: Number,
totalWithdraw: Number,
withdrawAmount: Number,
withdrawStatus: Boolean,
withdrawDate: Date,
withdrawMethod: String,
withdrawAccount: String,
withdrawAccountName: String,


    email: String,
    password: String,
    role: String,
    status: Boolean,
    

},
  { timestamps: true}
);

const User = mongoose.model('User', userSchema);
module.exports = User;
