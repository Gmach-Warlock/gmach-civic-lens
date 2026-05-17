import { useNavigate } from "react-router";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks/generalHooks";
import { selectAccessToken } from "../../../features/auth/selectors/authSelectors";
import { logoutUser } from "../../../features/auth/authSlice";
import Button from "../../atoms/controls/Button";
import Row from "../../organisms/layout/Row";

export default function AuthNav() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);

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
    <Row variant="end" className="auth-nav">
      {!accessToken && (
        <Button
          name="register"
          content="Register"
          variant="auth"
          onClick={handleRegister}
        />
      )}

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
    </Row>
  );
}
