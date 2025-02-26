import { SignIn, StackProvider, StackTheme } from "@stackframe/react";
import { Suspense } from "react";
import { stackClientApp } from "./stack";

function App() {
  return (
    <Suspense fallback={null}>
      <StackProvider app={stackClientApp}>
        <StackTheme>
          <SignIn />
        </StackTheme>
      </StackProvider>
    </Suspense>
  );
}

export default App
