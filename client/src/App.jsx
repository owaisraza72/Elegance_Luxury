import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useGetProfileQuery } from "./features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser, finishCheckingAuth } from "./features/auth/authSlice";
import { useEffect } from "react";
import { LoadingState } from "./pages/user/LoadingState";

const App = () => {
  const { data, isLoading, isError, isSuccess } = useGetProfileQuery();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(setUser(data.user));
    } else if (isError || (!isLoading && !data)) {
      dispatch(finishCheckingAuth());
    }
  }, [isSuccess, isError, isLoading, data, dispatch]);

  const isDashboardRoute =
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/admin");

  if (isLoading) return <LoadingState />;

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen">
        <AppRoutes />
      </div>
      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default App;
