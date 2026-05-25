# General Front End Notes

Ping needs props!

button variants that render a tags or navlinks instead

## Double Bar Header Layout+-----------------------------------------------------------------------------+

| [SearchBar] (Cog) [Theme Switch] | <-- Top Bar (Utility)
+-----------------------------------------------------------------------------+
| CIVIC LENS [Bars Icon ▾] [LOGIN] [REGISTER] [Report!]| <-- Main Bar (Navigation)
+-----------------------------------------------------------------------------+

## As prop

As you continue implementing this pattern across the rest of your app, would you like to explore adding an as prop to your layout components so they can morph into semantic HTML tags like <header>, <nav>, or <footer> while keeping their layout logic?

## Dashboard UI design using merch tricks

1. Status & Urgency (The "At-a-Glance" Layer)
   These two data points tell the user what is happening and how bad it is before they even read the description. You want to use clear visual styling rather than just plain text.

Urgency Levels (Low / Medium / High / Critical):

Instead of just a text label, use a subtle, color-coded badge system (e.g., green for low, amber for medium, deep red for critical).

Sass Tip: You can use a mixin or map in your SCSS to map these urgency strings directly to background/text color variables (e.g., .badge--critical { background-color: var(--color-danger-subtle); }).

Status Lifecycle (Reported ➔ Investigating ➔ In Progress ➔ Resolved):

Display this as a micro-stepper or a cleanly styled tag so users can track the lifecycle of the infrastructure repair. This builds immense trust in the platform because citizens can see the backend progress.

2. The Upvote / "Me Too" Tally (The Primary CTA)
   To actually get things fixed, you need data volume. A single report is an incident; 150 upvotes is a community priority.

The UX Placement: This needs to be a prominent, high-contrast button right next to or just below the title/status area.

The Psychology: Make the interaction satisfying. When a user clicks it:

The tally number should increment immediately (optimistic UI update).

The button state should visually change (e.g., active/filled background) to lock out further clicks from that authenticated user, preventing duplicate tallies.

Label it something community-driven, like "Verify Issue", "Affects Me Too", or a clean arrow icon next to a prominent tally count.

3. Comments & The Interaction Thread
   Since a detailed description might have a lot of moving parts, keeping the UI clean means handling comments gracefully.

The "View Comments" Accordion/Toggle: Instead of taking up massive screen real estate by default, display a small button or text link like 💬 View Comments (5). Clicking it can expand a tray directly under the card or open a slide-out panel (drawer).

The "Add Comment" Form: If clicking "Add Comment" takes them to a new form, you have two great architectural options depending on your routing setup:

The Dedicated Sub-Route: Navigate them to /issues/:id/comment or a dedicated issue detail view page (/issues/:id). This keeps your forms isolated, modular, and easy to test with your reusable Form component.

The Inline Modal: If you want to keep them on the dashboard context without losing their scroll position, wire up an overlay modal containing your reusable Form engine when they click the button.

Suggested Card Layout Blueprint
To organize this visually without cluttering the screen, here is a solid structural layout to aim for:

+-------------------------------------------------------------+
| [BADGE: CRITICAL] [BADGE: IN PROGRESS] |
| Pothole on Pike Main Intersection [ 🔼 142 ] |
| AFFECTS ME |
| There is a large pothole on the corner of... |
| |
| --------------------------------------------------------- |
| [💬 View Comments (6)] [+ Add Comment] |
+-------------------------------------------------------------+
