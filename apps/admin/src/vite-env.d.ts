/// <reference types="vite/client" />

// Image imports
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}

// CSS Modules
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
