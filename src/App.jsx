import React, { useState } from "react";
// import "./App.css";
import Dashboard from "./components/Dashboard";
import PostComposer from "./components/PostComposer";
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"


const postStatus = {
  scheduled: {
    label: "Scheduled",
    color: "#92400e",
    backgroundColor: "#fef3c7",
  },
  published: {
    label: "Published",
    color: "#166534",
    backgroundColor: "#dcfce7",
  },
  failed: {
    label: "Failed",
    color: "#991b1b",
    backgroundColor: "#fee2e2",
  },
};
const tabs = [
  {
    name: "Dashboard",
    component: Dashboard,
  },
  {
    name: "Compose",
    component: PostComposer,
  },
];

const platformConfig = [
  {
    platform: "Facebook",
    maxCharacterCount: 5000,
  },
  {
    platform: "X",
    maxCharacterCount: 280,
  },
  {
    platform: "Instagram",
    maxCharacterCount: 2200,
  },
  {
    platform: "TikTok",
    maxCharacterCount: 2200,
  },
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
  const [activeTab, setActiveTab] = useState(0);
  const ActiveTab = tabs[activeTab].component;

  return (
    <div>
      <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
        {tabs.map((tab, idx) => (
          <Tab key={tab.name} value={idx} label={tab.name} />
        ))}
      </Tabs>
      <div role="tabpanel">
        <ActiveTab />
      </div>
    </div>
  );
}

export default App;
