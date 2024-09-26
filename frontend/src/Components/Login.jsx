import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import showToast from '../Utils/ShowToast';
import { SERVER_URL } from '../Constants';
import { jwtDecode } from "jwt-decode"; 
import { setUser } from '../../Redux/userSlice';
import { useAppDispatch } from "../../Redux/store";
import { loginValidationSchema } from '../Utils/validation'; 

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${SERVER_URL}/login`, values);

        const { access_token } = response.data; 

        if (!access_token) {
          throw new Error('Access token not found');
        }
        const { id, name } = jwtDecode(access_token);
        console.log(id, name);

        if (response.status === 200) {
          localStorage.setItem("access_token", access_token);
          dispatch(
            setUser({
              id,
              name,
              isAuthenticated: true,
            })
          );
          formik.resetForm(); 
          showToast('Login Successful', 'success');
          navigate('/'); 
        }
      } catch (error) {
        console.log('Error Response:', error.response);
        const errorMessage = error.response ? error.response.data.message : 'Login failed';
        showToast(errorMessage, 'error');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-5">Login</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
