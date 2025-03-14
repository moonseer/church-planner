declare module 'csurf' {
  import { RequestHandler } from 'express';

  interface CookieOptions {
    key?: string;
    path?: string;
    signed?: boolean;
    secure?: boolean;
    maxAge?: number;
    httpOnly?: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
  }

  interface Options {
    value?: (req: any) => string;
    cookie?: CookieOptions | boolean;
    ignoreMethods?: string[];
  }

  function csurf(options?: Options): RequestHandler;

  export = csurf;
}

// Extend the Request type to include csrfToken
import 'express';
declare module 'express' {
  interface Request {
    csrfToken(): string;
  }
} 