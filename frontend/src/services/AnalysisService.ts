export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
import * as Types from '../types/types';
import * as Mock from '../test/mock';

// export async function getAnalysisPayload (id: string) {
//     const dataAnalisi = await getAnalysisById(id);
//     if (!dataAnalisi) return null;
//     const dataRemediation = await getRemediationByRepoId(id);

//     return {
//         repository: dataAnalisi,
//         remediation: dataRemediation ?? []
//     };
// };

export async function getAnalysisByUrl (url: string): Promise<Types.AnalysisReport | undefined> {
  const res = await fetch("http://localhost:4000/analysis/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url}),
    });

  if (!res.ok) {
    throw new Error("Repository non trovato.");
  }

  const data = await res.json();
  return data;
};

// async function getRemediationByRepoId (id: string): Promise<Types.AnalysisReport[] | undefined> {
//   return new Promise((resolve) => {
//     const found = Mock.mock_reports.filter(item => item.repositoryID === id);
//     resolve(found);
//     // const response = await fetch(`${API_URL}/repo/${id}`);
//     // return response.json();
//   });
// };