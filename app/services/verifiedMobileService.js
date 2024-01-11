const verifiedNumber = require("../models/verifiedMobileModel");

const createNewMobile = async ({ number, role, user_id }) => {
  try {
    if (!number || !role || !user_id)
      return {
        mobileDetail: null,
        error: "All fields are required",
      };
    const { mobileDetail, error } = await mobileExistenceCheck(number);
    if (error) return { mobileDetail, error };
    const newMobile = new verifiedNumber({ number, role, user_id });
    return { mobileDetail: await newMobile.save(), error: null };
  } catch (error) {
    return { mobileDetail: null, error };
  }
};

const mobileExistenceCheck = async (number) => {
    const { mobileDetails, error } = await findMobile(number);
    if (mobileDetails.length > 0) {
      return {
        mobileDetail: mobileDetails[0],
        error: "Mobile number already taken",
      };
    } else {
      return {
        mobileDetail: null,
        error,
      };
    }
}

const findMobile = async (number) => {
  try {
    let mobileDetails = await verifiedNumber
      .find({ number })
      .sort({ createdAt: -1 })
      .limit(1);
    return { mobileDetails, error: null };
  } catch (error) {
    return { mobileDetails: null, error };
  }
};

const deleteMobile = async (number) => {
  try {
    let { mobileDetails, error } = await findMobile(number);
    if (mobileDetails.length === 0) {
      return {
        deletedMobile: null,
        error: "Number not found",
      };
    }
    return {
      deletedMobile: await verifiedNumber.deleteOne({ number }),
      error: null,
    };
  } catch (error) {
    return { deletedMobile: null, error };
  }
};

module.exports = { createNewMobile, findMobile, deleteMobile, mobileExistenceCheck };
