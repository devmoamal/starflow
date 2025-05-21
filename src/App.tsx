import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import PageWrapper from './components/common/PageWrapper';
import { Toaster } from "@/components/ui/Toaster";
import ModelsPage from './pages/ModelsPage';
import FlowsPage from './pages/FlowsPage'; // Updated import

// Placeholder Page Components for other pages
const EditorPage = () => <PageWrapper><div>Editor Page Content</div></PageWrapper>;

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FlowsPage />} />
        <Route path="/models" element={<ModelsPage />} /> {/* Updated */}
        <Route path="/flows" element={<FlowsPage />} />
        <Route path="/flows/editor/:flowId" element={<EditorPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
