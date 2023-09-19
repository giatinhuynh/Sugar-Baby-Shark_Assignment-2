function displayErrorMessage(message, inputName) {
    // Add pink border to the input
    $(`[name=${inputName}]`).css("border", "2px solid pink");
    // Append an error message below the input
    $(`[name=${inputName}]`).after(
      `<p class="error-message">${message}</p>`
    );
  }

  function clearErrorStyles() {
    // Remove pink border and error messages from all inputs
    $("form input").css("border", "1px solid #ccc");
    $("p.error-message").remove();
  }

  function validateUsername(username) {
    // Regular expression for username: contains only letters (lower and upper case) and digits, 8 to 15 characters.
    const usernameRegex = /^[a-zA-Z0-9]{8,15}$/;
    return usernameRegex.test(username);
  }
  
  function validatePassword(password) {
    // Regular expression for password: contains at least one upper case letter,
    // at least one lower case letter, at least one digit, at least one special character, 8 to 20 characters.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    return passwordRegex.test(password);
  }

  function validateMinLength(input, minLength) {
    return input.length >= minLength;
  }