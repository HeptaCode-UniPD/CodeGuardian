import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import * as SessionService from './SessionService';
import { useNavigate, useLocation } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

describe('SessionService', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  it('salva e recupera il userID', () => {
    const setSpy = vi.spyOn(Storage.prototype, 'setItem');
    SessionService.saveUserID('userID', '123');
    
    expect(setSpy).toHaveBeenCalledWith('userID', '123');
    expect(SessionService.getUserID('userID')).toBe('123');
  });

  it('rimuove il userID al logout', () => {
    localStorage.setItem('userID', '123');
    SessionService.logout('userID');
    expect(localStorage.getItem('userID')).toBeNull();
  });

  it('reindirizza a /login se l\'utente non è loggato e non è in login', () => {
    (useLocation as any).mockReturnValue({ pathname: '/repositories' });
    renderHook(() => SessionService.isLogged());
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('reindirizza a /repositories se l\'utente è loggato ma si trova in /login', () => {
    localStorage.setItem('userID', '123');
    (useLocation as any).mockReturnValue({ pathname: '/login' });
    renderHook(() => SessionService.isLogged());
    expect(mockNavigate).toHaveBeenCalledWith('/repositories');
  });

  it('non fa nulla se l\'utente è loggato e si trova in una pagina protetta', () => {
    localStorage.setItem('userID', '123');
    (useLocation as any).mockReturnValue({ pathname: '/repositories' });
    renderHook(() => SessionService.isLogged());
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});