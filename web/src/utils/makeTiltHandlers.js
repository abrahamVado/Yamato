// src/utils/makeTiltHandlers.js
export function makeTiltHandlers(strength = 8, shadow = 10) {
  return {
    onMouseMove(e) {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const px = (x / r.width  - 0.5) * 2;
      const py = (y / r.height - 0.5) * 2;
      el.style.setProperty("--ry", `${( px * strength).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-py * strength).toFixed(2)}deg`);
      el.style.setProperty("--sx", `${( px * shadow ).toFixed(2)}px`);
      el.style.setProperty("--sy", `${( Math.max(py, .2) * shadow ).toFixed(2)}px`);
      el.style.setProperty("--spec-x", `${(x / r.width * 100).toFixed(1)}%`);
      el.style.setProperty("--spec-y", `${(y / r.height * 100).toFixed(1)}%`);
      el.style.transform = `perspective(700px) rotateX(var(--rx)) rotateY(var(--ry))`;
    },
    onMouseLeave(e) {
      const el = e.currentTarget;
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
      el.style.removeProperty("--sx");
      el.style.removeProperty("--sy");
      el.style.removeProperty("--spec-x");
      el.style.removeProperty("--spec-y");
      el.style.removeProperty("transform");
    }
  };
}
