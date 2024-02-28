import { Box } from "@chakra-ui/react";
import CodeEditor from "./components/CodeEditor";

function App() {
  return (
    <Box minH={"100vh"} bg={"#0f0a19"} p={4} color={"gray.200"} px={6} py={10}>
      <CodeEditor />
    </Box>
  );
}

export default App;
