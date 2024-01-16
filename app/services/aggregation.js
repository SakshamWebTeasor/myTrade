const aggFetchUsers = (managebleRoles, id) => [
  {
    $match: {
      role: { $in: managebleRoles },
    },
  },
  {
    $lookup: {
      from: "verifiedmobiles",
      localField: "_id",
      foreignField: "user_id",
      as: "mobiles",
    },
  },
  {
    $project: {
      _id: 1,
      name: 1,
      gender: 1,
      email: 1,
      aadhar_no: 1,
      pan_no: 1,
      role: 1,
      created_at: 1,
      mobile: {
        $arrayElemAt: ["$mobiles.number", 0],
      },
    },
  },
  {
    $sort: {
      _id: -1,
    },
  },
];

const aggToFindCompleteUserById = (_id) => [
  {
    $match: {
      _id: new ObjectId(_id),
    },
  },
  {
    $lookup: {
      from: "verifiedmobiles",
      localField: "_id",
      foreignField: "user_id",
      as: "mobiles",
    },
  },
  {
    $project: {
      _id: 1,
      name: 1,
      gender: 1,
      email: 1,
      aadhar_no: 1,
      pan_no: 1,
      password: 1,
      role: 1,
      created_at: 1,
      mobile: {
        $arrayElemAt: ["$mobiles.number", 0],
      },
    },
  },
];

const aggToFindCompleteUserByEmail = (email) => [
  {
    $match: {
      email,
    },
  },
  {
    $lookup: {
      from: "verifiedmobiles",
      localField: "_id",
      foreignField: "user_id",
      as: "mobiles",
    },
  },
  {
    $project: {
      _id: 1,
      name: 1,
      gender: 1,
      email: 1,
      aadhar_no: 1,
      pan_no: 1,
      password: 1,
      role: 1,
      created_at: 1,
      mobile: {
        $arrayElemAt: ["$mobiles.number", 0],
      },
    },
  },
  {
    $sort: {
      _id: -1,
    },
  },
  {
    $limit: 1,
  },
];

module.exports = {
  aggFetchUsers,
  aggToFindCompleteUserById,
  aggToFindCompleteUserByEmail,
};
