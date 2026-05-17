import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks/generalHooks";
import { toggleTheme } from "../../../features/global/globalSlice";
import SearchBar from "../../molecules/actions/SearchBar";
import Container from "../layout/Container";
import Row from "../layout/Row";
import Switch from "../../atoms/controls/Switch";
import AuthNav from "../../molecules/actions/AuthNav";
import Icon from "../../atoms/controls/Icon";

export default function Header() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.global.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Container className="header__container" variant="fluid">
      <Row className={`header__top-${currentTheme}`} variant="between">
        <SearchBar />
        <Row className="header__top-utilities" variant="end">
          <Icon name="gear" />
          <Switch
            checked={currentTheme === "dark"}
            onChange={handleThemeToggle}
            label="Toggle Dark/Light Mode"
          />
        </Row>
      </Row>

      <Row className={`header__bottom-${currentTheme}`} variant="between">
        <span>GMach</span>

        <AuthNav />
        <Icon name="bars" />
      </Row>
    </Container>
  );
}
