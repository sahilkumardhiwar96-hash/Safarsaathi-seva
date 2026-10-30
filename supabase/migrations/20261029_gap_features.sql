-- =============================================================================
-- Suraksha – GAP Features Migration
-- Gaps: Childcare, Schooling Transfer, Protection Alert, Journey Continuity
-- =============================================================================

-- ----------------------------------------
-- GAP 1: Childcare Finder
-- Extend childcare_directory service_type to include creche and daycare
-- ----------------------------------------

-- If using Postgres enums, alter the type. If using CHECK constraints, update them.
-- Using a safe conditional approach:

DO $$
BEGIN
  -- Add creche to service_type CHECK if constraint exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'childcare_directory' AND constraint_type = 'CHECK'
  ) THEN
    ALTER TABLE childcare_directory DROP CONSTRAINT IF EXISTS childcare_directory_service_type_check;
    ALTER TABLE childcare_directory ADD CONSTRAINT childcare_directory_service_type_check
      CHECK (service_type IN ('anganwadi', 'school', 'health', 'shelter', 'counselling', 'creche', 'daycare', 'other'));
  END IF;
END;
$$;

-- Seed creche/daycare entries
INSERT INTO childcare_directory (name, service_type, district, address, contact_phone, languages, is_active)
VALUES
  ('Asha Bal Griha Creche – Bargarh',        'creche',  'Bargarh',    'Labour Colony, Near Mandi, Bargarh',               '+91-6646-231456', ARRAY['Odia','Hindi'],   true),
  ('Sunflower Mobile Creche – Khurda',       'creche',  'Khurda',     'Near Construction Site NH-16, Bhubaneswar',        '+91-674-2665544',  ARRAY['Odia','Telugu'],  true),
  ('Cuttack ICDS Daycare – Sector 5',        'daycare', 'Cuttack',    'Sector 5 Community Hall, CDA, Cuttack',            '+91-671-2456789',  ARRAY['Odia'],           true),
  ('Bolangir Creche for Seasonal Workers',   'creche',  'Bolangir',   'Adjacent Brick Kiln Area, Patnagarh Road',         '+91-6652-233210', ARRAY['Odia','Hindi'],   true),
  ('Subarnapur Anganwadi Plus Creche',       'creche',  'Subarnapur', 'Village Welfare Centre, Sonepur',                  '+91-6653-225501', ARRAY['Odia'],           true)
ON CONFLICT DO NOTHING;


-- ----------------------------------------
-- GAP 2: School Transfer Record
-- Add transfer-related fields to schooling_records
-- ----------------------------------------

ALTER TABLE schooling_records
  ADD COLUMN IF NOT EXISTS destination_school       TEXT,
  ADD COLUMN IF NOT EXISTS destination_district     TEXT,
  ADD COLUMN IF NOT EXISTS destination_state        TEXT,
  ADD COLUMN IF NOT EXISTS transfer_certificate_issued  BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS transfer_certificate_date    DATE,
  ADD COLUMN IF NOT EXISTS last_known_district      TEXT,
  ADD COLUMN IF NOT EXISTS last_known_state         TEXT;

COMMENT ON COLUMN schooling_records.destination_school IS 'School the child will enroll at after migration';
COMMENT ON COLUMN schooling_records.transfer_certificate_issued IS 'Whether the origin school has issued the TC (Transfer Certificate)';
COMMENT ON COLUMN schooling_records.transfer_certificate_date IS 'Date TC was issued by origin school';
COMMENT ON COLUMN schooling_records.last_known_district IS 'District where the child was last enrolled';
COMMENT ON COLUMN schooling_records.last_known_state IS 'State where the child was last enrolled';


-- ----------------------------------------
-- GAP 3: Protection Alert – Case Transfer tracking
-- Add case_transferred and receiving_officer to migration_events
-- ----------------------------------------

ALTER TABLE migration_events
  ADD COLUMN IF NOT EXISTS case_transferred    BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS receiving_officer   TEXT;

COMMENT ON COLUMN migration_events.case_transferred IS 'Whether the protection case has been formally transferred to the destination district officer';
COMMENT ON COLUMN migration_events.receiving_officer IS 'Name and designation of the officer receiving the case at destination';


-- ----------------------------------------
-- GAP 4: Cross-state Journey Continuity
-- Add from_state / to_state to migration_events
-- ----------------------------------------

ALTER TABLE migration_events
  ADD COLUMN IF NOT EXISTS from_state  TEXT,
  ADD COLUMN IF NOT EXISTS to_state    TEXT;

COMMENT ON COLUMN migration_events.from_state IS 'State of origin for inter-state migrations';
COMMENT ON COLUMN migration_events.to_state IS 'Destination state for inter-state migrations';


-- ----------------------------------------
-- Indexes for alert query performance
-- ----------------------------------------

CREATE INDEX IF NOT EXISTS idx_migration_events_child_date
  ON migration_events (child_id, event_date);

CREATE INDEX IF NOT EXISTS idx_migration_events_case_transferred
  ON migration_events (case_transferred, event_date);

CREATE INDEX IF NOT EXISTS idx_children_risk_level
  ON children (risk_level);
