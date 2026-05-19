import Title from "../../atoms/elements/Title";
import Slogan from "../../atoms/elements/Slogan";
import Cta from "../../molecules/actions/Cta";
import Sign from "../../atoms/objects/Sign";
import Map from "../../atoms/objects/Map";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectTheme } from "../../../features/global/globalSelectors";

export default function Hero() {
  const theme = useAppSelector(selectTheme);

  return (
    <div className={`hero hero--${theme}`}>
      <Title />

      <Slogan />
      <Cta />
      <Sign />
      <Map />
    </div>
  );
}
