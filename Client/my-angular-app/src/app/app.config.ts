import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { HomeComponent } from './pages/home/home.component';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSIsImlhdCI6MTc0MDU2MDg1OSwiZXhwIjoxNzQwNTk2ODU5fQ.UpitI55eF0EHg9sul_EddpDP-Q9TLviMghYGfeCjrNg';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: { preset: Aura },
    }),
    provideHttpClient(),
    provideRouter(routes), // Register routes
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      // Create an auth link to attach the token
      const authLink = setContext(() => {
        const token = localStorage.getItem('token'); // Get JWT token
        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : `Bearer ${TOKEN}`,
          },
        };
      });

      return {
        link: authLink.concat(
          httpLink.create({ uri: 'http://localhost:7000/graphql' })
        ),
        cache: new InMemoryCache(),
      };
    }),
  ],
};

// import { provideApollo } from 'apollo-angular';
// import { HttpLink } from 'apollo-angular/http';
// import { provideHttpClient } from '@angular/common/http';
// import { ApplicationConfig, inject } from '@angular/core';
// import { InMemoryCache } from '@apollo/client/core';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideHttpClient(),
//     provideApollo(() => {
//       const httpLink = inject(HttpLink);

//       return {
//         link: httpLink.create({ uri: 'http://localhost:7000/graphql' }),
//         cache: new InMemoryCache(),
//       };
//     }),
//   ],
// };
