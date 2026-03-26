import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAnalysisPayload } from './AnalysisService';
import * as Mock from '../test/mock';

describe('AnalysisService', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    
    it('restituisce il payload per un ID esistente', async () => {
        const targetId = Mock.mock_repositories[0].id;
        const result = await getAnalysisPayload(targetId);

        expect(result).not.toBeNull();
        expect(result?.repository).toEqual(Mock.mock_repositories[0]);
        expect(result?.remediation).toHaveLength(2);
    });

    it('non cerca le remediation se il repo non esiste', async () => {
        const filterSpy = vi.spyOn(Mock.mock_reports, 'filter');
        const result = await getAnalysisPayload('99999');

        expect(result).toBeNull();
        expect(filterSpy).toHaveBeenCalledTimes(0);
    });

    it('cerca tutto se il repo esiste', async () => {
        const filterSpy = vi.spyOn(Mock.mock_reports, 'filter');
        await getAnalysisPayload('1');
        expect(filterSpy).toHaveBeenCalledTimes(1);
    });

    it('caso in cui non ci sono remediation per un repo', async () => {
        const result = await getAnalysisPayload('3');
        expect(result).not.toBeNull();
        expect(result?.remediation).toBeInstanceOf(Array);
    });
});