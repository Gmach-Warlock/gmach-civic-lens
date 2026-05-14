## Star principles

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

const issue = await Issue.findByPk(issueId, {
include: [
{ model: Location, as: 'location' },
{ model: Comment, as: 'comments', include: ['author'] },
{ model: User, as: 'author' }
]

You are completely right to call me out on this! "STAR" is indeed a major double-agent acronym in the tech space. Here are the two definitions you'll see used most often:

STAR in Testing (Software Quality): Size, Type, Association, Range. This is a testing framework/heuristic used to design edge-case test cases for input fields.

STAR in Job Interviews (Behavioral): Situation, Task, Action, Result. This is a framework used to answer interview questions structured around how you solved past problems.

🛠️ The Defensive Engineer's Route ChecklistWhenever you sit down to build an endpoint, run the incoming data through the STAR pipeline before it ever touches a database model or service:1. 🔲 Size & Range GuardsIs the input data within acceptable physical, mathematical, or logical limits?For example: Are coordinates within limits ($-90$ to $90$ / $-180$ to $180$)? Is a description string too long (over $1000$ characters) or too short?2. 🔲 Type & Structure GuardsAre the data types exactly what the backend expects?For example: Are numbers actually numbers (and not NaN or numeric strings like "34")? Is the ID a valid UUID format?Are all required fields actually present in the request body, or is something undefined?3. 🔲 Association & Authorization GuardsDoes this request make sense in the context of the user making it?For example: Does the userId in the body match the authenticated user's session? If updating/deleting, does this resource actually belong to the person trying to change it?4. 🔲 Resilience (The Catch-All)If the database does throw an error (like a unique constraint violation), does the route handle it gracefully with a clean 400 or 409 response instead of exposing a raw SQL crash to the client?"Amateurs practice until they get it right. Professionals practice until they can't get it wrong."

Right now, you have a solid foundation. Let’s multiply your test count by turning your STAR checklist into highly specific, isolated unit tests.

1. The Type-Guard Test Battery (Expanding "T")
   Don't just test one bad type; test all the weird ways JavaScript can behave when someone sends bad payload structures.

Test: Send userId as an integer (12345) instead of a string UUID.

Test: Send userId as a boolean (true).

Test: Send lat as an array ([34.0522]).

Test: Send lng as an object ({ value: -118.2437 }).

Test: Send an empty string "" for the description to ensure your existence guard doesn't treat whitespace/empty strings as a valid value.

2. The Boundary "Fence-Post" Tests (Expanding "S" and "R")
   In engineering, we don't just test inside and outside a boundary. We test the exact fence-post values (the absolute limits).

Test: Latitude at exactly -90.0 (Should PASS).

Test: Latitude at exactly 90.0 (Should PASS).

Test: Latitude at -90.0001 (Should FAIL).

Test: Latitude at 90.0001 (Should FAIL).

Test: Longitude at exactly -180.0 (Should PASS).

Test: Longitude at exactly 180.0 (Should PASS).

Test: Longitude at -180.0001 (Should FAIL).

Test: Longitude at 180.0001 (Should FAIL).

3. The Payload SQL-Injection & XSS Guards (Advanced Resilience)
   What happens if someone tries to send malicious data in your string fields?

Test: Send SQL injection syntax in the description (e.g., "'; DROP TABLE reports; --"). Your database should safely parameterize this and save it as literal text, rather than executing it.

Test: Send HTML/Script tags in the description (e.g., "<script>alert('hack')</script>"). This proves your app handles unsanitized input safely.

## Block first test blueprint

describe("POST /api/issues", () => {
// Rail 1: The Validation Check (Expected: 400 Bad Request)
it("should return 400 if required fields are missing", async () => { ... });

// Rail 2: The Not Found Check (Expected: 404 Not Found - if applicable)
it("should return 404 if associated resource doesn't exist", async () => { ... });

// Rail 3: The Disaster Check (Expected: 500 Server Error)
it("should return 500 if the database crashes", async () => { ... });

// Rail 4: The Happy Path (Expected: 200/201 Success)
it("should successfully create the resource and return data", async () => { ... });
});

## Try catch finally trick questions

function interviewTrap() {
try {
return "Team Try";
} finally {
return "Team Finally";
}
}

console.log(interviewTrap()); // What prints?
The Answer: It prints "Team Finally".

function standardMistake() {
try {
throw new Error("Something went horribly wrong!");
} finally {
return "Everything is fine!"; // Swallows the error
}
}
The Answer: This function will not throw an error. It will gracefully return "Everything is fine!". The finally block's control flow statement (return, break, or continue) completely overrides the exception thrown in the try block.

3. Does finally ALWAYS run? (The Ultimate Follow-up)
   Once you confidently explain that finally always runs, a sharp interviewer will smile and ask: "Are there any situations where finally does not run?"

If you want to blow them away, say "Yes, if the process dies before the block is reached." Here are the specific ways to kill it:

System Exit: If the code explicitly kills the entire application process inside the try or catch block.

Java: System.exit(0);

Node.js: process.exit(0);

Python: os.\_exit(0)

Infinite Loops / Deadlocks: If the try block hits an infinite loop (while(true)) or gets permanently stuck waiting for a thread lock, the code will never physically reach the finally block.

Hardware / Power Failure: If someone pulls the plug on the server or the Operating System crashes (Kernel Panic), the runtime terminates instantly.

Out of Memory (OOM) Crash: If the JVM or V8 engine runs completely out of memory and the OS forcefully terminates the process (SIGKILL).

try block has a returnYesfinally runs before the function actually exits.catch block throws a new errorYesfinally runs before the error bubbles up.finally has a returnYesIt overrides any return or throw from try/catch.System.exit(0) is calledNoThe process dies instantly; nothing else executes.

function ultimateInterviewQuestion() {
try {
throw new Error("Try Error");
} catch (err) {
throw new Error("Catch Error");
} finally {
return "Finally wins everything!";
}
}

console.log(ultimateInterviewQuestion());
// Output: "Finally wins everything!"
// No errors are thrown, and both exceptions are completely swallowed!
