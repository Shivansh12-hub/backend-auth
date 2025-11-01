import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";
import { transporter } from "../config/nodemailer.js";

// export const register = async (req, res) => {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.json({
//             success: false,
//             message:"enter all values"
//         })
//     }

//     if (!validator.isEmail(email)) {
//         return res.json({
//             success: false,
//             message:"Envalid email"
//         })
    
//     }

//     try {
//         const existingUser = await userModel.findOne({ email });
//         if (existingUser) {
//             return res.json({
//                 success:false,
//                 message: "user already exist"
//             })
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = new userModel({ name, email, password: hashedPassword });
//         await user.save();

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '4d' });

//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         });

//         // sending welcome email
//         // const mailOptions = {
//         //     from: process.env.SENDER_EMAIL,
//         //     to: email,
//         //     subject: 'Welcome to the Game Recommenders',
//         //     text: `Hey user welcome to the ocean of the games. You can explore thousands of game on our web application. Your account has been succesfully created with ${email}`
//         // }
//         // await transporter.sendMail(mailOptions)


//         const mailOptions = {
//             from: process.env.G_USER,
//             to: email,
//             subject: 'Welcome to the Game Recommenders',
//             text: `Hey user welcome to the ocean of the games. You can explore thousands of game on our web application. Your account has been succesfully created with ${email}`
//         }
//         await transporter.sendMail(mailOptions)


//         return res.json({
//             success:true
//         })
        
//     } catch (error) {
//         res.json({
//             success: false,
//             message:"Registration failed",
//             message:error.message
//         })
//     }
// }



export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            success: false,
            message:"enter all values"
        })
    }

    if (!validator.isEmail(email)) {
        return res.json({
            success: false,
            message:"Envalid email"
        })
    
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({
                success:false,
                message: "user already exist"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '4d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // sending welcome email
        // const mailOptions = {
        //     from: process.env.SENDER_EMAIL,
        //     to: email,
        //     subject: 'Welcome to the Game Recommenders',
        //     text: `Hey user welcome to the ocean of the games. You can explore thousands of game on our web application. Your account has been succesfully created with ${email}`
        // }
        // await transporter.sendMail(mailOptions)


        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 6 * 60 * 1000; // 6 minutes
        await user.save();

        const mailOptions = {
            from: process.env.G_USER,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Here is your one-time verification code: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        return res.json({
            success:true
        })
        
    } catch (error) {
        res.json({
            success: false,
            message:"Registration failed",
            message:error.message
        })
    }
}





export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message:"enter all values"
        })
    }
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message:"envalid email"
            })
        };

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.json({
                success: false,
                message:"password incorrect"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '4d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({
            success: true,
            message: "user loged in success",
            data:user
        })

        
    } catch (error) {
        res.json({
            success: false, 
            message: "login failed",
            message:error.message
        })
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({
            success: true,
            message:"logged Out"
        })
    } catch (error) {
        return res.json({
            success: false,
            message:error.message
        })
    }
}

// send varification otp to user's email


// export const sendVerifyOtp = async (req, res) => {
//     try {
//         const userId = req.userId; //  from middleware
//         const user = await userModel.findById(userId);

//         if (user.isAccountVerified) {
//             return res.json({
//                 success: false,
//                 message: "Account already verified"
//             });
//         }

//         const otp = String(Math.floor(100000 + Math.random() * 900000));
//         user.verifyOtp = otp;
//         user.verifyOtpExpireAt = Date.now() + 6 * 60 * 1000; // 6 minutes
//         await user.save();

//         const mailOptions = {
//             from: process.env.G_USER,
//             to: user.email,
//             subject: 'Account Verification OTP',
//             text: `Here is your one-time verification code: ${otp}`
//         };

//         await transporter.sendMail(mailOptions);

//         res.json({
//             success: true,
//             message: "OTP sent successfully"
//         });
//     } catch (error) {
//         res.json({
//             success: false,
//             message: error.message
//         });
//     }
// };


export const verifyEmail = async (req, res) => {
    const { otp } = req.body; //  OTP comes from frontend
    const userId = req.userId; //  from middleware

    if (!otp) {
        return res.json({
            success: false,
            message: "Missing OTP"
        });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (user.verifyOtp !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP Expired"
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();

        return res.json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};


export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true,
            message:"Authenticated user"
        })
    } catch(error) {
        return res.json({
            success: false,
            message:error.message
        })
    }
}

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({
            success: false,
            message:"Email is require"
        })
    }
    try {
        
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "user not found"
            })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 6 * 60 * 1000; // 6 minutes
        await user.save();

        const mailOption = {
            from: process.env.ENDER_EMAIL,
            to: user.email,
            subject: 'Here is the Opt for your forget password',
            text:`Your otp is ${otp}, use this opt for resetting password `
        }

        await transporter.sendMail(mailOption)

        return res.json({
            success: true,
            message:"opt is successfully send to your email"
        })

    } catch (error) {
        return res.json({
            success: false,
            message: "Error occur while sending otp ",
            message:error.message
        })
    }
}

// reset user password

    export const resetPassword = async (req, res)=>{

        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.json({
                success: false,
                message:"enter all require field"
            })
        }

        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.json({
                    success: false,
                    message:"user not found"
                })
            }
            else if ( user.resetOtp === "") {
                return res.json({
                    success: false,
                    message: "otp not sent successfully"
                });
            }
            else if (user.resetOtpExpireAt < Date.now()) {
                return res.json({
                    success: false,
                    message:"OTP expires"
                })
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetOtp = "";
            user.resetOtpExpireAt = 0;
            await user.save();
            return res.json({
                    success: true,
                    message: "otp verified successfully"
                });
            
        } catch (error) {
            return res.json({
                success: false,
                message:error.message
            })
        }
    }