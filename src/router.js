import { Routes, Route } from "react-router-dom";

import Home from "./view/home/index";
import Chapter01FirstScene from "./view/chapter-01/first-scene";
import Chapter01MaterialsLight from "./view/chapter-01/materials-light";
import Chapter02BasicScene from "./view/chapter-02/basic-scene";
import Chapter03AmbientLight from "./view/chapter-03/ambient-light";
import Chapter03Lensflares from "./view/chapter-03/lensflares";
import CyberpunkDesk from "./view/other/cyberpunk-desk";
import CyberpunkDesk2 from "./view/other/cyberpunk-desk_2";
export const routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chapter-01/first-scene" element={<Chapter01FirstScene />} />
      <Route path="/chapter-01/materials-light" element={<Chapter01MaterialsLight />} />
      <Route path="/chapter-02/basic-scene" element={<Chapter02BasicScene />} />
      <Route path="/chapter-03/ambient-light" element={<Chapter03AmbientLight />} />
      <Route path="/chapter-03/lensflares" element={<Chapter03Lensflares />} />
      <Route path="/other/cyberpunk-desk" element={<CyberpunkDesk />} />
      <Route path="/other/cyberpunk-desk2" element={<CyberpunkDesk2 />} />
    </Routes>
  );
};
