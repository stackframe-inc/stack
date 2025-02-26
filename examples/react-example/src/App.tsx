import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { stackClientApp } from "./stack";

function StackRoutes(props: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackClientApp}>
      <StackTheme>
        {props.children}
      </StackTheme>
    </StackProvider>
  );
}

function HandlerRoutes() {
  const location = useLocation();
  
  return (
    <StackHandler app={stackClientApp} location={location.pathname} />
  );
}

function App() {
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <StackRoutes>
          <Routes>
            <Route path="/handler/*" element={<HandlerRoutes />} />
          </Routes>
        </StackRoutes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
