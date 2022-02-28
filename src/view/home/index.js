import { Link } from "react-router-dom";
function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <div className="chapter">
          <Link
            to="/chapter-01/first-scene"
            style={{ "padding-right": "16px" }}
          >
            first scene
          </Link>
          <Link to="/chapter-01/materials-light">materials-light</Link>
        </div>
        <div className="chapter">
          <Link to="/chapter-02/basic-scene">basic scene</Link>
        </div>
      </nav>
    </div>
  );
}

export default Home;
