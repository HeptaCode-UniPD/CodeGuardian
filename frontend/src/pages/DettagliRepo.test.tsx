import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter, useParams } from 'react-router-dom';
import DettagliRepo from './DettagliRepo';
import * as analysisService from '../services/AnalysisService';
import { isLogged } from '../services/SessionService';
import * as Mock from '../test/mock';

vi.mock('../services/AnalysisService');
vi.mock('../services/SessionService');

// controllo cosa restituisce useParams() perché va a prendere l'id del repo dall'url
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

describe('DettagliRepo con dati Mock', () => {
  beforeEach(() => {
    vi.resetAllMocks();
});

it('renderizza correttamente i dati del repository e le sezioni remediation quando l\'utente è loggato', async () => {
    // mock
    (isLogged as any).mockImplementation(() => {});
    const targetRepo = Mock.mock_repositories[0];
    const targetRemediations = Mock.mock_reports.filter(r => r.repositoryID === targetRepo.id);

    (useParams as any).mockReturnValue({ id: targetRepo.id });
    (analysisService.getAnalysisPayload as any).mockResolvedValue({
      repository: targetRepo,
      remediation: targetRemediations
    });

    render(
      <MemoryRouter>
        <DettagliRepo />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(targetRepo.name)).toBeInTheDocument();
      expect(screen.getByText(targetRepo.visibility)).toBeInTheDocument();
    });

    // verifica percentuali
    expect(screen.getByText('Copertura Test')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('Completezza Documentazione')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('Correttezza OWASP')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    
    // verifica filtraggio dei report
    expect(screen.getByText('1 file: Copertura test')).toBeInTheDocument();
    expect(screen.getByText('1 file: Correttezza OWASP')).toBeInTheDocument();
    expect(screen.getByText('0 file: Completezza documentazione')).toBeInTheDocument();

    // verifica path
    expect(screen.getByText('src/components/comp1.tsx:')).toBeInTheDocument();
  });

  it('reindirizza al login se l\'utente non è loggato', () => {
      
    (useParams as any).mockReturnValue({ id: '1' });
    vi.stubGlobal('location', {
        ...window.location,
        href: '',
    });

    // simula il reindirizzamento
    (isLogged as any).mockImplementation(() => {
        window.location.href = '/login';
    });

    render(
        <MemoryRouter>
        <DettagliRepo />
        </MemoryRouter>
    );

    // verifico reindirizzamento
    expect(window.location.href).toBe('/login');

    // Ripristiniamo window.location dopo il test
    vi.unstubAllGlobals();
    });
});