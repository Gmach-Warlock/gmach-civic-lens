import { useNavigate } from "react-router";
import Button from "../../atoms/controls/Button";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks/generalHooks";
import { selectAccessToken } from "../../../features/auth/selectors/authSelectors";
import { logoutUser } from "../../../features/auth/authSlice";
import SearchBar from "../../molecules/actions/SearchBar";

export default function Header() {
  const navigate = useNavigate();
  const accessToken = useAppSelector(selectAccessToken);
  const dispatch = useAppDispatch();

  const handleAuthenticate = () => {
    if (accessToken) {
      dispatch(logoutUser());
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <header className="header__container">
      <div className="header__top">
        <span>GMach</span>
        <nav>
          {accessToken ? (
            <Button
              name="logout"
              content="Logout"
              variant="auth"
              onClick={handleAuthenticate}
            />
          ) : (
            <Button
              name="login"
              content="Login"
              variant="auth"
              onClick={handleAuthenticate}
            />
          )}
        </nav>
      </div>

      <div className="header__bottom">
        <SearchBar />

        {!accessToken && (
          <Button
            name="register"
            content="Register"
            variant="auth"
            onClick={handleRegister}
          />
        )}
      </div>
    </header>
  );
}
