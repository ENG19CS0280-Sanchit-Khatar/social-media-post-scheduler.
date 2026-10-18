import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import PostComposer from "./components/PostComposer";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const navigationItems = [
  { name: "Dashboard", component: Dashboard },
  { name: "Compose", component: PostComposer },
];

// Platform = 'facebook' | 'instagram' | 'x' | 'tiktok';
// PostStatus = 'scheduled' | 'published' | 'failed';
// Post {
//   id: string;
//   content: string;
//   platforms: Platform[];
//   mediaUrl?: string;
//   scheduledAt: string;
//   status: PostStatus;
//   errorMessage?: string;
// }

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const ActivePage = navigationItems.find(
    (item) => item.name === activePage,
  ).component;

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" component="div">
            Schedulezy
          </Typography>
          {navigationItems.map((item) => (
            <Button
              key={item.name}
              color="inherit"
              aria-current={activePage === item.name ? "page" : undefined}
              onClick={() => setActivePage(item.name)}
              sx={{
                borderBottom: 2,
                borderColor:
                  activePage === item.name ? "currentColor" : "transparent",
                borderRadius: 0,
              }}
            >
              {item.name.toLowerCase()}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
        <ActivePage />
      </Container>
    </>
  );
}

export default App;
