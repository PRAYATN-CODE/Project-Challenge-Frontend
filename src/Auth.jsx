import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Auth = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = () => {
            const token = localStorage.getItem("token"); // Fetch token from localStorage
            if (!token) {
                // If token is not found
                toast.error("Unauthorized! Please log in to continue.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                navigate("/");
            }
        };

        verifyUser();
    }, [navigate]);

    return <>{children}</>;
};

export default Auth;
