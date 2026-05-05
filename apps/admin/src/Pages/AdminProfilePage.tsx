import { useNavigate } from "react-router-dom";
import AdminProfile from "../AdminProfile/AdminProfile";
import Navbar from "../navbar/Navbar.tsx";

interface AdminProfilePageProps {
  pic?: string
  username?: string
  onSave?: (newUsername: string) => void
}

function AdminProfilePage({ pic, username, onSave }: AdminProfilePageProps) {
  return (
    <>
      <Navbar pic={pic} username={username} />
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "2rem",
        }}>
      </div>
      <AdminProfile pic={pic} username={username} onSave={onSave}/>
    </>
  );
}

export default AdminProfilePage;