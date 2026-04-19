import "./Hero.css";
import Slogan from "./Slogan/Slogan";
import Title from "./Title/Title";

export default function Hero() {
  return (
    <div className="hero">
      <Title />
      <Slogan />
    </div>
  );
}
