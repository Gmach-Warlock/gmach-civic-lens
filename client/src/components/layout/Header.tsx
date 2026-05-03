import { useNavigate } from "react-router";
import type {
  FetchResourceInterface,
  UserInterface,
} from "../../app/interfaces/authInterfaces";
import HeaderButton from "./HeaderButton";
import Heading from "../atoms/Heading";

export default function Header() {
  const navigate = useNavigate();

  const authState: FetchResourceInterface<UserInterface> = {
    state: "idle",
    message: "",
    data: null,
  };

  const handleLoadRegisterPage = () => {
    navigate("/register");
  };

  return (
    <header className="header__container">
      <div className="header__top">
        <span>GMach</span>
        <nav>
          <HeaderButton auth={authState} />
        </nav>
      </div>
      <div className="header__bottom">
        <button type="button" onClick={handleLoadRegisterPage}>
          Register
        </button>
      </div>
      <Heading
        size={1}
        headingStyle="blocked"
        color="neutral-light"
        content="This is a Test!"
      />
    </header>
  );
}
