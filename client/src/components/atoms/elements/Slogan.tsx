import ImpulseLine from "./ImpulseLine";

export default function Slogan() {
  return (
    <div className="slogan">
      {/* 2s Delay: Starts right as the Title animation is peaking */}
      <ImpulseLine
        message="See the problem."
        className="slogan__line font-main"
        delay={2.2}
      />

      {/* 3s Delay: Clean follow-up for the punchline */}
      <ImpulseLine
        message="Say the word."
        className="slogan__line font-main"
        delay={3.2}
        stagger={0.08}
      />
    </div>
  );
}
