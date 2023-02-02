import Interest from "../models/Interest.js";
import * as responses from "../helpers/responses.js";

export const createInterest = async (req, res) => {
  try {
    const { name } = req.body

    if( !name ) return responses.responseGeneric(res, 400, 'You must enter all the data')
    
    const interest = new Interest({
        name,
        createdAt: Date.now()
    })

    const saveInterest = await interest.save()

    return responses.responseOK(res, 200, 'Success', saveInterest)

} catch(error) {
    responses.responseServerError(res, error)
}
}

export const getAllInterest = async (req, res) => {
  try {

    const interest = await Interest.find({ status: true }).exec()

    responses.responseOK(res, 200, 'Success', interest)

  } catch (error) {
    responses.responseServerError(res, error)
  }
}

export const getInterestById = async (req, res) => {
  try {

    const { id } = req.params
    const interest = await Interest.findOne({
      _id: id,
      status: true
    })
      .sort({ createdAt: -1 })

      responses.responseOK(res, 200, 'Success', interest)

  } catch (error) {
    responses.responseServerError(res, error)
  }
}