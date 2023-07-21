function isEmpty(value){
    return !value || value.trim() === ''; 
}

function userCredentialsAreValid(email,password){
    return (email && 
    email.includes('@') && 
    password && password.trim().length >= 6
    );
}

function userDetailsAreValid(email,password, name, street,postal,city){
    return (
        userCredentialsAreValid(email,password) && 
        name && 
        name.trim() !== '' &&
        !isEmpty(name) && !isEmpty(street) && !isEmpty(postal) && !isEmpty(city)  
    );
}

function emailIsconfirmed(email, confirmEmail){
    return email === confirmEmail;
}

module.exports = { 
    userDetailsAreValid,
    emailIsconfirmed: emailIsconfirmed,
    
 };