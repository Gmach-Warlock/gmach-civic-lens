import { useAppSelector } from "../app/hooks/generalHooks";
import { selectUserZipCode } from "../features/auth/selectors/authSelectors";
import Input from "../components/atoms/controls/Input";
import Button from "../components/atoms/controls/Button";

function Report() {
  const userZip = useAppSelector(selectUserZipCode);

  return (
    <div className="report card--form">
      <form action="" className="report__form form">
        <h2>Report an issue in your area</h2>
        <p>Zip: {userZip}</p>

        <Input name="title" label="Please input Title of Issue" />
        <Input
          name="description"
          label="Please give a brief description of the problem."
        />
        <Input
          name="location_name"
          label="Please give use the location of the Issue"
        />
        <Button
          name="issue-submit"
          content="Submit"
          className="btn--submit-form"
        />
      </form>
    </div>
  );
}

export default Report;
