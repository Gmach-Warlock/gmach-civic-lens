import { useNavigate } from "react-router";
import Button from "../../atoms/controls/Button";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks/generalHooks";
import { selectAccessToken } from "../../../features/auth/selectors/authSelectors";
import { logoutUser } from "../../../features/auth/authSlice";

export default function Header() {
  const navigate = useNavigate();
  const accessToken = useAppSelector(selectAccessToken);
  const dispatch = useAppDispatch();

  const authState = {
    hasToken: false, // !!user.meta.accessToken
    isRegistering: window.location.pathname === "/register", // Simple way to check route
  };

  const handleAuthClick = () => {
    console.log("testing", authState, accessToken);
    if (accessToken) {
      dispatch(logoutUser());
    } else if (authState.isRegistering) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="header__container">
      <div className="header__top">
        <span>GMach</span>
        <nav>
          <Button
            name="btn--auth"
            variant="auth"
            authProperties={authState}
            onClick={handleAuthClick}
          />
        </nav>
      </div>

      <div className="header__bottom">
        <button
          type="button"
          onClick={handleAuthClick}
          className="btn btn--register"
        >
          Register
        </button>
      </div>
    </header>
  );
}
