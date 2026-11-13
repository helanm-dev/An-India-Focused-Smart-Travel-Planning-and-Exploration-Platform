(() => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordIsValid = (value) => value.length >= 8
    && /[A-Z]/.test(value)
    && /[a-z]/.test(value)
    && /\d/.test(value)
    && /[@$!%*?&]/.test(value);
  const storageKey = "wanderoam-demo-accounts";

  const getAccounts = () => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return [];
    const accounts = JSON.parse(saved);
    return Array.isArray(accounts) ? accounts : [];
  };

  const saveAccount = (account) => {
    const accounts = getAccounts();
    const email = account.email.toLowerCase();
    if (accounts.some((saved) => saved.email.toLowerCase() === email)) {
      return false;
    }
    accounts.push({ ...account, email });
    window.localStorage.setItem(storageKey, JSON.stringify(accounts));
    return true;
  };

  const showError = (input, message) => {
    input.classList.toggle("invalid", Boolean(message));
    input.classList.toggle("valid", !message && Boolean(input.value));
    input.setAttribute("aria-invalid", String(Boolean(message)));
    const error = document.getElementById(`${input.id}-error`);
    if (error) error.textContent = message;
  };

  const setFeedback = (element, message, isError) => {
    element.textContent = message;
    element.classList.toggle("error", Boolean(isError));
  };

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    const fields = {
      fullName: {
        input: document.getElementById("fullName"),
        validate: (value) => /^[a-zA-Z\s]{2,50}$/.test(value) ? "" : "Enter 2–50 letters and spaces only."
      },
      empId: {
        input: document.getElementById("empId"),
        validate: (value) => /^[A-Z0-9]{6,12}$/i.test(value) ? "" : "Use 6–12 letters or numbers."
      },
      email: {
        input: document.getElementById("email"),
        validate: (value) => emailPattern.test(value) ? "" : "Enter a valid email address."
      },
      mobile: {
        input: document.getElementById("mobile"),
        validate: (value) => /^[6-9]\d{9}$/.test(value) ? "" : "Enter a valid 10-digit Indian mobile number."
      },
      dept: {
        input: document.getElementById("dept"),
        validate: (value) => value !== "" ? "" : "Choose your division."
      },
      password: {
        input: document.getElementById("password"),
        validate: (value) => passwordIsValid(value) ? "" : "Use 8+ characters with uppercase, lowercase, number and @$!%*?&."
      },
      confirmPassword: {
        input: document.getElementById("confirmPassword"),
        validate: (value) => value && value === fields.password.input.value ? "" : "Passwords must match."
      }
    };
    const submit = document.getElementById("register-submit");
    const feedback = document.getElementById("register-feedback");

    const validateField = (name) => {
      const field = fields[name];
      const message = field.validate(field.input.value);
      showError(field.input, message);
      return !message;
    };
    const validateAll = (showErrors) => Object.keys(fields).map((name) => {
      const field = fields[name];
      const message = field.validate(field.input.value);
      if (showErrors) showError(field.input, message);
      return !message;
    }).every(Boolean);
    const refresh = (name) => {
      validateField(name);
      if (name === "password") validateField("confirmPassword");
      submit.disabled = !validateAll(false);
      feedback.textContent = "";
      feedback.classList.remove("error");
    };

    Object.keys(fields).forEach((name) => {
      fields[name].input.addEventListener("blur", () => {
        validateField(name);
        if (name === "password") validateField("confirmPassword");
        submit.disabled = !validateAll(false);
      });
      fields[name].input.addEventListener("input", () => refresh(name));
      fields[name].input.addEventListener("change", () => refresh(name));
    });

    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateAll()) {
        submit.disabled = true;
        const firstInvalid = registerForm.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      try {
        const created = saveAccount({
          email: fields.email.input.value,
          password: fields.password.input.value,
          name: fields.fullName.input.value
        });
        if (!created) {
          setFeedback(feedback, "An account with this email already exists. Try signing in instead.", true);
          return;
        }
        setFeedback(feedback, "Your profile is ready! You can now sign in.", false);
        registerForm.reset();
        Object.keys(fields).forEach((name) => showError(fields[name].input, ""));
        submit.disabled = true;
      } catch (error) {
        console.error("WandeRoam could not save the demo account.", error);
        setFeedback(feedback, "We couldn't save your profile in this browser. Check storage settings and try again.", true);
      }
    });
    submit.disabled = !validateAll(false);
  }

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    const email = document.getElementById("signup-email");
    const password = document.getElementById("signup-password");
    const terms = document.getElementById("terms");
    const feedback = document.getElementById("signup-feedback");
    const validateSignup = (input, message) => {
      showError(input, message);
      return !message;
    };
    const validateEmail = () => validateSignup(email, emailPattern.test(email.value) ? "" : "Enter a valid email address.");
    const validatePassword = () => validateSignup(password, passwordIsValid(password.value) ? "" : "Use 8+ characters with uppercase, lowercase, number and @$!%*?&.");
    const validateTerms = () => {
      const error = document.getElementById("terms-error");
      error.textContent = terms.checked ? "" : "Please accept the Terms of Service to continue.";
      return terms.checked;
    };
    [email, password].forEach((input) => {
      input.addEventListener("blur", input === email ? validateEmail : validatePassword);
      input.addEventListener("input", () => {
        (input === email ? validateEmail : validatePassword)();
        feedback.textContent = "";
      });
    });
    terms.addEventListener("change", validateTerms);
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const emailValid = validateEmail();
      const passwordValid = validatePassword();
      const termsValid = validateTerms();
      const valid = emailValid && passwordValid && termsValid;
      if (!valid) {
        setFeedback(feedback, "Please correct the highlighted fields.", true);
        return;
      }
      try {
        const created = saveAccount({ email: email.value, password: password.value });
        if (!created) {
          setFeedback(feedback, "An account with this email already exists. Please sign in.", true);
          return;
        }
        setFeedback(feedback, "Account created! Your browser demo account is ready. Sign in to continue.", false);
        signupForm.reset();
        showError(email, "");
        showError(password, "");
        document.getElementById("terms-error").textContent = "";
      } catch (error) {
        console.error("WandeRoam could not save the demo account.", error);
        setFeedback(feedback, "We couldn't save your account in this browser. Check storage settings and try again.", true);
      }
    });
  }

  const signinForm = document.getElementById("signin-form");
  if (signinForm) {
    const email = document.getElementById("signin-email");
    const password = document.getElementById("signin-password");
    const feedback = document.getElementById("signin-feedback");
    const alertBox = document.getElementById("signin-alert");
    const validateEmail = () => {
      const message = emailPattern.test(email.value) ? "" : "Enter a valid email address.";
      showError(email, message);
      return !message;
    };
    const validatePassword = () => {
      const message = password.value ? "" : "Enter your password.";
      showError(password, message);
      return !message;
    };
    email.addEventListener("blur", validateEmail);
    password.addEventListener("blur", validatePassword);
    email.addEventListener("input", () => { validateEmail(); alertBox.hidden = true; });
    password.addEventListener("input", () => { validatePassword(); alertBox.hidden = true; });
    signinForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const validEmail = validateEmail();
      const validPassword = validatePassword();
      if (!validEmail || !validPassword) {
        alertBox.textContent = "Please correct the email or password format before signing in.";
        alertBox.hidden = false;
        return;
      }
      try {
        const account = getAccounts().find((saved) => saved.email.toLowerCase() === email.value.toLowerCase());
        if (!account || account.password !== password.value) {
          alertBox.textContent = "We couldn't find a matching demo account. Check your details or create an account first.";
          alertBox.hidden = false;
          setFeedback(feedback, "", false);
          return;
        }
        alertBox.hidden = true;
        setFeedback(feedback, `Welcome back${account.name ? `, ${account.name.split(" ")[0]}` : ""}! Opening your travel dashboard…`, false);
        window.setTimeout(() => { window.location.href = "home.html"; }, 800);
      } catch (error) {
        console.error("WandeRoam could not read demo account storage.", error);
        alertBox.textContent = "We couldn't access saved demo accounts in this browser. Check storage settings and try again.";
        alertBox.hidden = false;
      }
    });
    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.passwordToggle);
        const visible = input.type === "password";
        input.type = visible ? "text" : "password";
        button.textContent = visible ? "Hide" : "Show";
        button.setAttribute("aria-label", visible ? "Hide password" : "Show password");
      });
    });
  }
})();
