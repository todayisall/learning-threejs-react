import { Link } from "react-router-dom";
function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <Link to="/chapter-01/first-scene" style={{'padding-right': '16px'}}>first scene</Link>
        <Link to="/chapter-01/materials-light">materials-light</Link>
      </nav>
    </div>
  );
}

export default Home;
