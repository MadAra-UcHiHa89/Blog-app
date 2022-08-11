import {
  PlusCircleIcon,
  BookOpenIcon,
  TrashIcon
} from "@heroicons/react/solid";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCategoryAction,
  fetchCategoryAction,
  deleteCategoryAction
} from "../../redux/slices/category/categorySlice";

const formSchema = Yup.object({
  title: Yup.string().required("Title is required")
});

export default function UpdateCategory(props) {
  const {
    singleCategory,
    updatedCategory,
    deletedCategory,
    appError,
    serverError,
    loading
  } = useSelector((state) => state.category);

  const { id } = useParams(); // since route is /update-category/:id
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If updatedCategory || deletedCategory exists, then redirect to /ccategory-list
  if (updatedCategory || deletedCategory) {
    navigate("/category-list", { replace: true });
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: singleCategory?.title
    },
    onSubmit: (values) => {
      // Since in update categpry we require the id , and the title input as arguments for thunk function , so as to make the put request
      dispatch(updateCategoryAction({ id, title: values.title }));
    },
    validationSchema: formSchema
  });
  console.log(singleCategory);

  useEffect(() => {
    dispatch(fetchCategoryAction(id));
  }, [dispatch]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <BookOpenIcon className="mx-auto h-12 w-auto" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Hey are sure you want to to update ...
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              <p className="font-medium text-indigo-600 hover:text-indigo-500">
                These are the categories user will select when creating a post
              </p>
            </p>
            {appError && <h2 className="text-red-400">{appError}</h2>}
          </div>
          {/* Form start here */}
          <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Name
                </label>
                {/* title */}
                <input
                  value={formik.values.title}
                  onChange={formik.handleChange("title")}
                  onBlur={formik.handleBlur("title")}
                  type="text"
                  autoComplete="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-center focus:z-10 sm:text-sm"
                  placeholder="New Category"
                />
                <div className="text-red-400 mb-2">
                  {formik.touched.title && formik.errors.title}
                </div>
              </div>
            </div>

            <div>
              <div>
                {/* Submit btn */}
                {!loading ? (
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <PlusCircleIcon
                        className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
                        aria-hidden="true"
                      />
                    </span>
                    Update
                  </button>
                ) : (
                  <button
                    disabled
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 "
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <PlusCircleIcon
                        className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
                        aria-hidden="true"
                      />
                    </span>
                    Loading ...
                  </button>
                )}
              </div>
              <div className="mt-6">
                {/* Submit btn */}
                {!loading ? (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(deleteCategoryAction(id));
                    }}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <TrashIcon
                        className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
                        aria-hidden="true"
                      />
                    </span>
                    Delete
                  </button>
                ) : (
                  <button
                    disabled
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 "
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <TrashIcon
                        className="h-5 w-5 text-yellow-500 group-hover:text-indigo-400"
                        aria-hidden="true"
                      />
                    </span>
                    Loading ...
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
