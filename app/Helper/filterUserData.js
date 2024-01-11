const RolesCanManage = {
  "superAdmin":[
    "admin","user"
  ],
  "admin":[
    "user"
  ],
  "user":[],
}

const showLevelFilter = (data) => {
  return {
    _id: data._id,
    name: data.name,
    email: data.email,
    age: data.age,
    role: data.role,
  };
};

const useLevelFilter = (data) => {
  return {
    _id: data._id,
    name: data.name,
    email: data.email,
    gender: data.gender,
    aadhar_no: data.aadhar_no,
    pan_no: data.pan_no,
    mobile_no: data.mobile_no,
    role: data.role,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

module.exports = { showLevelFilter, useLevelFilter, RolesCanManage };
