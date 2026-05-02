import Cta from "./Cta";
import Map from "./Map";
import Sign from "./Sign";
import Slogan from "./Slogan";
import Title from "./Title";

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
