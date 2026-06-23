import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "../src/supabase-client";
import { FunctionsFetchError } from "@supabase/supabase-js";
import TaskManager from "./components/task-manager";
import Auth from "./components/auth";

function App() {
  const [session, setSession] = useState(null);

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    setSession(currentSession.data.session);
  };

  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <>
      {session ? (
        <>
          <button onClick={logout}>Log Out</button>
          <TaskManager session={session} />
        </>
      ) : (
        <Auth></Auth>
      )}
    </>
  );
}

export default App;
