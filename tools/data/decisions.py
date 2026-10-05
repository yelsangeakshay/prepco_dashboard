# Content for the Decisions page. Journey ids match tools/data/journeys.py.

DECISIONS = [
    dict(q="Does a missed panel use up the session?",
         proposal="The first no-show is free to rebook. After that it counts as used. A dropped call or broken link on our side never counts.",
         screens=["E6"], journey="j-session"),
    dict(q="How late can a student reschedule for free?",
         proposal="Free up to 24 hours before the session. Inside 24 hours it counts as missed.",
         screens=["E6"], journey="j-session"),
    dict(q="Which payment provider, and how are GST invoices issued?",
         proposal="Not decided. The checkout shows UPI, card and net banking as a placeholder, and the invoice list is a proposal.",
         screens=["S4", "E4", "S14"], journey="j-pay"),
    dict(q="What is the Season 2 price for returning students?",
         proposal="The website says returning students get season-2 pricing but not what it is. The screen shows a placeholder.",
         screens=["E11"], journey="j-outcome"),
    dict(q="Below how many weeks to Day 0 do we stop selling Premium?",
         proposal="Under 8 weeks the app recommends Basic plus one top-up and says why. The exact cut-off is open.",
         screens=["E3"], journey="j-late"),
    dict(q="Who gets a seat first from the waitlist?",
         proposal="First come, first served, with 24 hours to take the seat before it passes on. Priority for free-session attendees is the alternative.",
         screens=["E5"], journey="j-full"),
    dict(q="What happens to unused sessions if a student is placed early through a PPO or PPI?",
         proposal="Not decided: credited, transferable or lost. The Day 0 outcome screen has a decision-needed marker.",
         screens=["E7"], journey="j-outcome"),
    dict(q="Is the product for SCMHRD only at launch, or for several colleges?",
         proposal="The mockups assume one college and one Day 0 date per cohort. Several colleges need a Day 0 date per college and per-college seat caps.",
         screens=["S2", "E10"], journey="j-dayzero"),
    dict(q="How are panelists paid?",
         proposal="Not decided: per panel or monthly, and whether feedback turnaround is part of it. The roster shows turnaround as a metric.",
         screens=["P1", "A6"], journey="j-apply"),
    dict(q="Who runs the free sessions?",
         proposal="The mockups show the Prep Co team. Senior panelists running them is the alternative.",
         screens=["S3", "A4"], journey="j-join"),
]

# (group, [(priority, case, designed_in_journey_or_None)])
EDGE = [
    ("Account and onboarding", [
        ("P0", "A free session booked on the website before the student has an account. Match it by email when they sign up.", "j-join"),
        ("P1", "Signs in with a personal Gmail instead of the college address. Ask for the college email once and verify it.", "j-locked"),
        ("P1", "The CV is a scan or a photo and cannot be read. Offer to upload another file or type it in.", "j-join"),
        ("P1", "Consent for panelists to read the CV, notes and answers. Ask once at onboarding, since continuity depends on it.", "j-join"),
    ]),
    ("Buying", [
        ("P0", "The payment fails or stays pending. Hold the seat for a short window and never charge twice.", "j-pay"),
        ("P0", "The cohort fills while a student is at checkout. The site promises Season 1 pricing until the cohort fills, so there needs to be a waitlist.", "j-full"),
        ("P0", "Fewer than 8 weeks to Day 0. The FAQ promises an honest answer if there is not enough time, so the app has to say it too.", "j-late"),
        ("P1", "A student wants both tracks. Each plan covers one track, so finals is a new plan with the history carried over.", "j-outcome"),
    ]),
    ("Sessions", [
        ("P0", "The panelist cancels. The student rebooks at no cost and keeps priority.", "j-session"),
        ("P0", "The student misses a session or moves it late. Policy needed.", "j-session"),
        ("P1", "The video link fails during a panel. The panelist marks it interrupted and ops rebooks.", None),
        ("P1", "Panelist feedback is overdue and the student is waiting before the next panel. Escalate to ops.", None),
        ("P1", "Conflict of interest: the panelist works at a company the student is targeting, or is an alum of the same college.", None),
    ]),
    ("Runway changes", [
        ("P0", "The target role changes. Reassign the panel and carry over the CV, notes and answer bank.", "j-target"),
        ("P0", "Day 0 moves because the placement cell reschedules. Every runway date shifts and the student confirms.", "j-dayzero"),
        ("P1", "A re-lock requested the night before a shortlist. The lock rule exists to prevent exactly this.", "j-prepare"),
    ]),
    ("Outcome", [
        ("P0", "Placed on Day 0, Day 1 or Day 2. Record it, close the runway and keep the builders read-only.", "j-outcome"),
        ("P0", "Not placed after Day 2. The fee becomes full credit for next season and Route Four switches on.", "j-credit"),
        ("P1", "A PPO or PPI converts before finals. The student leaves the finals runway early.", None),
    ]),
    ("Trust and data", [
        ("P2", "Delete an account or export data under India's data protection rules. Keep the ledger and remove personal data.", None),
    ]),
]

NOT_DESIGNED = [
    "Premium extras: the company-specific prep pack and the shortlist, JD and application strategy.",
    "Panelist approval and onboarding calls, and panelist payouts.",
    "Admin season setup: Day 0 per college, seat caps and prices, and a reviewer queue for CV re-locks.",
    "An interrupted panel, overdue feedback escalation and conflict-of-interest checks.",
    "Account deletion and data export.",
]

BUILD_ORDER = [
    ("MVP", "Sign-up and onboarding, free session, plan and payment, home, CV Builder, HR Question Builder, sessions and feedback, panelist brief and scoring, ops assignment and bookings."),
    ("Next", "Day 0 outcomes, upgrades with credit, waitlist, Quick Switch, case track and the ledger."),
    ("Later", "Panelist payouts, several colleges per season and data export."),
]
