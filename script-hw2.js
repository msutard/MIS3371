let formHasError = false;

// helper functions
function showError(id, message) {
    document.getElementById(id).innerHTML = message;
    formHasError = true;
}

function clearError(id) {
    document.getElementById(id).innerHTML = "";
}

// first name
function validateFirstName() {
    let firstName = document.getElementById("firstName").value.trim();
    let pattern = /^[A-Za-z'-]{1,30}$/;

    if (firstName === "" || !pattern.test(firstName)) {
        showError("firstNameError", "Letters, apostrophes, and dashes only");
    } else {
        clearError("firstNameError");
    }
}

// middle initial
function validateMiddleInitial() {
    let middleInitial = document.getElementById("middleInitial").value.trim();
    let pattern = /^[A-Za-z]$/;

    if (middleInitial !== "" && !pattern.test(middleInitial)) {
        showError("middleInitialError", "Enter one letter only");
    } else {
        clearError("middleInitialError");
    }
}

// last name
function validateLastName() {
    let lastName = document.getElementById("lastName").value.trim();
    let pattern = /^[A-Za-z'\-2-5]{1,30}$/;
    if (lastName === "" || !pattern.test(lastName)) {
        showError("lastNameError", "Invalid last name");
    } else {
        clearError("lastNameError");
    }
}

// date of birth
function validateDOB() {
    let dobValue = document.getElementById("dob").value;
    let dob = new Date(dobValue);
    let today = new Date();
    let minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120);

    if (dobValue === "") {
        showError("dobError", "Date of birth is required");
        return;
    }

    if (dob > today || dob < minDate) {
        showError("dobError", "Date must be within the last 120 years");
    } else {
        clearError("dobError");
    }
}

// ssn / id field
function validateSSN() {
    let ssn = document.getElementById("ssn").value.trim();
    let pattern = /^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/;

    if (ssn === "" || !pattern.test(ssn)) {
        showError("ssnError", "Enter a valid 9-digit ID");
    } else {
        clearError("ssnError");
    }
}

// user id
function validateUserId() {
    let userIdField = document.getElementById("userId");
    userIdField.value = userIdField.value.toLowerCase().trim();

    let userId = userIdField.value;
    let pattern = /^[a-z][a-z0-9_-]{4,29}$/;

    if (userId === "" || !pattern.test(userId)) {
        showError("userIdError", "5-30 chars, start with a letter, no spaces");
    } else {
        clearError("userIdError");
    }
}

// address line 1
function validateAddress1() {
    let address1 = document.getElementById("address1").value.trim();

    if (address1.length < 2 || address1.length > 30) {
        showError("address1Error", "Address must be 2 to 30 characters");
    } else {
        clearError("address1Error");
    }
}

// address line 2
function validateAddress2() {
    let address2 = document.getElementById("address2").value.trim();

    if (address2 !== "" && (address2.length < 2 || address2.length > 30)) {
        showError("address2Error", "Address must be 2 to 30 characters");
    } else {
        clearError("address2Error");
    }
}

// city
function validateCity() {
    let city = document.getElementById("city").value.trim();

    if (city.length < 2 || city.length > 30) {
        showError("cityError", "City must be 2 to 30 characters");
    } else {
        clearError("cityError");
    }
}

// state
function validateState() {
    let state = document.getElementById("state").value;

    if (state === "") {
        showError("stateError", "Please select a state");
    } else {
        clearError("stateError");
    }
}

// zip
function validateZip() {
    let zipField = document.getElementById("zip");
    let zip = zipField.value.trim();
    let pattern = /^\d{5}(-\d{4})?$/;

    if (zip === "" || !pattern.test(zip)) {
        showError("zipError", "Enter 5 digits or ZIP+4");
    } else {
        zipField.value = zip.substring(0, 5);
        clearError("zipError");
    }
}

// email
function validateEmail() {
    let email = document.getElementById("email").value.trim();
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "" || !pattern.test(email)) {
        showError("emailError", "Enter a valid email");
    } else {
        clearError("emailError");
    }
}

// phone
function validatePhone() {
    let phone = document.getElementById("phone").value.trim();
    let pattern = /^\d{3}-\d{3}-\d{4}$/;

    if (phone === "" || !pattern.test(phone)) {
        showError("phoneError", "Use format 000-000-0000");
    } else {
        clearError("phoneError");
    }
}

// password
function validatePassword() {
    let password = document.getElementById("password").value;
    let userId = document.getElementById("userId").value.toLowerCase();
    let firstName = document.getElementById("firstName").value.toLowerCase();
    let lastName = document.getElementById("lastName").value.toLowerCase();

    let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()\-_=+\\/><.,`~])[A-Za-z\d!@#%^&*()\-_=+\\/><.,`~]{8,30}$/;

    if (password.includes('"')) {
        showError("passwordError", "Password cannot contain quotes");
        return;
    }

    if (!pattern.test(password)) {
        showError("passwordError", "8-30 chars, upper, lower, number, special");
        return;
    }

    let lowerPass = password.toLowerCase();

    if (
        userId !== "" && lowerPass.includes(userId) ||
        firstName !== "" && lowerPass.includes(firstName) ||
        lastName !== "" && lowerPass.includes(lastName)
    ) {
        showError("passwordError", "Password cannot contain your name or user ID");
    } else {
        clearError("passwordError");
    }
}

// confirm password
function validateConfirmPassword() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (confirmPassword === "" || password !== confirmPassword) {
        showError("confirmPasswordError", "Passwords do not match");
    } else {
        clearError("confirmPasswordError");
    }
}

// slider
function updateRangeValue() {
    let value = document.getElementById("healthStatus").value;
    document.getElementById("rangeValue").innerHTML = value;
}

// review form
function reviewForm() {
    formHasError = false;

    validateFirstName();
    validateMiddleInitial();
    validateLastName();
    validateDOB();
    validateSSN();
    validateUserId();
    validateAddress1();
    validateAddress2();
    validateCity();
    validateState();
    validateZip();
    validateEmail();
    validatePhone();
    validatePassword();
    validateConfirmPassword();

    if (formHasError) {
        alert("Please fix the errors before reviewing.");
        return false;
    }

    let historyList = [];
    let historyChecks = document.getElementsByName("history");
    for (let i = 0; i < historyChecks.length; i++) {
        if (historyChecks[i].checked) {
            historyList.push(historyChecks[i].value);
        }
    }

    let sex = "";
    let genderButtons = document.getElementsByName("sex");
    for (let i = 0; i < genderButtons.length; i++) {
        if (genderButtons[i].checked) {
            sex = genderButtons[i].value;
        }
    }
    
    let vaccinated = "";
    let vaccinatedButtons = document.getElementsByName("vaccinated");
    for (let i = 0; i < vaccinatedButtons.length; i++) {
        if (vaccinatedButtons[i].checked) {
            vaccinated = vaccinatedButtons[i].value;
        }
    }

    let insurance = "";
    let insuranceButtons = document.getElementsByName("insurance");
    for (let i = 0; i < insuranceButtons.length; i++) {
        if (insuranceButtons[i].checked) {
            insurance = insuranceButtons[i].value;
        }
    }

 let ssn = document.getElementById("ssn").value.trim();

    document.getElementById("reviewName").innerHTML =
        document.getElementById("firstName").value + " " +
        document.getElementById("middleInitial").value + " " +
        document.getElementById("lastName").value;

    document.getElementById("reviewDOB").innerHTML = document.getElementById("dob").value;
    document.getElementById("reviewSSN").innerHTML = "***-**-" + ssn.slice(-4);
    document.getElementById("reviewUserId").innerHTML = document.getElementById("userId").value;
    document.getElementById("reviewAddress").innerHTML =
        document.getElementById("address1").value + "<br>" +
        document.getElementById("address2").value + "<br>" +
        document.getElementById("city").value + ", " +
        document.getElementById("state").value + " " +
        document.getElementById("zip").value;

    document.getElementById("reviewEmail").innerHTML = document.getElementById("email").value;
    document.getElementById("reviewPhone").innerHTML = document.getElementById("phone").value;
    document.getElementById("reviewHistory").innerHTML = historyList.join(", ");
    document.getElementById("reviewGender").innerHTML = sex;
    document.getElementById("reviewVaccinated").innerHTML = vaccinated;
    document.getElementById("reviewInsurance").innerHTML = insurance;
    document.getElementById("reviewHealthStatus").innerHTML = document.getElementById("healthStatus").value;
    document.getElementById("reviewConcern").innerHTML = document.getElementById("concern").value;

    document.getElementById("reviewBox").style.display = "block";

    return false;
}

// submit form
function validateForm(event) {
    formHasError = false;

    validateFirstName();
    validateMiddleInitial();
    validateLastName();
    validateDOB();
    validateSSN();
    validateUserId();
    validateAddress1();
    validateAddress2();
    validateCity();
    validateState();
    validateZip();
    validateEmail();
    validatePhone();
    validatePassword();
    validateConfirmPassword();

    if (formHasError) {
        event.preventDefault();
        alert("Please fix the errors before submitting.");
        return false;
    }

    return true;
}

// reset form
function resetReview() {
    formHasError = false;

    let errors = document.getElementsByClassName("error");
    for (let i = 0; i < errors.length; i++) {
        errors[i].innerHTML = "";
    }

    document.getElementById("reviewBox").style.display = "none";
    document.getElementById("sliderValue").innerHTML = "5";
}