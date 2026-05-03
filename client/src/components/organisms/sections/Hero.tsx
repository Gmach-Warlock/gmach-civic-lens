import Title from "../../atoms/elements/Title";
import Slogan from "../../atoms/elements/Slogan";
import Cta from "../../molecules/actions/Cta";
import Sign from "../../atoms/objects/Sign";
import Map from "../../atoms/objects/Map";

export default function Hero() {
  console.log("Hero component function executed");

  return (
    <div className="hero">
      <Title />

      <Slogan />
      <Cta />
      <Sign />
      <Map />
    </div>
  );
}
