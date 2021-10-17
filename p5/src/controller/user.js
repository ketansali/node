const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");

exports.Signup = async(req, res) => {
    try {
        const _user = new User(req.body)
        const token = jwt.sign({ _id: _user._id, }, process.env.KEY, {
            expiresIn: "2h"
        })

        const url = `http://localhost:7600/api/UserVerification/${token}`
        await main(_user.email, url)
        await _user.save((error, data) => {
            if (error) return res.status(200).json({ error })
            if (data) {
                return res.status(200).json({ data })
            }
        })

    } catch (error) {
        console.log(error);
    }
}
exports.Signin = async(req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const _email = await User.findOne({ email: email })

        if (_email != null) {
            const isMatch = bcrypt.compareSync(password, _email.hash_password)
            if (isMatch) {
                return res.status(200).json({ _email, message: "User Login Successfully" })
            } else {
                return res.status(200).json({ _message: "invalid Password" })
            }
        } else {
            return res.status(200).json({ _message: "Invalid Email" })
        }


    } catch (error) {
        console.log(error);
    }
}
exports.getUser = async(req, res) => {
    try {
        const data = await User.find({})
        return res.status(200).json({ data })
    } catch (error) {
        console.log(error);
    }
}

exports.Deleteuser = async(req, res) => {
    try {
        const id = req.params.id
        const data = await User.findByIdAndDelete(id)
        return res.status(200).json({ data, "message": "User Deleted" })
    } catch (error) {
        console.log(error);
    }

}
exports.updateUser = async(req, res) => {
    try {
        const id = req.params.id
        const data = await User.findByIdAndUpdate({ _id: id }, req.body, {
            new: true
        })
        return res.status(200).json({ data, "message": "User Updated" })
    } catch (error) {
        console.log(error);
    }
}

async function main(email, url) {

    await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'bookselling7600@gmail.com', // generated ethereal user
            pass: 'Book@7600', // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: 'bookselling7600@gmail.com', // sender address
        to: email, // list of receivers
        subject: "User Verification", // Subject line
        text: "Verification", // plain text body
        html: `${url}` // html body
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}

main().catch(console.error);

exports.UserVerification = async(req, res) => {
    const token = req.params.token
    if (!token) return res.status(400).json({ message: "Token Is Require For User Vrification" })
    const _user = jwt.verify(token, process.env.KEY)

    await User.updateOne({ _id: _user._id }, { isVerified: 1 })
    return res.json({ _user, message: "User Verified" })
}