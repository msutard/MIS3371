let formWasValidated = false;

function setStatus(message, isSuccess) {
    const status = document.getElementById("formStatus");
    status.textContent = message;
    status.className = "status-message " + (isSuccess ? "status-success" : "status-error");
}

function showError(id, message) {
    document.getElementById(id).textContent = message;
    const fieldId = id.replace("Error", "");
    const field = document.getElementById(fieldId);
    if (field) field.classList.add("invalid");
}

function clearError(id) {
    document.getElementById(id).textContent = "";
    const fieldId = id.replace("Error", "");
    const field = document.getElementById(fieldId);
    if (field) field.classList.remove("invalid");
}

function normalizeAndHideSubmit() {
    document.getElementById("submitButton").hidden = true;
    if (formWasValidated) {
        setStatus("Please click Validate again after changes.", false);
    }
}

function stripToDigits(value) {
    return value.replace(/\D/g, "");
}

function formatSSN(value) {
    const digits = stripToDigits(value).slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return digits.slice(0, 3) + "-" + digits.slice(3);
    return digits.slice(0, 3) + "-" + digits.slice(3, 5) + "-" + digits.slice(5);
}

function formatPhone(value) {
    const digits = stripToDigits(value).slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return digits.slice(0, 3) + "-" + digits.slice(3);
    return digits.slice(0, 3) + "-" + digits.slice(3, 6) + "-" + digits.slice(6);
}

function validateFirstName() {
    const value = document.getElementById("firstName").value.trim();
    const pattern = /^[A-Za-z'-]{1,30}$/;
    if (!pattern.test(value)) {
        showError("firstNameError", "Use 1 to 30 letters, apostrophes, or dashes.");
        return false;
    }
    clearError("firstNameError");
    return true;
}

function validateMiddleInitial() {
    const value = document.getElementById("middleInitial").value.trim();
    const pattern = /^[A-Za-z]$/;
    if (value !== "" && !pattern.test(value)) {
        showError("middleInitialError", "Optional, but if entered it must be one letter.");
        return false;
    }
    clearError("middleInitialError");
    return true;
}

function validateLastName() {
    const value = document.getElementById("lastName").value.trim();
    const pattern = /^[A-Za-z'-]{1,30}$/;
    if (!pattern.test(value)) {
        showError("lastNameError", "Use 1 to 30 letters, apostrophes, or dashes.");
        return false;
    }
    clearError("lastNameError");
    return true;
}

function validateDOB() {
    const field = document.getElementById("dob");
    const value = field.value;
    if (value === "") {
        showError("dobError", "Date of birth is required.");
        return false;
    }

    const dob = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oldest = new Date();
    oldest.setHours(0, 0, 0, 0);
    oldest.setFullYear(today.getFullYear() - 120);

    if (Number.isNaN(dob.getTime()) || dob > today || dob < oldest) {
        showError("dobError", "Birth date must not be in the future or more than 120 years ago.");
        return false;
    }
    clearError("dobError");
    return true;
}

function validateSSN() {
    const field = document.getElementById("ssn");
    field.value = formatSSN(field.value);
    const pattern = /^\d{3}-\d{2}-\d{4}$/;
    if (!pattern.test(field.value)) {
        showError("ssnError", "Enter exactly 9 digits. It will format automatically.");
        return false;
    }
    clearError("ssnError");
    return true;
}

function validateUserId() {
    const field = document.getElementById("userId");
    field.value = field.value.trim();
    const value = field.value;
    const pattern = /^[A-Za-z][A-Za-z0-9_-]{4,19}$/;

    if (!pattern.test(value)) {
        showError("userIdError", "5 to 20 chars, start with a letter, and use only letters, numbers, _ or -.");
        return false;
    }
    clearError("userIdError");
    return true;
}

function validateEmail() {
    const field = document.getElementById("email");
    field.value = field.value.trim().toLowerCase();
    const value = field.value;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) {
        showError("emailError", "Enter a valid email such as name@domain.tld.");
        return false;
    }
    clearError("emailError");
    return true;
}

function validatePhone() {
    const field = document.getElementById("phone");
    field.value = formatPhone(field.value);
    const pattern = /^\d{3}-\d{3}-\d{4}$/;
    if (!pattern.test(field.value)) {
        showError("phoneError", "Enter a 10-digit phone number in the format 000-000-0000.");
        return false;
    }
    clearError("phoneError");
    return true;
}

function validatePassword() {
    const password = document.getElementById("password").value;
    const userId = document.getElementById("userId").value.trim();

    if (password.length < 8) {
        showError("passwordError", "Password must be at least 8 characters.");
        return false;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        showError("passwordError", "Password must contain an uppercase letter, lowercase letter, and a number.");
        return false;
    }
    if (userId !== "" && password === userId) {
        showError("passwordError", "Password cannot match your user ID.");
        return false;
    }
    clearError("passwordError");
    return true;
}

function validateConfirmPassword() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (confirmPassword === "" || password !== confirmPassword) {
        showError("confirmPasswordError", "Passwords must match exactly.");
        return false;
    }
    clearError("confirmPasswordError");
    return true;
}

function validateAddress1() {
    const value = document.getElementById("address1").value.trim();
    if (value.length < 2 || value.length > 30) {
        showError("address1Error", "Address Line 1 must be 2 to 30 characters.");
        return false;
    }
    clearError("address1Error");
    return true;
}

function validateAddress2() {
    const value = document.getElementById("address2").value.trim();
    if (value !== "" && (value.length < 2 || value.length > 30)) {
        showError("address2Error", "Address Line 2 must be blank or 2 to 30 characters.");
        return false;
    }
    clearError("address2Error");
    return true;
}

function validateCity() {
    const value = document.getElementById("city").value.trim();
    const pattern = /^[A-Za-z .'-]{2,30}$/;
    if (!pattern.test(value)) {
        showError("cityError", "City must be 2 to 30 characters using letters and basic punctuation only.");
        return false;
    }
    clearError("cityError");
    return true;
}

function validateState() {
    const value = document.getElementById("state").value;
    if (value === "") {
        showError("stateError", "Please select a state, DC, or PR.");
        return false;
    }
    clearError("stateError");
    return true;
}

function validateZip() {
    const field = document.getElementById("zip");
    field.value = stripToDigits(field.value).slice(0, 5);
    if (!/^\d{5}$/.test(field.value)) {
        showError("zipError", "Zip code must be exactly 5 digits.");
        return false;
    }
    clearError("zipError");
    return true;
}

function validateConcern() {
    const value = document.getElementById("concern").value.trim();
    if (value !== "" && (value.length < 2 || value.length > 300)) {
        showError("concernError", "Health concerns must be blank or 2 to 300 characters.");
        return false;
    }
    clearError("concernError");
    return true;
}

function updateRangeValue() {
    document.getElementById("rangeValue").textContent = document.getElementById("healthStatus").value;
}

function validateAllFields() {
    const checks = [
        validateFirstName(),
        validateMiddleInitial(),
        validateLastName(),
        validateDOB(),
        validateSSN(),
        validateUserId(),
        validateEmail(),
        validatePhone(),
        validatePassword(),
        validateConfirmPassword(),
        validateAddress1(),
        validateAddress2(),
        validateCity(),
        validateState(),
        validateZip(),
        validateConcern()
    ];
    return checks.every(Boolean);
}

function handleValidateClick() {
    formWasValidated = true;
    const ok = validateAllFields();
    const submitButton = document.getElementById("submitButton");
    if (ok) {
        submitButton.hidden = false;
        setStatus("All fields look good. You may now submit the form.", true);
    } else {
        submitButton.hidden = true;
        setStatus("Please correct the highlighted errors before submitting.", false);
    }
    return ok;
}

function finalSubmitCheck(event) {
    const ok = validateAllFields();
    if (!ok) {
        event.preventDefault();
        document.getElementById("submitButton").hidden = true;
        setStatus("Please correct the highlighted errors before submitting.", false);
        return false;
    }
    return true;
}

function getCheckedValues(name) {
    return Array.from(document.getElementsByName(name))
        .filter((element) => element.checked)
        .map((element) => element.value);
}

function getRadioValue(name) {
    const checked = Array.from(document.getElementsByName(name)).find((element) => element.checked);
    return checked ? checked.value : "";
}

function reviewForm() {
    const ok = validateAllFields();
    if (!ok) {
        setStatus("Please correct the highlighted errors before reviewing.", false);
        return false;
    }

    const firstName = document.getElementById("firstName").value.trim();
    const middleInitial = document.getElementById("middleInitial").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const fullName = [firstName, middleInitial, lastName].filter(Boolean).join(" ");
    const ssn = document.getElementById("ssn").value;
    const address2 = document.getElementById("address2").value.trim();

    document.getElementById("reviewName").innerHTML = fullName;
    document.getElementById("reviewDOB").innerHTML = document.getElementById("dob").value;
    document.getElementById("reviewSSN").innerHTML = "***-**-" + ssn.slice(-4);
    document.getElementById("reviewUserId").innerHTML = document.getElementById("userId").value.trim();
    document.getElementById("reviewAddress").innerHTML =
        document.getElementById("address1").value.trim() +
        (address2 ? "<br>" + address2 : "") +
        "<br>" + document.getElementById("city").value.trim() + ", " +
        document.getElementById("state").value + " " + document.getElementById("zip").value;
    document.getElementById("reviewEmail").innerHTML = document.getElementById("email").value.trim();
    document.getElementById("reviewPhone").innerHTML = document.getElementById("phone").value.trim();
    document.getElementById("reviewHistory").innerHTML = getCheckedValues("history").join(", ") || "None selected";
    document.getElementById("reviewGender").innerHTML = getRadioValue("sex") || "Not selected";
    document.getElementById("reviewVaccinated").innerHTML = getRadioValue("vaccinated") || "Not selected";
    document.getElementById("reviewInsurance").innerHTML = getRadioValue("insurance") || "Not selected";
    document.getElementById("reviewHealthStatus").innerHTML = document.getElementById("healthStatus").value;
    document.getElementById("reviewConcern").innerHTML = document.getElementById("concern").value.trim() || "None entered";
    document.getElementById("reviewBox").style.display = "block";
    setStatus("Review generated below.", true);
    return true;
}

function resetReview() {
    formWasValidated = false;
    document.querySelectorAll(".error").forEach((item) => {
        item.textContent = "";
    });
    document.querySelectorAll("input, select, textarea").forEach((item) => {
        item.classList.remove("invalid");
    });
    document.getElementById("reviewBox").style.display = "none";
    document.getElementById("submitButton").hidden = true;
    document.getElementById("rangeValue").textContent = "5";
    document.getElementById("formStatus").textContent = "";
    document.getElementById("formStatus").className = "status-message";
}

function wireValidation(fieldId, validator, events = ["input", "blur"]) {
    const field = document.getElementById(fieldId);
    events.forEach((eventName) => {
        field.addEventListener(eventName, () => {
            normalizeAndHideSubmit();
            validator();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    wireValidation("firstName", validateFirstName);
    wireValidation("middleInitial", validateMiddleInitial);
    wireValidation("lastName", validateLastName);
    wireValidation("dob", validateDOB, ["input", "blur", "change"]);
    wireValidation("ssn", validateSSN);
    wireValidation("userId", validateUserId);
    wireValidation("email", validateEmail);
    wireValidation("phone", validatePhone);
    wireValidation("password", () => {
        validatePassword();
        validateConfirmPassword();
    });
    wireValidation("confirmPassword", validateConfirmPassword);
    wireValidation("address1", validateAddress1);
    wireValidation("address2", validateAddress2);
    wireValidation("city", validateCity);
    wireValidation("state", validateState, ["input", "blur", "change"]);
    wireValidation("zip", validateZip);
    wireValidation("concern", validateConcern);

    document.getElementById("healthStatus").addEventListener("input", () => {
        normalizeAndHideSubmit();
        updateRangeValue();
    });

    document.getElementById("patientForm").addEventListener("reset", () => {
        setTimeout(resetReview, 0);
    });

    updateRangeValue();
});
