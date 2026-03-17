import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getRepositoriesPayload} from '../services/RepositoriesService';
import { type Repository} from '../types/types';

export default function Repositories() {
  const id = "1"; //todo
  const [loading, setLoading] = useState(true);
  const [repositories, setRepositories] = useState<Repository[] | null>(null);

  useEffect(() => {
      if(!id) return;
      const fetchData = async () => {
          try {
              setLoading(true);
          const result = await getRepositoriesPayload(id);
          if (result) {
              setRepositories(result);
          }} catch (err) {
              console.error("Errore nel recupero dati:", err);
          } finally { setLoading(false); }
      };
      if (id) fetchData();
  }, [id]);

  if (loading) return <p>Caricamento...</p>;
  if (!repositories) return <div>La ricerca dei repository non è andata a buon fine. <Link to="/Repositories">Riprova</Link></div>;
 

  return (
    <div id="repositories-page">
      <aside>
        <Link to="/addRepository">+ Aggiungi repository</Link>
      </aside>
      <ul>
          {repositories?.map((item) => (
            <li key={item.id}>
            <Link to={`/repository/${item.id}`}>
            <span>{item.name}</span>
            <span className="visibility">{item.visibility}</span>
            </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}