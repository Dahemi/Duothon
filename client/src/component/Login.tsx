import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { googleSignIn } = useAuth();

  return (
    <div>
      <button onClick={googleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};