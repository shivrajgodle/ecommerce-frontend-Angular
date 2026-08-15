import { ApplicationConfig, provideBrowserGlobalErrorListeners , provideZonelessChangeDetection} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular 22 default for NEW projects, but this app was generated
    // by the CLI already zoneless — this line is here to make that
    // choice EXPLICIT and self-documenting, not to actually change
    // behavior the CLI didn't already set up. Zoneless means Angular
    // detects when to re-render based on SIGNALS changing, not by
    // monkey-patching every async browser API (setTimeout, fetch,
    // addEventListener) the way Zone.js did — faster, and the stack
    // traces in your browser devtools are your ACTUAL code's stack,
    // not Zone.js's wrapping machinery around it.
    provideZonelessChangeDetection(),
    // withComponentInputBinding() lets route params/query params bind
    // DIRECTLY to a component's signal inputs (input()) — e.g. a
    // route param :id automatically populates `id = input<string>()`
    // on the component with zero manual ActivatedRoute subscription
    // code. We'll use this immediately in Phase 3's product detail page.
     provideRouter(routes, withComponentInputBinding()),
   // withFetch() makes HttpClient use the native Fetch API instead of
    // XMLHttpRequest under the hood — the modern default, better
    // interop with things like Service Workers and streaming.
    // withInterceptors() registers FUNCTIONAL interceptors (plain
    // functions, not injectable classes implementing HttpInterceptor
    // — the class-based approach still works but functional is the
    // current idiomatic style) — order matters, explained below.
    // provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),

    provideAnimationsAsync(),
  
  ]
};
