// const numberRegex = /^[0-9]+$/;
export const ONLY_NUMBER_ALLOWED = 'Please enter only numerical values.';
const NUMBER_GREATER_ZERO = 'Enter a number more than 0.';

const validatePositiveNumber = (_, value) => {
  if (Number(value) > 0) {
    return Promise.resolve();
  }
  return Promise.reject(new Error(NUMBER_GREATER_ZERO));
};

export const validateNumber = () => [
  // { required: true, message: `${fieldName} is required!` },
  // { pattern: numberRegex, message: ONLY_NUMBER_ALLOWED },

  { validator: validatePositiveNumber },
];
