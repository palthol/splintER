import { Link } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";

const LandingPage: React.FC = () => {
  // Check authentication state using our global auth context
  // This assumes useAuth() correctly returns the authentication status
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-[#23272A] min-h-screen flex justify-center items-center p-8">
      <section className="bg-[#2C2F33] max-w-[1200px] w-full p-8 rounded-lg shadow-lg text-center">
        <h1 className="font-montserrat text-white text-4xl mb-4">
          League Dashboard
        </h1>
        <p className="font-roboto text-[#C7C7C7] text-xl mb-8">
          Welcome to your personalized League of Legends dashboard. Explore stats, trends, and more. Create a profile to get started!
        </p>
        
        {/* Dynamic button based on authentication state */}
        <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
          <button className="bg-[#5865F2] text-white font-roboto text-base py-3 px-6 rounded hover:bg-[#4b55d6] transition-all duration-300">
            {isAuthenticated ? "Go to Dashboard" : "Create a Profile"}
          </button>
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;