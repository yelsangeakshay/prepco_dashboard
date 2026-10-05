import type { Journey, JourneyTab } from './types'

export const JOURNEY_TABS: { key: 'all' | JourneyTab; label: string }[] = [
  {
    "key": "all",
    "label": "All"
  },
  {
    "key": "student",
    "label": "Student"
  },
  {
    "key": "edge",
    "label": "Edge cases"
  },
  {
    "key": "panelist",
    "label": "Panelist"
  },
  {
    "key": "admin",
    "label": "Admin / ops"
  },
  {
    "key": "cross",
    "label": "Across roles"
  }
]

export const SECTION_INFO: Record<JourneyTab, { name: string; blurb: string }> = {
  "student": {
    "name": "Student",
    "blurb": "The paths a student walks from the marketing site to Day 0, on desktop and on a phone."
  },
  "edge": {
    "name": "Edge cases",
    "blurb": "What happens when a payment fails, a seat is gone, a session moves or a date changes."
  },
  "panelist": {
    "name": "Panelist",
    "blurb": "How a working practitioner joins, runs a panel and keeps their calendar open."
  },
  "admin": {
    "name": "Admin / ops",
    "blurb": "The weekly loop that keeps a cohort moving, and how the panel stays healthy."
  },
  "cross": {
    "name": "Across roles",
    "blurb": "The handoffs: one action in one role shows up in the next."
  }
}

export const JOURNEYS: Journey[] = [
  {
    "id": "j-join",
    "tab": "student",
    "title": "Join and buy a plan",
    "starts": "A student lands on theprep.co.in",
    "ends": "A paid plan and an open dashboard",
    "steps": [
      {
        "code": null,
        "title": "Book a free session",
        "note": "Every Book your free session button opens a Calendly slot picker. 30 minutes, no card.",
        "kind": "Marketing site"
      },
      {
        "code": "s01",
        "title": "Create an account",
        "note": "Google or college email. A session booked before signing up is matched by email.",
        "branch": [
          "j-locked",
          "Forgot password or personal Gmail"
        ]
      },
      {
        "code": "s02",
        "title": "Pick track, target and Day 0",
        "note": "Finals or summers, one of six functions, and the Day 0 date. The screen says how many weeks of runway are left.",
        "branch": [
          "j-late",
          "Fewer than 8 weeks to Day 0"
        ]
      },
      {
        "code": "e02",
        "title": "Upload the current CV",
        "note": "It becomes V1 and gets a first score. One checkbox lets panelists read the student's history. An unreadable file can be replaced or typed in."
      },
      {
        "code": "s03",
        "title": "Read the session summary",
        "note": "Three roles the profile fits, the CV lines a panel will pull on, how two practice answers landed, and a suggested runway."
      },
      {
        "code": "s04",
        "title": "Choose a plan",
        "note": "Basic, Premium or Elite at Season 1 prices, with seats left shown.",
        "branch": [
          "j-full",
          "The cohort is full"
        ]
      },
      {
        "code": "e04",
        "title": "Pay and get a receipt",
        "note": "UPI, card or net banking. A failed payment holds the seat for 15 minutes.",
        "tag": "Proposed",
        "branch": [
          "j-pay",
          "The payment fails"
        ]
      },
      {
        "code": "s05",
        "title": "Open the dashboard",
        "note": "Day 0 countdown, the runway, the next session and this week's tasks."
      }
    ]
  },
  {
    "id": "j-prepare",
    "tab": "student",
    "title": "Prepare for Day 0",
    "starts": "The plan is paid and the dashboard is open",
    "ends": "The Day 0 result is recorded",
    "steps": [
      {
        "code": "s05",
        "title": "Check the runway",
        "note": "Done, next and locked stages from Week -8 to Day 0, with the tasks for this week."
      },
      {
        "code": "s06",
        "title": "Build the CV",
        "note": "Every bullet is scored on a decision made, a number moved and a trade-off owned. The score splits into impact, clarity and defensibility."
      },
      {
        "code": "s07",
        "title": "Lock a version",
        "note": "V4 is locked after the profiling call. Later changes go through a re-lock request, so nothing moves the night before a shortlist."
      },
      {
        "code": "s08",
        "title": "Draft answers",
        "note": "The answer bank is built from the locked CV. Weak answers are flagged with Situation, Decision and Result."
      },
      {
        "code": "s09",
        "title": "Book the next panel",
        "note": "P1, deep-dive, P2, group session, P3. Premium students pick slots first.",
        "branch": [
          "j-session",
          "A session is cancelled, moved or missed"
        ]
      },
      {
        "code": "s10",
        "title": "Read panel feedback",
        "note": "A readiness score, a note per question and a short list of fixes. Flagged answers go back to the answer bank. Steps 4 to 6 repeat for P2 and P3."
      },
      {
        "code": "e10",
        "title": "Get reminders",
        "note": "Session reminders, feedback ready, and any change to the runway or to Day 0.",
        "branch": [
          "j-dayzero",
          "Day 0 moves"
        ]
      },
      {
        "code": "e07",
        "title": "Report the outcome",
        "note": "Placed on Day 0, Day 1 or Day 2, or not yet.",
        "branch": [
          "j-outcome",
          "After Day 0"
        ]
      }
    ]
  },
  {
    "id": "j-phone",
    "tab": "student",
    "title": "On a phone, start to finish",
    "starts": "A student opens the app on a phone",
    "ends": "Every daily task done from one thumb",
    "steps": [
      {
        "code": "s01-mobile",
        "title": "Sign in",
        "note": "Google or email, with a link to the free session for new students."
      },
      {
        "code": "s02-mobile",
        "title": "Pick track and target",
        "note": "Three short steps with a progress bar, one decision per screen."
      },
      {
        "code": "s03-mobile",
        "title": "Read the summary",
        "note": "Roles, CV markup and answers, with the suggested runway pinned at the bottom."
      },
      {
        "code": "s05-mobile",
        "title": "Home",
        "note": "Day 0 countdown, the next session, CV score and answer progress."
      },
      {
        "code": "s09-mobile",
        "title": "Sessions",
        "note": "The runway as a vertical timeline. Slot buttons are large enough to tap."
      },
      {
        "code": "s06-mobile",
        "title": "CV Builder",
        "note": "Section chips, the score, and the bullet being edited."
      },
      {
        "code": "s08-mobile",
        "title": "Answer bank",
        "note": "Filter by Flagged or Not drafted. The flagged critique shows inline."
      },
      {
        "code": "s10-mobile",
        "title": "Panel feedback",
        "note": "Readiness, the panelist's summary and a button to fix flagged answers."
      },
      {
        "code": "s14-mobile",
        "title": "Plan and billing",
        "note": "Plan status, top-ups at the plan rate and the Elite upgrade."
      }
    ]
  },
  {
    "id": "j-routes",
    "tab": "student",
    "title": "Routes and extras",
    "starts": "A student wants more than the finals runway",
    "ends": "The plan matches the route",
    "steps": [
      {
        "code": "s11",
        "title": "See the four routes",
        "note": "The seven-step journey from Term 1 to the offer letter, and where the student is now."
      },
      {
        "code": "s12",
        "title": "Open the case track",
        "note": "Elite only: three coaching sessions, two deck reviews and PPI preparation from Week -12."
      },
      {
        "code": "s13",
        "title": "Turn on Quick Switch",
        "note": "A daily digest of live openings under seven days old, with a fit score for each."
      },
      {
        "code": "s14",
        "title": "Review plan and billing",
        "note": "Plan, top-ups, the upgrade credit and invoices.",
        "tag": "Proposed"
      },
      {
        "code": "s15",
        "title": "Check what the panel sees",
        "note": "CV history, profiling notes, answer bank and past feedback, all listed."
      }
    ]
  },
  {
    "id": "j-locked",
    "tab": "edge",
    "title": "Locked out, or the wrong email",
    "starts": "A student cannot sign in, or signed up with a personal Gmail",
    "ends": "Back in with a verified college email",
    "steps": [
      {
        "code": "s01",
        "title": "Tap Forgot?",
        "note": "The link sits beside the password field on desktop and phone."
      },
      {
        "code": "e01",
        "title": "Reset the password, or add the college email",
        "note": "Three steps: enter the email, check the inbox, set a new password. A banner asks Gmail sign-ups to verify a college address."
      },
      {
        "code": "s05",
        "title": "Back on the dashboard",
        "note": "Everything is where it was left."
      }
    ]
  },
  {
    "id": "j-pay",
    "tab": "edge",
    "title": "The payment fails",
    "starts": "A UPI payment times out at checkout",
    "ends": "Paid, with a receipt",
    "steps": [
      {
        "code": "s04",
        "title": "Choose a plan",
        "note": "The same screen as a normal purchase."
      },
      {
        "code": "e04",
        "title": "See that nothing was charged",
        "note": "The seat is held for 15 minutes at the Season 1 price. A bank debit reverses on its own in 5 to 7 working days.",
        "tag": "Proposed"
      },
      {
        "code": "e04",
        "title": "Try again, or pay another way",
        "note": "Right side of the same screen: the receipt, the reference and what happens next."
      },
      {
        "code": "s05",
        "title": "Open the dashboard",
        "note": "The profiling call is the first thing to book."
      }
    ]
  },
  {
    "id": "j-full",
    "tab": "edge",
    "title": "The cohort is full",
    "starts": "A student reaches checkout and the seats are gone",
    "ends": "A seat is taken from the waitlist",
    "steps": [
      {
        "code": "s04",
        "title": "Choose a plan",
        "note": "Season 1 pricing held until the cohort filled, and it has."
      },
      {
        "code": "e05",
        "title": "Join the waitlist",
        "note": "Pick a plan and a fallback. No payment now. The screen shows the place in the queue.",
        "tag": "Proposed"
      },
      {
        "code": null,
        "title": "A seat opens",
        "note": "The student gets 24 hours to take it before it passes to the next person.",
        "kind": "Email and WhatsApp",
        "tag": "Proposed"
      },
      {
        "code": "e04",
        "title": "Pay",
        "note": "Season 1 pricing is kept."
      }
    ]
  },
  {
    "id": "j-late",
    "tab": "edge",
    "title": "Joined late",
    "starts": "Fewer than 8 weeks to Day 0",
    "ends": "Compressed sessions booked",
    "steps": [
      {
        "code": "s02",
        "title": "See the weeks left",
        "note": "The onboarding screen shows how much runway remains."
      },
      {
        "code": "e03",
        "title": "See what still fits",
        "note": "A compressed runway, with what is dropped and why. The app recommends Basic plus a top-up rather than a plan it cannot deliver.",
        "tag": "Proposed"
      },
      {
        "code": "e04",
        "title": "Pay",
        "note": "Basic and one top-up mock."
      },
      {
        "code": "s09",
        "title": "Book the compressed sessions",
        "note": "Profiling and CV lock the same day, P1 and the deep-dive two days apart, P3 seven days out."
      }
    ]
  },
  {
    "id": "j-session",
    "tab": "edge",
    "title": "A session is cancelled, moved or missed",
    "starts": "A panel cannot happen as booked",
    "ends": "A new slot is confirmed",
    "steps": [
      {
        "code": "s09",
        "title": "Book the panel",
        "note": "The student has a P2 slot on Monday evening."
      },
      {
        "code": "e06",
        "title": "Handle the change",
        "note": "Panelist cancels: free rebook with priority. Student reschedules: free up to 24 hours before. No-show: the first miss is free to rebook, after that it counts.",
        "tag": "Proposed"
      },
      {
        "code": "s09",
        "title": "Back on the runway",
        "note": "The new slot shows as booked."
      }
    ]
  },
  {
    "id": "j-upgrade",
    "tab": "edge",
    "title": "Upgrade mid-season",
    "starts": "Basic has ended and the student wants more",
    "ends": "Premium stages unlocked",
    "steps": [
      {
        "code": "s09",
        "title": "See where Basic stops",
        "note": "Switch the Plan tweak to Basic to see the Basic ends here divider and the upgrade card."
      },
      {
        "code": "e08",
        "title": "See the upgrade price",
        "note": "Premium costs 4,000 more than Basic. Top-ups already paid come off, so ₹1,799 spent makes it ₹2,201."
      },
      {
        "code": "e04",
        "title": "Pay",
        "note": "Receipt and the next booking."
      },
      {
        "code": "s09",
        "title": "Book the rest of the runway",
        "note": "Deep-dive, P2, group session and P3 unlock."
      }
    ]
  },
  {
    "id": "j-dayzero",
    "tab": "edge",
    "title": "Day 0 moves",
    "starts": "The placement cell changes the date",
    "ends": "Every runway date reflects the new Day 0",
    "steps": [
      {
        "code": null,
        "title": "The placement cell changes Day 0",
        "note": "Colleges announce dates. The ops team updates the cohort.",
        "kind": "Outside the app"
      },
      {
        "code": "e10",
        "title": "Tell the student",
        "note": "A notification, always by email, says the runway changed and which sessions moved."
      },
      {
        "code": "s09",
        "title": "Review the new dates",
        "note": "P3 stays seven days out. Anything that no longer fits is flagged for the student to confirm."
      }
    ]
  },
  {
    "id": "j-outcome",
    "tab": "edge",
    "title": "After Day 0",
    "starts": "The process has closed",
    "ends": "Credit or a new season",
    "steps": [
      {
        "code": "e07",
        "title": "Report the outcome",
        "note": "Placed records the offer and makes the builders read-only. Not placed turns the fee into full credit for next season.",
        "tag": "Proposed"
      },
      {
        "code": "s13",
        "title": "Not placed: Quick Switch starts",
        "note": "Route Four, lateral support off campus at no extra cost, until there is an offer."
      },
      {
        "code": "e11",
        "title": "Come back next season",
        "note": "CV, answers and feedback come with the student. Season 2 prices apply.",
        "tag": "Proposed"
      }
    ]
  },
  {
    "id": "j-first",
    "tab": "edge",
    "title": "First login, nothing booked",
    "starts": "A new account with no session and no plan",
    "ends": "The free session is booked and the CV is improving",
    "steps": [
      {
        "code": "e12",
        "title": "See what is left to do",
        "note": "Three steps before anything costs money. Runway, answers and feedback show what they will hold."
      },
      {
        "code": "s03",
        "title": "Book the free session",
        "note": "After the session, the summary appears here."
      },
      {
        "code": "s06",
        "title": "Fix bullets while waiting",
        "note": "The CV Builder is always free."
      }
    ]
  },
  {
    "id": "j-apply",
    "tab": "panelist",
    "title": "Become a panelist",
    "starts": "A working practitioner finds the application form",
    "ends": "An active panelist with a first panel booked",
    "steps": [
      {
        "code": "p01",
        "title": "Apply",
        "note": "Name, current role, years in the function, the function to interview for, sessions they can run and when they are free."
      },
      {
        "code": "a06",
        "title": "Ops reviews the application",
        "note": "Applications queue beside the roster, by function."
      },
      {
        "code": "p02",
        "title": "Open the panelist home",
        "note": "Tonight's panels, feedback due and this season's count."
      }
    ]
  },
  {
    "id": "j-evening",
    "tab": "panelist",
    "title": "Run a panel",
    "starts": "A panel is on the calendar tonight",
    "ends": "Feedback is with the student",
    "steps": [
      {
        "code": "p02",
        "title": "See tonight's panels",
        "note": "Each row shows the session, the target and whether the brief has been read. Also available on a phone."
      },
      {
        "code": "p03",
        "title": "Read the brief",
        "note": "Questions to pull on, the locked CV, the last panel's summary and the profiling notes."
      },
      {
        "code": "p04",
        "title": "Score the panel",
        "note": "What landed, a verdict, a note to the student, and a switch to send the answer back to the student's builder.",
        "tag": "Proposed"
      },
      {
        "code": "s10",
        "title": "The student reads it",
        "note": "The same notes appear as the student's feedback report."
      }
    ]
  },
  {
    "id": "j-avail",
    "tab": "panelist",
    "title": "Set availability",
    "starts": "A panelist opens their week",
    "ends": "Students can book the open slots",
    "steps": [
      {
        "code": "p05",
        "title": "Open slots",
        "note": "Booked, open and empty, by day and time."
      },
      {
        "code": "s09",
        "title": "The student picks a slot",
        "note": "Open slots appear on the student's runway."
      },
      {
        "code": "a04",
        "title": "Ops sees the booking",
        "note": "Synced from Calendly, with the panelist already filled in."
      },
      {
        "code": "p02",
        "title": "The panelist sees it that day",
        "note": "The session appears under Tonight."
      }
    ]
  },
  {
    "id": "j-ops",
    "tab": "admin",
    "title": "The weekly ops loop",
    "starts": "Monday morning check",
    "ends": "Everyone has a panelist and nothing is overdue",
    "steps": [
      {
        "code": "a01",
        "title": "Read the cohort overview",
        "note": "Seat fill, free session to paid conversion, revenue by tier and what needs attention.",
        "tag": "Sample data"
      },
      {
        "code": "a03",
        "title": "Assign panelists",
        "note": "Match by function. The load per function is shown beside each name."
      },
      {
        "code": "a04",
        "title": "Check bookings",
        "note": "Calendly feed, unassigned sessions and no-shows."
      },
      {
        "code": "a02",
        "title": "Look at a student",
        "note": "Plan, CV, answers, last panel and next session, with a message button."
      },
      {
        "code": "a05",
        "title": "Check the ledger",
        "note": "Plans, top-ups, upgrade credit and carried-over credit.",
        "tag": "Sample data"
      }
    ]
  },
  {
    "id": "j-roster",
    "tab": "admin",
    "title": "Keep the panel healthy",
    "starts": "Panel load is uneven or applications are waiting",
    "ends": "Every function has enough panelists",
    "steps": [
      {
        "code": "a06",
        "title": "Read the roster",
        "note": "Panelists by function, panels run and feedback turnaround."
      },
      {
        "code": "a03",
        "title": "Check load by function",
        "note": "Marketing and Consulting run hottest in the sample week."
      },
      {
        "code": "a04",
        "title": "Find sessions without a panelist",
        "note": "Fill them first, then review the application queue."
      }
    ]
  },
  {
    "id": "j-panel",
    "tab": "cross",
    "title": "One panel, three roles",
    "starts": "A student books P2",
    "ends": "The flagged answer is back in the student's answer bank",
    "steps": [
      {
        "code": "s09",
        "title": "Student books the slot",
        "note": "Monday 12 October, 7:30 PM, with priority booking."
      },
      {
        "code": "a04",
        "title": "Ops sees the booking",
        "note": "It appears in the feed. If no panelist is attached it is flagged."
      },
      {
        "code": "a03",
        "title": "Ops assigns the panelist",
        "note": "A Marketing & Brand specialist is matched to the student's target."
      },
      {
        "code": "p02",
        "title": "Panelist sees it",
        "note": "It shows under Tonight with the brief status."
      },
      {
        "code": "p03",
        "title": "Panelist reads the brief",
        "note": "Flagged answers, locked CV and the last panel's summary."
      },
      {
        "code": "p04",
        "title": "Panelist scores it",
        "note": "Verdicts, notes and the send-back switch."
      },
      {
        "code": "s10",
        "title": "Student reads feedback",
        "note": "Readiness moves from 64% to the new score."
      },
      {
        "code": "s08",
        "title": "Flagged answers return",
        "note": "They reappear in the answer bank with the panelist's note."
      }
    ]
  },
  {
    "id": "j-target",
    "tab": "cross",
    "title": "Target role changes",
    "starts": "A student's target moves from Sales & Marketing to Finance",
    "ends": "A Finance panel is booked and the history is intact",
    "steps": [
      {
        "code": "s15",
        "title": "Student asks for a panel change",
        "note": "The button sits beside What your panel can see."
      },
      {
        "code": "e09",
        "title": "Choose the new target",
        "note": "The screen lists what carries over (CV, notes, answers, plan) and what changes (deep-dive, new role questions, a possible CV re-lock)."
      },
      {
        "code": "a03",
        "title": "Ops assigns a new panelist",
        "note": "Finance & Banking panelists are listed with open slots and load."
      },
      {
        "code": "p03",
        "title": "The new panelist reads the history",
        "note": "The full brief, as for any other panel."
      },
      {
        "code": "s09",
        "title": "Student books the new deep-dive",
        "note": "Same time slot if the panelist is free."
      }
    ]
  },
  {
    "id": "j-credit",
    "tab": "cross",
    "title": "Not placed, credit carried over",
    "starts": "A student reports no offer after Day 2",
    "ends": "The credit is ready for next season",
    "steps": [
      {
        "code": "e07",
        "title": "Student reports not placed",
        "note": "The screen says what was promised: full credit, no cash refund."
      },
      {
        "code": "a05",
        "title": "Ops sees the credit",
        "note": "The ledger shows it under carried over, with the student's name.",
        "tag": "Proposed"
      },
      {
        "code": "e11",
        "title": "Student returns next season",
        "note": "Season 2 prices apply and the CV, answers and feedback come along."
      }
    ]
  }
]
