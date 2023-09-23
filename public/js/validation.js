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

    // Function to validate the product name
    function validateProductName(name) {
      // Regular expression for product name: contains only letters (lower and upper case), digits, and spaces, 10 to 20 characters.
      const nameRegex = /^[a-zA-Z0-9\s]+$/;
      return nameRegex.test(name) && name.length >= 10 && name.length <= 20;
    }
  
    // Function to validate the product price
    function validateProductPrice(price) {
      // Regular expression for product price: contains only digits and a maximum of 2 decimal places, greater than or equal to 0.
      const priceRegex = /^\d+(\.\d{1,2})?$/;
      return priceRegex.test(price) && parseFloat(price) >= 0;
    }
  
    // Function to validate the product description length
    function validateProductDescription(description) {
      // Regular expression for product description: max 500 characters.
      return description.length <= 500;
    }
  