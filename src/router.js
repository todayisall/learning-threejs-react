import { Routes, Route } from "react-router-dom";

import Home from "./view/home/index";
import Chapter01FirstScene from "./view/chapter-01/first-scene";
import Chapter01MaterialsLight from "./view/chapter-01/materials-light";
import Chapter02BasicScene from "./view/chapter-02/basic-scene";
export const routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chapter-01/first-scene" element={<Chapter01FirstScene />} />
      <Route path="/chapter-01/materials-light" element={<Chapter01MaterialsLight />} />
      <Route path="/chapter-02/basic-scene" element={<Chapter02BasicScene />} />
    </Routes>
  );
};
