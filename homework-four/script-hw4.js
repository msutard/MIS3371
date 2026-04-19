let formWasValidated = false;

const COOKIE_NAME = "vitaFirstName";
const STORAGE_KEY = "vitaHealthFormData";
const FALLBACK_STATES = [
    { value: "", label: "Select" },
    { value: "AL", label: "AL" }, { value: "AK", label: "AK" }, { value: "AZ", label: "AZ" }, { value: "AR", label: "AR" },
    { value: "CA", label: "CA" }, { value: "CO", label: "CO" }, { value: "CT", label: "CT" }, { value: "DE", label: "DE" },
    { value: "DC", label: "DC" }, { value: "FL", label: "FL" }, { value: "GA", label: "GA" }, { value: "HI", label: "HI" },
    { value: "ID", label: "ID" }, { value: "IL", label: "IL" }, { value: "IN", label: "IN" }, { value: "IA", label: "IA" },
    { value: "KS", label: "KS" }, { value: "KY", label: "KY" }, { value: "LA", label: "LA" }, { value: "ME", label: "ME" },
    { value: "MD", label: "MD" }, { value: "MA", label: "MA" }, { value: "MI", label: "MI" }, { value: "MN", label: "MN" },
    { value: "MS", label: "MS" }, { value: "MO", label: "MO" }, { value: "MT", label: "MT" }, { value: "NE", label: "NE" },
    { value: "NV", label: "NV" }, { value: "NH", label: "NH" }, { value: "NJ", label: "NJ" }, { value: "NM", label: "NM" },
    { value: "NY", label: "NY" }, { value: "NC", label: "NC" }, { value: "ND", label: "ND" }, { value: "OH", label: "OH" },
    { value: "OK", label: "OK" }, { value: "OR", label: "OR" }, { value: "PA", label: "PA" }, { value: "PR", label: "PR" },
    { value: "RI", label: "RI" }, { value: "SC", label: "SC" }, { value: "SD", label: "SD" }, { value: "TN", label: "TN" },
    { value: "TX", label: "TX" }, { value: "UT", label: "UT" }, { value: "VT", label: "VT" }, { value: "VA", label: "VA" },
    { value: "WA", label: "WA" }, { value: "WV", label: "WV" }, { value: "WI", label: "WI" }, { value: "WY", label: "WY" }
];
const FALLBACK_HISTORY = ["Asthma", "Diabetes Type 1", "Diabetes Type 2", "Flu", "Hypertension"];

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

function setCookie(name, value, hours) {
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    const prefix = name + "=";
    const cookieParts = document.cookie.split(";");
    for (let i = 0; i < cookieParts.length; i++) {
        const cookie = cookieParts[i].trim();
        if (cookie.indexOf(prefix) === 0) {
            return decodeURIComponent(cookie.substring(prefix.length));
        }
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

function updateWelcomeArea(name) {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const returningUserBox = document.getElementById("returningUserBox");
    const returningUserName = document.getElementById("returningUserName");

    if (name) {
        welcomeMessage.textContent = "Welcome back, " + name;
        returningUserName.textContent = name;
        returningUserBox.hidden = false;
    } else {
        welcomeMessage.textContent = "Hello New User";
        returningUserName.textContent = "";
        returningUserBox.hidden = true;
        document.getElementById("newUserToggle").checked = false;
    }
}

function saveNonSecureData() {
    const rememberMe = document.getElementById("rememberMe").checked;
    if (!rememberMe) {
        clearRememberedData();
        return;
    }

    const firstName = document.getElementById("firstName").value.trim();
    const payload = {
        firstName,
        middleInitial: document.getElementById("middleInitial").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        dob: document.getElementById("dob").value,
        userId: document.getElementById("userId").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address1: document.getElementById("address1").value.trim(),
        address2: document.getElementById("address2").value.trim(),
        city: document.getElementById("city").value.trim(),
        state: document.getElementById("state").value,
        zip: document.getElementById("zip").value.trim(),
        concern: document.getElementById("concern").value,
        healthStatus: document.getElementById("healthStatus").value,
        sex: getRadioValue("sex"),
        vaccinated: getRadioValue("vaccinated"),
        insurance: getRadioValue("insurance"),
        history: getCheckedValues("history"),
        rememberMe
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (firstName) {
        setCookie(COOKIE_NAME, firstName, 48);
        updateWelcomeArea(firstName);
    }
}

function clearRememberedData() {
    localStorage.removeItem(STORAGE_KEY);
    deleteCookie(COOKIE_NAME);
    updateWelcomeArea("");
}

function loadNonSecureData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
        const data = JSON.parse(raw);
        const safeSet = (id, value) => {
            const field = document.getElementById(id);
            if (field && typeof value !== "undefined" && value !== null) field.value = value;
        };

        safeSet("firstName", data.firstName || "");
        safeSet("middleInitial", data.middleInitial || "");
        safeSet("lastName", data.lastName || "");
        safeSet("dob", data.dob || "");
        safeSet("userId", data.userId || "");
        safeSet("email", data.email || "");
        safeSet("phone", data.phone || "");
        safeSet("address1", data.address1 || "");
        safeSet("address2", data.address2 || "");
        safeSet("city", data.city || "");
        safeSet("state", data.state || "");
        safeSet("zip", data.zip || "");
        safeSet("concern", data.concern || "");
        safeSet("healthStatus", data.healthStatus || "5");

        if (data.sex) setRadioValue("sex", data.sex);
        if (data.vaccinated) setRadioValue("vaccinated", data.vaccinated);
        if (data.insurance) setRadioValue("insurance", data.insurance);
        if (Array.isArray(data.history)) setCheckedValues("history", data.history);
        document.getElementById("rememberMe").checked = data.rememberMe !== false;
        updateRangeValue();
    } catch (error) {
        console.error("Could not read saved local storage data.", error);
    }
}

function handleRememberMeChange() {
    if (!document.getElementById("rememberMe").checked) {
        clearRememberedData();
        setStatus("Remember Me is off. Cookie and local storage were cleared.", false);
    } else {
        saveNonSecureData();
        setStatus("Remember Me is on. Non-secure data will be saved on this device.", true);
    }
}

function handleNewUserToggle() {
    if (document.getElementById("newUserToggle").checked) {
        document.getElementById("patientForm").reset();
        setTimeout(() => {
            clearRememberedData();
            resetReview();
            updateRangeValue();
            setStatus("Started over as a new user.", true);
        }, 0);
    }
}

function restoreReturningUser() {
    const savedName = getCookie(COOKIE_NAME);
    if (savedName) {
        updateWelcomeArea(savedName);
        document.getElementById("firstName").value = savedName;
        loadNonSecureData();
        validateFirstName();
    } else {
        updateWelcomeArea("");
    }
}

async function loadStateOptions() {
    let states = FALLBACK_STATES;
    try {
        const response = await fetch("states-hw4.json");
        if (!response.ok) throw new Error("Could not fetch state list.");
        states = await response.json();
    } catch (error) {
        console.error("Fetch API state load failed.", error);
    }
    const select = document.getElementById("state");
    select.innerHTML = states.map((state) => `<option value="${state.value}">${state.label}</option>`).join("");
}

async function loadMedicalHistoryOptions() {
    let conditions = FALLBACK_HISTORY;
    try {
        const response = await fetch("history-options-hw4.json");
        if (!response.ok) throw new Error("Could not fetch medical history options.");
        conditions = await response.json();
    } catch (error) {
        console.error("Fetch API history load failed.", error);
    }

    const container = document.getElementById("historyOptions");
    container.innerHTML = conditions.map((condition) =>
        `<label><input type="checkbox" name="history" value="${condition}"> ${condition}</label>`
    ).join("");
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
        saveNonSecureData();
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

    if (document.getElementById("rememberMe").checked) {
        saveNonSecureData();
    } else {
        clearRememberedData();
    }
    return true;
}

function getCheckedValues(name) {
    return Array.from(document.getElementsByName(name))
        .filter((element) => element.checked)
        .map((element) => element.value);
}

function setCheckedValues(name, values) {
    Array.from(document.getElementsByName(name)).forEach((element) => {
        element.checked = values.includes(element.value);
    });
}

function getRadioValue(name) {
    const checked = Array.from(document.getElementsByName(name)).find((element) => element.checked);
    return checked ? checked.value : "";
}

function setRadioValue(name, value) {
    Array.from(document.getElementsByName(name)).forEach((element) => {
        element.checked = element.value === value;
    });
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
    saveNonSecureData();
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
            if (eventName === "blur" || eventName === "change") {
                saveNonSecureData();
                if (fieldId === "firstName") {
                    const name = document.getElementById("firstName").value.trim();
                    updateWelcomeArea(name || getCookie(COOKIE_NAME));
                }
            }
        });
    });
}

function wireChoiceSaving(name) {
    Array.from(document.getElementsByName(name)).forEach((element) => {
        element.addEventListener("change", () => {
            normalizeAndHideSubmit();
            saveNonSecureData();
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadStateOptions();
    await loadMedicalHistoryOptions();
    restoreReturningUser();

    wireValidation("firstName", validateFirstName);
    wireValidation("middleInitial", validateMiddleInitial);
    wireValidation("lastName", validateLastName);
    wireValidation("dob", validateDOB, ["input", "blur", "change"]);
    wireValidation("ssn", validateSSN);
    wireValidation("userId", validateUserId, ["input", "blur", "change"]);
    wireValidation("email", validateEmail, ["input", "blur", "change"]);
    wireValidation("phone", validatePhone);
    wireValidation("password", () => {
        validatePassword();
        validateConfirmPassword();
    });
    wireValidation("confirmPassword", validateConfirmPassword);
    wireValidation("address1", validateAddress1, ["input", "blur", "change"]);
    wireValidation("address2", validateAddress2, ["input", "blur", "change"]);
    wireValidation("city", validateCity, ["input", "blur", "change"]);
    wireValidation("state", validateState, ["input", "blur", "change"]);
    wireValidation("zip", validateZip);
    wireValidation("concern", validateConcern, ["input", "blur", "change"]);

    document.getElementById("healthStatus").addEventListener("input", () => {
        normalizeAndHideSubmit();
        updateRangeValue();
        saveNonSecureData();
    });

    document.getElementById("rememberMe").addEventListener("change", handleRememberMeChange);
    document.getElementById("newUserToggle").addEventListener("change", handleNewUserToggle);

    wireChoiceSaving("history");
    wireChoiceSaving("sex");
    wireChoiceSaving("vaccinated");
    wireChoiceSaving("insurance");

    document.getElementById("patientForm").addEventListener("reset", () => {
        setTimeout(() => {
            resetReview();
            if (document.getElementById("rememberMe").checked) {
                saveNonSecureData();
            }
        }, 0);
    });

    updateRangeValue();
});