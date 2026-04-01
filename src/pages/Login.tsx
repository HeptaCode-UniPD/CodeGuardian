import { useState } from 'react';
import { checkCredentials} from '../services/UserService';
import { saveUserID, useIsLogged} from '../services/SessionService';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
    useIsLogged();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isCredentialCorrect, setCredentialCorrect] = useState(true);
    const key = 'userID';
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };
 
const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try{
        const result_credential = await checkCredentials(email, password);
        saveUserID(key, result_credential.userId);
        setLoading(false);
        navigate('/repositories');
    }catch{
        setCredentialCorrect(false);
        setLoading(false);
    }
};

const handleAnnulla = async () => {
    setEmail('');
    setPassword('');
};

  return (
    <article id="login-page">
        <div id="login-image"></div>
        <h1>Accedi</h1>
        <form onSubmit={handleLogin} onReset={handleAnnulla}>
            <legend aria-hidden="true">Accedi</legend>
            <div>
                <label htmlFor="email-input">Email: </label>
                <input id="email-input" name="email" value={email} onChange={(e) => {setEmail(e.target.value); setCredentialCorrect(true);}} placeholder="Email"/>
            </div>
            <div>
                <label htmlFor="password-input">Password: </label>
                <input id="password-input" name="password" type={isPasswordVisible ? 'text' : 'password'} value={password} onChange={(e) => {setPassword(e.target.value); setCredentialCorrect(true);}}/>
                <button type="button" onClick={togglePasswordVisibility} id="password-icon" aria-label={isPasswordVisible ? 'Nascondi password' : 'Mostra password'}>
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            
            <div>
                <button type="reset" id="reset-button" disabled={loading}> Annulla </button>
                <button type="submit" id="login" disabled={loading || !email || !password}> Accedi </button>
            </div>
            {!isCredentialCorrect && !loading && email && password &&  <p className="error"> Le credenziali non sono corrette.</p>}
            {loading && email && password && <p id="loading"> Verifica informazioni...</p>}
        </form>
    </article>
  );
}
