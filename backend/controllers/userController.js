import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'
import crypto from 'crypto'

const parseRequestBody = (body) => {
    if (body && typeof body === 'object') return body

    if (typeof body === 'string') {
        try {
            return JSON.parse(body)
        } catch {
            return {}
        }
    }

    return {}
}


const registerUser = async (req,res) => {
    try {
        const payload = parseRequestBody(req.body)
        const { name,email,password } = payload

        if(!name || !email || !password){
            return res.status(400).json({success:false,message:"Missing Details"})
        }

        if(!req.body){
            return res.status(400).json({success:false,message:"Invalid request payload"})
        }

        if( !validator.isEmail(email)){
            return res.json({success:false,message:"Enter a valid email"})

        }
        if(password.length < 8){
            return res.json({success:false,message:"Enter a strong password"})

        }

        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false,message:"Email is already registered"})
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token})


    } catch (error) {
        console.log(error);
        if(error.code === 11000){
            return res.json({success:false,message:"Email is already registered"})
        }

        res.json({success:false,message:error.message})
        
        
    }
}

const loginUser = async (req,res) => {
    try {
        const payload = parseRequestBody(req.body)
        const {email,password} = payload

        if(!email || !password){
            return res.status(400).json({success:false,message:'Email and password are required'})
        }

        if(!req.body){
            return res.status(400).json({success:false,message:"Invalid request payload"})
        }

        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        } else{
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}

const getProfile = async (req,res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({success:true,userData})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }

}

const updateProfile = async (req,res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file
        if(!name || !phone || !dob || !gender){
            return res.json({success:false,message:"Data missing!!"})
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }
        res.json({success:true,message:"Profile Updated"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}

const bookAppointment = async (req,res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({success:false,message:"Doctor not available"})
        }

        let slots_booked = docData.slots_booked

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:"Slot not available"})
            } else {
                slots_booked[slotDate].push(slotTime)
            }

        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)

        }

        const userData = await userModel.findById(userId).select('-password')
        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotDate,
            slotTime,
            date:Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()  

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"Appointment booked successfully"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}

//api to get user appointments

const listAppointment = async(req,res) => {
    try {
        
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//API to cancel appointment

const cancelAppointment = async(req,res) => {
    try {
        
        const {userId,appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        
        if(appointmentData.userId !== userId){
            return res.json({success:false,message:"Unauthorized access"})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

        //releasing doctor slot

        const {docId, slotDate, slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true,message:"Appointment cancelled successfully"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

//api to make payment using razorpay

const paymentRazorpay = async (req,res) => {

    try {
        
        const { appointmentId } = req.body
        const { userId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(!appointmentData || appointmentData.cancelled){
            return res.json({success:false,message:"Appointment not found or already cancelled"})
        }

        if(appointmentData.userId !== userId){
            return res.status(403).json({success:false,message:"Unauthorized access"})
        }

        if(appointmentData.payment){
            return res.json({success:false,message:"Appointment already paid"})
        }

        //creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100, 
            currency: process.env.CURRENCY,
            receipt: appointmentId
        }

        const order = await razorpayInstance.orders.create(options)

        await appointmentModel.findByIdAndUpdate(appointmentId,{
            razorpayOrderId: order.id,
            paymentStatus: 'pending'
        })

        res.json({success:true,order})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
    

}

//api to verify payment of razorpay

const verifyRazorpay = async (req,res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
            return res.status(400).json({success:false,message:"Missing payment verification fields"})
        }

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        if(generatedSignature !== razorpay_signature){
            return res.status(400).json({success:false,message:"Invalid payment signature"})
        }

        const appointment = await appointmentModel.findOne({razorpayOrderId: razorpay_order_id})

        if(!appointment){
            return res.status(404).json({success:false,message:"Appointment not found for this order"})
        }

        if(appointment.payment){
            return res.json({success:true,message:"Payment already verified"})
        }

        await appointmentModel.findByIdAndUpdate(appointment._id,{
            payment: true,
            paymentStatus: 'paid',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paymentVerifiedAt: new Date()
        })

        res.json({success:true,message:"Payment successful"})


    } catch (error) {

        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//api webhook callback from razorpay

const razorpayWebhook = async (req,res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

        if(!webhookSecret){
            return res.status(500).json({success:false,message:'Webhook secret is not configured'})
        }

        const signature = req.headers['x-razorpay-signature']
        const rawBody = req.body

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex')

        if(signature !== expectedSignature){
            return res.status(400).json({success:false,message:'Invalid webhook signature'})
        }

        const eventData = JSON.parse(rawBody.toString())
        const eventType = eventData?.event
        const eventId = eventData?.payload?.payment?.entity?.id || eventData?.payload?.order?.entity?.id || ''

        if(eventType === 'payment.captured' || eventType === 'order.paid'){
            const paymentEntity = eventData?.payload?.payment?.entity
            const orderEntity = eventData?.payload?.order?.entity
            const orderId = paymentEntity?.order_id || orderEntity?.id
            const paymentId = paymentEntity?.id || ''

            if(orderId){
                const appointment = await appointmentModel.findOne({razorpayOrderId: orderId})

                if(appointment && appointment.lastRazorpayEventId !== eventId && !appointment.payment){
                    await appointmentModel.findByIdAndUpdate(appointment._id,{
                        payment: true,
                        paymentStatus: 'paid',
                        razorpayPaymentId: paymentId,
                        paymentVerifiedAt: new Date(),
                        lastRazorpayEventId: eventId
                    })
                }
            }
        }

        if(eventType === 'payment.failed'){
            const paymentEntity = eventData?.payload?.payment?.entity
            const orderId = paymentEntity?.order_id

            if(orderId){
                const appointment = await appointmentModel.findOne({razorpayOrderId: orderId})

                if(appointment && appointment.lastRazorpayEventId !== (paymentEntity?.id || '')){
                    await appointmentModel.findByIdAndUpdate(
                        appointment._id,
                        {paymentStatus: 'failed', lastRazorpayEventId: paymentEntity?.id || ''}
                    )
                }
            }
        }

        res.status(200).json({success:true})

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:error.message})
    }
}

export {registerUser,loginUser,getProfile,updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay, razorpayWebhook}