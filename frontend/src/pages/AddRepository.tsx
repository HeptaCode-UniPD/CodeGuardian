import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkRepoValid, checkRepoToken, checkRepoPrivacy} from '../services/RepositoriesService';


export default function AddRepository() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [generalError, setGeneralError] = useState(false);

  useEffect(() => {
    if (url.length < 10) {
      setIsValid(false);
      return;
    }

    const checkDelay = setTimeout(async () => {
      setLoading(true);
      try {
        const result_valid = await checkRepoValid(url);
        setIsValid(result_valid.isValid);

        if (result_valid.isValid) {
          const result_private = await checkRepoPrivacy(url);
          setIsPrivate(result_private.isPrivate);
        }
      } catch (err) {
        console.error("Errore nel controllo");
      } finally {
        setLoading(false);
      }
    }, 600);
    return () => clearTimeout(checkDelay); //reset del timer
  }, [url]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setTokenError(false);
  setGeneralError(false);

  try {
    const response = await checkRepoToken(url, token);

    if (response.isValid) {
      navigate('/repositories');
    } else {
      setTokenError(true);
    }
  } catch (err) {
    setGeneralError(true);
  } finally {
    setLoading(false);
  }
};

  return (
    <div id="add-repository-page">
      <h1>Aggiungi repository</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="url-input">URL repository GitHub</label>
          <input id="url-input" name="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" className={!isValid ? 'error' : ''}/>
          {loading && <p> Verificando URL...</p>}
        </div>

        {!isValid && (
          <div className="error-message">
            <p>L'URL inserito non è valido.</p>
          </div>
        )}

        {generalError && <p className="error">Qualcosa è andato storto. Riprova più tardi.</p>}

        {isPrivate && isValid && (
          <div id="token-section">
            <label htmlFor="token-input">Inserisci il Personal Token</label>
            <input id="token-input" value={token} onChange={(e) => setToken(e.target.value)}/>
            <p id="hint">Il repository è privato. Inserisci il tuo Personal Access Token per continuare.</p>
            {isPrivate && isValid && tokenError && (<p className='error'>Il token inserito non è valido.</p>)}
          </div>
        )}

        <div className="form-actions">
          <Link to="/repositories" id="annulla">Annulla</Link>
          <button type="submit" disabled={loading || !isValid || (isPrivate && !token)}>
            Importa
          </button>
        </div>
      </form>
    </div>
  );
}