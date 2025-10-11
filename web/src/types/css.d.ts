//1.- Provide a minimal typing for CSS modules so TypeScript understands CatLoader.module.css imports.
declare module "*.module.css" {
  const classes: Record<string, string>
  export default classes
}
