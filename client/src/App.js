import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Users/Login";
import Register from "./components/Users/Register";
import Navbar from "./components/Navbar/Navbar";
import AddNewCategory from "./components/Categories/AddNewCategory";
import CategoryList from "./components/Categories/CategoryList";
function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-category" element={<AddNewCategory />} />
        <Route path="/categorylist" element={<CategoryList />} />
        <Route path="/*" element={<h1>404</h1>} />
      </Routes>
    </div>
  );
}

export default App;
