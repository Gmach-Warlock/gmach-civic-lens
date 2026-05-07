The "S.T.A.R." Pattern for Edge Cases
When you look at a piece of data (like latitude or description), run it through these four filters:

S - Size: What is the smallest possible value (empty string, 0, negative number) and the largest possible value (massive paragraph, max-integer)?

T - Type: What happens if I send the "right" data in the "wrong" container? (e.g., sending the number 34 as a string "34", or sending null instead of undefined).

A - Atlas (Boundaries): If the data represents a range (like coordinates -90 to 90, or age 0 to 120), what happens at exactly -91 or 91?

R - Relationships: Does this data depend on another field? (e.g., if the status is "closed," should I still be allowed to update the severity?)

Why the "Red" (Fail) step is so important
You mentioned that seeing the fail was "beautiful." In TDD, a failing test is your specification.

The Red Phase tells you: "My guardrails are missing."

The Green Phase tells you: "My guardrails are now installed."

The Refactor Phase tells you: "My guardrails are installed cleanly."

If you never see the test fail, you don't actually know if the test is working! You might have written a test that accidentally passes everything, which is more dangerous than having no test at all.

What’s next for your pattern recognition?
Since you've mastered the Create (POST) pattern, the next pattern recognition leap is usually Persistence & Retrieval (GET).

The logic goes like this:

I save a report (POST).

I get an id back.

If I immediately ask the server for that id (GET), does it actually exist in the database?
