import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as UserService from './UserService';
import * as Mock from '../test/mock';

describe('UserService', () => {

    beforeEach(() => {
        vi.restoreAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('getInfoUserByID restituisce l\'utente corretto', async () => {
        const targetUser = Mock.mock_user[0];
        const result = await UserService.getInfoUserByID(targetUser.id);
        expect(result).toEqual(targetUser);
    });

    it('getInfoUserByID restituisce undefined se l\'utente non esiste', async () => {
        const result = await UserService.getInfoUserByID('9999');
        expect(result).toBeUndefined();
    });

    // TODO 
    it('getIDbyEmail restituisce "1"', async () => {
        const promise = UserService.getIDbyEmail('todo.it');
        vi.advanceTimersByTime(1000);
        const result = await promise;
        expect(result).toBe("1");
    });

    it('checkEmailValid restituisce sempre true per ora', async () => {
        const promise = UserService.checkEmailValid('todo.it');
        vi.advanceTimersByTime(1000);
        
        const result = await promise;
        expect(result).toBe(true);
    });

    it('checkCredentials restituisce sempre true per ora', async () => {
        const promise = UserService.checkCredentials('todo.it', 'todo_pw');
        vi.advanceTimersByTime(1000);
        
        const result = await promise;
        expect(result).toBe(true);
    });
});