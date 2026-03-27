import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

vi.mock('./pages/Repositories', () => ({ default: () => <div>Repositories Page</div> }));
vi.mock('./pages/DettagliRepo', () => ({ default: () => <div>DettagliRepo Page</div> }));
vi.mock('./pages/AddRepository', () => ({ default: () => <div>AddRepository Page</div> }));
vi.mock('./pages/UserPage', () => ({ default: () => <div>UserPage Page</div> }));
vi.mock('./pages/Login', () => ({ default: () => <div>Login Page</div> }));
vi.mock('./components/NavBar', () => ({ NavBar: () => <nav>NavBar</nav> }));

import { Navigate, Outlet } from 'react-router-dom';

const RootLayout = () => (
  <div>
    <nav>NavBar</nav>
    <main><Outlet /></main>
  </div>
);

const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/repositories" replace /> },
      { path: 'repositories', element: <div>Repositories Page</div> },
      { path: 'repository/:id', element: <div>DettagliRepo Page</div> },
      { path: '/addRepository', element: <div>AddRepository Page</div> },
      { path: '/profile', element: <div>UserPage Page</div> },
      { path: '/login', element: <div>Login Page</div> },
      { path: '*', element: <div>404 - Pagina non trovata</div> },
    ],
  },
];

const renderWithRouter = (initialEntry: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [initialEntry] });
  return render(<RouterProvider router={router} />);
};

describe('App routing', () => {
  it('reindirizza / a /repositories', async () => {
    renderWithRouter('/');
    expect(await screen.findByText('Repositories Page')).toBeInTheDocument();
  });

  it('renderizza Repositories su /repositories', async () => {
    renderWithRouter('/repositories');
    expect(await screen.findByText('Repositories Page')).toBeInTheDocument();
  });

  it('renderizza DettagliRepo su /repository/:id', async () => {
    renderWithRouter('/repository/1');
    expect(await screen.findByText('DettagliRepo Page')).toBeInTheDocument();
  });

  it('renderizza AddRepository su /addRepository', async () => {
    renderWithRouter('/addRepository');
    expect(await screen.findByText('AddRepository Page')).toBeInTheDocument();
  });

  it('renderizza UserPage su /profile', async () => {
    renderWithRouter('/profile');
    expect(await screen.findByText('UserPage Page')).toBeInTheDocument();
  });

  it('renderizza Login su /login', async () => {
    renderWithRouter('/login');
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('renderizza 404 per percorsi non esistenti', async () => {
    renderWithRouter('/percorso-inesistente');
    expect(await screen.findByText('404 - Pagina non trovata')).toBeInTheDocument();
  });

  it('renderizza la NavBar in tutte le pagine', async () => {
    renderWithRouter('/repositories');
    expect(await screen.findByText('NavBar')).toBeInTheDocument();
  });
});