import React from 'react';
import { SERVER_URL } from '../Constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import showToast from '../Utils/ShowToast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { validationSchema } from '../Utils/validation';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post(`${SERVER_URL}/register`, values);
      if (response.status === 200) {
        resetForm();
        showToast('Registered Successfully, Login Now', 'success');
        navigate('/login');
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Registration failed';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <Field
                  type="text"
                  name="username"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                />
                <ErrorMessage name="username" component="div" className="text-red-600 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                />
                <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Register
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
