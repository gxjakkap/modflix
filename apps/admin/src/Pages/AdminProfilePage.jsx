import { useNavigate } from "react-router-dom";
import AdminProfile from "../AdminProfile/AdminProfile";
import Navbar from "../navbar/navbar";
import mockProfilePic from '../assets/rigbyMockProfilePic.png'

function AdminProfilePage({ pic, username, onSave }) {
  const navigate = useNavigate();

  return (
    <>
      <Navbar pic={pic} username={username} />
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "2rem",
        }}>
        {/* <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14, padding: "1rem 0" }}
        >
          ← Back
        </button> */}
      </div>
      <AdminProfile pic={pic} username={username} onSave={onSave}/>
    </>
  );
}

export default AdminProfilePage;