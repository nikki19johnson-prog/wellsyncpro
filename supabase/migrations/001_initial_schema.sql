-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── CLIENTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  short       TEXT NOT NULL,
  employees   INT  NOT NULL,
  tier        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'active',
  color       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TASKS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  task        TEXT    NOT NULL,
  client      TEXT    NOT NULL,
  type        TEXT    NOT NULL,
  due         TEXT    NOT NULL,
  urgent      BOOLEAN NOT NULL DEFAULT FALSE,
  done        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CHAMPIONS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS champions (
  id                TEXT PRIMARY KEY,
  client            TEXT    NOT NULL,
  name              TEXT    NOT NULL,
  department        TEXT    NOT NULL,
  region            TEXT    NOT NULL,
  active            BOOLEAN NOT NULL DEFAULT TRUE,
  last_action       TEXT,
  actions_completed INT     NOT NULL DEFAULT 0,
  total_actions     INT     NOT NULL DEFAULT 3,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── COMMUNICATIONS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS communications (
  id          SERIAL PRIMARY KEY,
  type        TEXT NOT NULL,
  client      TEXT NOT NULL,
  subject     TEXT NOT NULL,
  date        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'draft',
  opens       INT,
  clicks      INT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BENEFITS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS benefits (
  id            TEXT PRIMARY KEY,
  client        TEXT  NOT NULL,
  name          TEXT  NOT NULL,
  category      TEXT  NOT NULL,
  vendor        TEXT  NOT NULL,
  description   TEXT  NOT NULL,
  flyer_link    TEXT,
  heyzine_link  TEXT,
  themes        TEXT[] DEFAULT '{}',
  spotlighted   JSONB  DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ACTIVITY LOGS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id          SERIAL PRIMARY KEY,
  client      TEXT NOT NULL,
  action      TEXT NOT NULL,
  detail      TEXT NOT NULL,
  date        TEXT NOT NULL,
  type        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TEMPLATES ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS templates (
  id          SERIAL PRIMARY KEY,
  name        TEXT   NOT NULL,
  type        TEXT   NOT NULL,
  client      TEXT   NOT NULL,
  created     TEXT   NOT NULL,
  used_by     TEXT[] DEFAULT '{}',
  sections    TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE clients         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE champions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefits        ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates       ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access to all tables
CREATE POLICY "Authenticated users can read clients"
  ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can modify clients"
  ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read tasks"
  ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can modify tasks"
  ON tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read champions"
  ON champions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can modify champions"
  ON champions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read communications"
  ON communications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can modify communications"
  ON communications FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read benefits"
  ON benefits FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can modify benefits"
  ON benefits FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read activity_logs"
  ON activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can modify activity_logs"
  ON activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read templates"
  ON templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can modify templates"
  ON templates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── SEED DATA ─────────────────────────────────────────────────────────────

-- Clients
INSERT INTO clients (name, short, employees, tier, status, color) VALUES
  ('Meridian Health Systems', 'Meridian',  2400, 'Premium',    'active', '#2D6A4F'),
  ('TechVault Solutions',     'TechVault', 850,  'Standard',   'active', '#0077B6'),
  ('Summit Financial Group',  'Summit',    1200, 'Premium',    'active', '#7B2D8E'),
  ('Greenleaf Manufacturing', 'Greenleaf', 3100, 'Enterprise', 'active', '#E76F51')
ON CONFLICT DO NOTHING;

-- Tasks
INSERT INTO tasks (task, client, type, due, urgent, done) VALUES
  ('Send March newsletter',          'Meridian',    'newsletter', 'Mar 5',  true,  false),
  ('Launch Step Challenge',          'Greenleaf',   'challenge',  'Mar 7',  true,  false),
  ('Send March newsletter',          'TechVault',   'newsletter', 'Mar 8',  false, false),
  ('Q1 incentive distribution',      'Summit',      'incentive',  'Mar 10', false, false),
  ('Send March newsletter',          'Summit',      'newsletter', 'Mar 10', false, false),
  ('Mindfulness challenge wrap-up',  'TechVault',   'challenge',  'Mar 12', false, false),
  ('Review Q1 engagement data',      'All Clients', 'report',     'Mar 15', false, false),
  ('April calendar finalization',    'Meridian',    'calendar',   'Mar 20', false, false),
  ('April calendar finalization',    'TechVault',   'calendar',   'Mar 20', false, false),
  ('April calendar finalization',    'Greenleaf',   'calendar',   'Mar 22', false, false),
  ('Send March newsletter',          'Greenleaf',   'newsletter', 'Mar 6',  true,  false),
  ('Q1 incentive distribution',      'Meridian',    'incentive',  'Mar 14', false, false)
ON CONFLICT DO NOTHING;

-- Champions
INSERT INTO champions (id, client, name, department, region, active, last_action, actions_completed, total_actions, notes) VALUES
  ('mc1', 'Meridian',  'Sarah L.',  'Operations', 'Midwest',   true,  'Feb', 2, 3, 'Very engaged, runs team walking groups'),
  ('mc2', 'Meridian',  'David K.',  'Finance',    'Northeast', true,  'Feb', 3, 3, 'Shared EAP resources with entire floor'),
  ('mc3', 'Meridian',  'Priya M.',  'Engineering','West',      true,  'Jan', 1, 3, 'New champion, still ramping up'),
  ('mc4', 'Meridian',  'James T.',  'HR',         'Midwest',   false, 'Nov', 0, 3, 'Has gone quiet — needs check-in'),
  ('mc5', 'Meridian',  'Maria G.',  'Marketing',  'Southeast', true,  'Feb', 2, 3, 'Created team gratitude board in breakroom'),
  ('tc1', 'TechVault', 'Alex W.',   'Product',    'Remote',    true,  'Feb', 3, 3, 'Superstar — leads virtual meditation breaks'),
  ('tc2', 'TechVault', 'Jordan P.', 'Sales',      'West',      true,  'Feb', 2, 3, 'Great at Slack engagement'),
  ('tc3', 'TechVault', 'Kai N.',    'Engineering','Remote',    true,  'Jan', 1, 3, 'Quiet but consistent'),
  ('sc1', 'Summit',    'Rachel F.', 'Compliance', 'Northeast', true,  'Feb', 2, 3, 'Connected wellness to compliance training'),
  ('sc2', 'Summit',    'Tom B.',    'Advisory',   'Midwest',   true,  'Feb', 3, 3, 'Most vocal champion, great energy'),
  ('sc3', 'Summit',    'Lisa C.',   'Operations', 'Southeast', false, 'Dec', 0, 3, 'Role change — may need to transition'),
  ('gc1', 'Greenleaf', 'Miguel R.', 'Plant Floor','Midwest',   true,  'Feb', 2, 3, 'Bridges office & plant floor wellness'),
  ('gc2', 'Greenleaf', 'Donna H.',  'Safety',     'Midwest',   true,  'Feb', 3, 3, 'Integrates wellness into safety huddles'),
  ('gc3', 'Greenleaf', 'Chris J.',  'Shipping',   'Southeast', true,  'Jan', 1, 3, 'Night shift — needs adjusted comms'),
  ('gc4', 'Greenleaf', 'Angela S.', 'Admin',      'Midwest',   true,  'Feb', 2, 3, 'Organizes monthly potlucks'),
  ('gc5', 'Greenleaf', 'Derek M.',  'Maintenance','Midwest',   false, 'Oct', 0, 3, 'Disengaged — needs 1:1 outreach'),
  ('gc6', 'Greenleaf', 'Yuki T.',   'Quality',    'West',      true,  'Feb', 3, 3, 'Runs bilingual wellness comms for team')
ON CONFLICT (id) DO NOTHING;

-- Communications
INSERT INTO communications (type, client, subject, date, status, opens, clicks) VALUES
  ('weekly',    'Meridian', 'This Week: Nutrition Kickoff + Mindful Movement',       'Mar 3', 'sent',      412,  89),
  ('weekly',    'TechVault','This Week: Headspace Challenge + Sleep Webinar',         'Mar 3', 'sent',      198,  42),
  ('biweekly',  'Meridian', 'Did You Know? Your Noom Benefit is Fully Covered',       'Mar 1', 'sent',      389,  134),
  ('newsletter','Greenleaf','March Wellness: Nutrition & Nourishment',                'Mar 1', 'sent',      1245, 312),
  ('icymi',     'Meridian', 'ICYMI: Heart Health Webinar Recap + Recording',          'Feb 28','sent',      267,  98),
  ('champion',  'Meridian', 'March Champion Bundle: Nutrition Theme',                 'Feb 28','sent',      5,    5),
  ('weekly',    'Greenleaf','This Week: Team Walking War Update + March Preview',      'Mar 3', 'sent',      876,  201),
  ('newsletter','Meridian', 'March Wellness: Nutrition & Nourishment',                'Mar 4', 'draft',     NULL, NULL),
  ('biweekly',  'Summit',   'Spotlight: Omada Digital Health for Diabetes Prevention','Mar 5', 'scheduled', NULL, NULL),
  ('weekly',    'Summit',   'This Week: Financial Fundamentals Q1 Session',           'Mar 3', 'sent',      302,  67),
  ('newsletter','TechVault','March Wellness: Nutrition & Nourishment',                'Mar 5', 'scheduled', NULL, NULL),
  ('newsletter','Summit',   'March Wellness: Nutrition & Nourishment',                'Mar 7', 'draft',     NULL, NULL)
ON CONFLICT DO NOTHING;

-- Benefits — Meridian
INSERT INTO benefits (id, client, name, category, vendor, description, flyer_link, heyzine_link, themes, spotlighted) VALUES
  ('m1','Meridian','ComPsych GuidanceResources','eap','ComPsych',
   '24/7 EAP with 8 free counseling sessions, legal/financial consults, work-life balance resources',
   'canva.com/design/meridian-eap-flyer','heyzine.com/flip/meridian-eap',
   ARRAY['Jan','Apr','May','Sep'],'[{"month":"Jan","year":2026}]'),
  ('m2','Meridian','Teladoc Virtual Care','telehealth','Teladoc',
   '24/7 virtual doctor visits, dermatology, mental health, $0 copay',
   'canva.com/design/meridian-teladoc','heyzine.com/flip/meridian-teladoc',
   ARRAY['Feb','Jun','Aug'],'[{"month":"Feb","year":2026}]'),
  ('m3','Meridian','Peloton Corporate Wellness','fitness','Peloton',
   'Discounted Peloton App membership for all employees, group challenges available',
   'canva.com/design/meridian-peloton','',
   ARRAY['Jan','Jun','Aug'],'[]'),
  ('m4','Meridian','Noom Weight Management','nutrition','Noom',
   'Subsidized Noom membership for employees with BMI >30 or pre-diabetes',
   'canva.com/design/meridian-noom','heyzine.com/flip/meridian-noom',
   ARRAY['Mar','Jul'],'[]'),
  ('m5','Meridian','SmartDollar Financial Program','financial','Ramsey Solutions',
   'Full financial wellness platform — budgeting, debt payoff, retirement planning',
   'canva.com/design/meridian-smartdollar','heyzine.com/flip/meridian-smartdollar',
   ARRAY['Nov','Jan'],'[]'),
  ('m6','Meridian','Livongo Diabetes Management','chronic','Livongo/Teladoc',
   'Connected glucose meter, coaching, unlimited strips for enrolled diabetics',
   'canva.com/design/meridian-livongo','',
   ARRAY['Mar','Nov'],'[]'),
  ('m7','Meridian','Annual Biometric Screening','prevention','Quest Diagnostics',
   'On-site or at-home biometric screening — lipids, glucose, BMI, blood pressure',
   'canva.com/design/meridian-biometric','heyzine.com/flip/meridian-biometric',
   ARRAY['Feb','Oct'],'[{"month":"Feb","year":2026}]'),
  ('m8','Meridian','Quit For Life Tobacco Program','tobacco','Optum',
   'Free 12-week coaching + nicotine replacement therapy',
   'canva.com/design/meridian-quitforlife','',
   ARRAY['Jan','Nov'],'[]')
ON CONFLICT (id) DO NOTHING;

-- Benefits — TechVault
INSERT INTO benefits (id, client, name, category, vendor, description, flyer_link, heyzine_link, themes, spotlighted) VALUES
  ('t1','TechVault','Lyra Health EAP','eap','Lyra Health',
   '12 free therapy sessions, coaching, self-care apps, family support',
   'canva.com/design/techvault-lyra','heyzine.com/flip/tv-lyra',
   ARRAY['Apr','May','Sep'],'[{"month":"Jan","year":2026}]'),
  ('t2','TechVault','Headspace for Work','mental','Headspace',
   'Full Headspace membership — meditation, sleep, focus exercises',
   'canva.com/design/techvault-headspace','heyzine.com/flip/tv-headspace',
   ARRAY['Apr','May','Sep','Dec'],'[{"month":"Feb","year":2026}]'),
  ('t3','TechVault','ClassPass Corporate','fitness','ClassPass',
   'Monthly credits for gym, yoga, Pilates, cycling across partner studios',
   'canva.com/design/techvault-classpass','',
   ARRAY['Jan','Jun','Aug'],'[]'),
  ('t4','TechVault','Origin Financial Coaching','financial','Origin',
   '1:1 financial planning sessions, student loan assistance, equity compensation guidance',
   'canva.com/design/techvault-origin','heyzine.com/flip/tv-origin',
   ARRAY['Nov','Jan'],'[]'),
  ('t5','TechVault','Maven Family Planning','family','Maven',
   'Fertility, maternity, postpartum, and pediatric virtual care',
   'canva.com/design/techvault-maven','heyzine.com/flip/tv-maven',
   ARRAY['May','Feb'],'[]'),
  ('t6','TechVault','Spring Health Therapy','mental','Spring Health',
   'Therapy matching, medication management, Moments self-care app',
   'canva.com/design/techvault-spring','',
   ARRAY['Apr','May','Sep'],'[]')
ON CONFLICT (id) DO NOTHING;

-- Benefits — Summit
INSERT INTO benefits (id, client, name, category, vendor, description, flyer_link, heyzine_link, themes, spotlighted) VALUES
  ('s1','Summit','LifeWorks EAP','eap','LifeWorks/TELUS',
   '6 counseling sessions, manager support, crisis intervention, iCBT programs',
   'canva.com/design/summit-lifeworks','heyzine.com/flip/summit-lw',
   ARRAY['Apr','May','Sep'],'[]'),
  ('s2','Summit','Omada Chronic Care','chronic','Omada Health',
   'Digital prevention for diabetes, hypertension, MSK — coaching + connected devices',
   'canva.com/design/summit-omada','heyzine.com/flip/summit-omada',
   ARRAY['Feb','Mar','Oct'],'[{"month":"Feb","year":2026}]'),
  ('s3','Summit','Virgin Pulse Platform','fitness','Virgin Pulse',
   'Activity tracking, healthy habit challenges, device sync, rewards points',
   'canva.com/design/summit-vp','heyzine.com/flip/summit-vp',
   ARRAY['Jan','Jun','Aug'],'[{"month":"Jan","year":2026}]'),
  ('s4','Summit','Fidelity Financial Wellness','financial','Fidelity',
   'Retirement planning tools, HSA education, investment guidance',
   'canva.com/design/summit-fidelity','',
   ARRAY['Nov','Jan'],'[]'),
  ('s5','Summit','Hinge Health MSK','chronic','Hinge Health',
   'Digital physical therapy for back, knee, hip, shoulder pain — sensors + coaching',
   'canva.com/design/summit-hinge','heyzine.com/flip/summit-hinge',
   ARRAY['Jun','Aug'],'[]')
ON CONFLICT (id) DO NOTHING;

-- Benefits — Greenleaf
INSERT INTO benefits (id, client, name, category, vendor, description, flyer_link, heyzine_link, themes, spotlighted) VALUES
  ('g1','Greenleaf','Beacon Health EAP','eap','Beacon Health',
   '5 counseling sessions, substance abuse support, critical incident debriefing',
   'canva.com/design/greenleaf-beacon','heyzine.com/flip/gl-beacon',
   ARRAY['Apr','May','Sep'],'[{"month":"Jan","year":2026}]'),
  ('g2','Greenleaf','MDLive Telehealth','telehealth','MDLive',
   'Virtual urgent care, behavioral health, dermatology — available 24/7',
   'canva.com/design/greenleaf-mdlive','',
   ARRAY['Feb','Jun','Aug'],'[]'),
  ('g3','Greenleaf','Wellhub (formerly Gympass)','fitness','Wellhub',
   'Tiered gym/studio access starting at $9.99/mo, includes wellness apps',
   'canva.com/design/greenleaf-wellhub','heyzine.com/flip/gl-wellhub',
   ARRAY['Jan','Jun','Aug'],'[{"month":"Feb","year":2026}]'),
  ('g4','Greenleaf','Quit Genius Tobacco/Substance','tobacco','Quit Genius',
   'CBT-based app for tobacco, alcohol, and opioid use — coaching included',
   'canva.com/design/greenleaf-qg','',
   ARRAY['Jan','Nov'],'[]'),
  ('g5','Greenleaf','Progyny Fertility Benefits','family','Progyny',
   'Fertility treatment coverage, smart cycles, dedicated patient care advocate',
   'canva.com/design/greenleaf-progyny','heyzine.com/flip/gl-progyny',
   ARRAY['May','Feb'],'[]'),
  ('g6','Greenleaf','Carrot Pregnancy & Postpartum','family','Carrot Fertility',
   'Pregnancy, postpartum, and menopause support — virtual care + reimbursement',
   'canva.com/design/greenleaf-carrot','',
   ARRAY['May','Feb','Oct'],'[]'),
  ('g7','Greenleaf','Real Appeal Weight Management','nutrition','UnitedHealthcare',
   'Online weight loss program with coaching, food scale, activity tracker',
   'canva.com/design/greenleaf-realappeal','heyzine.com/flip/gl-realappeal',
   ARRAY['Mar','Jan','Jul'],'[]'),
  ('g8','Greenleaf','On-Site Health Clinic','prevention','CareATC',
   'Free on-site clinic for primary care, labs, medications — open to employees + dependents',
   'canva.com/design/greenleaf-onsite','heyzine.com/flip/gl-clinic',
   ARRAY['Feb','Jun','Oct'],'[{"month":"Jan","year":2026}]')
ON CONFLICT (id) DO NOTHING;

-- Activity Logs
INSERT INTO activity_logs (client, action, detail, date, type) VALUES
  ('Meridian', 'Newsletter sent',       'February — Heart Health & Connection',         'Feb 28', 'newsletter'),
  ('TechVault','Newsletter sent',       'February — Heart Health & Connection',         'Feb 27', 'newsletter'),
  ('Greenleaf','Challenge launched',    'Team Walking War — 891 enrolled',              'Feb 24', 'challenge'),
  ('Summit',   'Incentive distributed', 'Q1 wellness credits — $4,200',                 'Feb 22', 'incentive'),
  ('Meridian', 'Challenge completed',   'Hydration Habit Builder — 68% completion',     'Feb 20', 'challenge'),
  ('Greenleaf','Newsletter sent',       'February — Heart Health & Connection',         'Feb 19', 'newsletter'),
  ('TechVault','Challenge launched',    'Mindfulness Minutes — 156 enrolled',           'Feb 17', 'challenge'),
  ('Summit',   'Newsletter sent',       'February — Heart Health & Connection',         'Feb 15', 'newsletter'),
  ('Meridian', 'Webinar hosted',        'Heart-Healthy Cooking — 312 attendees',        'Feb 12', 'calendar'),
  ('Greenleaf','Incentive distributed', 'February wellness gift cards — $8,100',        'Feb 10', 'incentive')
ON CONFLICT DO NOTHING;

-- Templates
INSERT INTO templates (name, type, client, created, used_by, sections) VALUES
  ('March Nutrition Newsletter',    'newsletter', 'Meridian',    'Mar 2025', ARRAY['TechVault','Summit'], ARRAY['spotlight','recipe','activity']),
  ('30-Day Step Challenge Config',  'challenge',  'Greenleaf',   'Jan 2025', ARRAY['Meridian'],           ARRAY[]::TEXT[]),
  ('Q1 Engagement Report Template', 'report',     'All Clients', 'Apr 2025', ARRAY[]::TEXT[],             ARRAY[]::TEXT[]),
  ('Mindfulness Month Calendar',    'calendar',   'TechVault',   'Apr 2025', ARRAY['Summit'],             ARRAY[]::TEXT[]),
  ('Points-Based Incentive Structure','incentive','Meridian',    'Jan 2025', ARRAY['Greenleaf'],          ARRAY[]::TEXT[])
ON CONFLICT DO NOTHING;
