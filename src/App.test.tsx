import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./pages/Repositories', () => ({ default: () => <div>Repositories Page</div> }));
vi.mock('./pages/DettagliRepo', () => ({ default: () => <div>DettagliRepo Page</div> }));
vi.mock('./pages/AddRepository', () => ({ default: () => <div>AddRepository Page</div> }));
vi.mock('./pages/UserPage', () => ({ default: () => <div>UserPage Page</div> }));
vi.mock('./pages/Login', () => ({ default: () => <div>Login Page</div> }));
vi.mock('./components/NavBar', () => ({ NavBar: () => <nav>NavBar</nav> }));

let mockInitialEntry = '/repositories';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    createBrowserRouter: (routes: any) =>
      actual.createMemoryRouter(routes, { initialEntries: [mockInitialEntry] }),
  };
});

const renderApp = async (path: string) => {
  mockInitialEntry = path;
  vi.resetModules();
  const { default: App } = await import('./App');
  return render(<App />);
};

describe('App routing', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renderizza Repositories su /repositories', async () => {
    await renderApp('/repositories');
    expect(await screen.findByText('Repositories Page')).toBeInTheDocument();
  });

  it('renderizza Login su /login', async () => {
    await renderApp('/login');
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('renderizza UserPage su /profile', async () => {
    await renderApp('/profile');
    expect(await screen.findByText('UserPage Page')).toBeInTheDocument();
  });

  it('renderizza AddRepository su /addRepository', async () => {
    await renderApp('/addRepository');
    expect(await screen.findByText('AddRepository Page')).toBeInTheDocument();
  });

  it('renderizza 404 per percorsi non esistenti', async () => {
    await renderApp('/percorso-inesistente');
    expect(await screen.findByText('404 - Pagina non trovata')).toBeInTheDocument();
  });

  it('renderizza la NavBar', async () => {
    await renderApp('/repositories');
    expect(await screen.findByText('NavBar')).toBeInTheDocument();
  });
});