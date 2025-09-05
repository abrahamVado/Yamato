import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";

function Login(){
  const {login, register} = useAuth();
  const [mode,setMode]=React.useState('login');
  const [name,setName]=React.useState('');
  const [email,setEmail]=React.useState('');
  const [pw,setPw]=React.useState('');
  return (
    <div style={{maxWidth:420,margin:"80px auto",display:"grid",gap:12}}>
      <h1>{mode==='login'?'Sign in':'Create account'}</h1>
      {mode==='register' && <input placeholder="name" value={name} onChange={e=>setName(e.target.value)} />}
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
      {mode==='login'
        ? <button onClick={()=>login(email,pw)}>Sign in</button>
        : <button onClick={()=>register(name,email,pw)}>Register</button>}
      <button onClick={()=>setMode(mode==='login'?'register':'login')}>
        {mode==='login'?'Need an account?':'Have an account?'}
      </button>
    </div>
  );
}

function Guard({children}) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{padding:40}}>Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function Dashboard(){
  const {user, logout} = useAuth();
  return (
    <div style={{maxWidth:720,margin:"80px auto"}}>
      <h1>Dashboard</h1>
      <p>Welcome, <b>{user?.name}</b></p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

const router = createBrowserRouter([
  { path: "/login", element: <Login/> },
  { path: "/", element: <Guard><Dashboard/></Guard> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><AuthProvider><RouterProvider router={router}/></AuthProvider></React.StrictMode>
);
