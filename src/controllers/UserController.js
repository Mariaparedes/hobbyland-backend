import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as responses from "../helpers/responses.js";
import Follows from "../models/Follows.js";
import cloudinary from "../helpers/cloudinary.js";

// ******************** User CRUD ************************
export const createUser = async (req, res) => {
  try {
    const { 
      firstName,
      lastName,
      email,
      password,
      birthday } = req.body

    const user = await User.findOne({
      email: email,
      status: true,
    })

    if (user) {

      responses.responseGeneric(res, 400, `User with email ${email} exist`)

    } else if (await User.findOne({
      email: email,
      status: false,
    })) {

      const saveUser = await User.findOneAndUpdate({ email: email }, {
        $set: {
          status: true,
          deletedAt: null
        }
      })

      responses.responseOK(res, 200, 'Activated user', saveUser)

    } else {

      const user = new User({
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password),
        birthday,
      })

      const saveUser = await user.save()
      responses.responseOK(res, 201, 'User created', saveUser)

    }

  } catch (error) {
    console.log(error)
    responses.responseServerError(res, error)
  }
}

export const login = async (req, res) => {
  try {

    const { email, password } = req.body

    const valUser = await User.findOne({
      email
    })

    if (!valUser) {
      return responses.responseNotFound(res, 'Incorrect credentials', valUser)
    }

    const valPass = await bcrypt.compare(password, valUser.password)

    if (!valPass) {
      return responses.responseGeneric(res, '401', 'Incorrect credentials')
    }

    const token = jwt.sign({ id: valUser._id, }, process.env.SECRET_KEY, { expiresIn: '1w' })

    const user = {
      id: valUser._id,
      firstName: valUser.firstName,
      lastName: valUser.lastName,
      token: token
    }

    responses.responseOK(res, 200, 'Success', user)

  } catch (error) {
    responses.responseServerError(res, error)
  }
} 

export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find({ status: true }).exec()

    if(users.length) return responses.responseOK(res, 200, 'Success', users)
    if(!users) return responses.responseNotFound(res, 'Users not found', users)
  } catch (error) {
      console.log(error);
      responses.responseServerError(res, error)
  }
}
 
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, status: true })
      responses.responseOK(res, 200, 'Success', user)
  } catch (error) {
    responses.responseServerError(res, error)
  }
}

export const getFilterUsers = async (req, res) => {
  try {

    const search = req.params.search
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: search
          }
        },
        {
          lastName: {
            $regex: search
          }
        },
      ],
      status: true
    })

    responses.responseOK(res, 200, 'Success', users)
  } catch (error) {
    responses.responseServerError(res, error)
  }
}

export const uploadProfileImage = async (req, res) => {
  try {

    const { id } = req.params
    if (!await User.findOne({ _id: id, status: true })) {
      return responses.responseNotFound(res, `User don't exist`)
    }

    const file = req?.files?.image
    if (!file) {
      return responses.responseGeneric(res, 400, 'The image is missing', file)
    }
    const response = await cloudinary.uploader.upload(file.tempFilePath)
    
    if (response.secure_url) {
      const saveUser = await User.findOneAndUpdate({
        _id: id,
        status: true
      }, {
        $set: {
          photo: response.secure_url
        }
      })

      responses.responseOK(res, 200, 'Updated photo', saveUser)
    } else {
      responses.responseServerError(res, 'Could not upload image')
    }

  } catch (error) {
    console.log(error);
    responses.responseServerError(res, error)
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { firstName, lastName, address, phone, biography } = req.body
    const user = await User.findOne({ _id: id, status: true })

    if (!user) {
      return responses.responseNotFound(res, `User don't exist`, user)
    } else {

      const saveUser = await User.findOneAndUpdate({ _id: id, status: true }, {
        $set: {
          firstName: firstName ? firstName : user.firstName,
          lastName: lastName ? lastName : user.lastName,
          address: address ? address : user.address,
          phone: phone ? phone : user.phone,
          biography: biography ? biography : user.biography,
        }
      })

      responses.responseOK(res, 200, 'Updated user', saveUser)

    }

  } catch (error) {
    responses.responseServerError(res, error)
  }
}

export const changePassword = async (req, res) => {
  try {

    const { id } = req.params
    const { email, password, newPassword } = req.body
    const valUser = await User.findOne({
      _id: id,
      email,
      status: true
    })

    if (!valUser) {
      return responses.responseNotFound(res, `User don't exist`, valUser)
    }

    const valPass = await bcrypt.compare(password, valUser.password)

    if (!valPass) {
      return responses.responseGeneric(res, 401, 'Incorrect credentials')
    }

    const valNewPass = await bcrypt.compare(newPassword, valUser.password)

    if (valNewPass) {
      return responses.responseGeneric(res, 400, 'The mew password is the same as the old one')
    }

    const saveUser = await User.findOneAndUpdate({
      _id: valUser._id,
      status: true
    }, {
      $set: {
        password: bcrypt.hashSync(newPassword)
      }
    })

    responses.responseOK(res, 200, 'Updated user', saveUser)

  } catch (error) {
    responses.responseServerError(res, error)
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findOne({ _id: id, status: true })

    if (!user) {
      return responses.responseNotFound(res, `User don't exist`, User)
    }

    const saveUser = await user.updateOne({
      _id: id,
      status: false
    }, {
      $set: {
        deletedAt: Date.now()
      }
    })

    responses.responseOK(res, 200, 'Deleted user', saveUser)

  } catch (error) {
    responses.responseServerError(res, error)
  }
}

/**
 * 
 * UserFollows actions
 */
export const setFollowUser = async (req, res) => {
  try {

    const { id } = req.params
    const { followsId } = req.body
    const user = await User.findOne({ _id: id, status: true })

    if (!user) {
      return responses.responseNotFound(res, `User don't exist`, user)
    } else if (await Follows.findOne({ user: id })) {

      const updatedFollows = await Follows.findOneAndUpdate({
        user: id
      }, {
        $set: {
          follows: followsId
        }
      })

      responses.responseOK(res, 200, 'Updated follows', updatedFollows)

    } else {

      const follows = await Follows.create({
        user: id,
        follows: followsId
      })
      const saveFollows = follows.save()

      responses.responseOK(res, 200, 'Created follow', saveFollows)

    }

  } catch (error) {
    responses.responseServerError(res, error)
  }
}

export const getFollows = async (req, res) => {
  try {

    const { id } = req.params
    const user = await User.findOne({ _id: id, status: true })

    if (!user) {
      return responses.responseNotFound(res, `User don't exist`, user)
    } else if (!await Follows.findOne({ user: id })) {

      const follows = await Follows.create({
        user: id,
        createdAt: Date.now(),
        follows: []
      })

      const saveFollows = follows.save()

      responses.responseOK(res, 200, 'Success', saveFollows)

    } else {

      const follows = await Follows.findOne({ user: id })
        .populate({ path: 'user', select: 'firstName lastName' })
        .populate({ path: 'follows' })
        .sort({ createdAt: -1 })
        
      responses.responseOK(res, 200, 'Success', follows)


    }

  } catch (error) {
    responses.responseServerError(res, error)
  }
}

export const getFollowers = async (req, res) => {
  try {

    const { id } = req.params
    const followers = await Follows.find({
      follows: id,
      user: {
        $nin: id
      }
    })
      .populate({ path: 'user' })
      .sort({ createdAt: -1 })

    responses.responseOK(res, 200, 'Success', followers)

  } catch (error) {
    responses.responseServerError(res, error)
  }
}