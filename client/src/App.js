import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Users/Login";
import Register from "./components/Users/Register";
import Navbar from "./components/Navbar/Navbar";
import AddNewCategory from "./components/Categories/AddNewCategory";
import CategoryList from "./components/Categories/CategoryList";
import UpdateCategory from "./components/Categories/UpdateCategory";
import { useSelector } from "react-redux";
import CreatePost from "./components/Posts/CreatePost";
function App() {
  const { userAuth } = useSelector((state) => state.user);
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Admin only routes */}
        <Route
          path="/add-category"
          element={userAuth?.isAdmin ? <AddNewCategory /> : <HomePage />}
        />
        <Route
          path="/category-list"
          element={userAuth?.isAdmin ? <CategoryList /> : <HomePage />}
        />
        <Route
          path="/update-category/:id"
          element={userAuth?.isAdmin ? <UpdateCategory /> : <HomePage />}
        />
        {/* Authenticated users can only access */}
        <Route
          path="/create-post"
          element={userAuth ? <CreatePost /> : <Login />}
        />
        <Route path="/*" element={<h1>404</h1>} />
      </Routes>
    </div>
  );
}

export default App;
