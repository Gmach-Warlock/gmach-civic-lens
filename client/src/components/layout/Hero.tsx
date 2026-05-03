import Title from "../organisms/Title";
import Slogan from "../organisms/Slogan";
import Cta from "../organisms/Cta";
import Sign from "../organisms/Sign";
import Map from "../organisms/Map";

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
