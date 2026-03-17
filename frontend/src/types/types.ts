// info utente
export interface User{
    id: string,
    email: string,
    password: string
}

// stato dell'analisi
enum AnalysisStatus {
    Pending = 'pending',
    Running = 'running',
    Done = 'done',
    Failed = 'failed',
}

// report prodotto dell'analisi
export interface AnalysisInsight {
    summary: string,
    strengths: string[],
    weakness: string[],
    analysisID: string,
}

// tipologia di avvio analisi
export enum AnalysisType {
    Documentation = 'documentation',
    Owasp = 'owasp',
    Test = 'test',
}

// report dell'analisi
export interface AnalysisReport{
    id: string,
    repositoryID: string, //non ho messo userID, non credo serva
    status: AnalysisStatus,
    insight: AnalysisInsight,
    analysisDate: Date,
    type: AnalysisType,

    originalCode: string,
    newCode: string,
    path: string
}

// info repository
export interface Repository{
    id: string,
    userID: string[], //un repository può essere aggiunto da più persone
    url: string,
    token: string,
    pathStorage: string,
    lastCommit: Date,

    visibility: string,
    name: string,
    pctTest: number
    pctDoc: number
    pctOwasp: number
}



// --- mock ---

// Mock Utente
export const mock_user: User = {
    id: "1",
    email: "developer@heptacode.it",
    password: "1234"
};

// Mock Insights
const mock_insights1: AnalysisInsight = {
    summary: "Il repository segue bene le convenzioni di naming, ma mancano i test di integrazione.",
    strengths: ["Ottima documentazione interna", "Clean Code", "Modularità"],
    weakness: ["Copertura test bassa", "Dipendenze obsolete"],
    analysisID: "1"
};

const mock_insights2: AnalysisInsight = {
    summary: "PoC funzionale, ma con diverse vulnerabilità OWASP rilevate nelle dipendenze.",
    strengths: ["Velocità di esecuzione", "Logica chiara"],
    weakness: ["Hardcoded secrets", "Mancanza di HTTPS"],
    analysisID: "2"
};

// Mock Repository
export const mock_repositories: Repository[] = [
    {
        id: "1",
        userID: ["1", "2"],
        url: "https://github.com/HeptaCode-UniPD/CodeGuardian",
        token: "ghp_secureToken123",
        pathStorage: "/storage/code-guardian",
        lastCommit: new Date('2026-03-10T14:30:00'),

        visibility: "public",
        name: "CodeGuardian",
        pctTest: 80,
        pctDoc: 90,
        pctOwasp: 40
    },
    {
        id: "2",
        userID: ["1"],
        url: "https://github.com/HeptaCode-UniPD/PoC",
        token: "ghp_secureToken456",
        pathStorage: "/storage/poc",
        lastCommit: new Date('2026-03-15T09:15:00'),

        visibility: "private",
        name: "PoC",
        pctTest: 60,
        pctDoc: 79,
        pctOwasp: 90
    }
];

// Mock Reports
export const mock_reports: AnalysisReport[] = [
    {
        id: "1",
        repositoryID: "1",
        status: AnalysisStatus.Done,
        insight: mock_insights1,
        analysisDate: new Date('2026-03-11T10:00:00'),
        type: AnalysisType.Test,

        originalCode: `import React from 'react';
        const App = () => {
        return <div>Ciao</div>;
        };`,
                
                newCode: `import React from 'react';
        const App = () => {
        return <div>Ciao mondo!</div>; // Riga modificata
        };`,
        path: "src/components/comp1.tsx"
    },
    {
        id: "2",
        repositoryID: "1",
        status: AnalysisStatus.Failed,
        insight: mock_insights2,
        analysisDate: new Date('2026-03-16T11:00:00'),
        type: AnalysisType.Owasp,

        originalCode: `// Funzione di prova
        function test() {
            console.log("esecuzione...");
        }`,
                newCode: `// Funzione di prova
        // Log rimosso per sicurezza
        function test() {
        }`,
        path: "src/components/comp2.tsx"
    }
];