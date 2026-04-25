/**
 * Global TypeScript declarations
 * 
 * This file contains global type declarations for the application.
 * It helps TypeScript understand module types and resolve import issues.
 */

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.sass' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

// React types
declare namespace React {
  interface ChangeEvent<T = Element> {
    target: T & {
      name?: string;
      value?: string;
    };
  }
}

// JSX types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
