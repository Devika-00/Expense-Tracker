import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .matches(/^[A-Z][a-zA-Z ]*$/, 'Username must start with a capital letter and only contain alphabets and spaces')
    .min(2, 'Username must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*()_+\[\]{}|?]/, 'Password must contain at least one special character'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*()_+\[\]{}|?]/, 'Password must contain at least one special character'),
});
