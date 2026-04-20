import "./Map.css";

export default function Map() {
  return (
    <div className="map">
      <span>[ Map Canvas Area ]</span>
      <div className="map__lake"></div>
      <div className="map__tree"></div>
      <div className="map__main-street"></div>
      <div className="map__cross-street"></div>
      <div className="map__building1"></div>
      <div className="map__building2"></div>
      <div className="map__problem-marker">
        <div className="marker__ping"></div>
        <span className="marker__icon">!</span>
      </div>
    </div>
  );
}
