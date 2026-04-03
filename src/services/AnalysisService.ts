import * as Types from '../types/types';
import { API_BASE_URL_ANALYSIS } from "../config";

export async function getLastAnalysis (repoUrl: string): Promise<Types.AnalysisReport | null> {
  const res = await fetch(`${API_BASE_URL_ANALYSIS}/analysis/view?url=${repoUrl}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Analisi non trovata");
  }

  const data = await res.json();
  return data;
};

export async function startNewAnalysis(url: string): Promise<Types.StartAnalysisResponse> {
  const res = await fetch(`${API_BASE_URL_ANALYSIS}/analysis/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoUrl: url }),
  });

  if (!res.ok) throw new Error('Errore nella richiesta di analisi.');
  return res.json();
}

export async function pollAnalysisStatus(jobId: string): Promise<Types.AnalysisStatus> {
  const res = await fetch(`${API_BASE_URL_ANALYSIS}/analysis/status/${jobId}`);
  if (!res.ok) throw new Error('Errore nel polling.');
  const data = await res.json();
  return data.status;
}