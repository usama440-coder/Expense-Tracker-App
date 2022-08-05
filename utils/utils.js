// Desc     =>  Validator for register user
// routes   =>  /api/users/register
const registerUserValidator = (name, email, password) => {
  if (
    name.length > 30 ||
    password.length < 6 ||
    password.length > 20 ||
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  ) {
    return true;
  }
};

module.exports = {
  registerUserValidator,
};
