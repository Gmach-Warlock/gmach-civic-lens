import Heading from "../components/atoms/elements/Heading";
import Prose from "../components/organisms/layout/Prose";
import Button from "../components/atoms/controls/Button";
import { useAppDispatch } from "../app/hooks/generalHooks";
import { useNavigate } from "react-router";
import { addToast } from "../features/global/globalSlice";

function Terms() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAccept = () => {
    dispatch(
      addToast({
        message: "Terms accepted. Returning to home...",
        type: "success",
      }),
    );
    navigate("/", { replace: true });
  };

  return (
    <div className="terms">
      <Prose>
        <Heading size={1} headingStyle="basic" color="mono">
          Terms of Service: The "Good Faith" Pact
        </Heading>

        <ol className="terms-list">
          <li>
            <Heading size={3} headingStyle="basic" color="mono">
              Acceptance of Non-Binding Terms
            </Heading>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </li>

          <li>
            <Heading size={3} headingStyle="basic" color="mono">
              Liability & SQL Safety
            </Heading>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </li>

          <li>
            <Heading size={3} headingStyle="basic" color="mono">
              The "Human" Clause
            </Heading>
            <p>
              By accessing this application, you agree that you are a human
              being, or at least a very convincing AI. We promise to keep the
              code running, and you promise not to break our database with weird
              SQL injection strings.
            </p>
          </li>
        </ol>

        <div className="acknowledgement-box">
          <strong>The Real Talk:</strong> I acknowledge that by clicking "I
          Agree," I am technically agreeing to something, but let’s be
          honest—I’m just clicking this to get to the dashboard.
        </div>

        <Button
          name="terms"
          content="Accept"
          className="self-center my-4"
          onClick={handleAccept}
        />
      </Prose>
    </div>
  );
}

export default Terms;
