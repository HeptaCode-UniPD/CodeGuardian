import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getAnalysisByUrl } from './AnalysisService';
import * as Mock from '../test/mock';

describe('AnalysisService - Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gestisce una risposta con status e response valorizzati', async () => {
    const mockReport = Mock.mock_reports[1];

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockReport,
    }));

    const result = await getAnalysisByUrl(Mock.mock_repositories[1].url);

    expect(result).not.toBeUndefined();
    expect(result?.id).toBe('2');
    expect(result?.status).toBe('finish');
  });

  it('propaga correttamente l\'errore al chiamante', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    await expect(
      getAnalysisByUrl(Mock.mock_repositories[0].url)
    ).rejects.toThrow('Network error');
  });
});