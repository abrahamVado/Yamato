import React, {createContext, useContext, useEffect, useState} from "react";
import { api, ensureCsrf } from "./api";

const Ctx = createContext({ user:null, loading:true, login:async()=>{}, register:async()=>{}, logout:async()=>{} });

export function AuthProvider({children}) {
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ (async()=>{
    try { const r = await api.get("/me"); setUser(r.data.user); } catch {} finally { setLoading(false); }
  })(); },[]);

  const login = async (email,password)=>{ await ensureCsrf(); const r = await api.post("/auth/login",{email,password}); setUser(r.data.user); };
  const register = async (name,email,password)=>{ await ensureCsrf(); const r = await api.post("/auth/register",{name,email,password}); setUser(r.data.user); };
  const logout = async ()=>{ await ensureCsrf(); await api.post("/auth/logout"); setUser(null); };

  return <Ctx.Provider value={{user,loading,login,register,logout}}>{children}</Ctx.Provider>;
}
export const useAuth = ()=>useContext(Ctx);
