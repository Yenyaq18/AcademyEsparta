import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { COLORS } from "../../utils/constants";

/**
 * role: "admin" | "director" | "estudiante" — decide qué menú muestra el Sidebar.
 */
export default function MainLayout({ role = "estudiante" }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: COLORS.bgApp }}>
      <Sidebar role={role} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {role !== "estudiante" && <Header role={role} />}
        <Box
          sx={{
            flex: 1,
            px: { xs: 2, sm: 3 },
            pt: role === "estudiante" ? { xs: 2, sm: 3 } : 0,
            pb: 3,
          }}
        >
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}