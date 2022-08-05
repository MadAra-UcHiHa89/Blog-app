import React from "react";
import { BiUserPlus } from "react-icons/bi";
import { RiRotateLockLine } from "react-icons/ri";
import { useFormik } from "formik";
import * as yup from "yup";
import { registerUserAction } from "../../redux/slices/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Form Schema for validation using yup

const formSchema = yup.object({
  firstName: yup.string().required("First Name is required"), // field: yup.type().required("error message")
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required")
});

const Register = () => {
  const dispatch = useDispatch();
  const { loading, appError, serverError, registered } = useSelector(
    (state) => state.user
  ); // accessing the user slice of the state

  const navigate = useNavigate();
  if (registered) {
    // User has lready registered then redirect to login page
    navigate("/login", { replace: true });
  }

  console.log(loading, appError, serverError, registered, "From Register");

  // Formik
  const formik = useFormik({
    // provide the initial values of the form fields
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    },
    onSubmit: (values) => {
      // disptach the action to register the user (which is a thunk action creator)
      dispatch(registerUserAction(values));
    },
    validationSchema: formSchema
  });

  return (
    <div className="w-[100vw] h-[100vh] bg-[#1F2A37] flex items-center">
      <div className="container mx-auto h-[100%] justify-center md:h-[600px]  flex flex-col  md:flex-row items-center md:justify-evenly px-4 py-4">
        <div className="flex flex-col  justify-center gap-8 md:w-[350px] h-[100%]">
          <h3 className="font-semibold text-[#267EF2] text-xl">
            Register Account
          </h3>
          <h1 className="font-bold text-white text-4xl">
            Create An Account <br /> and start pending <br /> down your ideas
          </h1>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col justify-evenly  gap-4 md:h-[80%] rounded-md md:w-[400px] px-12 py-12 bg-[rgba(255,255,255,0.3)] backdrop-blur-md"
        >
          <h3 className="text-white text-lg font-bold ">
            Register Account
            {/* Error Message */}
            {appError && <p className="text-red-400">{appError}</p>}
          </h3>
          <div>
            <div className="flex w-[100%]">
              <div className="bg-white rounded-tl-xl rounded-bl-xl w-[10%] flex items-center justify-end ">
                <BiUserPlus />
              </div>
              <input
                value={formik.values.firstName}
                onChange={formik.handleChange("firstName")}
                onBlur={formik.handleBlur("firstName")}
                className="bg-white outline-none px-4 py-2 text-sm w-[80%]"
                placeholder="First Name"
                type="text"
              />
              <div className="bg-white w-[10%] flex items-center justify-start rounded-tr-xl rounded-br-xl">
                <RiRotateLockLine />
              </div>
            </div>
            {formik.touched.firstName && (
              <p className="text-sm text-red-600 mt-[2px]">
                {formik.errors.firstName}
              </p>
            )}
          </div>
          <div>
            <div className="flex w-[100%]">
              <div className="bg-white rounded-tl-xl rounded-bl-xl w-[10%] flex items-center justify-end ">
                <BiUserPlus />
              </div>
              <input
                value={formik.values.lastName}
                onChange={formik.handleChange("lastName")}
                onBlur={formik.handleBlur("lastName")}
                className="bg-white outline-none px-4 py-2 text-sm w-[80%]"
                placeholder="Last Name"
                type="text"
              />
              <div className="bg-white w-[10%] flex items-center justify-start rounded-tr-xl rounded-br-xl">
                <RiRotateLockLine />
              </div>
            </div>
            {formik.touched.lastName && (
              <p className="text-sm text-red-600 mt-[2px]">
                {formik.errors.lastName}
              </p>
            )}
          </div>
          <div>
            <div className="flex w-[100%]">
              <div className="bg-white rounded-tl-xl rounded-bl-xl w-[10%] flex items-center justify-end ">
                <BiUserPlus />
              </div>
              <input
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                className="bg-white outline-none px-4 py-2 text-sm w-[80%]"
                placeholder="email@example.com"
                type="email"
              />
              <div className="bg-white w-[10%] flex items-center justify-start rounded-tr-xl rounded-br-xl">
                <RiRotateLockLine />
              </div>
            </div>
            {formik.touched.email && (
              <p className="text-sm text-red-600 mt-[2px]">
                {formik.errors.email}
              </p>
            )}
          </div>
          <div>
            <div className="flex w-[100%]">
              <div className="bg-white rounded-tl-xl rounded-bl-xl w-[10%] flex items-center justify-end ">
                <BiUserPlus />
              </div>
              <input
                value={formik.values.password}
                onChange={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                className="bg-white outline-none px-4 py-2 text-sm w-[80%]"
                placeholder="password"
                type="password"
              />
              <div className="bg-white w-[10%] flex items-center justify-start rounded-tr-xl rounded-br-xl">
                <RiRotateLockLine />
              </div>
            </div>
            {formik.touched.password && (
              <p className="text-sm text-red-600 mt-[2px]">
                {formik.errors.password}
              </p>
            )}
          </div>

          {!loading ? (
            <button
              type="submit"
              className="font-semibold text-white text-md bg-[#267EF2] py-2 px-4 rounded-full"
            >
              {" "}
              Register{" "}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="font-semibold text-white text-md bg-gray-400 py-2 px-4 rounded-full"
            >
              {" "}
              Loading Pleas wait{" "}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
