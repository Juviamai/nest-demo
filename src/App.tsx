import { motion } from "framer-motion";
import { AppProvider, useApp } from "./state/AppState";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { EventDetailPanel } from "./components/EventDetailPanel";
import { VoiceOverlay } from "./components/VoiceOverlay";
import { HomePage } from "./pages/HomePage";
import { MemoryPage } from "./pages/MemoryPage";
import { ObjectsPage } from "./pages/ObjectsPage";
import { EventsPage } from "./pages/EventsPage";
import { SensorsPage } from "./pages/SensorsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { SettingsPage } from "./pages/SettingsPage";

function Shell() {
  const { page } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9FB] text-slate-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1440px] px-6 py-6 xl:px-8">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              {page === "home" && <HomePage />}
              {page === "memory" && <MemoryPage />}
              {page === "objects" && <ObjectsPage />}
              {page === "events" && <EventsPage />}
              {page === "sensors" && <SensorsPage />}
              {page === "privacy" && <PrivacyPage />}
              {page === "settings" && <SettingsPage />}
            </motion.div>
          </div>
        </main>
      </div>
      <EventDetailPanel />
      <VoiceOverlay />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
