import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('browser client falls back to demo mode for missing/invalid config and documents no service role key', () => {
 const source = read('../src/lib/supabase.ts');
 // Must document that service_role must never be used
 assert.match(source, /never service_role/i);
 // Must fall back to mock Supabase (not throw) when env vars are invalid
 assert.match(source, /createMockSupabase/);
 // The hard throw that prevented mock fallback must be gone
 assert.doesNotMatch(source, /throw new Error\('Missing Supabase configuration/);
});

test('security migration removes anonymous access and defines role-based policies', () => {
 const sql = read('../supabase/migrations/20261028190000_security_and_missing_features.sql');
 assert.match(sql, /revoke all on public\.%I from anon/);
 assert.match(sql, /current_staff_role\(\).*read_only/s);
 assert.match(sql, /admin delete/);
});

test('missing feature tables are represented in migration', () => {
 const sql = read('../supabase/migrations/20261028190000_security_and_missing_features.sql');
 for (const table of ['family_links','migration_events','schooling_records','childcare_directory']) assert.match(sql, new RegExp('create table if not exists public\.' + table));
});

test('supported language catalog includes Indian language options', () => {
 const source = read('../src/features/i18n/languages.ts');
 for (const language of ["'en'", "'hi'", "'or'", "'bn'", "'ta'", "'te'"]) assert.ok(source.includes(language));
 assert.ok(source.includes('languageNames'));
});

test('type definitions include family, migration, and schooling models', () => {
 const types = read('../src/types/index.ts');
 for (const model of ['FamilyLink', 'MigrationEvent', 'SchoolingRecord', 'ChildcareDirectoryItem']) {
  assert.ok(types.includes(`export interface ${model}`));
 }
});

test('offline queue module safely guards localStorage operations', () => {
 const source = read('../src/features/offline/offlineQueue.ts');
 assert.match(source, /readPendingActions/);
 assert.match(source, /queueAction/);
 assert.match(source, /clearPendingActions/);
});

test('mock database includes family, migration, and schooling entities', () => {
 const source = read('../src/lib/mockSupabase.ts');
 for (const entity of ['family_links', 'migration_events', 'schooling_records', 'childcare_directory']) {
  assert.ok(source.includes(entity));
 }
});

test('gap resolution features: creche, school transfer, protection case tracking, and cross-state fields', () => {
 const types = read('../src/types/index.ts');
 assert.ok(types.includes("'creche'"));
 assert.ok(types.includes("'daycare'"));
 assert.ok(types.includes('transfer_certificate_issued: boolean'));
 assert.ok(types.includes('destination_school: string | null'));
 assert.ok(types.includes('case_transferred: boolean'));
 assert.ok(types.includes('from_state: string | null'));

 const migrationSql = read('../supabase/migrations/20261029_gap_features.sql');
 assert.match(migrationSql, /destination_school/);
 assert.match(migrationSql, /transfer_certificate_issued/);
 assert.match(migrationSql, /case_transferred/);
 assert.match(migrationSql, /from_state/);
 assert.match(migrationSql, /creche/);
});

// ── B-03 fix: dashboard must not use a sequential loop for lost-case detection ──
test('dashboard api uses bulk .in() queries instead of N+1 loop for lost cases', () => {
 const source = read('../src/features/dashboard/api.ts');
 // Must contain .in() for bulk child ID lookup
 assert.match(source, /\.in\('child_id', highRiskIds\)/);
 // Must NOT contain a for…of loop over highRiskChildren
 assert.doesNotMatch(source, /for \(const child of highRiskChildren\)/);
});

// ── B-05 fix: delete() must use AND semantics (every), not OR (any) ──
test('mockSupabase delete uses every() (AND semantics) not early-exit OR', () => {
 const source = read('../src/lib/mockSupabase.ts');
 assert.match(source, /this\.filters\.every\(f => f\(item\)\)/);
});

// ── B-09 fix: upsert must not use child_id as a match key ──
test('mockSupabase upsert does not use child_id as a secondary match key', () => {
 const source = read('../src/lib/mockSupabase.ts');
 // The old fallback pattern must be gone
 assert.doesNotMatch(source, /item\.child_id === row\.child_id/);
});
