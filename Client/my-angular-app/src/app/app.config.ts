import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeng/themes/aura';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: { preset: Aura },
    }),
    MessageService,
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const authLink = setContext(() => {
        const token = localStorage.getItem('accessToken');
        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
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
// import { provideRouter, Routes } from '@angular/router';
// import { InMemoryCache } from '@apollo/client/core';
// import { setContext } from '@apollo/client/link/context';
// import { HomeComponent } from './pages/home/home.component';
// import { routes } from './app.routes';
// import { providePrimeNG } from 'primeng/config';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
// import { Provider } from '@angular/core';

// import Aura from '@primeng/themes/aura';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     providePrimeNG({
//       theme: { preset: Aura },
//     }),
//     provideHttpClient(),
//     provideRouter(routes),
//     provideApollo(() => {
//       const httpLink = inject(HttpLink);

//       // Create an auth link to attach the token
//       const authLink = setContext(() => {
//         const token = localStorage.getItem('accessToken');

//         return {
//           headers: {
//             Authorization: token ? `Bearer ${token}` : '',
//           },
//         };
//       });

//       return {
//         link: authLink.concat(
//           httpLink.create({ uri: 'http://localhost:7000/graphql' })
//         ),
//         cache: new InMemoryCache(),
//       };
//     }),
//   ],
// };
