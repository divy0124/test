// const numberRegex = /^[0-9]+$/;
export const ONLY_NUMBER_ALLOWED = 'Only numbers allowed.';
const NUMBER_GREATER_ZERO = 'Enter a number more than 0.';

const onlyNumberPattern = /^\d+$/;
const validatePositiveNumber = (_, value) => {
  if (Number(value) > 0) {
    return Promise.resolve();
  }
  if (!onlyNumberPattern.test(value))
    return Promise.reject(new Error(ONLY_NUMBER_ALLOWED));

  return Promise.reject(new Error(NUMBER_GREATER_ZERO));
};

export const validateNumber = () => [{ validator: validatePositiveNumber }];
