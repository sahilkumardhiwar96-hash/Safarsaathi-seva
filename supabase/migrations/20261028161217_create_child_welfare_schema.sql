/*
# Child Welfare Case Management Schema

## Overview
Creates the core database tables for a child welfare case management platform
tracking children across childcare centers, health records, protection cases,
location handoffs, and consent management.

## New Tables
1. `centers` — Childcare institutions/facilities where children are placed
   - id, name, type (cci/aftercare/community), district, capacity, contact_phone, status, created_at
2. `children` — Central child registry
   - id, full_name, date_of_birth, gender, photo_url, district, status (active/in_care/reunified/transferred),
     risk_level (low/medium/high/critical), center_id (FK), guardian_name, guardian_phone,
     admission_date, notes, created_at, updated_at
3. `health_records` — Health and nutrition tracking per child
   - id, child_id (FK), record_date, height_cm, weight_kg, muac_cm (mid-upper arm circumference),
     bmi, nutritional_status (normal/mild_moderate_acute/severe_acute),
     immunization_status, medical_notes, recorded_by, created_at
4. `case_notes` — Protection / case management notes
   - id, child_id (FK), note_date, category (protection/education/family/medical/other),
     priority (low/medium/high/urgent), body, author, status (open/in_progress/resolved),
     created_at, updated_at
5. `handoffs` — Location handoff / transfer records between centers or to family
   - id, child_id (FK), handoff_date, from_center_id, to_center_id, handoff_type (transfer/reunification/temporary),
     reason, receiving_person, receiving_contact, status (pending/completed/cancelled),
     initiated_by, completed_by, notes, created_at
6. `consents` — Consent records for services / treatment / data sharing
   - id, child_id (FK), consent_type (medical/data_sharing/photography/admission/transfer),
     given_by (guardian/child/self), giver_name, giver_relationship, is_granted, consent_date,
     expiry_date, witness_name, notes, created_at

## Security
- RLS enabled on ALL tables.
- Grants to `anon` + `authenticated` for all CRUD (single-tenant, no-auth app — data is intentionally shared).
- Policies use `USING (true)` / `WITH CHECK (true)` because there is no user isolation requirement.

## Notes
- All tables use `gen_random_uuid()` for primary keys.
- Foreign keys have ON DELETE CASCADE where appropriate to prevent orphaned records.
- Indexes on frequently-queried foreign keys.
*/

-- Centers table
CREATE TABLE IF NOT EXISTS centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'cci' CHECK (type IN ('cci', 'aftercare', 'community', 'shelter')),
  district text NOT NULL,
  capacity integer DEFAULT 0,
  contact_phone text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'at_capacity')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON centers TO anon, authenticated;
DROP POLICY IF EXISTS "anon_select_centers" ON centers;
CREATE POLICY "anon_select_centers" ON centers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_centers" ON centers;
CREATE POLICY "anon_insert_centers" ON centers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_centers" ON centers;
CREATE POLICY "anon_update_centers" ON centers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_centers" ON centers;
CREATE POLICY "anon_delete_centers" ON centers FOR DELETE TO anon, authenticated USING (true);

-- Children table
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  photo_url text,
  district text NOT NULL,
  status text NOT NULL DEFAULT 'in_care' CHECK (status IN ('active', 'in_care', 'reunified', 'transferred', 'closed')),
  risk_level text NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  center_id uuid REFERENCES centers(id) ON DELETE SET NULL,
  guardian_name text,
  guardian_phone text,
  admission_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON children TO anon, authenticated;
DROP POLICY IF EXISTS "anon_select_children" ON children;
CREATE POLICY "anon_select_children" ON children FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_children" ON children;
CREATE POLICY "anon_insert_children" ON children FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_children" ON children;
CREATE POLICY "anon_update_children" ON children FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_children" ON children;
CREATE POLICY "anon_delete_children" ON children FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_children_center_id ON children(center_id);
CREATE INDEX IF NOT EXISTS idx_children_status ON children(status);
CREATE INDEX IF NOT EXISTS idx_children_risk_level ON children(risk_level);

-- Health records table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  record_date date NOT NULL DEFAULT CURRENT_DATE,
  height_cm numeric,
  weight_kg numeric,
  muac_cm numeric,
  bmi numeric,
  nutritional_status text CHECK (nutritional_status IN ('normal', 'mild_moderate_acute', 'severe_acute')),
  immunization_status text DEFAULT 'up_to_date' CHECK (immunization_status IN ('up_to_date', 'partial', 'not_started', 'unknown')),
  medical_notes text,
  recorded_by text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON health_records TO anon, authenticated;
DROP POLICY IF EXISTS "anon_select_health_records" ON health_records;
CREATE POLICY "anon_select_health_records" ON health_records FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_health_records" ON health_records;
CREATE POLICY "anon_insert_health_records" ON health_records FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_health_records" ON health_records;
CREATE POLICY "anon_update_health_records" ON health_records FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_health_records" ON health_records;
CREATE POLICY "anon_delete_health_records" ON health_records FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_health_records_child_id ON health_records(child_id);

-- Case notes table
CREATE TABLE IF NOT EXISTS case_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  note_date date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL DEFAULT 'protection' CHECK (category IN ('protection', 'education', 'family', 'medical', 'other')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  body text NOT NULL,
  author text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON case_notes TO anon, authenticated;
DROP POLICY IF EXISTS "anon_select_case_notes" ON case_notes;
CREATE POLICY "anon_select_case_notes" ON case_notes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_case_notes" ON case_notes;
CREATE POLICY "anon_insert_case_notes" ON case_notes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_case_notes" ON case_notes;
CREATE POLICY "anon_update_case_notes" ON case_notes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_case_notes" ON case_notes;
CREATE POLICY "anon_delete_case_notes" ON case_notes FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_case_notes_child_id ON case_notes(child_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_status ON case_notes(status);

-- Handoffs table
CREATE TABLE IF NOT EXISTS handoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  handoff_date date NOT NULL DEFAULT CURRENT_DATE,
  from_center_id uuid REFERENCES centers(id) ON DELETE SET NULL,
  to_center_id uuid REFERENCES centers(id) ON DELETE SET NULL,
  handoff_type text NOT NULL DEFAULT 'transfer' CHECK (handoff_type IN ('transfer', 'reunification', 'temporary', 'external_referral')),
  reason text,
  receiving_person text,
  receiving_contact text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  initiated_by text,
  completed_by text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE handoffs ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON handoffs TO anon, authenticated;
DROP POLICY IF EXISTS "anon_select_handoffs" ON handoffs;
CREATE POLICY "anon_select_handoffs" ON handoffs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_handoffs" ON handoffs;
CREATE POLICY "anon_insert_handoffs" ON handoffs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_handoffs" ON handoffs;
CREATE POLICY "anon_update_handoffs" ON handoffs FOR UPDATE TO anon, authenticated USING ( true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_handoffs" ON handoffs;
CREATE POLICY "anon_delete_handoffs" ON handoffs FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_handoffs_child_id ON handoffs(child_id);
CREATE INDEX IF NOT EXISTS idx_handoffs_status ON handoffs(status);

-- Consents table
CREATE TABLE IF NOT EXISTS consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  consent_type text NOT NULL CHECK (consent_type IN ('medical', 'data_sharing', 'photography', 'admission', 'transfer', 'education')),
  given_by text NOT NULL CHECK (given_by IN ('guardian', 'child', 'self', 'court')),
  giver_name text NOT NULL,
  giver_relationship text,
  is_granted boolean NOT NULL DEFAULT true,
  consent_date date NOT NULL DEFAULT CURRENT_DATE,
  expiry_date date,
  witness_name text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON consents TO anon, authenticated;
DROP POLICY IF EXISTS "anon_select_consents" ON consents;
CREATE POLICY "anon_select_consents" ON consents FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_consents" ON consents;
CREATE POLICY "anon_insert_consents" ON consents FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_consents" ON consents;
CREATE POLICY "anon_update_consents" ON consents FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_consents" ON consents;
CREATE POLICY "anon_delete_consents" ON consents FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_consents_child_id ON consents(child_id);
