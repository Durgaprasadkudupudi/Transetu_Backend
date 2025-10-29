// Copied for Render: Backend/src/Validations/UserValidation.js
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

function buildError(messages) {
  const err = new Error('Validation error');
  err.isJoi = true;
  err.details = messages.map(m => ({ message: m }));
  return err;
}

const userValidationSchema = {
  validateAsync(value = {}, options = {}) {
    const { presence = 'required', abortEarly = false } = options;
    const errors = [];

    if (presence === 'required' || (presence === 'optional' && value.name !== undefined)) {
      if (value.name === undefined || value.name === null || String(value.name).trim() === '') {
        errors.push('Name is required');
      } else if (String(value.name).length < 3) {
        errors.push('Name should have at least 3 characters');
      } else if (String(value.name).length > 50) {
        errors.push('Name should not exceed 50 characters');
      }
    }

    if (presence === 'required' || (presence === 'optional' && value.email !== undefined)) {
      if (value.email === undefined || value.email === null || String(value.email).trim() === '') {
        errors.push('Email is required');
      } else if (!emailRegex.test(String(value.email))) {
        errors.push('Please enter a valid email address');
      }
    }

    if (presence === 'required' || (presence === 'optional' && value.password !== undefined)) {
      if (value.password === undefined || value.password === null || String(value.password).trim() === '') {
        errors.push('Password is required');
      } else if (String(value.password).length < 6) {
        errors.push('Password must be at least 6 characters long');
      } else if (String(value.password).length > 20) {
        errors.push('Password should not exceed 20 characters');
      } else if (!passwordRegex.test(String(value.password))) {
        errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      }
    }

    if (errors.length) {
      if (abortEarly === false) {
        return Promise.reject(buildError(errors));
      }
      return Promise.reject(buildError([errors[0]]));
    }

    const cleaned = {};
    if (value.name !== undefined) cleaned.name = String(value.name).trim();
    if (value.email !== undefined) cleaned.email = String(value.email).trim();
    if (value.password !== undefined) cleaned.password = value.password;

    return Promise.resolve(cleaned);
  }
};

module.exports = userValidationSchema;
