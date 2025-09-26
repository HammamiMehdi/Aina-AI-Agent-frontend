import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../service/authConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignInPage: React.FC = () => {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const location = useLocation();
  
    // 🌙 Force Dark Mode on Mount
    useEffect(() => {
      // Add 'dark' class to html element
      document.documentElement.classList.add('dark');
  
      // Optional: You can also set a default background color for the body
      // document.body.classList.add('bg-gray-900');
  
      // Cleanup function: You can choose to remove 'dark' on unmount if you want other pages to respect system preference.
      // For a consistent app experience, you might want to leave it.
      return () => {
        // Uncomment the line below ONLY if you want other pages to go back to auto/system preference
        // document.documentElement.classList.remove('dark');
      };
    }, []); // Empty dependency array: runs once on mount
  
    const handleLogin = async () => {
      try {
        await instance.loginPopup(loginRequest);
      } catch (error) {
        console.error("Login failed:", error);
        alert("La connexion a échoué. Veuillez réessayer.");
      }
    };
  
    useEffect(() => {
      if (isAuthenticated && accounts.length > 0) {
        const from = (location.state as any)?.from?.pathname || "/";
        const timer = setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [isAuthenticated, accounts, navigate, location.state]);
  
    return (
      <div className="min-h-screen flex flex-col items-center justify-center 
                      bg-gradient-to-r from-white via-slate-100 to-sky-100
                      dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950
                      animate-gradient-x transition-colors duration-300
                      p-6">
        <div className="text-center max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <img
            src="/logo-blue.png"
            alt="Aïna Logo"
            className="mx-auto h-16 w-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Bienvenue dans Aïna
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-8">
            Veuillez vous connecter avec votre compte professionnel pour accéder à votre assistante IA.
          </p>
          <button
            onClick={handleLogin}
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            🔐 Se Connecter
          </button>
          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            Votre identité est vérifiée via Microsoft Entra ID.
          </p>
        </div>
      </div>
    );
  };
  
  export default SignInPage;