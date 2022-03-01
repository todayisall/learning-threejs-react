import { Link } from "react-router-dom";
function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <div className="chapter">
          第一章:
          <Link
            to="/chapter-01/first-scene"
            className="chapter-link"
          >
            first scene
          </Link>
          <Link to="/chapter-01/materials-light">materials-light</Link>
        </div>
        <div className="chapter">
          第二章:
          <Link to="/chapter-02/basic-scene">basic scene</Link>
        </div>
        <div className="chapter">
          第三章:
          <Link to="/chapter-03/ambient-light">ambient light</Link>
          <Link to="/chapter-03/lensflares">lensflares</Link>
        </div>
      </nav>
    </div>
  );
}

export default Home;
