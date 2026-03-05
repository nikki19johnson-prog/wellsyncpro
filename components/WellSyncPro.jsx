"use client";
import { useState, useEffect, useRef } from "react";

// ─── THEME & CONSTANTS ───────────────────────────────────────────────
const COLORS = {
  bg: "#F8F7F4",
  bgDark: "#1A1A2E",
  card: "#FFFFFF",
  cardDark: "#16213E",
  accent: "#2D6A4F",
  accentLight: "#52B788",
  accentGlow: "#40916C",
  warm: "#E76F51",
  warmLight: "#F4A261",
  purple: "#7B2D8E",
  purpleLight: "#A855F7",
  blue: "#0077B6",
  blueLight: "#48CAE4",
  text: "#1A1A2E",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
  border: "#E5E7EB",
  success: "#10B981",
  warning: "#F59E0B",
  pink: "#F472B6",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const FULL_MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── MOCK DATA ───────────────────────────────────────────────────────
const SAMPLE_CLIENTS = [
  { id: 1, name: "Meridian Health Systems", short: "Meridian", employees: 2400, tier: "Premium", status: "active", color: "#2D6A4F" },
  { id: 2, name: "TechVault Solutions", short: "TechVault", employees: 850, tier: "Standard", status: "active", color: "#0077B6" },
  { id: 3, name: "Summit Financial Group", short: "Summit", employees: 1200, tier: "Premium", status: "active", color: "#7B2D8E" },
  { id: 4, name: "Greenleaf Manufacturing", short: "Greenleaf", employees: 3100, tier: "Enterprise", status: "active", color: "#E76F51" },
];

const CALENDAR_THEMES = {
  Jan: { theme: "New Year, New Habits", color: "#48CAE4", icon: "✨" },
  Feb: { theme: "Heart Health & Connection", color: "#E76F51", icon: "❤️" },
  Mar: { theme: "Nutrition & Nourishment", color: "#52B788", icon: "🥗" },
  Apr: { theme: "Stress Awareness", color: "#7B2D8E", icon: "🧘" },
  May: { theme: "Mental Health Month", color: "#0077B6", icon: "🧠" },
  Jun: { theme: "Men's Health & Movement", color: "#2D6A4F", icon: "🏃" },
  Jul: { theme: "Sun Safety & Hydration", color: "#F4A261", icon: "☀️" },
  Aug: { theme: "Back-to-Routine", color: "#E76F51", icon: "📋" },
  Sep: { theme: "Suicide Prevention & Resilience", color: "#48CAE4", icon: "💙" },
  Oct: { theme: "Breast Cancer Awareness", color: "#F472B6", icon: "🎀" },
  Nov: { theme: "Gratitude & Financial Wellness", color: "#F59E0B", icon: "🍂" },
  Dec: { theme: "Holiday Wellness & Reflection", color: "#10B981", icon: "🎄" },
};

const CHALLENGE_TEMPLATES = [
  { name: "30-Day Step Challenge", type: "Physical", duration: "30 days", difficulty: "Beginner", engagement: 72 },
  { name: "Hydration Habit Builder", type: "Nutrition", duration: "21 days", difficulty: "Beginner", engagement: 68 },
  { name: "Mindfulness Minutes", type: "Mental Health", duration: "14 days", difficulty: "Beginner", engagement: 64 },
  { name: "Sleep Optimization Sprint", type: "Sleep", duration: "21 days", difficulty: "Intermediate", engagement: 58 },
  { name: "Team Walking War", type: "Physical + Social", duration: "30 days", difficulty: "All Levels", engagement: 81 },
  { name: "Financial Wellness Check", type: "Financial", duration: "7 days", difficulty: "Beginner", engagement: 45 },
];

const NEWSLETTER_SECTIONS = [
  { id: "spotlight", label: "Monthly Spotlight", icon: "⭐" },
  { id: "activity", label: "Interactive Activity", icon: "🎯" },
  { id: "recipe", label: "Healthy Recipe", icon: "🍳" },
  { id: "challenge", label: "Challenge Update", icon: "🏆" },
  { id: "resource", label: "Resource Corner", icon: "📚" },
  { id: "incentive", label: "Incentive Reminder", icon: "🎁" },
];

// NEW: Tasks / upcoming deadlines data
const UPCOMING_TASKS = [
  { id: 1, task: "Send March newsletter", client: "Meridian", type: "newsletter", due: "Mar 5", urgent: true, done: false },
  { id: 2, task: "Launch Step Challenge", client: "Greenleaf", type: "challenge", due: "Mar 7", urgent: true, done: false },
  { id: 3, task: "Send March newsletter", client: "TechVault", type: "newsletter", due: "Mar 8", urgent: false, done: false },
  { id: 4, task: "Q1 incentive distribution", client: "Summit", type: "incentive", due: "Mar 10", urgent: false, done: false },
  { id: 5, task: "Send March newsletter", client: "Summit", type: "newsletter", due: "Mar 10", urgent: false, done: false },
  { id: 6, task: "Mindfulness challenge wrap-up", client: "TechVault", type: "challenge", due: "Mar 12", urgent: false, done: false },
  { id: 7, task: "Review Q1 engagement data", client: "All Clients", type: "report", due: "Mar 15", urgent: false, done: false },
  { id: 8, task: "April calendar finalization", client: "Meridian", type: "calendar", due: "Mar 20", urgent: false, done: false },
  { id: 9, task: "April calendar finalization", client: "TechVault", type: "calendar", due: "Mar 20", urgent: false, done: false },
  { id: 10, task: "April calendar finalization", client: "Greenleaf", type: "calendar", due: "Mar 22", urgent: false, done: false },
  { id: 11, task: "Send March newsletter", client: "Greenleaf", type: "newsletter", due: "Mar 6", urgent: true, done: false },
  { id: 12, task: "Q1 incentive distribution", client: "Meridian", type: "incentive", due: "Mar 14", urgent: false, done: false },
];

// NEW: Activity log data
const ACTIVITY_LOG = [
  { id: 1, client: "Meridian", action: "Newsletter sent", detail: "February — Heart Health & Connection", date: "Feb 28", type: "newsletter" },
  { id: 2, client: "TechVault", action: "Newsletter sent", detail: "February — Heart Health & Connection", date: "Feb 27", type: "newsletter" },
  { id: 3, client: "Greenleaf", action: "Challenge launched", detail: "Team Walking War — 891 enrolled", date: "Feb 24", type: "challenge" },
  { id: 4, client: "Summit", action: "Incentive distributed", detail: "Q1 wellness credits — $4,200", date: "Feb 22", type: "incentive" },
  { id: 5, client: "Meridian", action: "Challenge completed", detail: "Hydration Habit Builder — 68% completion", date: "Feb 20", type: "challenge" },
  { id: 6, client: "Greenleaf", action: "Newsletter sent", detail: "February — Heart Health & Connection", date: "Feb 19", type: "newsletter" },
  { id: 7, client: "TechVault", action: "Challenge launched", detail: "Mindfulness Minutes — 156 enrolled", date: "Feb 17", type: "challenge" },
  { id: 8, client: "Summit", action: "Newsletter sent", detail: "February — Heart Health & Connection", date: "Feb 15", type: "newsletter" },
  { id: 9, client: "Meridian", action: "Webinar hosted", detail: "Heart-Healthy Cooking — 312 attendees", date: "Feb 12", type: "calendar" },
  { id: 10, client: "Greenleaf", action: "Incentive distributed", detail: "February wellness gift cards — $8,100", date: "Feb 10", type: "incentive" },
];

// NEW: Template library
const SAVED_TEMPLATES = [
  { id: 1, name: "March Nutrition Newsletter", type: "newsletter", client: "Meridian", created: "Mar 2025", usedBy: ["TechVault", "Summit"], sections: ["spotlight", "recipe", "activity"] },
  { id: 2, name: "30-Day Step Challenge Config", type: "challenge", client: "Greenleaf", created: "Jan 2025", usedBy: ["Meridian"], sections: [] },
  { id: 3, name: "Q1 Engagement Report Template", type: "report", client: "All Clients", created: "Apr 2025", usedBy: [], sections: [] },
  { id: 4, name: "Mindfulness Month Calendar", type: "calendar", client: "TechVault", created: "Apr 2025", usedBy: ["Summit"], sections: [] },
  { id: 5, name: "Points-Based Incentive Structure", type: "incentive", client: "Meridian", created: "Jan 2025", usedBy: ["Greenleaf"], sections: [] },
];

// NEW: Benefits & Resources per client
const BENEFIT_CATEGORIES = [
  { id: "eap", label: "EAP", color: "#7B2D8E", icon: "🧠" },
  { id: "telehealth", label: "Telehealth", color: "#0077B6", icon: "📱" },
  { id: "fitness", label: "Fitness & Movement", color: "#2D6A4F", icon: "💪" },
  { id: "nutrition", label: "Nutrition", color: "#52B788", icon: "🥗" },
  { id: "financial", label: "Financial Wellness", color: "#F59E0B", icon: "💰" },
  { id: "mental", label: "Mental Health", color: "#48CAE4", icon: "🧘" },
  { id: "chronic", label: "Chronic Condition Mgmt", color: "#E76F51", icon: "❤️‍🩹" },
  { id: "prevention", label: "Preventive Care", color: "#F472B6", icon: "🩺" },
  { id: "family", label: "Family & Caregiving", color: "#A855F7", icon: "👨‍👩‍👧" },
  { id: "tobacco", label: "Tobacco Cessation", color: "#6B7280", icon: "🚭" },
];

const CLIENT_BENEFITS = {
  "Meridian": [
    { id: "m1", name: "ComPsych GuidanceResources", category: "eap", vendor: "ComPsych", description: "24/7 EAP with 8 free counseling sessions, legal/financial consults, work-life balance resources", flyerLink: "canva.com/design/meridian-eap-flyer", heyzineLink: "heyzine.com/flip/meridian-eap", themes: ["Jan", "Apr", "May", "Sep"], spotlighted: [{ month: "Jan", year: 2026 }] },
    { id: "m2", name: "Teladoc Virtual Care", category: "telehealth", vendor: "Teladoc", description: "24/7 virtual doctor visits, dermatology, mental health, $0 copay", flyerLink: "canva.com/design/meridian-teladoc", heyzineLink: "heyzine.com/flip/meridian-teladoc", themes: ["Feb", "Jun", "Aug"], spotlighted: [{ month: "Feb", year: 2026 }] },
    { id: "m3", name: "Peloton Corporate Wellness", category: "fitness", vendor: "Peloton", description: "Discounted Peloton App membership for all employees, group challenges available", flyerLink: "canva.com/design/meridian-peloton", heyzineLink: "", themes: ["Jan", "Jun", "Aug"], spotlighted: [] },
    { id: "m4", name: "Noom Weight Management", category: "nutrition", vendor: "Noom", description: "Subsidized Noom membership for employees with BMI >30 or pre-diabetes", flyerLink: "canva.com/design/meridian-noom", heyzineLink: "heyzine.com/flip/meridian-noom", themes: ["Mar", "Jul"], spotlighted: [] },
    { id: "m5", name: "SmartDollar Financial Program", category: "financial", vendor: "Ramsey Solutions", description: "Full financial wellness platform — budgeting, debt payoff, retirement planning", flyerLink: "canva.com/design/meridian-smartdollar", heyzineLink: "heyzine.com/flip/meridian-smartdollar", themes: ["Nov", "Jan"], spotlighted: [] },
    { id: "m6", name: "Livongo Diabetes Management", category: "chronic", vendor: "Livongo/Teladoc", description: "Connected glucose meter, coaching, unlimited strips for enrolled diabetics", flyerLink: "canva.com/design/meridian-livongo", heyzineLink: "", themes: ["Mar", "Nov"], spotlighted: [] },
    { id: "m7", name: "Annual Biometric Screening", category: "prevention", vendor: "Quest Diagnostics", description: "On-site or at-home biometric screening — lipids, glucose, BMI, blood pressure", flyerLink: "canva.com/design/meridian-biometric", heyzineLink: "heyzine.com/flip/meridian-biometric", themes: ["Feb", "Oct"], spotlighted: [{ month: "Feb", year: 2026 }] },
    { id: "m8", name: "Quit For Life Tobacco Program", category: "tobacco", vendor: "Optum", description: "Free 12-week coaching + nicotine replacement therapy", flyerLink: "canva.com/design/meridian-quitforlife", heyzineLink: "", themes: ["Jan", "Nov"], spotlighted: [] },
  ],
  "TechVault": [
    { id: "t1", name: "Lyra Health EAP", category: "eap", vendor: "Lyra Health", description: "12 free therapy sessions, coaching, self-care apps, family support", flyerLink: "canva.com/design/techvault-lyra", heyzineLink: "heyzine.com/flip/tv-lyra", themes: ["Apr", "May", "Sep"], spotlighted: [{ month: "Jan", year: 2026 }] },
    { id: "t2", name: "Headspace for Work", category: "mental", vendor: "Headspace", description: "Full Headspace membership — meditation, sleep, focus exercises", flyerLink: "canva.com/design/techvault-headspace", heyzineLink: "heyzine.com/flip/tv-headspace", themes: ["Apr", "May", "Sep", "Dec"], spotlighted: [{ month: "Feb", year: 2026 }] },
    { id: "t3", name: "ClassPass Corporate", category: "fitness", vendor: "ClassPass", description: "Monthly credits for gym, yoga, Pilates, cycling across partner studios", flyerLink: "canva.com/design/techvault-classpass", heyzineLink: "", themes: ["Jan", "Jun", "Aug"], spotlighted: [] },
    { id: "t4", name: "Origin Financial Coaching", category: "financial", vendor: "Origin", description: "1:1 financial planning sessions, student loan assistance, equity compensation guidance", flyerLink: "canva.com/design/techvault-origin", heyzineLink: "heyzine.com/flip/tv-origin", themes: ["Nov", "Jan"], spotlighted: [] },
    { id: "t5", name: "Maven Family Planning", category: "family", vendor: "Maven", description: "Fertility, maternity, postpartum, and pediatric virtual care", flyerLink: "canva.com/design/techvault-maven", heyzineLink: "heyzine.com/flip/tv-maven", themes: ["May", "Feb"], spotlighted: [] },
    { id: "t6", name: "Spring Health Therapy", category: "mental", vendor: "Spring Health", description: "Therapy matching, medication management, Moments self-care app", flyerLink: "canva.com/design/techvault-spring", heyzineLink: "", themes: ["Apr", "May", "Sep"], spotlighted: [] },
  ],
  "Summit": [
    { id: "s1", name: "LifeWorks EAP", category: "eap", vendor: "LifeWorks/TELUS", description: "6 counseling sessions, manager support, crisis intervention, iCBT programs", flyerLink: "canva.com/design/summit-lifeworks", heyzineLink: "heyzine.com/flip/summit-lw", themes: ["Apr", "May", "Sep"], spotlighted: [] },
    { id: "s2", name: "Omada Chronic Care", category: "chronic", vendor: "Omada Health", description: "Digital prevention for diabetes, hypertension, MSK — coaching + connected devices", flyerLink: "canva.com/design/summit-omada", heyzineLink: "heyzine.com/flip/summit-omada", themes: ["Feb", "Mar", "Oct"], spotlighted: [{ month: "Feb", year: 2026 }] },
    { id: "s3", name: "Virgin Pulse Platform", category: "fitness", vendor: "Virgin Pulse", description: "Activity tracking, healthy habit challenges, device sync, rewards points", flyerLink: "canva.com/design/summit-vp", heyzineLink: "heyzine.com/flip/summit-vp", themes: ["Jan", "Jun", "Aug"], spotlighted: [{ month: "Jan", year: 2026 }] },
    { id: "s4", name: "Fidelity Financial Wellness", category: "financial", vendor: "Fidelity", description: "Retirement planning tools, HSA education, investment guidance", flyerLink: "canva.com/design/summit-fidelity", heyzineLink: "", themes: ["Nov", "Jan"], spotlighted: [] },
    { id: "s5", name: "Hinge Health MSK", category: "chronic", vendor: "Hinge Health", description: "Digital physical therapy for back, knee, hip, shoulder pain — sensors + coaching", flyerLink: "canva.com/design/summit-hinge", heyzineLink: "heyzine.com/flip/summit-hinge", themes: ["Jun", "Aug"], spotlighted: [] },
  ],
  "Greenleaf": [
    { id: "g1", name: "Beacon Health EAP", category: "eap", vendor: "Beacon Health", description: "5 counseling sessions, substance abuse support, critical incident debriefing", flyerLink: "canva.com/design/greenleaf-beacon", heyzineLink: "heyzine.com/flip/gl-beacon", themes: ["Apr", "May", "Sep"], spotlighted: [{ month: "Jan", year: 2026 }] },
    { id: "g2", name: "MDLive Telehealth", category: "telehealth", vendor: "MDLive", description: "Virtual urgent care, behavioral health, dermatology — available 24/7", flyerLink: "canva.com/design/greenleaf-mdlive", heyzineLink: "", themes: ["Feb", "Jun", "Aug"], spotlighted: [] },
    { id: "g3", name: "Wellhub (formerly Gympass)", category: "fitness", vendor: "Wellhub", description: "Tiered gym/studio access starting at $9.99/mo, includes wellness apps", flyerLink: "canva.com/design/greenleaf-wellhub", heyzineLink: "heyzine.com/flip/gl-wellhub", themes: ["Jan", "Jun", "Aug"], spotlighted: [{ month: "Feb", year: 2026 }] },
    { id: "g4", name: "Quit Genius Tobacco/Substance", category: "tobacco", vendor: "Quit Genius", description: "CBT-based app for tobacco, alcohol, and opioid use — coaching included", flyerLink: "canva.com/design/greenleaf-qg", heyzineLink: "", themes: ["Jan", "Nov"], spotlighted: [] },
    { id: "g5", name: "Progyny Fertility Benefits", category: "family", vendor: "Progyny", description: "Fertility treatment coverage, smart cycles, dedicated patient care advocate", flyerLink: "canva.com/design/greenleaf-progyny", heyzineLink: "heyzine.com/flip/gl-progyny", themes: ["May", "Feb"], spotlighted: [] },
    { id: "g6", name: "Carrot Pregnancy & Postpartum", category: "family", vendor: "Carrot Fertility", description: "Pregnancy, postpartum, and menopause support — virtual care + reimbursement", flyerLink: "canva.com/design/greenleaf-carrot", heyzineLink: "", themes: ["May", "Feb", "Oct"], spotlighted: [] },
    { id: "g7", name: "Real Appeal Weight Management", category: "nutrition", vendor: "UnitedHealthcare", description: "Online weight loss program with coaching, food scale, activity tracker", flyerLink: "canva.com/design/greenleaf-realappeal", heyzineLink: "heyzine.com/flip/gl-realappeal", themes: ["Mar", "Jan", "Jul"], spotlighted: [] },
    { id: "g8", name: "On-Site Health Clinic", category: "prevention", vendor: "CareATC", description: "Free on-site clinic for primary care, labs, medications — open to employees + dependents", flyerLink: "canva.com/design/greenleaf-onsite", heyzineLink: "heyzine.com/flip/gl-clinic", themes: ["Feb", "Jun", "Oct"], spotlighted: [{ month: "Jan", year: 2026 }] },
  ],
};

// NEW: Wellness Champions data
const CHAMPIONS_DATA = {
  "Meridian": [
    { id: "mc1", name: "Sarah L.", department: "Operations", region: "Midwest", active: true, lastAction: "Feb", actionsCompleted: 2, totalActions: 3, notes: "Very engaged, runs team walking groups" },
    { id: "mc2", name: "David K.", department: "Finance", region: "Northeast", active: true, lastAction: "Feb", actionsCompleted: 3, totalActions: 3, notes: "Shared EAP resources with entire floor" },
    { id: "mc3", name: "Priya M.", department: "Engineering", region: "West", active: true, lastAction: "Jan", actionsCompleted: 1, totalActions: 3, notes: "New champion, still ramping up" },
    { id: "mc4", name: "James T.", department: "HR", region: "Midwest", active: false, lastAction: "Nov", actionsCompleted: 0, totalActions: 3, notes: "Has gone quiet — needs check-in" },
    { id: "mc5", name: "Maria G.", department: "Marketing", region: "Southeast", active: true, lastAction: "Feb", actionsCompleted: 2, totalActions: 3, notes: "Created team gratitude board in breakroom" },
  ],
  "TechVault": [
    { id: "tc1", name: "Alex W.", department: "Product", region: "Remote", active: true, lastAction: "Feb", actionsCompleted: 3, totalActions: 3, notes: "Superstar — leads virtual meditation breaks" },
    { id: "tc2", name: "Jordan P.", department: "Sales", region: "West", active: true, lastAction: "Feb", actionsCompleted: 2, totalActions: 3, notes: "Great at Slack engagement" },
    { id: "tc3", name: "Kai N.", department: "Engineering", region: "Remote", active: true, lastAction: "Jan", actionsCompleted: 1, totalActions: 3, notes: "Quiet but consistent" },
  ],
  "Summit": [
    { id: "sc1", name: "Rachel F.", department: "Compliance", region: "Northeast", active: true, lastAction: "Feb", actionsCompleted: 2, totalActions: 3, notes: "Connected wellness to compliance training" },
    { id: "sc2", name: "Tom B.", department: "Advisory", region: "Midwest", active: true, lastAction: "Feb", actionsCompleted: 3, totalActions: 3, notes: "Most vocal champion, great energy" },
    { id: "sc3", name: "Lisa C.", department: "Operations", region: "Southeast", active: false, lastAction: "Dec", actionsCompleted: 0, totalActions: 3, notes: "Role change — may need to transition" },
  ],
  "Greenleaf": [
    { id: "gc1", name: "Miguel R.", department: "Plant Floor", region: "Midwest", active: true, lastAction: "Feb", actionsCompleted: 2, totalActions: 3, notes: "Bridges office & plant floor wellness" },
    { id: "gc2", name: "Donna H.", department: "Safety", region: "Midwest", active: true, lastAction: "Feb", actionsCompleted: 3, totalActions: 3, notes: "Integrates wellness into safety huddles" },
    { id: "gc3", name: "Chris J.", department: "Shipping", region: "Southeast", active: true, lastAction: "Jan", actionsCompleted: 1, totalActions: 3, notes: "Night shift — needs adjusted comms" },
    { id: "gc4", name: "Angela S.", department: "Admin", region: "Midwest", active: true, lastAction: "Feb", actionsCompleted: 2, totalActions: 3, notes: "Organizes monthly potlucks" },
    { id: "gc5", name: "Derek M.", department: "Maintenance", region: "Midwest", active: false, lastAction: "Oct", actionsCompleted: 0, totalActions: 3, notes: "Disengaged — needs 1:1 outreach" },
    { id: "gc6", name: "Yuki T.", department: "Quality", region: "West", active: true, lastAction: "Feb", actionsCompleted: 3, totalActions: 3, notes: "Runs bilingual wellness comms for team" },
  ],
};

const CHAMPION_MONTHLY_ACTIONS = {
  Jan: "Attend one wellness program and post a recap to your department/team",
  Feb: "Share one specific benefit or resource with your team (e.g., EAP counseling)",
  Mar: "Ask your team what wellness topics they want to learn about; bring top answer to next meeting",
  Apr: "Recruit one colleague to attend an upcoming program with you",
  May: "Spread the word about mental health benefits for Mental Health Awareness Month",
  Jun: "Promote and attend the financial fundamentals series session",
  Jul: "Run a micro challenge (hydration or steps) for your team for one week",
  Aug: "Model micro breaks with 2 five-minute movement breaks per day",
  Sep: "Spotlight preventative care — annual physicals, screenings",
  Oct: "Ergonomics check: share a 5-point desk setup guide, lead a 3-min stretch in a meeting",
  Nov: "Gratitude and community: promote volunteer opportunities or start a gratitude thread",
  Dec: "Year-end reflection: survey your team on what worked and what to adjust next year",
};

// NEW: Communications tracker data
const COMMS_TYPES = [
  { id: "weekly", label: "Weekly Wellness Email", icon: "mail", color: COLORS.accent, cadence: "Weekly", description: "Programs, CTAs, highlights, ICYMI recap" },
  { id: "biweekly", label: "Bi-Weekly Benefits Email", icon: "shield", color: COLORS.blue, cadence: "Bi-weekly", description: "Benefit callouts, program spotlights, resource links" },
  { id: "icymi", label: "ICYMI Recap", icon: "eye", color: COLORS.purple, cadence: "Weekly", description: "Recording links, key takeaways from recent sessions" },
  { id: "newsletter", label: "Monthly Newsletter", icon: "mail", color: COLORS.warm, cadence: "Monthly", description: "Full newsletter with activity, recipe, spotlight, challenge update" },
  { id: "champion", label: "Champion Bundle", icon: "users", color: COLORS.accentLight, cadence: "Monthly", description: "Done-for-you comms kit: messaging, flyers, share-ready content" },
];

const COMMS_LOG = [
  { id: 1, type: "weekly", client: "Meridian", subject: "This Week: Nutrition Kickoff + Mindful Movement", date: "Mar 3", status: "sent", opens: 412, clicks: 89 },
  { id: 2, type: "weekly", client: "TechVault", subject: "This Week: Headspace Challenge + Sleep Webinar", date: "Mar 3", status: "sent", opens: 198, clicks: 42 },
  { id: 3, type: "biweekly", client: "Meridian", subject: "Did You Know? Your Noom Benefit is Fully Covered", date: "Mar 1", status: "sent", opens: 389, clicks: 134 },
  { id: 4, type: "newsletter", client: "Greenleaf", subject: "March Wellness: Nutrition & Nourishment", date: "Mar 1", status: "sent", opens: 1245, clicks: 312 },
  { id: 5, type: "icymi", client: "Meridian", subject: "ICYMI: Heart Health Webinar Recap + Recording", date: "Feb 28", status: "sent", opens: 267, clicks: 98 },
  { id: 6, type: "champion", client: "Meridian", subject: "March Champion Bundle: Nutrition Theme", date: "Feb 28", status: "sent", opens: 5, clicks: 5 },
  { id: 7, type: "weekly", client: "Greenleaf", subject: "This Week: Team Walking War Update + March Preview", date: "Mar 3", status: "sent", opens: 876, clicks: 201 },
  { id: 8, type: "newsletter", client: "Meridian", subject: "March Wellness: Nutrition & Nourishment", date: "Mar 4", status: "draft", opens: null, clicks: null },
  { id: 9, type: "biweekly", client: "Summit", subject: "Spotlight: Omada Digital Health for Diabetes Prevention", date: "Mar 5", status: "scheduled", opens: null, clicks: null },
  { id: 10, type: "weekly", client: "Summit", subject: "This Week: Financial Fundamentals Q1 Session", date: "Mar 3", status: "sent", opens: 302, clicks: 67 },
  { id: 11, type: "newsletter", client: "TechVault", subject: "March Wellness: Nutrition & Nourishment", date: "Mar 5", status: "scheduled", opens: null, clicks: null },
  { id: 12, type: "newsletter", client: "Summit", subject: "March Wellness: Nutrition & Nourishment", date: "Mar 7", status: "draft", opens: null, clicks: null },
];

// ─── ICONS ────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
    gift: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
    sparkles: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    target: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    arrowUp: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    arrowDown: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    loader: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    copy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
    layers: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    activity: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    link: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  };
  return icons[name] || null;
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
    @keyframes dotPulse { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    .animate-in { animation: fadeInUp 0.5s ease-out forwards; }
    .animate-in-delay-1 { animation: fadeInUp 0.5s ease-out 0.1s forwards; opacity: 0; }
    .animate-in-delay-2 { animation: fadeInUp 0.5s ease-out 0.2s forwards; opacity: 0; }
    .animate-in-delay-3 { animation: fadeInUp 0.5s ease-out 0.3s forwards; opacity: 0; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
  `}</style>
);

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────
const f = "'Plus Jakarta Sans', sans-serif";
const fSerif = "'DM Serif Display', serif";

const Badge = ({ children, color = COLORS.accent, bg }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.02em", color, background: bg || `${color}14`, fontFamily: f }}>{children}</span>
);

const StatCard = ({ label, value, change, icon, color = COLORS.accent }) => (
  <div style={{ background: COLORS.card, borderRadius: 16, padding: "20px 24px", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s ease", cursor: "default" }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={22} color={color} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 500, marginBottom: 2, fontFamily: f }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, fontFamily: fSerif, lineHeight: 1.1 }}>{value}</div>
    </div>
    {change != null && (
      <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 600, color: change > 0 ? COLORS.success : COLORS.warm }}>
        <Icon name={change > 0 ? "arrowUp" : "arrowDown"} size={14} color={change > 0 ? COLORS.success : COLORS.warm} />
        {Math.abs(change)}%
      </div>
    )}
  </div>
);

const ProgressBar = ({ value, max = 100, color = COLORS.accent, height = 8 }) => (
  <div style={{ width: "100%", height, background: `${color}15`, borderRadius: height }}>
    <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${color}, ${color}CC)`, borderRadius: height, transition: "width 0.8s ease" }} />
  </div>
);

const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 400, color: COLORS.text, fontFamily: fSerif, marginBottom: 4 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: f }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Button = ({ children, onClick, variant = "primary", size = "md", icon, style: cs = {} }) => {
  const vs = { primary: { background: COLORS.accent, color: "#fff", border: "none" }, secondary: { background: "transparent", color: COLORS.accent, border: `1.5px solid ${COLORS.accent}` }, ghost: { background: "transparent", color: COLORS.textMuted, border: "none" }, ai: { background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.accent})`, color: "#fff", border: "none" } };
  const ss = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "10px 20px", fontSize: 13 }, lg: { padding: "12px 24px", fontSize: 14 } };
  return (
    <button onClick={onClick} style={{ ...vs[variant], ...ss[size], borderRadius: 10, fontWeight: 600, cursor: "pointer", fontFamily: f, display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s ease", letterSpacing: "0.01em", ...cs }}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.opacity = "0.9"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = "1"; }}>
      {icon && <Icon name={icon} size={ss[size].fontSize} />}
      {children}
    </button>
  );
};

const TypeIcon = ({ type, size = 14 }) => {
  const map = { newsletter: { icon: "mail", color: COLORS.blue }, challenge: { icon: "trophy", color: COLORS.warm }, incentive: { icon: "gift", color: COLORS.purple }, calendar: { icon: "calendar", color: COLORS.accent }, report: { icon: "chart", color: COLORS.success } };
  const m = map[type] || map.calendar;
  return <div style={{ width: size + 12, height: size + 12, borderRadius: 6, background: `${m.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={m.icon} size={size} color={m.color} /></div>;
};

const ClientDot = ({ client }) => {
  const c = SAMPLE_CLIENTS.find(cl => cl.short === client || cl.name === client);
  return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: c?.color || COLORS.textMuted, marginRight: 6, flexShrink: 0 }} />;
};

// ─── NAV ITEMS ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "command", label: "Command Center", icon: "home" },
  { id: "benefits", label: "Benefits & Resources", icon: "shield" },
  { id: "champions", label: "Wellness Champions", icon: "users" },
  { id: "comms", label: "Communications Hub", icon: "mail" },
  { id: "timeline", label: "Cross-Client Timeline", icon: "layers" },
  { id: "calendar", label: "Wellness Calendar", icon: "calendar" },
  { id: "newsletter", label: "Newsletter Builder", icon: "mail" },
  { id: "challenges", label: "Challenges", icon: "trophy" },
  { id: "incentives", label: "Incentives", icon: "gift" },
  { id: "templates", label: "Template Library", icon: "copy" },
  { id: "activity", label: "Activity Log", icon: "activity" },
  { id: "reports", label: "Annual Reports", icon: "chart" },
  { id: "ai", label: "AI Wellness Engine", icon: "brain" },
];

// ═══════════════════════════════════════════════════════════════════════
// COMMAND CENTER (new primary dashboard)
// ═══════════════════════════════════════════════════════════════════════
const CommandCenter = ({ setActiveView }) => {
  const [tasks, setTasks] = useState(UPCOMING_TASKS);
  const [filter, setFilter] = useState("all");

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const filtered = tasks.filter(t => filter === "all" || t.type === filter).sort((a, b) => a.done - b.done);
  const urgentCount = tasks.filter(t => t.urgent && !t.done).length;
  const dueThisWeek = tasks.filter(t => !t.done && (t.due.includes("Mar 5") || t.due.includes("Mar 6") || t.due.includes("Mar 7") || t.due.includes("Mar 8"))).length;

  return (
    <div className="animate-in">
      {/* Welcome + Stats */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontFamily: fSerif, color: COLORS.text, fontWeight: 400, marginBottom: 4 }}>Good morning, Nicole</h2>
        <p style={{ fontSize: 14, color: COLORS.textMuted, fontFamily: f }}>Here's what needs your attention this week.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Due This Week" value={dueThisWeek} icon="clock" color={COLORS.warm} />
        <StatCard label="Urgent Items" value={urgentCount} icon="zap" color={COLORS.warm} />
        <StatCard label="Active Clients" value="4" icon="users" color={COLORS.accent} />
        <StatCard label="Avg. Engagement" value="67%" change={5} icon="target" color={COLORS.blue} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        {/* Task List */}
        <div style={{ background: COLORS.card, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontFamily: fSerif, color: COLORS.text }}>What's Due</h3>
            <div style={{ display: "flex", gap: 4 }}>
              {[{ key: "all", label: "All" }, { key: "newsletter", label: "Newsletters" }, { key: "challenge", label: "Challenges" }, { key: "incentive", label: "Incentives" }, { key: "calendar", label: "Calendar" }].map(f2 => (
                <button key={f2.key} onClick={() => setFilter(f2.key)} style={{ padding: "4px 12px", borderRadius: 8, border: "none", fontSize: 11, fontWeight: 600, fontFamily: f, cursor: "pointer", background: filter === f2.key ? `${COLORS.accent}15` : "transparent", color: filter === f2.key ? COLORS.accent : COLORS.textMuted, transition: "all 0.15s" }}>{f2.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 420, overflowY: "auto" }}>
            {filtered.map((task, i) => (
              <div key={task.id} onClick={() => toggleTask(task.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12,
                background: task.done ? `${COLORS.success}06` : task.urgent ? `${COLORS.warm}06` : `${COLORS.accent}03`,
                border: `1px solid ${task.done ? `${COLORS.success}20` : task.urgent ? `${COLORS.warm}20` : COLORS.border}`,
                cursor: "pointer", transition: "all 0.15s", opacity: task.done ? 0.55 : 1,
                animation: `fadeInUp 0.3s ease-out ${i * 0.03}s forwards`,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                  border: `2px solid ${task.done ? COLORS.success : COLORS.border}`,
                  background: task.done ? COLORS.success : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {task.done && <Icon name="check" size={12} color="#fff" />}
                </div>
                <TypeIcon type={task.type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: f, textDecoration: task.done ? "line-through" : "none" }}>{task.task}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <ClientDot client={task.client} />
                    <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: f }}>{task.client}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: task.urgent ? COLORS.warm : COLORS.textMuted, fontFamily: f }}>{task.due}</span>
                  {task.urgent && !task.done && <Badge color={COLORS.warm}>Urgent</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar: Quick Actions + Recent Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Quick Actions */}
          <div style={{ background: COLORS.card, borderRadius: 16, padding: 20, border: `1px solid ${COLORS.border}` }}>
            <h3 style={{ fontSize: 15, fontFamily: fSerif, color: COLORS.text, marginBottom: 14 }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Build Calendar", icon: "calendar", view: "calendar", color: COLORS.accent },
                { label: "Draft Newsletter", icon: "mail", view: "newsletter", color: COLORS.blue },
                { label: "Launch Challenge", icon: "trophy", view: "challenges", color: COLORS.warm },
                { label: "View Timeline", icon: "layers", view: "timeline", color: COLORS.purple },
                { label: "AI Strategist", icon: "brain", view: "ai", color: COLORS.purple },
              ].map(action => (
                <button key={action.label} onClick={() => setActiveView(action.view)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10,
                  background: `${action.color}06`, border: `1.5px solid ${action.color}15`,
                  cursor: "pointer", transition: "all 0.15s", fontFamily: f, width: "100%",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${action.color}12`; e.currentTarget.style.borderColor = `${action.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${action.color}06`; e.currentTarget.style.borderColor = `${action.color}15`; }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${action.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={action.icon} size={15} color={action.color} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ background: COLORS.card, borderRadius: 16, padding: 20, border: `1px solid ${COLORS.border}`, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontFamily: fSerif, color: COLORS.text }}>Recent Activity</h3>
              <button onClick={() => setActiveView("activity")} style={{ fontSize: 11, color: COLORS.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: f }}>View all</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ACTIVITY_LOG.slice(0, 5).map((item, i) => (
                <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <TypeIcon type={item.type} size={12} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, fontFamily: f }}>{item.action}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: f, display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                      <ClientDot client={item.client} />{item.client} · {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Future Vision Banner */}
      <div style={{ marginTop: 24, padding: "22px 28px", borderRadius: 16, background: `linear-gradient(135deg, ${COLORS.bgDark} 0%, #16213E 50%, ${COLORS.purple}40 100%)`, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", position: "relative", overflow: "hidden" }} onClick={() => setActiveView("ai")}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Icon name="sparkles" size={16} color={COLORS.purpleLight} />
            <Badge color={COLORS.purpleLight} bg="rgba(168,85,247,0.15)">FUTURE VISION</Badge>
          </div>
          <div style={{ fontSize: 18, fontWeight: 400, color: "#fff", fontFamily: fSerif, marginBottom: 4 }}>AI-Powered Personalized Wellness</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: f, maxWidth: 460 }}>Bridge the gap between scalable programs and individualized behavior change.</div>
        </div>
        <Button variant="ai" icon="brain" size="sm" onClick={e => { e.stopPropagation(); setActiveView("ai"); }}>Explore</Button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// BENEFITS & RESOURCES HUB (new)
// ═══════════════════════════════════════════════════════════════════════
const BenefitsHubView = () => {
  const [selectedClient, setSelectedClient] = useState("Meridian");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [showUnspotlighted, setShowUnspotlighted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const benefits = CLIENT_BENEFITS[selectedClient] || [];
  const filtered = benefits.filter(b => {
    if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
    if (themeFilter !== "all" && !b.themes.includes(themeFilter)) return false;
    if (showUnspotlighted && b.spotlighted.length > 0) return false;
    if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase()) && !b.vendor.toLowerCase().includes(searchQuery.toLowerCase()) && !b.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const clientColor = SAMPLE_CLIENTS.find(c => c.short === selectedClient)?.color || COLORS.accent;
  const totalBenefits = benefits.length;
  const spotlightedCount = benefits.filter(b => b.spotlighted.length > 0).length;
  const unspotlightedCount = totalBenefits - spotlightedCount;
  const withFlyers = benefits.filter(b => b.heyzineLink).length;

  // Smart suggestion: What fits this month's theme that hasn't been used?
  const currentMonth = "Mar";
  const currentTheme = CALENDAR_THEMES[currentMonth];
  const suggestions = benefits.filter(b => b.themes.includes(currentMonth) && b.spotlighted.filter(s => s.year === 2026).length === 0);

  return (
    <div className="animate-in">
      <SectionHeader title="Benefits & Resources Hub" subtitle="Track every client's benefits, link to assets, and know what to spotlight next" />

      {/* Client selector + stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {SAMPLE_CLIENTS.map(c => (
          <button key={c.short} onClick={() => { setSelectedClient(c.short); setCategoryFilter("all"); setThemeFilter("all"); setShowUnspotlighted(false); }} style={{
            padding: "10px 20px", borderRadius: 12, border: `2px solid ${selectedClient === c.short ? c.color : COLORS.border}`,
            background: selectedClient === c.short ? `${c.color}10` : COLORS.card,
            cursor: "pointer", transition: "all 0.15s", fontFamily: f,
            display: "flex", alignItems: "center", gap: 8,
          }}
          onMouseEnter={e => { if (selectedClient !== c.short) e.currentTarget.style.borderColor = `${c.color}60`; }}
          onMouseLeave={e => { if (selectedClient !== c.short) e.currentTarget.style.borderColor = COLORS.border; }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color }} />
            <span style={{ fontSize: 13, fontWeight: selectedClient === c.short ? 700 : 500, color: selectedClient === c.short ? c.color : COLORS.text }}>{c.short}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, background: `${COLORS.border}80`, padding: "1px 7px", borderRadius: 8 }}>{(CLIENT_BENEFITS[c.short] || []).length}</span>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <div className="animate-in"><StatCard label="Total Benefits" value={totalBenefits} icon="shield" color={clientColor} /></div>
        <div className="animate-in-delay-1"><StatCard label="Spotlighted in 2026" value={spotlightedCount} icon="eye" color={COLORS.success} /></div>
        <div className="animate-in-delay-2"><StatCard label="Not Yet Spotlighted" value={unspotlightedCount} icon="target" color={COLORS.warning} /></div>
        <div className="animate-in-delay-3"><StatCard label="Heyzine Flipbooks" value={withFlyers} icon="link" color={COLORS.blue} /></div>
      </div>

      {/* Smart Suggestion Banner */}
      {suggestions.length > 0 && (
        <div style={{ padding: "16px 22px", borderRadius: 14, background: `linear-gradient(135deg, ${currentTheme.color}08, ${currentTheme.color}15)`, border: `1.5px solid ${currentTheme.color}25`, marginBottom: 20, animation: "fadeInUp 0.4s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Icon name="sparkles" size={16} color={currentTheme.color} />
            <span style={{ fontSize: 13, fontWeight: 700, color: currentTheme.color, fontFamily: f }}>Smart Suggestion for {currentMonth} — {currentTheme.theme}</span>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: f, marginBottom: 10 }}>
            These {selectedClient} benefits match this month's theme and haven't been spotlighted yet in 2026:
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {suggestions.map(s => (
              <div key={s.id} style={{ padding: "8px 14px", borderRadius: 10, background: COLORS.card, border: `1px solid ${currentTheme.color}20`, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>{BENEFIT_CATEGORIES.find(c => c.id === s.category)?.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, fontFamily: f }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: f }}>{s.vendor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
        {/* Filters sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><Icon name="search" size={14} color={COLORS.textLight} /></div>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search benefits..." style={{
              width: "100%", padding: "10px 14px 10px 34px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`,
              fontSize: 12, fontFamily: f, outline: "none", transition: "border-color 0.2s", background: COLORS.card,
            }} onFocus={e => e.target.style.borderColor = COLORS.accent} onBlur={e => e.target.style.borderColor = COLORS.border} />
          </div>

          {/* Category filter */}
          <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: "0.04em", marginBottom: 10, fontFamily: f }}>CATEGORY</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <button onClick={() => setCategoryFilter("all")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 8, border: "none", cursor: "pointer", background: categoryFilter === "all" ? `${COLORS.accent}10` : "transparent", fontFamily: f, fontSize: 12, fontWeight: categoryFilter === "all" ? 600 : 400, color: categoryFilter === "all" ? COLORS.accent : COLORS.textMuted, textAlign: "left", width: "100%" }}>All ({totalBenefits})</button>
              {BENEFIT_CATEGORIES.filter(cat => benefits.some(b => b.category === cat.id)).map(cat => {
                const count = benefits.filter(b => b.category === cat.id).length;
                return (
                  <button key={cat.id} onClick={() => setCategoryFilter(cat.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 8, border: "none", cursor: "pointer", background: categoryFilter === cat.id ? `${cat.color}10` : "transparent", fontFamily: f, fontSize: 12, fontWeight: categoryFilter === cat.id ? 600 : 400, color: categoryFilter === cat.id ? cat.color : COLORS.textMuted, textAlign: "left", width: "100%" }}>
                    <span style={{ fontSize: 13 }}>{cat.icon}</span> {cat.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme filter */}
          <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: "0.04em", marginBottom: 10, fontFamily: f }}>MONTHLY THEME</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              <button onClick={() => setThemeFilter("all")} style={{ padding: "4px 10px", borderRadius: 8, border: `1.5px solid ${themeFilter === "all" ? COLORS.accent : COLORS.border}`, fontSize: 11, fontWeight: 600, fontFamily: f, cursor: "pointer", background: themeFilter === "all" ? `${COLORS.accent}10` : "transparent", color: themeFilter === "all" ? COLORS.accent : COLORS.textMuted }}>All</button>
              {MONTHS.map(m => (
                <button key={m} onClick={() => setThemeFilter(m)} style={{ padding: "4px 10px", borderRadius: 8, border: `1.5px solid ${themeFilter === m ? CALENDAR_THEMES[m].color : COLORS.border}`, fontSize: 11, fontWeight: 600, fontFamily: f, cursor: "pointer", background: themeFilter === m ? `${CALENDAR_THEMES[m].color}10` : "transparent", color: themeFilter === m ? CALENDAR_THEMES[m].color : COLORS.textMuted }}>{m}</button>
              ))}
            </div>
          </div>

          {/* Unspotlighted toggle */}
          <div onClick={() => setShowUnspotlighted(!showUnspotlighted)} style={{ background: COLORS.card, borderRadius: 14, padding: "14px 16px", border: `1.5px solid ${showUnspotlighted ? COLORS.warning : COLORS.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s" }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${showUnspotlighted ? COLORS.warning : COLORS.border}`, background: showUnspotlighted ? COLORS.warning : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
              {showUnspotlighted && <Icon name="check" size={12} color="#fff" />}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: showUnspotlighted ? COLORS.warning : COLORS.textMuted, fontFamily: f }}>Not yet spotlighted only</span>
          </div>
        </div>

        {/* Benefits list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}` }}>
              <Icon name="search" size={28} color={COLORS.textLight} />
              <p style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: f, marginTop: 12 }}>No benefits match your filters. Try adjusting your search or filters.</p>
            </div>
          )}
          {filtered.map((benefit, i) => {
            const cat = BENEFIT_CATEGORIES.find(c => c.id === benefit.category);
            const hasBeenSpotlighted = benefit.spotlighted.length > 0;
            const spotlightedThisYear = benefit.spotlighted.filter(s => s.year === 2026);
            return (
              <div key={benefit.id} style={{
                background: COLORS.card, borderRadius: 14, padding: "18px 22px",
                border: `1px solid ${COLORS.border}`, transition: "all 0.15s",
                animation: `fadeInUp 0.3s ease-out ${i * 0.04}s forwards`, opacity: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${cat.color}40`; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${cat.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{cat.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, fontFamily: f }}>{benefit.name}</span>
                      <Badge color={cat.color}>{cat.label}</Badge>
                      {hasBeenSpotlighted ? (
                        <Badge color={COLORS.success}>Spotlighted {spotlightedThisYear.map(s => s.month).join(", ")}</Badge>
                      ) : (
                        <Badge color={COLORS.warning}>Not yet spotlighted</Badge>
                      )}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, fontFamily: f, marginBottom: 6 }}>Vendor: {benefit.vendor}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: f, lineHeight: 1.5, marginBottom: 10 }}>{benefit.description}</div>

                    {/* Theme tags */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.textLight, fontFamily: f, letterSpacing: "0.04em" }}>BEST FOR:</span>
                      {benefit.themes.map(th => (
                        <span key={th} style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: `${CALENDAR_THEMES[th].color}12`, color: CALENDAR_THEMES[th].color, fontFamily: f }}>{th} — {CALENDAR_THEMES[th].theme.split(" ")[0]}</span>
                      ))}
                    </div>

                    {/* Asset links */}
                    <div style={{ display: "flex", gap: 8 }}>
                      {benefit.flyerLink && (
                        <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: `${COLORS.purple}08`, border: `1px solid ${COLORS.purple}15`, fontSize: 11, fontWeight: 600, color: COLORS.purple, fontFamily: f, cursor: "pointer" }}>
                          <Icon name="link" size={11} color={COLORS.purple} /> Canva Flyer
                        </div>
                      )}
                      {benefit.heyzineLink && (
                        <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: `${COLORS.blue}08`, border: `1px solid ${COLORS.blue}15`, fontSize: 11, fontWeight: 600, color: COLORS.blue, fontFamily: f, cursor: "pointer" }}>
                          <Icon name="eye" size={11} color={COLORS.blue} /> Heyzine Flipbook
                        </div>
                      )}
                      {!benefit.heyzineLink && (
                        <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, background: `${COLORS.textLight}08`, border: `1px dashed ${COLORS.textLight}30`, fontSize: 11, fontWeight: 500, color: COLORS.textLight, fontFamily: f, cursor: "pointer" }}>
                          <Icon name="plus" size={11} color={COLORS.textLight} /> Add Heyzine Link
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// WELLNESS CHAMPIONS
// ═══════════════════════════════════════════════════════════════════════
const ChampionsView = () => {
  const [selectedClient, setSelectedClient] = useState("Meridian");
  const champions = CHAMPIONS_DATA[selectedClient] || [];
  const currentMonth = "Mar";
  const currentAction = CHAMPION_MONTHLY_ACTIONS[currentMonth];

  const activeCount = champions.filter(c => c.active).length;
  const inactiveCount = champions.filter(c => !c.active).length;
  const avgCompletion = champions.length > 0 ? Math.round(champions.reduce((sum, c) => sum + (c.actionsCompleted / c.totalActions) * 100, 0) / champions.length) : 0;
  const needsCheckIn = champions.filter(c => !c.active || c.actionsCompleted === 0);

  return (
    <div className="animate-in">
      <SectionHeader title="Wellness Champions" subtitle="Track, support, and empower your champion network across clients" />

      {/* Client tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {SAMPLE_CLIENTS.map(c => (
          <button key={c.short} onClick={() => setSelectedClient(c.short)} style={{
            padding: "8px 18px", borderRadius: 10, border: `2px solid ${selectedClient === c.short ? c.color : COLORS.border}`,
            background: selectedClient === c.short ? `${c.color}10` : COLORS.card,
            cursor: "pointer", transition: "all 0.15s", fontFamily: f,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color }} />
            <span style={{ fontSize: 12, fontWeight: selectedClient === c.short ? 700 : 500, color: selectedClient === c.short ? c.color : COLORS.text }}>{c.short}</span>
            <span style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 600 }}>{(CHAMPIONS_DATA[c.short] || []).length}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard label="Active Champions" value={activeCount} icon="users" color={COLORS.accent} />
        <StatCard label="Needs Check-In" value={inactiveCount} icon="zap" color={inactiveCount > 0 ? COLORS.warm : COLORS.success} />
        <StatCard label="Avg Action Completion" value={`${avgCompletion}%`} icon="target" color={avgCompletion > 60 ? COLORS.success : COLORS.warning} />
        <StatCard label="Total Champions" value={champions.length} icon="heart" color={COLORS.purple} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Champions list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Monthly action banner */}
          <div style={{ padding: "16px 20px", borderRadius: 14, background: `${CALENDAR_THEMES[currentMonth].color}08`, border: `1.5px solid ${CALENDAR_THEMES[currentMonth].color}20` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>{CALENDAR_THEMES[currentMonth].icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: CALENDAR_THEMES[currentMonth].color, fontFamily: f }}>{currentMonth} Champion Action</span>
            </div>
            <p style={{ fontSize: 12, color: COLORS.text, fontFamily: f, lineHeight: 1.5 }}>{currentAction}</p>
          </div>

          {/* Champion cards */}
          {champions.map((champ, i) => {
            const completionPct = Math.round((champ.actionsCompleted / champ.totalActions) * 100);
            return (
              <div key={champ.id} style={{
                background: COLORS.card, borderRadius: 14, padding: "16px 20px",
                border: `1px solid ${champ.active ? COLORS.border : `${COLORS.warm}30`}`,
                opacity: champ.active ? 1 : 0.75,
                animation: `fadeInUp 0.3s ease-out ${i * 0.04}s forwards`, opacity: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: champ.active ? `${COLORS.accent}12` : `${COLORS.warm}12`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 700, color: champ.active ? COLORS.accent : COLORS.warm, fontFamily: f,
                  }}>{champ.name.split(" ").map(n => n[0]).join("")}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, fontFamily: f }}>{champ.name}</span>
                      <Badge color={champ.active ? COLORS.success : COLORS.warm}>{champ.active ? "Active" : "Inactive"}</Badge>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: f }}>{champ.department} · {champ.region} · Last action: {champ.lastAction}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: completionPct >= 66 ? COLORS.success : completionPct >= 33 ? COLORS.warning : COLORS.warm, fontFamily: fSerif }}>{champ.actionsCompleted}/{champ.totalActions}</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: f }}>Q1 actions</div>
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <ProgressBar value={completionPct} color={completionPct >= 66 ? COLORS.success : completionPct >= 33 ? COLORS.warning : COLORS.warm} height={4} />
                </div>
                {champ.notes && (
                  <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: `${COLORS.accent}04`, fontSize: 11, color: COLORS.textMuted, fontFamily: f, fontStyle: "italic" }}>
                    📝 {champ.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right panel: Actions calendar + Needs attention */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Needs attention */}
          {needsCheckIn.length > 0 && (
            <div style={{ background: COLORS.card, borderRadius: 14, padding: 18, border: `1.5px solid ${COLORS.warm}20` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <Icon name="zap" size={14} color={COLORS.warm} />
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.warm, fontFamily: f }}>Needs Attention</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {needsCheckIn.map(c => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, background: `${COLORS.warm}06` }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: `${COLORS.warm}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: COLORS.warm }}>{c.name.split(" ").map(n => n[0]).join("")}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, fontFamily: f }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: f }}>Last active: {c.lastAction}</div>
                    </div>
                    <Button variant="ghost" size="sm">Check in</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monthly actions calendar */}
          <div style={{ background: COLORS.card, borderRadius: 14, padding: 18, border: `1px solid ${COLORS.border}` }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, fontFamily: f, marginBottom: 12 }}>Monthly Actions Calendar</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 350, overflowY: "auto" }}>
              {MONTHS.map((m, i) => {
                const isCurrent = m === currentMonth;
                const isPast = i < MONTHS.indexOf(currentMonth);
                return (
                  <div key={m} style={{
                    padding: "10px 12px", borderRadius: 10,
                    background: isCurrent ? `${CALENDAR_THEMES[m].color}10` : "transparent",
                    border: isCurrent ? `1.5px solid ${CALENDAR_THEMES[m].color}30` : `1px solid transparent`,
                    opacity: isPast ? 0.5 : 1,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 12 }}>{CALENDAR_THEMES[m].icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: isCurrent ? CALENDAR_THEMES[m].color : COLORS.textMuted, fontFamily: f }}>{m}</span>
                      {isCurrent && <Badge color={CALENDAR_THEMES[m].color}>Current</Badge>}
                      {isPast && <Icon name="check" size={12} color={COLORS.success} />}
                    </div>
                    <p style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: f, lineHeight: 1.4, paddingLeft: 22 }}>{CHAMPION_MONTHLY_ACTIONS[m]}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ background: COLORS.card, borderRadius: 14, padding: 18, border: `1px solid ${COLORS.border}` }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, fontFamily: f, marginBottom: 12 }}>Champion Toolkit</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Monthly One-Pager", desc: "Ready-to-share resource for champions", icon: "copy" },
                { label: "Champion Bundle", desc: "Messaging, flyers, share-ready content", icon: "mail" },
                { label: "Quarterly Check-In Form", desc: "2-min accountability survey", icon: "check" },
                { label: "Champion Directory", desc: "\"Find Your Wellness Champion\" list", icon: "users" },
              ].map((tool, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLORS.accent}40`; e.currentTarget.style.background = `${COLORS.accent}04`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = "transparent"; }}>
                  <Icon name={tool.icon} size={14} color={COLORS.accent} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, fontFamily: f }}>{tool.label}</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: f }}>{tool.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// COMMUNICATIONS HUB
// ═══════════════════════════════════════════════════════════════════════
const CommsHubView = () => {
  const [clientFilter, setClientFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = COMMS_LOG.filter(c => {
    if (clientFilter !== "all" && c.client !== clientFilter) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const totalSent = COMMS_LOG.filter(c => c.status === "sent").length;
  const totalDrafts = COMMS_LOG.filter(c => c.status === "draft").length;
  const totalScheduled = COMMS_LOG.filter(c => c.status === "scheduled").length;
  const avgOpenRate = Math.round(COMMS_LOG.filter(c => c.opens).reduce((sum, c) => sum + c.opens, 0) / COMMS_LOG.filter(c => c.opens).length);

  const statusColors = { sent: COLORS.success, draft: COLORS.warning, scheduled: COLORS.blue };
  const statusLabels = { sent: "Sent", draft: "Draft", scheduled: "Scheduled" };

  // Weekly calendar view data
  const currentWeekComms = [
    { day: "Mon", items: [{ type: "weekly", client: "Meridian", status: "sent" }, { type: "weekly", client: "TechVault", status: "sent" }] },
    { day: "Tue", items: [{ type: "newsletter", client: "Meridian", status: "draft" }] },
    { day: "Wed", items: [{ type: "biweekly", client: "Summit", status: "scheduled" }, { type: "newsletter", client: "TechVault", status: "scheduled" }] },
    { day: "Thu", items: [] },
    { day: "Fri", items: [{ type: "newsletter", client: "Summit", status: "draft" }, { type: "icymi", client: "Meridian", status: "draft" }] },
  ];

  return (
    <div className="animate-in">
      <SectionHeader title="Communications Hub" subtitle="Plan, track, and manage all wellness communications across clients and types"
        action={<Button variant="ai" icon="sparkles" size="sm">AI Draft</Button>} />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard label="Sent This Month" value={totalSent} icon="check" color={COLORS.success} />
        <StatCard label="Drafts" value={totalDrafts} icon="mail" color={COLORS.warning} />
        <StatCard label="Scheduled" value={totalScheduled} icon="clock" color={COLORS.blue} />
        <StatCard label="Avg Opens (sent)" value={avgOpenRate} icon="eye" color={COLORS.accent} />
      </div>

      {/* Weekly send calendar */}
      <div style={{ background: COLORS.card, borderRadius: 16, padding: 22, border: `1px solid ${COLORS.border}`, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontFamily: fSerif, color: COLORS.text, marginBottom: 14 }}>This Week's Send Calendar</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {currentWeekComms.map((day, di) => (
            <div key={di} style={{ padding: "12px", borderRadius: 12, background: `${COLORS.accent}03`, border: `1px solid ${COLORS.border}`, minHeight: 100 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: di === 0 ? COLORS.accent : COLORS.textMuted, fontFamily: f, marginBottom: 8, letterSpacing: "0.04em" }}>
                {day.day} {di === 0 && <span style={{ fontSize: 9, color: COLORS.accent }}>TODAY</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {day.items.length === 0 && <span style={{ fontSize: 10, color: COLORS.textLight, fontFamily: f, fontStyle: "italic" }}>No sends</span>}
                {day.items.map((item, ii) => {
                  const ct = COMMS_TYPES.find(t => t.id === item.type);
                  return (
                    <div key={ii} style={{
                      padding: "5px 8px", borderRadius: 6,
                      background: `${ct.color}10`, border: `1px solid ${ct.color}20`,
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      <ClientDot client={item.client} />
                      <span style={{ fontSize: 9, fontWeight: 600, color: ct.color, fontFamily: f, flex: 1 }}>{ct.label.split(" ")[0]}</span>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: statusColors[item.status] }} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
        {/* Filters + Comm types */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Communication Types reference */}
          <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: "0.04em", marginBottom: 10, fontFamily: f }}>COMM TYPES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {COMMS_TYPES.map(ct => (
                <button key={ct.id} onClick={() => setTypeFilter(typeFilter === ct.id ? "all" : ct.id)} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8,
                  border: "none", cursor: "pointer", textAlign: "left", width: "100%",
                  background: typeFilter === ct.id ? `${ct.color}10` : "transparent",
                  fontFamily: f, transition: "all 0.15s",
                }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: `${ct.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={ct.icon} size={12} color={ct.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: typeFilter === ct.id ? ct.color : COLORS.text }}>{ct.label}</div>
                    <div style={{ fontSize: 9, color: COLORS.textLight }}>{ct.cadence}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Client filter */}
          <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: "0.04em", marginBottom: 10, fontFamily: f }}>CLIENT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <button onClick={() => setClientFilter("all")} style={{ padding: "6px 8px", borderRadius: 8, border: "none", cursor: "pointer", background: clientFilter === "all" ? `${COLORS.accent}10` : "transparent", fontFamily: f, fontSize: 12, fontWeight: clientFilter === "all" ? 600 : 400, color: clientFilter === "all" ? COLORS.accent : COLORS.textMuted, textAlign: "left", width: "100%" }}>All Clients</button>
              {SAMPLE_CLIENTS.map(c => (
                <button key={c.short} onClick={() => setClientFilter(c.short)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 8, border: "none", cursor: "pointer", background: clientFilter === c.short ? `${c.color}10` : "transparent", fontFamily: f, fontSize: 12, fontWeight: clientFilter === c.short ? 600 : 400, color: clientFilter === c.short ? c.color : COLORS.textMuted, textAlign: "left", width: "100%" }}>
                  <ClientDot client={c.short} />{c.short}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div style={{ background: COLORS.card, borderRadius: 14, padding: 16, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, letterSpacing: "0.04em", marginBottom: 10, fontFamily: f }}>STATUS</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["all", "sent", "draft", "scheduled"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "5px 12px", borderRadius: 8, border: `1.5px solid ${statusFilter === s ? (statusColors[s] || COLORS.accent) : COLORS.border}`, fontSize: 11, fontWeight: 600, fontFamily: f, cursor: "pointer", background: statusFilter === s ? `${statusColors[s] || COLORS.accent}10` : "transparent", color: statusFilter === s ? (statusColors[s] || COLORS.accent) : COLORS.textMuted, textTransform: "capitalize" }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Email template guide */}
          <div style={{ padding: "14px 16px", borderRadius: 14, background: `${COLORS.accent}04`, border: `1px dashed ${COLORS.accent}20` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent, fontFamily: f, marginBottom: 6 }}>Weekly Email Template</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: f, lineHeight: 1.5 }}>
              1. Hero image + CTA{"\n"}
              2. "This Week in Wellness"{"\n"}
              3. Monthly highlights{"\n"}
              4. ICYMI recap{"\n"}
              5. Contact info
            </div>
          </div>
        </div>

        {/* Communications log */}
        <div style={{ background: COLORS.card, borderRadius: 16, padding: 22, border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontFamily: fSerif, color: COLORS.text }}>All Communications</h3>
            <Button variant="primary" icon="plus" size="sm">New Email</Button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {filtered.map((comm, i) => {
              const ct = COMMS_TYPES.find(t => t.id === comm.type);
              return (
                <div key={comm.id} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
                  borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  animation: `fadeInUp 0.3s ease-out ${i * 0.03}s forwards`, opacity: 0,
                  cursor: "pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${COLORS.accent}02`}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${ct.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={ct.icon} size={14} color={ct.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: f, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{comm.subject}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                      <ClientDot client={comm.client} />
                      <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: f }}>{comm.client}</span>
                      <span style={{ fontSize: 10, color: COLORS.textLight }}>·</span>
                      <span style={{ fontSize: 11, color: ct.color, fontWeight: 500, fontFamily: f }}>{ct.label}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    {comm.opens != null && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, fontFamily: f }}>{comm.opens}</div>
                        <div style={{ fontSize: 9, color: COLORS.textLight, fontFamily: f }}>opens</div>
                      </div>
                    )}
                    {comm.clicks != null && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent, fontFamily: f }}>{comm.clicks}</div>
                        <div style={{ fontSize: 9, color: COLORS.textLight, fontFamily: f }}>clicks</div>
                      </div>
                    )}
                    <Badge color={statusColors[comm.status]}>{statusLabels[comm.status]}</Badge>
                    <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: f, minWidth: 45, textAlign: "right" }}>{comm.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CROSS-CLIENT TIMELINE
// ═══════════════════════════════════════════════════════════════════════
const TimelineView = () => {
  const [selectedMonth, setSelectedMonth] = useState(2); // March = index 2

  // Generate timeline events per client per month
  const getEventsForClient = (clientId, monthIdx) => {
    const events = [];
    const m = MONTHS[monthIdx];
    // Every client has a newsletter
    events.push({ type: "newsletter", label: `${m} Newsletter`, week: monthIdx % 2 === 0 ? 1 : 2 });
    // Some have challenges
    if ((clientId + monthIdx) % 3 !== 0) events.push({ type: "challenge", label: CHALLENGE_TEMPLATES[(clientId + monthIdx) % 6].name, week: 1 });
    // Some have incentive milestones
    if (monthIdx % 3 === 0 || monthIdx % 3 === 2) events.push({ type: "incentive", label: `Q${Math.ceil((monthIdx + 1) / 3)} Distribution`, week: 3 });
    // Calendar events
    events.push({ type: "calendar", label: `${m} Webinar`, week: 3 });
    return events;
  };

  const typeColors = { newsletter: COLORS.blue, challenge: COLORS.warm, incentive: COLORS.purple, calendar: COLORS.accent, report: COLORS.success };

  return (
    <div className="animate-in">
      <SectionHeader title="Cross-Client Timeline" subtitle="See everything happening across all clients at a glance" />

      {/* Month selector */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, padding: "4px", background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, width: "fit-content" }}>
        {MONTHS.map((m, i) => (
          <button key={m} onClick={() => setSelectedMonth(i)} style={{
            padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: selectedMonth === i ? 700 : 500,
            fontFamily: f, cursor: "pointer", transition: "all 0.15s",
            background: selectedMonth === i ? COLORS.accent : "transparent",
            color: selectedMonth === i ? "#fff" : COLORS.textMuted,
          }}>{m}</button>
        ))}
      </div>

      {/* Timeline grid */}
      <div style={{ background: COLORS.card, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 22 }}>{CALENDAR_THEMES[MONTHS[selectedMonth]].icon}</span>
          <div>
            <h3 style={{ fontSize: 18, fontFamily: fSerif, color: COLORS.text }}>{FULL_MONTHS[selectedMonth]} — {CALENDAR_THEMES[MONTHS[selectedMonth]].theme}</h3>
          </div>
        </div>

        {/* Week headers */}
        <div style={{ display: "grid", gridTemplateColumns: "140px repeat(4, 1fr)", gap: 0, marginBottom: 8 }}>
          <div />
          {[1, 2, 3, 4].map(w => (
            <div key={w} style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, fontFamily: f, letterSpacing: "0.04em", padding: "0 8px" }}>WEEK {w}</div>
          ))}
        </div>

        {/* Client rows */}
        {SAMPLE_CLIENTS.map((client, ci) => {
          const events = getEventsForClient(client.id, selectedMonth);
          return (
            <div key={client.id} style={{
              display: "grid", gridTemplateColumns: "140px repeat(4, 1fr)", gap: 0,
              padding: "14px 0", borderTop: ci > 0 ? `1px solid ${COLORS.border}` : "none",
              animation: `fadeInUp 0.3s ease-out ${ci * 0.06}s forwards`, opacity: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: client.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: f }}>{client.short}</span>
              </div>
              {[1, 2, 3, 4].map(week => {
                const weekEvents = events.filter(e => e.week === week);
                return (
                  <div key={week} style={{ padding: "0 4px", display: "flex", flexDirection: "column", gap: 4 }}>
                    {weekEvents.map((ev, ei) => (
                      <div key={ei} style={{
                        padding: "6px 10px", borderRadius: 8,
                        background: `${typeColors[ev.type]}08`, border: `1px solid ${typeColors[ev.type]}20`,
                        fontSize: 11, fontWeight: 500, color: typeColors[ev.type], fontFamily: f,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {ev.label}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${COLORS.border}` }}>
          {Object.entries(typeColors).map(([type, color]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: `${color}30`, border: `1px solid ${color}50` }} />
              <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: f, textTransform: "capitalize" }}>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE LIBRARY (new)
// ═══════════════════════════════════════════════════════════════════════
const TemplatesView = () => {
  const [filterType, setFilterType] = useState("all");
  const filtered = SAVED_TEMPLATES.filter(t => filterType === "all" || t.type === filterType);

  return (
    <div className="animate-in">
      <SectionHeader title="Template Library" subtitle="Save, reuse, and adapt content across clients — build once, use everywhere"
        action={<Button variant="primary" icon="plus" size="sm">Save New Template</Button>} />

      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {[{ key: "all", label: "All" }, { key: "newsletter", label: "Newsletters" }, { key: "challenge", label: "Challenges" }, { key: "calendar", label: "Calendars" }, { key: "incentive", label: "Incentives" }, { key: "report", label: "Reports" }].map(f2 => (
          <button key={f2.key} onClick={() => setFilterType(f2.key)} style={{ padding: "6px 16px", borderRadius: 10, border: `1.5px solid ${filterType === f2.key ? COLORS.accent : COLORS.border}`, fontSize: 12, fontWeight: 600, fontFamily: f, cursor: "pointer", background: filterType === f2.key ? `${COLORS.accent}10` : COLORS.card, color: filterType === f2.key ? COLORS.accent : COLORS.textMuted, transition: "all 0.15s" }}>{f2.label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {filtered.map((tpl, i) => (
          <div key={tpl.id} style={{
            background: COLORS.card, borderRadius: 14, padding: "20px 22px",
            border: `1px solid ${COLORS.border}`, transition: "all 0.15s", cursor: "pointer",
            animation: `fadeInUp 0.3s ease-out ${i * 0.06}s forwards`, opacity: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLORS.accent}40`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.05)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <TypeIcon type={tpl.type} size={16} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, fontFamily: f, marginBottom: 4 }}>{tpl.name}</div>
                <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                  <Badge color={COLORS.textMuted}>{tpl.type}</Badge>
                  <Badge color={SAMPLE_CLIENTS.find(c => c.short === tpl.client)?.color || COLORS.textMuted}>Origin: {tpl.client}</Badge>
                  <Badge color={COLORS.textLight}>Created {tpl.created}</Badge>
                </div>
                {tpl.usedBy.length > 0 && (
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: f, display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
                    <Icon name="copy" size={11} color={COLORS.textMuted} />
                    Adapted for: {tpl.usedBy.join(", ")}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6 }}>
                  <Button variant="primary" size="sm" icon="copy">Use for Client</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insight banner */}
      <div style={{ marginTop: 20, padding: "16px 22px", borderRadius: 12, background: `${COLORS.accent}06`, border: `1px dashed ${COLORS.accent}25`, display: "flex", alignItems: "center", gap: 12 }}>
        <Icon name="sparkles" size={18} color={COLORS.accent} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: f }}>Template insight</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: f }}>Your March Nutrition Newsletter has been adapted for 2 other clients. Newsletters built from templates save an average of 45 minutes per client.</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ACTIVITY LOG (new)
// ═══════════════════════════════════════════════════════════════════════
const ActivityLogView = () => {
  const [clientFilter, setClientFilter] = useState("all");
  const filtered = ACTIVITY_LOG.filter(a => clientFilter === "all" || a.client === clientFilter);

  return (
    <div className="animate-in">
      <SectionHeader title="Client Activity Log" subtitle="Everything that's been sent, launched, and completed — your single source of truth" />

      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {[{ key: "all", label: "All Clients" }, ...SAMPLE_CLIENTS.map(c => ({ key: c.short, label: c.short }))].map(f2 => (
          <button key={f2.key} onClick={() => setClientFilter(f2.key === "all" ? "all" : f2.key)} style={{
            padding: "6px 16px", borderRadius: 10, border: `1.5px solid ${clientFilter === f2.key ? COLORS.accent : COLORS.border}`,
            fontSize: 12, fontWeight: 600, fontFamily: f, cursor: "pointer",
            background: clientFilter === f2.key ? `${COLORS.accent}10` : COLORS.card,
            color: clientFilter === f2.key ? COLORS.accent : COLORS.textMuted, transition: "all 0.15s",
          }}>{f2.label}</button>
        ))}
      </div>

      <div style={{ background: COLORS.card, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {filtered.map((item, i) => (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "16px 0",
              borderBottom: i < filtered.length - 1 ? `1px solid ${COLORS.border}` : "none",
              animation: `fadeInUp 0.3s ease-out ${i * 0.04}s forwards`, opacity: 0,
            }}>
              <TypeIcon type={item.type} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, fontFamily: f }}>{item.action}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: f, marginTop: 2 }}>{item.detail}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <ClientDot client={item.client} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, fontFamily: f }}>{item.client}</span>
                </div>
                <span style={{ fontSize: 11, color: COLORS.textLight, fontFamily: f, minWidth: 50, textAlign: "right" }}>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CALENDAR VIEW (kept from v1)
// ═══════════════════════════════════════════════════════════════════════
const CalendarView = () => {
  const [selectedClient, setSelectedClient] = useState(SAMPLE_CLIENTS[0]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  return (
    <div className="animate-in">
      <SectionHeader title="Annual Wellness Calendar" subtitle="Plan and customize monthly wellness themes for each client"
        action={<select value={selectedClient.id} onChange={e => setSelectedClient(SAMPLE_CLIENTS.find(c => c.id === +e.target.value))} style={{ padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, fontSize: 13, fontFamily: f, fontWeight: 500, color: COLORS.text, background: COLORS.card, cursor: "pointer", outline: "none" }}>
          {SAMPLE_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {MONTHS.map((month, i) => {
          const theme = CALENDAR_THEMES[month];
          const isSelected = selectedMonth === month;
          return (
            <div key={month} onClick={() => setSelectedMonth(isSelected ? null : month)} style={{
              background: isSelected ? `${theme.color}10` : COLORS.card, borderRadius: 14, padding: "18px 20px",
              border: `1.5px solid ${isSelected ? theme.color : COLORS.border}`, cursor: "pointer", transition: "all 0.2s ease",
              animation: `fadeInUp 0.4s ease-out ${i * 0.04}s forwards`, opacity: 0,
            }}
            onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = `${theme.color}60`; e.currentTarget.style.transform = "translateY(-2px)"; }}}
            onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; }}}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: theme.color, fontFamily: f, letterSpacing: "0.04em" }}>{month.toUpperCase()}</span>
                <span style={{ fontSize: 20 }}>{theme.icon}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: f, marginBottom: 6, lineHeight: 1.3 }}>{theme.theme}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {["Newsletter", "Challenge", "Webinar"].slice(0, i % 3 + 1).map(item => <Badge key={item} color={theme.color}>{item}</Badge>)}
              </div>
            </div>
          );
        })}
      </div>

      {selectedMonth && (
        <div style={{ background: COLORS.card, borderRadius: 16, padding: 28, border: `1.5px solid ${CALENDAR_THEMES[selectedMonth].color}30`, animation: "fadeInUp 0.3s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>{CALENDAR_THEMES[selectedMonth].icon}</span>
            <div>
              <h3 style={{ fontSize: 18, fontFamily: fSerif, color: COLORS.text }}>{selectedMonth} — {CALENDAR_THEMES[selectedMonth].theme}</h3>
              <p style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: f }}>for {selectedClient.name}</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { week: "Week 1", activity: "Theme kickoff email + poster", type: "Communication" },
              { week: "Week 2", activity: "Interactive wellness activity", type: "Engagement" },
              { week: "Week 3", activity: "Lunch & Learn webinar", type: "Education" },
              { week: "Week 4", activity: "Challenge wrap-up + newsletter", type: "Summary" },
            ].map(item => (
              <div key={item.week} style={{ padding: "16px 18px", borderRadius: 12, background: `${CALENDAR_THEMES[selectedMonth].color}08`, border: `1px solid ${CALENDAR_THEMES[selectedMonth].color}15` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: CALENDAR_THEMES[selectedMonth].color, marginBottom: 6, fontFamily: f, letterSpacing: "0.04em" }}>{item.week}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: f, marginBottom: 4 }}>{item.activity}</div>
                <Badge color={CALENDAR_THEMES[selectedMonth].color}>{item.type}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// NEWSLETTER BUILDER (kept from v1)
// ═══════════════════════════════════════════════════════════════════════
const NewsletterView = () => {
  const [selectedSections, setSelectedSections] = useState(["spotlight", "activity", "recipe"]);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("Mar");

  const toggleSection = (id) => setSelectedSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const generateNewsletter = async () => {
    setGenerating(true); setGeneratedContent(null);
    try {
      const theme = CALENDAR_THEMES[selectedMonth];
      const sections = selectedSections.map(id => NEWSLETTER_SECTIONS.find(s => s.id === id)?.label).join(", ");
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `You are a corporate wellness newsletter writer. Generate a brief, engaging wellness newsletter for the month of ${selectedMonth} with the theme "${theme.theme}". Include these sections: ${sections}. For the Interactive Activity section, include a specific hands-on wellness activity employees can do at their desk or during a break. Keep each section to 2-3 sentences. Format as JSON with keys matching these section IDs: ${selectedSections.join(", ")}. Each value should be an object with "title" and "content" keys. Return ONLY valid JSON, no markdown or backticks.` }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      setGeneratedContent(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch { setGeneratedContent({ error: "Preview mode — AI content generation available when connected." }); }
    setGenerating(false);
  };

  return (
    <div className="animate-in">
      <SectionHeader title="Newsletter Builder" subtitle="Design custom wellness newsletters with integrated activities" />
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: COLORS.card, borderRadius: 16, padding: 20, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: f, marginBottom: 12 }}>Month & Theme</div>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, fontSize: 13, fontFamily: f, fontWeight: 500, color: COLORS.text, background: COLORS.card, cursor: "pointer", outline: "none", marginBottom: 8 }}>
              {MONTHS.map(m => <option key={m} value={m}>{m} — {CALENDAR_THEMES[m].theme}</option>)}
            </select>
            <div style={{ padding: "10px 14px", borderRadius: 10, background: `${CALENDAR_THEMES[selectedMonth].color}10`, fontSize: 12, color: CALENDAR_THEMES[selectedMonth].color, fontWeight: 500, fontFamily: f }}>
              {CALENDAR_THEMES[selectedMonth].icon} {CALENDAR_THEMES[selectedMonth].theme}
            </div>
          </div>
          <div style={{ background: COLORS.card, borderRadius: 16, padding: 20, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: f, marginBottom: 12 }}>Sections</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {NEWSLETTER_SECTIONS.map(section => (
                <div key={section.id} onClick={() => toggleSection(section.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", transition: "all 0.15s ease", background: selectedSections.includes(section.id) ? `${COLORS.accent}08` : "transparent", border: `1.5px solid ${selectedSections.includes(section.id) ? `${COLORS.accent}30` : "transparent"}` }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${selectedSections.includes(section.id) ? COLORS.accent : COLORS.border}`, background: selectedSections.includes(section.id) ? COLORS.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease" }}>
                    {selectedSections.includes(section.id) && <Icon name="check" size={12} color="#fff" />}
                  </div>
                  <span style={{ fontSize: 14 }}>{section.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.text, fontFamily: f }}>{section.label}</span>
                </div>
              ))}
            </div>
          </div>
          <Button variant="ai" icon="sparkles" onClick={generateNewsletter} style={{ width: "100%", justifyContent: "center", padding: "14px 20px" }}>
            {generating ? "Generating..." : "Generate with AI"}
          </Button>
        </div>

        <div style={{ background: COLORS.card, borderRadius: 16, padding: 32, border: `1px solid ${COLORS.border}`, minHeight: 500 }}>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <div style={{ background: `linear-gradient(135deg, ${CALENDAR_THEMES[selectedMonth].color}, ${CALENDAR_THEMES[selectedMonth].color}CC)`, borderRadius: 14, padding: "28px 24px", marginBottom: 24, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.1em", fontFamily: f, marginBottom: 6 }}>MONTHLY WELLNESS</div>
              <div style={{ fontSize: 24, fontWeight: 400, color: "#fff", fontFamily: fSerif }}>{CALENDAR_THEMES[selectedMonth].theme}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: f, marginTop: 6 }}>{selectedMonth} 2026</div>
            </div>
            {generating && <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 48, gap: 16 }}><div style={{ animation: "spin 1s linear infinite" }}><Icon name="loader" size={28} color={COLORS.accent} /></div><div style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: f }}>AI is drafting your newsletter...</div></div>}
            {!generating && !generatedContent && <div style={{ padding: "48px 24px", textAlign: "center" }}><Icon name="mail" size={32} color={COLORS.textLight} /><p style={{ fontSize: 14, color: COLORS.textMuted, fontFamily: f, marginTop: 12 }}>Select your sections and click "Generate with AI" to preview</p></div>}
            {!generating && generatedContent && !generatedContent.error && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {selectedSections.map(sId => {
                  const s = NEWSLETTER_SECTIONS.find(s2 => s2.id === sId); const c = generatedContent[sId];
                  if (!c) return null;
                  return (<div key={sId} style={{ padding: "18px 20px", borderRadius: 12, border: `1px solid ${COLORS.border}`, background: `${COLORS.accent}03`, animation: "fadeInUp 0.3s ease-out" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><span style={{ fontSize: 16 }}>{s.icon}</span><span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, fontFamily: f }}>{c.title || s.label}</span></div>
                    <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, fontFamily: f }}>{c.content}</p>
                  </div>);
                })}
              </div>
            )}
            {!generating && generatedContent?.error && <div style={{ padding: 24, textAlign: "center", background: `${COLORS.warm}08`, borderRadius: 12, border: `1px solid ${COLORS.warm}20` }}><p style={{ fontSize: 13, color: COLORS.warm, fontFamily: f }}>{generatedContent.error}</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CHALLENGES, INCENTIVES, REPORTS (kept from v1, condensed)
// ═══════════════════════════════════════════════════════════════════════
const ChallengesView = () => {
  const activeChallenges = [
    { ...CHALLENGE_TEMPLATES[0], client: "Meridian Health", participants: 342, progress: 68, status: "active" },
    { ...CHALLENGE_TEMPLATES[4], client: "Greenleaf Mfg", participants: 891, progress: 45, status: "active" },
    { ...CHALLENGE_TEMPLATES[2], client: "TechVault", participants: 156, progress: 82, status: "ending" },
  ];
  return (
    <div className="animate-in">
      <SectionHeader title="Wellness Challenges" subtitle="Create, manage, and track wellness challenges across clients" action={<Button variant="primary" icon="plus" size="sm">New Challenge</Button>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {activeChallenges.map((ch, i) => (
          <div key={i} style={{ background: COLORS.card, borderRadius: 16, padding: 22, border: `1px solid ${COLORS.border}`, animation: `fadeInUp 0.4s ease-out ${i * 0.1}s forwards`, opacity: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <Badge color={ch.status === "ending" ? COLORS.warm : COLORS.success}>{ch.status === "ending" ? "Ending Soon" : "Active"}</Badge>
              <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: f }}>{ch.duration}</span>
            </div>
            <h3 style={{ fontSize: 16, fontFamily: fSerif, color: COLORS.text, marginBottom: 4 }}>{ch.name}</h3>
            <p style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: f, marginBottom: 14 }}>{ch.client} · {ch.participants} participants</p>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: f, marginBottom: 6 }}>
                <span style={{ color: COLORS.textMuted }}>Progress</span><span style={{ fontWeight: 600, color: COLORS.text }}>{ch.progress}%</span>
              </div>
              <ProgressBar value={ch.progress} color={ch.status === "ending" ? COLORS.warm : COLORS.accent} />
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 14 }}><Badge color={COLORS.blue}>{ch.type}</Badge><Badge color={COLORS.textMuted}>{ch.difficulty}</Badge></div>
          </div>
        ))}
      </div>
      <div style={{ background: COLORS.card, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}` }}>
        <SectionHeader title="Challenge Templates" subtitle="Pre-built challenges ready to customize and launch" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {CHALLENGE_TEMPLATES.map((t, i) => (
            <div key={i} style={{ padding: "16px 18px", borderRadius: 12, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", gap: 8, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLORS.accent}40`; e.currentTarget.style.background = `${COLORS.accent}05`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = "transparent"; }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, fontFamily: f }}>{t.name}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><Badge color={COLORS.blue}>{t.type}</Badge><Badge color={COLORS.textMuted}>{t.duration}</Badge></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: f }}>Avg. engagement:</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.engagement > 65 ? COLORS.success : COLORS.warning, fontFamily: f }}>{t.engagement}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const IncentivesView = () => {
  const progs = [
    { client: "Meridian Health", budget: 50000, spent: 32400, model: "Points-based", rewards: "Gift cards, PTO hours, HSA contributions", rate: 74 },
    { client: "TechVault Solutions", budget: 18000, spent: 11200, model: "Completion-based", rewards: "Premium reduction, Wellness credits", rate: 62 },
    { client: "Summit Financial", budget: 35000, spent: 19800, model: "Tiered", rewards: "Cash incentives, Gym memberships", rate: 58 },
    { client: "Greenleaf Mfg", budget: 72000, spent: 48600, model: "Points-based", rewards: "Gift cards, Merch store, PTO", rate: 69 },
  ];
  return (
    <div className="animate-in">
      <SectionHeader title="Incentive Management" subtitle="Design, track, and distribute wellness incentives" action={<Button variant="primary" icon="plus" size="sm">New Program</Button>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Budget (All Clients)" value="$175K" icon="gift" color={COLORS.purple} />
        <StatCard label="Total Distributed YTD" value="$112K" change={14} icon="chart" color={COLORS.accent} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {progs.map((p, i) => (
          <div key={i} style={{ background: COLORS.card, borderRadius: 16, padding: "20px 24px", border: `1px solid ${COLORS.border}`, animation: `fadeInUp 0.4s ease-out ${i * 0.08}s forwards`, opacity: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 16, fontFamily: fSerif, color: COLORS.text }}>{p.client}</h3>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}><Badge color={COLORS.purple}>{p.model}</Badge><Badge color={COLORS.textMuted}>{p.rate}% participation</Badge></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, fontFamily: fSerif }}>${(p.spent / 1000).toFixed(1)}K</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: f }}>of ${(p.budget / 1000).toFixed(0)}K budget</div>
              </div>
            </div>
            <ProgressBar value={p.spent} max={p.budget} color={p.spent / p.budget > 0.8 ? COLORS.warm : COLORS.accent} height={6} />
            <div style={{ marginTop: 10, fontSize: 12, color: COLORS.textMuted, fontFamily: f }}><strong style={{ color: COLORS.text }}>Rewards:</strong> {p.rewards}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReportsView = () => {
  const groups = [
    { category: "Participation", metrics: [
      { name: "Overall Participation Rate", value: "67%", trend: 5, benchmark: "Industry avg: 52%" },
      { name: "Challenge Completion Rate", value: "58%", trend: 12, benchmark: "Industry avg: 41%" },
      { name: "Newsletter Open Rate", value: "44%", trend: -2, benchmark: "Industry avg: 38%" },
      { name: "Repeat Participants", value: "72%", trend: 8, benchmark: "Industry avg: 55%" },
    ]},
    { category: "Health Outcomes", metrics: [
      { name: "Biometric Screening Completion", value: "81%", trend: 3, benchmark: "Target: 80%" },
      { name: "Self-Reported Wellbeing Score", value: "7.2/10", trend: 4, benchmark: "Baseline: 6.4" },
      { name: "Stress Management Awareness", value: "89%", trend: 11, benchmark: "Pre-program: 62%" },
    ]},
    { category: "Financial Impact", metrics: [
      { name: "Cost per Participant", value: "$48", trend: -8, benchmark: "Target: <$60" },
      { name: "Estimated Claims Reduction", value: "3.2%", trend: 6, benchmark: "Industry: 1-5%" },
      { name: "ROI Estimate", value: "2.4:1", trend: 15, benchmark: "Breakeven: 1:1" },
    ]},
  ];
  return (
    <div className="animate-in">
      <SectionHeader title="Annual Wellness Reports" subtitle="Comprehensive program analytics and outcomes reporting" action={<Button variant="primary" icon="chart" size="sm">Generate Report</Button>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ background: COLORS.card, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}`, animation: `fadeInUp 0.4s ease-out ${gi * 0.1}s forwards`, opacity: 0 }}>
            <h3 style={{ fontSize: 16, fontFamily: fSerif, color: COLORS.text, marginBottom: 16 }}>{g.category}</h3>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${g.metrics.length}, 1fr)`, gap: 14 }}>
              {g.metrics.map((m, mi) => (
                <div key={mi} style={{ padding: "16px 18px", borderRadius: 12, background: `${COLORS.accent}04`, border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: f, marginBottom: 8 }}>{m.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, fontFamily: fSerif }}>{m.value}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 600, color: m.trend > 0 ? COLORS.success : COLORS.warm }}>
                      <Icon name={m.trend > 0 ? "arrowUp" : "arrowDown"} size={12} color={m.trend > 0 ? COLORS.success : COLORS.warm} />{Math.abs(m.trend)}%
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textLight, fontFamily: f, marginTop: 6 }}>{m.benchmark}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// AI WELLNESS ENGINE
// ═══════════════════════════════════════════════════════════════════════
const AIWellnessView = () => {
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI Wellness Strategist. I can help you design personalized wellness programming that bridges the gap between scalable corporate programs and individualized behavior change.\n\nTry asking me about:\n• Personalizing a challenge for different employee segments\n• Evidence-based approaches for a specific health topic\n• Designing a behavior change nudge sequence\n• Analyzing what's working vs. what's not" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim(); setInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You are an AI Wellness Strategist embedded in WellSync Pro. You help wellness program managers design more effective, evidence-based, personalized wellness programming for corporate clients.

Your expertise: evidence-based behavior change (COM-B model, habit formation, nudge theory), corporate wellness program design, AI-powered personalization at scale, the gap between standard corporate wellness and truly individualized approaches, translating academic research into practical programming.

You're talking to Nicole, a Wellness Program Manager at Gallagher who manages wellness calendars, newsletters with integrated activities, wellness challenges, incentive programs, and annual reports for corporate clients. She's interested in bridging the gap between scalable but generic programs and high-touch individualized approaches.

Be concise (2-3 paragraphs max), practical, and forward-thinking. Use specific examples. When relevant, suggest how AI could enhance the approach.`,
          messages: chatMessages.filter(m => m.role !== "assistant" || chatMessages.indexOf(m) !== 0).concat([{ role: "user", content: userMsg }]).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("") || "I'd love to help with that. Could you tell me more?";
      setChatMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch { setChatMessages(prev => [...prev, { role: "assistant", content: "I'm here to help with wellness strategy! In the full version, I'd provide evidence-based recommendations tailored to your specific clients. Try asking about personalization, behavior change frameworks, or program optimization." }]); }
    setIsLoading(false);
  };

  const spectrumData = [
    { label: "Standard Corporate\nWellness", scale: "High Scale", touch: "Low Touch", examples: "Newsletters, webinars, generic challenges", color: COLORS.blue },
    { label: "Enhanced\nProgramming", scale: "Med Scale", touch: "Med Touch", examples: "Segmented comms, targeted challenges", color: COLORS.accent },
    { label: "AI-Personalized\nWellness", scale: "High Scale", touch: "High Touch", examples: "Adaptive programs, AI coaching, nudges", color: COLORS.purple },
    { label: "1:1 Individualized\nCoaching", scale: "Low Scale", touch: "High Touch", examples: "Personal coaches, custom plans", color: COLORS.warm },
  ];

  return (
    <div className="animate-in">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.accent})`, display: "flex", alignItems: "center", justifyContent: "center", animation: "breathe 3s ease-in-out infinite" }}>
          <Icon name="brain" size={22} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: 22, fontFamily: fSerif, color: COLORS.text }}>AI Wellness Engine</h2>
          <p style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: f }}>The future of personalized corporate wellbeing at scale</p>
        </div>
        <Badge color={COLORS.purple} bg={`${COLORS.purple}15`}>FUTURE VISION</Badge>
      </div>

      {/* Spectrum */}
      <div style={{ background: COLORS.card, borderRadius: 16, padding: 28, marginBottom: 24, border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ fontSize: 15, fontFamily: fSerif, color: COLORS.text, marginBottom: 4 }}>The Wellness Personalization Spectrum</h3>
        <p style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: f, marginBottom: 20 }}>AI bridges the gap between scalable programs and individualized care</p>
        <div style={{ position: "relative", padding: "0 12px" }}>
          <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.accent}, ${COLORS.purple}, ${COLORS.warm})`, marginBottom: 20 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {spectrumData.map((p, i) => (
              <div key={i} style={{ padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${p.color}30`, background: `${p.color}06`, textAlign: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, margin: "-22px auto 10px", border: "3px solid #fff", boxShadow: `0 0 0 2px ${p.color}40` }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: p.color, fontFamily: f, whiteSpace: "pre-line", lineHeight: 1.3, marginBottom: 6 }}>{p.label}</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: f, marginBottom: 4 }}>{p.scale} · {p.touch}</div>
                <div style={{ fontSize: 10, color: COLORS.textLight, fontFamily: f, lineHeight: 1.4 }}>{p.examples}</div>
              </div>
            ))}
          </div>
          <div style={{ margin: "16px auto 0", padding: "10px 18px", borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.purple}10, ${COLORS.accent}10)`, border: `1px dashed ${COLORS.purple}30`, textAlign: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: f }}><span style={{ color: COLORS.purple }}>AI is the bridge</span><span style={{ color: COLORS.textMuted }}> — delivering high-touch personalization at high-scale cost efficiency</span></span>
          </div>
        </div>
      </div>

      {/* Chat + Capabilities */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "target", title: "Smart Segmentation", desc: "Auto-segment employees by health risk, interests, and engagement patterns", color: COLORS.accent },
            { icon: "zap", title: "Adaptive Nudges", desc: "AI-timed micro-interventions based on individual behavior data", color: COLORS.warm },
            { icon: "heart", title: "Personal Coaching", desc: "Scalable AI coaching that adapts tone, content, and cadence per person", color: COLORS.purple },
            { icon: "chart", title: "Predictive Analytics", desc: "Forecast engagement drop-off and intervene proactively", color: COLORS.blue },
          ].map((cap, i) => (
            <div key={i} style={{ background: COLORS.card, borderRadius: 14, padding: "16px 18px", border: `1px solid ${COLORS.border}`, animation: `slideInLeft 0.4s ease-out ${i * 0.08}s forwards`, opacity: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${cap.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={cap.icon} size={16} color={cap.color} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, fontFamily: f }}>{cap.title}</span>
              </div>
              <p style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: f, lineHeight: 1.5, paddingLeft: 42 }}>{cap.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", height: 420 }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.success, animation: "breathe 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: f }}>AI Wellness Strategist</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", animation: "fadeIn 0.3s ease-out" }}>
                <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: 14, background: msg.role === "user" ? COLORS.accent : `${COLORS.accent}08`, color: msg.role === "user" ? "#fff" : COLORS.text, fontSize: 13, lineHeight: 1.6, fontFamily: f, whiteSpace: "pre-wrap", borderBottomRightRadius: msg.role === "user" ? 4 : 14, borderBottomLeftRadius: msg.role === "user" ? 14 : 4 }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && <div style={{ display: "flex", gap: 6, padding: "12px 16px" }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, animation: `dotPulse 1.4s ease-in-out ${i * 0.16}s infinite` }} />)}</div>}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Ask about wellness strategy, personalization, behavior change..." style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, fontSize: 13, fontFamily: f, outline: "none", transition: "border-color 0.2s" }} onFocus={e => e.target.style.borderColor = COLORS.accent} onBlur={e => e.target.style.borderColor = COLORS.border} />
            <button onClick={sendMessage} disabled={isLoading} style={{ width: 40, height: 40, borderRadius: 10, background: input.trim() ? COLORS.accent : COLORS.border, border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
              <Icon name="send" size={16} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
export default function WellSyncPro() {
  const [activeView, setActiveView] = useState("command");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const views = {
    command: <CommandCenter setActiveView={setActiveView} />,
    benefits: <BenefitsHubView />,
    champions: <ChampionsView />,
    comms: <CommsHubView />,
    timeline: <TimelineView />,
    calendar: <CalendarView />,
    newsletter: <NewsletterView />,
    challenges: <ChallengesView />,
    incentives: <IncentivesView />,
    templates: <TemplatesView />,
    activity: <ActivityLogView />,
    reports: <ReportsView />,
    ai: <AIWellnessView />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: COLORS.bg, fontFamily: f, overflow: "hidden" }}>
      <GlobalStyles />

      {/* Sidebar */}
      <div style={{ width: sidebarCollapsed ? 68 : 240, minWidth: sidebarCollapsed ? 68 : 240, background: COLORS.bgDark, padding: sidebarCollapsed ? "24px 10px" : "24px 16px", display: "flex", flexDirection: "column", transition: "all 0.3s ease", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, cursor: "pointer", padding: sidebarCollapsed ? "0 4px" : "0 8px" }} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="heart" size={18} color="#fff" />
          </div>
          {!sidebarCollapsed && <div><div style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: fSerif, lineHeight: 1.1 }}>WellSync</div><div style={{ fontSize: 9, fontWeight: 600, color: COLORS.accentLight, letterSpacing: "0.12em" }}>PRO</div></div>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            const isAI = item.id === "ai";
            const isNew = item.id === "command" || item.id === "timeline" || item.id === "templates" || item.id === "activity" || item.id === "benefits" || item.id === "champions" || item.id === "comms";
            return (
              <div key={item.id}>
                {isAI && <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 8px" }} />}
                <button onClick={() => setActiveView(item.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: sidebarCollapsed ? "10px" : "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: isActive ? (isAI ? `linear-gradient(135deg, ${COLORS.purple}30, ${COLORS.accent}30)` : "rgba(255,255,255,0.08)") : "transparent",
                  transition: "all 0.15s", justifyContent: sidebarCollapsed ? "center" : "flex-start",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                  <Icon name={item.icon} size={18} color={isActive ? (isAI ? COLORS.purpleLight : COLORS.accentLight) : "rgba(255,255,255,0.4)"} />
                  {!sidebarCollapsed && (
                    <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: f, whiteSpace: "nowrap", flex: 1, textAlign: "left" }}>{item.label}</span>
                  )}
                  {!sidebarCollapsed && isAI && <Badge color={COLORS.purpleLight} bg="rgba(168,85,247,0.15)">AI</Badge>}
                  {!sidebarCollapsed && isNew && !isAI && <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accentLight, flexShrink: 0 }} />}
                </button>
              </div>
            );
          })}
        </div>

        {!sidebarCollapsed && (
          <div style={{ padding: "14px 12px", borderRadius: 12, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${COLORS.warm}, ${COLORS.warmLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>N</div>
            <div><div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Nicole</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Wellness Program Mgr</div></div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontFamily: fSerif, color: COLORS.text, fontWeight: 400 }}>
            {NAV_ITEMS.find(n => n.id === activeView)?.label || "Command Center"}
          </h1>
          <select style={{ padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.border}`, fontSize: 12, fontFamily: f, fontWeight: 500, color: COLORS.text, background: COLORS.card, cursor: "pointer", outline: "none" }}>
            <option>All Clients</option>
            {SAMPLE_CLIENTS.map(c => <option key={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div key={activeView}>{views[activeView]}</div>
      </div>
    </div>
  );
}
