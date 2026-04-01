import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getAnalysisByUrl } from './AnalysisService';
import * as Mock from '../test/mock';

describe('AnalysisService - Unit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restituisce i dati analisi quando fetch ha successo', async () => {
    const mockReport = Mock.mock_reports[0];

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockReport,
    }));

    const result = await getAnalysisByUrl('https://github.com/HeptaCode-UniPD/CodeGuardian');

    expect(result).toEqual(mockReport);
    expect(result?.status).toBe('finish');
    expect(result?.response).toBeDefined();
  });

  it('lancia un errore quando fetch restituisce !ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => null,
    }));

    await expect(
      getAnalysisByUrl('https://github.com/repo-inesistente')
    ).rejects.toThrow('Repository non trovato.');
  });

  it('chiama fetch con metodo POST e Content-Type corretto', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => Mock.mock_reports[0],
    });
    vi.stubGlobal('fetch', mockFetch);

    await getAnalysisByUrl('https://github.com/HeptaCode-UniPD/CodeGuardian');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/analysis/request',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://github.com/HeptaCode-UniPD/CodeGuardian' }),
      })
    );
  });
});