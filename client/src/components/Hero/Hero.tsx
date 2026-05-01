import Cta from "./Cta/Cta";
import "./Hero.css";
import Map from "./Map/Map";
import Sign from "./Sign/Sign";
import Slogan from "./Slogan/Slogan";
import Title from "./Title/Title";

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
