///
//HAndling all the form related validations to perform a check for inputs before storing into database
///

function isEmpty(value) {
  return !value && value.trim === " ";
  ////if we don't get value that means is empty and fxn will return true;
}

function userCredentialsAreValid(email,password){
    return  email &&
    email.includes("@") &&
    password &&
    password.trim().length >= 6 
}

function userDetailsAreValid(email, password, name, address, account, phone) {
  return (
    userCredentialsAreValid(email,password) && 
    !isEmpty(name) &&
    !isEmpty(address) &&
    !isEmpty(account) &&
    !isEmpty(phone)
  );
}

function passwordMatches(password,confirmPassword){
    return password === confirmPassword;
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  passwordMatches:passwordMatches,
};
