import { useAppSelector } from "../app/hooks/generalHooks";
import { selectUserZipCode } from "../features/auth/selectors/authSelectors";

function Report() {
  const userZip = useAppSelector(selectUserZipCode);

  return (
    <div className="report">
      <form action="" className="report__form">
        <h2>Report an issue in your area</h2>
        <p>Zip: {userZip}</p>
        <input
          type="text"
          name="issue__title"
          id="issue__title"
          className="issue__title"
          placeholder="Please Input Title of Issue"
        />
        <input
          type="text"
          name="issue__description"
          id="issue__description"
          className="issue__description"
          placeholder="Please give a brief description of the problem."
        />
      </form>
    </div>
  );
}

export default Report;
