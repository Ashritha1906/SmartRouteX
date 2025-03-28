
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { TrafficCone } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md px-6">
        <div className="bg-red-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
          <TrafficCone className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Road Closed</h2>
        <p className="text-slate-600 mb-6">
          Oops! Looks like you've taken a wrong turn. The route you're trying to access doesn't exist in our traffic network.
        </p>
        <Button asChild>
          <Link to="/">
            Return to Main Route
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
