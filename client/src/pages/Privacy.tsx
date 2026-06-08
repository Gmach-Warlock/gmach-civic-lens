import Prose from "../components/organisms/layout/Prose";
import Heading from "../components/atoms/elements/Heading";
import Button from "../components/atoms/controls/Button";
import { useAppDispatch } from "../app/hooks/generalHooks";
import { useNavigate } from "react-router";
import { addToast } from "../features/global/globalSlice";

function Privacy() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAccept = () => {
    dispatch(
      addToast({
        message: "Privacy policy accepted. Redirecting home...",
        type: "success",
      }),
    );
    navigate("/", { replace: true });
  };

  return (
    <div className="privacy">
      <Prose>
        <Heading size={1} headingStyle="basic" color="mono">
          Privacy Policy: We're Not Spying, We're Coding
        </Heading>

        <ol className="privacy-list">
          <li>
            <Heading size={3} headingStyle="basic" color="mono">
              Data Sovereignty
            </Heading>
            <p>
              Your data belongs to you. We only collect what is strictly
              necessary to make the app function—because nobody has time to
              manage extra rows in a PostgreSQL table.
            </p>
          </li>

          <li>
            <Heading size={3} headingStyle="basic" color="mono">
              Data Usage & Cookies
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
              Acknowledgement of Digital Reality
            </Heading>
            <p>
              I understand that "Privacy Policy" is a fancy way of saying "We
              aren't going to sell your soul." I further acknowledge that I have
              not actually read this entire document, but I accept the vibes
              provided herein.
            </p>
          </li>
        </ol>

        <Button
          name="privacy"
          content="Accept"
          className="self-center my-4"
          onClick={handleAccept}
        />
      </Prose>
    </div>
  );
}

export default Privacy;
