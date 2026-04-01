import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import * as RepositoriesService from './RepositoriesService';
import * as Mock from '../test/mock';

const server = setupServer(
    http.get('http://localhost:3000/repos', ({ request }) => {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const repos = Mock.mock_repositories.filter(r =>
            Array.isArray(r.userID) ? r.userID.includes(userId!) : r.userID === userId
        );
        return HttpResponse.json(repos);
    }),

    http.delete('http://localhost:3000/repo', () => {
        return HttpResponse.json({ success: true });
    }),

    http.post('http://localhost:3000/repo', () => {
        return HttpResponse.json({ success: true });
    }),

    http.get('http://localhost:3000/repo', ({ request }) => {
    const url = new URL(request.url);
    const repoId = url.searchParams.get('repoId');
    const repo = Mock.mock_repositories.find(r => r.id === repoId);
    if (!repo) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(repo);
}),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('RepositoriesService - integrazione', () => {

    it('getRepositoriesByUser chiama il server e restituisce i repository', async () => {
        const result = await RepositoriesService.getRepositoriesByUser('1');

        expect(Array.isArray(result)).toBe(true);
        expect(result).toContainEqual(expect.objectContaining({ name: 'CodeGuardian' }));
    });

    it('getRepositoriesByUser lancia errore se il server risponde con errore', async () => {
        server.use(
            http.get('http://localhost:3000/repos', () => {
                return HttpResponse.error();
            })
        );

        await expect(RepositoriesService.getRepositoriesByUser('1'))
            .rejects
            .toThrow();
    });

    it('deleteRepo chiama il server con i parametri corretti e restituisce true', async () => {
        const result = await RepositoriesService.deleteRepo('id-repo', 'id-utente');
        expect(result).toBe(true);
    });

    it('deleteRepo lancia errore se il server risponde con 404', async () => {
        server.use(
            http.delete('http://localhost:3000/repo', () => {
                return new HttpResponse(null, { status: 404 });
            })
        );

        await expect(RepositoriesService.deleteRepo('id-inesistente', 'id-utente'))
            .rejects
            .toThrow('Repository non trovato');
    });

    it('checkRepoAccess chiama il server e restituisce true', async () => {
        const result = await RepositoriesService.checkRepoAccess('https://github.com/user/repo');
        expect(result).toBe(true);
    });

    it('checkRepoAccess lancia errore se il server risponde con 400', async () => {
        const messaggioBackend = "Repository privato o URL invalido.";

            server.use(
                http.post('http://localhost:3000/repo', () => {
                    return HttpResponse.json(
                        { message: messaggioBackend }, 
                        { status: 404 });}));

            await expect(RepositoriesService.checkRepoAccess('url-inesistente'))
                .rejects
                .toThrow(messaggioBackend);
        });

    it('getRepositoryById chiama il server e restituisce il repository', async () => {
        const expected = Mock.mock_repositories[0];
        const result = await RepositoriesService.getRepositoryById(expected.id);

        expect(result).toEqual(expected);
    });

    it('getRepositoryById lancia errore se il server risponde con 404', async () => {
        server.use(
            http.get('http://localhost:3000/repo', () => {
                return new HttpResponse(null, { status: 404 });
            })
        );

        await expect(RepositoriesService.getRepositoryById('id-inesistente'))
            .rejects
            .toThrow('Repository non trovato');
    });
});