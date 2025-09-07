  // src/pages/PushyXDemo.jsx
import React from "react";
import * as Ph from "@phosphor-icons/react";
import PushyXButton from "@/components/PushyXButton.jsx";
import "@/styles/pushyx.scss";
import "@/styles/pushyx-tilt.scss";
import { makeTiltHandlers } from "@/utils/makeTiltHandlers.js";

export default function PushyXDemo(){
  const page = { background:"#0f2a66", minHeight:"100vh", padding:"40px", color:"#fff", fontFamily:"Inter, system-ui, Arial" };
  const section = { display:"grid", gap:20, marginBottom:28 };
  const grid3 = { display:"grid", gridTemplateColumns:"repeat(3, 260px)", gap:24 };
  const row = { display:"flex", gap:16, flexWrap:"wrap" };
  const tilt = makeTiltHandlers(8, 12);

  return (
    <div >
    <a class="button">
        <span>press me</span>
    </a>

    </div>
  );
}
