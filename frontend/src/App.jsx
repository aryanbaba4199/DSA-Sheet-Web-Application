import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentication from "./Components/Authentication/Authentication";

import Topics from "./Components/Home/Topics";
import Homepage from "./Components/Home/Homepage";
import ProtectedRoute from "./routes/protected_routes";
import TabMenu from "./Components/Home/TabMenu";
import UserProgress from "./Components/Home/UserProgress";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route
          path="/"
          
          element={
            <ProtectedRoute>
              <TabMenu/>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/topics"
          
          element={
            <ProtectedRoute>
              <TabMenu/>
              <Topics />
            </ProtectedRoute>
          }
        />
         <Route
          path="/progress"
          
          element={
            <ProtectedRoute>
              <TabMenu/>
              <UserProgress />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};


export default App
