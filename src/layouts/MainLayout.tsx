import { useState } from "react";
import { Flex, Box, IconButton } from "@radix-ui/themes";
import { PanelLeftOpen } from "lucide-react";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Flex style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <Box
        style={{
          width: isSidebarOpen ? "270px" : "0px",
          borderRight: isSidebarOpen ? "1px solid var(--gray-5)" : "none",
          flexShrink: 0,
          overflow: "hidden",
          transition:
            "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)" 
        }}
      >
        <Box style={{ width: "270px" }}>
          <Sidebar toggleSidebar={toggleSidebar} />
        </Box>
      </Box>

      <Flex direction="column" style={{ flexGrow: 1, overflow: "hidden" }}>
        <Flex
          align="center"
          px="4"
          style={{
            height: "45px",
            flexShrink: 0,
          }}
        >
          <IconButton
            variant="ghost"
            color="gray"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ cursor: "pointer", display: isSidebarOpen ? "none" : "block" }}
          >
            <PanelLeftOpen size={18} strokeWidth={1.5} />
          </IconButton>
          <Topbar />
        </Flex>
        <Box
          style={{
            flexGrow: 1,
            overflowY: "auto",
            backgroundColor: "var(--gray-2)",
          }}
        >
          <Box p="6" style={{ maxWidth: "800px", margin: "0 auto" }}>
            {children}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
