import "./Map.css";

export default function Map() {
  return (
    <div className="map">
      <div className="compass map__compass">
        <div className="compass__x-crosshair"></div>
        <div className="compass__y-crosshair"></div>
        <div className="compass__arrow"></div>
        <span className="compass__north">N</span>
      </div>
      <div className="map__lake"></div>
      <div className="map__tree1"></div>
      <div className="map__tree2"></div>
      <div className="map__tree3"></div>
      <div className="map__tree4"></div>
      <div className="map__tree5"></div>
      <div className="map__main-street"></div>
      <div className="map__bottom-street"></div>
      <div className="map__cross-street1"></div>
      <div className="map__cross-street2"></div>
      <div className="map__building1"></div>
      <div className="map__building2"></div>
      <div className="map__building3"></div>
      <div className="map__building4"></div>
      <div className="map__building5"></div>
      <div className="map__building6"></div>
      <div className="marker map__problem-marker">
        <div className="marker__ping"></div>
        <span className="marker__icon">!</span>
      </div>
      <div className="map__scale-bar">
        <div className="scale-segment"></div>
        <span>100FT</span>
      </div>
    </div>
  );
}
