// Mock Supabase implementation for Demo & Offline Mode

const INITIAL_CENTERS = [
  {
    id: 'c1',
    name: 'Khurda District Shelter Home',
    type: 'shelter',
    district: 'Khurda',
    capacity: 45,
    contact_phone: '+91-674-2301122',
    status: 'active',
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'c2',
    name: 'Cuttack Child Care Institution',
    type: 'cci',
    district: 'Cuttack',
    capacity: 60,
    contact_phone: '+91-671-2403344',
    status: 'active',
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'c3',
    name: 'Bhubaneswar Observation & Aftercare',
    type: 'aftercare',
    district: 'Khurda',
    capacity: 30,
    contact_phone: '+91-674-2556677',
    status: 'active',
    created_at: new Date('2024-01-01').toISOString(),
  },
];

const INITIAL_CHILDREN = [
  {
    id: 'ch1',
    full_name: 'Aarav Nayak',
    date_of_birth: '2015-04-12',
    gender: 'male',
    photo_url: null,
    district: 'Khurda',
    status: 'in_care',
    risk_level: 'low',
    center_id: 'c1',
    guardian_name: 'Sunita Nayak',
    guardian_phone: '+91-9876543210',
    admission_date: '2024-01-15',
    notes: 'Regular schooling at Utkal Model School. Enjoys sports.',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'ch2',
    full_name: 'Pooja Das',
    date_of_birth: '2013-09-20',
    gender: 'female',
    photo_url: null,
    district: 'Cuttack',
    status: 'in_care',
    risk_level: 'high',
    center_id: 'c2',
    guardian_name: 'Ramesh Das',
    guardian_phone: '+91-9876501234',
    admission_date: '2024-03-10',
    notes: 'Under high-priority legal guardianship review.',
    created_at: new Date('2024-03-10').toISOString(),
    updated_at: new Date('2024-03-10').toISOString(),
  },
  {
    id: 'ch3',
    full_name: 'Rahul Mohanty',
    date_of_birth: '2017-11-05',
    gender: 'male',
    photo_url: null,
    district: 'Khurda',
    status: 'in_care',
    risk_level: 'critical',
    center_id: 'c1',
    guardian_name: 'Laxmi Mohanty',
    guardian_phone: '+91-9876512345',
    admission_date: '2024-06-01',
    notes: 'Needs immediate pediatric and nutritional interventions.',
    created_at: new Date('2024-06-01').toISOString(),
    updated_at: new Date('2024-06-01').toISOString(),
  },
  {
    id: 'ch4',
    full_name: 'Sneha Patra',
    date_of_birth: '2016-02-18',
    gender: 'female',
    photo_url: null,
    district: 'Cuttack',
    status: 'reunified',
    risk_level: 'low',
    center_id: 'c2',
    guardian_name: 'Bikram Patra',
    guardian_phone: '+91-9876523456',
    admission_date: '2023-11-12',
    notes: 'Reunified with maternal family following CWC order.',
    created_at: new Date('2023-11-12').toISOString(),
    updated_at: new Date('2024-08-01').toISOString(),
  },
  {
    id: 'ch5',
    full_name: 'Manoj Behera',
    date_of_birth: '2012-07-25',
    gender: 'male',
    photo_url: null,
    district: 'Khurda',
    status: 'active',
    risk_level: 'medium',
    center_id: 'c3',
    guardian_name: 'Subash Behera',
    guardian_phone: '+91-9876534567',
    admission_date: '2024-02-20',
    notes: 'Enrolled in 8th grade vocational IT training track.',
    created_at: new Date('2024-02-20').toISOString(),
    updated_at: new Date('2024-02-20').toISOString(),
  },
];

const INITIAL_HEALTH_RECORDS = [
  {
    id: 'hr1',
    child_id: 'ch3',
    record_date: '2026-10-15',
    height_cm: 110,
    weight_kg: 16.5,
    muac_cm: 11.8,
    bmi: 13.6,
    nutritional_status: 'severe_acute',
    immunization_status: 'partial',
    medical_notes: 'MUAC measurement below threshold (11.8 cm). Supplementary nutrition initiated.',
    recorded_by: 'Dr. P. Senapati',
    created_at: new Date('2026-10-15').toISOString(),
  },
  {
    id: 'hr2',
    child_id: 'ch1',
    record_date: '2026-10-10',
    height_cm: 135,
    weight_kg: 32,
    muac_cm: 14.5,
    bmi: 17.5,
    nutritional_status: 'normal',
    immunization_status: 'up_to_date',
    medical_notes: 'Growth percentiles within normal parameters.',
    recorded_by: 'Staff Nurse Geeta',
    created_at: new Date('2026-10-10').toISOString(),
  },
];

const INITIAL_CASE_NOTES = [
  {
    id: 'cn1',
    child_id: 'ch3',
    note_date: '2026-10-20',
    category: 'medical',
    priority: 'urgent',
    body: 'Referred to District Headquarters Hospital pediatric OPD for urgent malnutrition assessment.',
    author: 'Dr. P. Senapati',
    status: 'open',
    created_at: new Date('2026-10-20').toISOString(),
    updated_at: new Date('2026-10-20').toISOString(),
  },
  {
    id: 'cn2',
    child_id: 'ch2',
    note_date: '2026-10-18',
    category: 'protection',
    priority: 'high',
    body: 'Child Welfare Committee (CWC) case review session scheduled for social investigation report.',
    author: 'Deepak Sahu (Case Worker)',
    status: 'in_progress',
    created_at: new Date('2026-10-18').toISOString(),
    updated_at: new Date('2026-10-18').toISOString(),
  },
];

const INITIAL_HANDOFFS = [
  {
    id: 'h1',
    child_id: 'ch2',
    handoff_date: '2026-10-30',
    from_center_id: 'c2',
    to_center_id: 'c1',
    handoff_type: 'transfer',
    reason: 'Transfer for closer access to higher secondary schooling facility.',
    receiving_person: 'Superintendent Khurda',
    receiving_contact: '+91-674-2301122',
    status: 'pending',
    initiated_by: 'Deepak Sahu',
    completed_by: null,
    notes: 'Escort team designated by CWC order.',
    created_at: new Date('2026-10-15').toISOString(),
  },
];

const INITIAL_CONSENTS = [
  {
    id: 'co1',
    child_id: 'ch1',
    consent_type: 'medical',
    given_by: 'guardian',
    giver_name: 'Sunita Nayak',
    giver_relationship: 'Mother',
    is_granted: true,
    consent_date: '2024-01-16',
    expiry_date: '2027-01-16',
    witness_name: 'Deepak Sahu',
    notes: 'Standard annual pediatric and emergency care consent.',
    created_at: new Date('2024-01-16').toISOString(),
  },
];

const INITIAL_FAMILY_LINKS = [
  {
    id: 'fl1',
    child_id: 'ch1',
    relationship: 'Mother',
    full_name: 'Sunita Nayak',
    contact_phone: '+91-9876543210',
    district: 'Khurda',
    verified: true,
    notes: 'Primary contact for quarterly visitation.',
    created_at: new Date('2024-01-15').toISOString(),
  },
];

const INITIAL_SCHOOLING = [
  {
    id: 'sc1',
    child_id: 'ch1',
    school_name: 'Utkal Government High School',
    grade_level: 'Grade 5',
    enrollment_status: 'enrolled',
    attendance_percent: 92,
    language_of_instruction: 'Odia',
    last_verified_at: '2026-10-01',
    notes: 'Regular attendance.',
    updated_at: new Date('2026-10-01').toISOString(),
    destination_school: null,
    destination_district: null,
    destination_state: null,
    transfer_certificate_issued: false,
    transfer_certificate_date: null,
    last_known_district: 'Khurda',
    last_known_state: 'Odisha',
  },
  {
    id: 'sc2',
    child_id: 'ch2',
    school_name: 'Kendriya Vidyalaya Cuttack',
    grade_level: 'Grade 8',
    enrollment_status: 'enrolled',
    attendance_percent: 78,
    language_of_instruction: 'Hindi',
    last_verified_at: '2026-09-15',
    notes: 'Irregular attendance due to family migration.',
    updated_at: new Date('2026-09-15').toISOString(),
    destination_school: 'Government High School, Khurda',
    destination_district: 'Khurda',
    destination_state: 'Odisha',
    transfer_certificate_issued: false,
    transfer_certificate_date: null,
    last_known_district: 'Cuttack',
    last_known_state: 'Odisha',
  },
];

const INITIAL_DIRECTORY = [
  {
    id: 'dir1',
    name: 'Khurda Anganwadi Center #4',
    service_type: 'anganwadi',
    district: 'Khurda',
    address: 'Near Old Bus Stand, Khurda',
    contact_phone: '+91-674-2399991',
    languages: ['Odia', 'Hindi'],
    is_active: true,
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'dir2',
    name: 'Asha Bal Griha Creche – Bargarh',
    service_type: 'creche',
    district: 'Bargarh',
    address: 'Labour Colony, Near Mandi, Bargarh',
    contact_phone: '+91-6646-231456',
    languages: ['Odia', 'Hindi'],
    is_active: true,
    created_at: new Date('2024-03-01').toISOString(),
  },
  {
    id: 'dir3',
    name: 'Sunflower Mobile Creche – Khurda',
    service_type: 'creche',
    district: 'Khurda',
    address: 'Near Construction Site NH-16, Bhubaneswar',
    contact_phone: '+91-674-2665544',
    languages: ['Odia', 'Telugu'],
    is_active: true,
    created_at: new Date('2024-06-01').toISOString(),
  },
  {
    id: 'dir4',
    name: 'Cuttack ICDS Daycare – Sector 5',
    service_type: 'daycare',
    district: 'Cuttack',
    address: 'Sector 5 Community Hall, CDA, Cuttack',
    contact_phone: '+91-671-2456789',
    languages: ['Odia'],
    is_active: true,
    created_at: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'dir5',
    name: 'Bolangir Creche for Seasonal Workers',
    service_type: 'creche',
    district: 'Bolangir',
    address: 'Adjacent Brick Kiln Area, Patnagarh Road',
    contact_phone: '+91-6652-233210',
    languages: ['Odia', 'Hindi'],
    is_active: true,
    created_at: new Date('2024-04-01').toISOString(),
  },
  {
    id: 'dir6',
    name: 'Subarnapur Anganwadi Plus Creche',
    service_type: 'creche',
    district: 'Subarnapur',
    address: 'Village Welfare Centre, Sonepur',
    contact_phone: '+91-6653-225501',
    languages: ['Odia'],
    is_active: true,
    created_at: new Date('2024-05-01').toISOString(),
  },
];

const INITIAL_MIGRATION_EVENTS = [
  {
    id: 'me1',
    child_id: 'ch2',
    event_date: '2026-10-10',
    from_district: 'Cuttack',
    to_district: 'Khurda',
    from_state: 'Odisha',
    to_state: 'Odisha',
    migration_reason: 'Seasonal brick kiln work – parent relocation',
    source_verified: true,
    case_transferred: false,
    receiving_officer: null,
    notes: 'Child accompanied parents to work site.',
    created_at: new Date('2026-10-10').toISOString(),
  },
  {
    id: 'me2',
    child_id: 'ch3',
    event_date: '2026-10-18',
    from_district: 'Bargarh',
    to_district: 'Khurda',
    from_state: 'Odisha',
    to_state: 'Odisha',
    migration_reason: 'Construction site relocation with family',
    source_verified: false,
    case_transferred: false,
    receiving_officer: null,
    notes: 'Child at critical risk, requires immediate monitoring at destination.',
    created_at: new Date('2026-10-18').toISOString(),
  },
];

type DbRecord = Record<string, unknown>;

interface MockDatabase {
  centers: DbRecord[];
  children: DbRecord[];
  health_records: DbRecord[];
  case_notes: DbRecord[];
  handoffs: DbRecord[];
  consents: DbRecord[];
  family_links: DbRecord[];
  migration_events: DbRecord[];
  schooling_records: DbRecord[];
  childcare_directory: DbRecord[];
}

function getInitialDb(): MockDatabase {
  return {
    centers: [...INITIAL_CENTERS] as DbRecord[],
    children: [...INITIAL_CHILDREN] as DbRecord[],
    health_records: [...INITIAL_HEALTH_RECORDS] as DbRecord[],
    case_notes: [...INITIAL_CASE_NOTES] as DbRecord[],
    handoffs: [...INITIAL_HANDOFFS] as DbRecord[],
    consents: [...INITIAL_CONSENTS] as DbRecord[],
    family_links: [...INITIAL_FAMILY_LINKS] as DbRecord[],
    migration_events: [...INITIAL_MIGRATION_EVENTS] as DbRecord[],
    schooling_records: [...INITIAL_SCHOOLING] as DbRecord[],
    childcare_directory: [...INITIAL_DIRECTORY] as DbRecord[],
  };
}

const STORAGE_KEY = 'suraksha_mock_db_v1';
const SESSION_KEY = 'suraksha_mock_session_v1';

function loadDb(): MockDatabase {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading mock db from storage', e);
  }
  return getInitialDb();
}

function saveDb(db: MockDatabase) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
  } catch (e) {
    console.error('Error saving mock db', e);
  }
}

type AuthListener = (event: string, session: unknown) => void;
const authListeners = new Set<AuthListener>();

function notifyAuth(event: string, session: unknown) {
  authListeners.forEach(listener => {
    try {
      listener(event, session);
    } catch (e) {
      console.error(e);
    }
  });
}

function getStoredSession() {
  try {
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read session:', err);
  }
  return null;
}

function setStoredSession(session: unknown) {
  try {
    if (typeof window !== 'undefined') {
      if (session) {
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } else {
        window.localStorage.removeItem(SESSION_KEY);
      }
    }
  } catch (err) {
    console.warn('Could not write session:', err);
  }
}

class MockQueryBuilder {
  private tableName: keyof MockDatabase;
  private filters: Array<(item: DbRecord) => boolean> = [];
  private orderField: string | null = null;
  private orderAsc = true;
  private limitCount: number | null = null;
  private selectCols = '*';
  private exactCount = false;
  private isHead = false;

  constructor(tableName: keyof MockDatabase) {
    this.tableName = tableName;
  }

  select(columns = '*', options?: { count?: string; head?: boolean }) {
    this.selectCols = columns;
    if (options?.count === 'exact') this.exactCount = true;
    if (options?.head) this.isHead = true;
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push(item => item[column] === value);
    return this;
  }

  neq(column: string, value: unknown) {
    this.filters.push(item => item[column] !== value);
    return this;
  }

  in(column: string, values: unknown[]) {
    this.filters.push(item => values.includes(item[column]));
    return this;
  }

  gte(column: string, value: unknown) {
    this.filters.push(item => {
      const v = item[column];
      if (typeof v === 'string' && typeof value === 'string') return v >= value;
      if (typeof v === 'number' && typeof value === 'number') return v >= value;
      return false;
    });
    return this;
  }

  lte(column: string, value: unknown) {
    this.filters.push(item => {
      const v = item[column];
      if (typeof v === 'string' && typeof value === 'string') return v <= value;
      if (typeof v === 'number' && typeof value === 'number') return v <= value;
      return false;
    });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderField = column;
    this.orderAsc = options?.ascending !== false;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  private resolveData() {
    const db = loadDb();
    let records = [...(db[this.tableName] || [])];

    for (const f of this.filters) {
      records = records.filter(f);
    }

    if (this.orderField) {
      records.sort((a, b) => {
        const valA = a[this.orderField!];
        const valB = b[this.orderField!];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return this.orderAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (Number(valA) < Number(valB)) return this.orderAsc ? -1 : 1;
        if (Number(valA) > Number(valB)) return this.orderAsc ? 1 : -1;
        return 0;
      });
    }

    const totalCount = records.length;

    if (this.limitCount !== null) {
      records = records.slice(0, this.limitCount);
    }

    // Hydrate relations
    const hydrated = records.map(item => {
      const copy = { ...item };
      if (this.tableName === 'children') {
        copy.center = db.centers.find(c => c.id === copy.center_id) || null;
      } else if (this.tableName === 'handoffs') {
        copy.child = db.children.find(c => c.id === copy.child_id) || null;
        copy.from_center = db.centers.find(c => c.id === copy.from_center_id) || null;
        copy.to_center = db.centers.find(c => c.id === copy.to_center_id) || null;
      } else if (this.tableName === 'case_notes') {
        copy.child = db.children.find(c => c.id === copy.child_id) || null;
      }
      return copy;
    });

    return {
      data: this.isHead ? null : hydrated,
      count: this.exactCount ? totalCount : null,
      error: null,
    };
  }

  async insert(values: DbRecord | DbRecord[]) {
    const db = loadDb();
    const rows = Array.isArray(values) ? values : [values];
    const createdRows: DbRecord[] = [];

    for (const row of rows) {
      const newRow: DbRecord = {
        ...row,
        id: (row.id as string) || 'id_' + Math.random().toString(36).substring(2, 9),
        created_at: (row.created_at as string) || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db[this.tableName].push(newRow);
      createdRows.push(newRow);
    }

    saveDb(db);
    return {
      data: Array.isArray(values) ? createdRows : createdRows[0],
      error: null,
      select: () => ({
        single: async () => ({ data: createdRows[0], error: null }),
        maybeSingle: async () => ({ data: createdRows[0], error: null }),
      }),
    };
  }

  async update(patch: DbRecord) {
    const db = loadDb();
    const records = db[this.tableName];
    const updatedRows: DbRecord[] = [];

    for (let i = 0; i < records.length; i++) {
      let matches = true;
      for (const f of this.filters) {
        if (!f(records[i])) {
          matches = false;
          break;
        }
      }
      if (matches) {
        records[i] = { ...records[i], ...patch, updated_at: new Date().toISOString() };
        updatedRows.push(records[i]);
      }
    }

    saveDb(db);
    return {
      data: updatedRows,
      error: null,
      select: () => ({
        single: async () => ({ data: updatedRows[0] || null, error: null }),
      }),
    };
  }

  async upsert(values: DbRecord | DbRecord[]) {
    const db = loadDb();
    const rows = Array.isArray(values) ? values : [values];
    const results: DbRecord[] = [];

    for (const row of rows) {
      // Match only on primary key; child_id is not a unique key for most tables
      // and using it as a fallback turns multi-row tables into single-row-per-child.
      const idx = db[this.tableName].findIndex((item: DbRecord) =>
        Boolean(row.id && item.id === row.id)
      );
      if (idx >= 0) {
        db[this.tableName][idx] = { ...db[this.tableName][idx], ...row, updated_at: new Date().toISOString() };
        results.push(db[this.tableName][idx]);
      } else {
        const created: DbRecord = {
          ...row,
          id: (row.id as string) || 'id_' + Math.random().toString(36).substring(2, 9),
          updated_at: new Date().toISOString(),
        };
        db[this.tableName].push(created);
        results.push(created);
      }
    }

    saveDb(db);
    return {
      data: Array.isArray(values) ? results : results[0],
      error: null,
      select: () => ({
        single: async () => ({ data: results[0], error: null }),
      }),
    };
  }

  async delete() {
    const db = loadDb();
    db[this.tableName] = db[this.tableName].filter((item: DbRecord) => {
      // Keep the row only when it does NOT match ALL filters (AND semantics,
      // consistent with resolveData/update above).
      return !this.filters.every(f => f(item));
    });
    saveDb(db);
    return { data: null, error: null };
  }

  async single() {
    const res = this.resolveData();
    const first = res.data && res.data.length > 0 ? res.data[0] : null;
    return { data: first, error: first ? null : new Error('No record found') };
  }

  async maybeSingle() {
    const res = this.resolveData();
    const first = res.data && res.data.length > 0 ? res.data[0] : null;
    return { data: first, error: null };
  }

  then<TResult1 = { data: DbRecord[] | null; count: number | null; error: null }, TResult2 = never>(
    onfulfilled?: ((value: { data: DbRecord[] | null; count: number | null; error: null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.resolveData()).then(onfulfilled, onrejected);
  }
}

export function createMockSupabase() {
  return {
    auth: {
      async getSession() {
        const session = getStoredSession();
        return { data: { session }, error: null };
      },
      onAuthStateChange(callback: AuthListener) {
        authListeners.add(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                authListeners.delete(callback);
              },
            },
          },
        };
      },
      async signInWithPassword({ email }: { email: string; password?: string }) {
        const user = {
          id: 'mock-user-uuid-1',
          email: email || 'surksha21@gmail.com',
          user_metadata: { role: 'admin' },
        };
        const session = {
          access_token: 'mock-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user,
        };
        setStoredSession(session);
        notifyAuth('SIGNED_IN', session);
        return { data: { session, user }, error: null };
      },
      async signOut() {
        setStoredSession(null);
        notifyAuth('SIGNED_OUT', null);
        return { error: null };
      },
    },
    from(tableName: keyof MockDatabase) {
      return new MockQueryBuilder(tableName);
    },
  };
}
