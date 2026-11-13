CREATE TABLE IF NOT EXISTS company_settings(id int PRIMARY KEY CHECK(id=1),name text NOT NULL,demo boolean NOT NULL DEFAULT true);
INSERT INTO company_settings VALUES(1,'Brisa Oficina — Climatização Demo',true) ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS clients(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name text NOT NULL,contact text NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS quotes(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),code bigint GENERATED ALWAYS AS IDENTITY UNIQUE,client_id uuid NOT NULL REFERENCES clients(id),current_revision int NOT NULL DEFAULT 0,status text NOT NULL CHECK(status IN ('draft','sent','accepted','change_requested','expired','cancelled')),created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS revisions(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),quote_id uuid NOT NULL REFERENCES quotes(id),number int NOT NULL,snapshot jsonb NOT NULL,total_cents bigint NOT NULL CHECK(total_cents>=0),snapshot_hash text NOT NULL,valid_until timestamptz NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(quote_id,number));
CREATE TABLE IF NOT EXISTS public_links(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),revision_id uuid NOT NULL REFERENCES revisions(id),token_hash text NOT NULL UNIQUE,expires_at timestamptz NOT NULL,revoked_at timestamptz);
CREATE TABLE IF NOT EXISTS decisions(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),revision_id uuid NOT NULL UNIQUE REFERENCES revisions(id),kind text NOT NULL CHECK(kind IN ('accepted','change_requested')),name text NOT NULL,note text NOT NULL DEFAULT '',snapshot_hash text NOT NULL,idempotency_key uuid NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS service_orders(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),quote_id uuid NOT NULL UNIQUE REFERENCES quotes(id),revision_id uuid NOT NULL REFERENCES revisions(id),status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','in_progress','completed','cancelled')),reason text NOT NULL DEFAULT '',created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS audit_events(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,quote_id uuid REFERENCES quotes(id),actor text NOT NULL,action text NOT NULL,detail jsonb NOT NULL DEFAULT '{}',created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS request_limits(key text PRIMARY KEY,hits int NOT NULL,reset_at timestamptz NOT NULL);
CREATE OR REPLACE FUNCTION deny_revision_change() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Immutable snapshot'; END $$;
DROP TRIGGER IF EXISTS revision_immutable ON revisions;
CREATE TRIGGER revision_immutable BEFORE UPDATE OR DELETE ON revisions FOR EACH ROW EXECUTE FUNCTION deny_revision_change();
DROP TRIGGER IF EXISTS audit_append_only ON audit_events;
CREATE TRIGGER audit_append_only BEFORE UPDATE OR DELETE ON audit_events FOR EACH ROW EXECUTE FUNCTION deny_revision_change();
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS draft jsonb;
ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS color text NOT NULL DEFAULT '#00777a';

-- O01 operations and user onboarding, additive migration.
ALTER TABLE clients ADD COLUMN IF NOT EXISTS address text NOT NULL DEFAULT '';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes text NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS equipment (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), client_id uuid NOT NULL REFERENCES clients(id),
 label text NOT NULL, brand_model text NOT NULL DEFAULT '', capacity_btu integer CHECK(capacity_btu BETWEEN 1 AND 1000000),
 serial text NOT NULL DEFAULT '', location text NOT NULL DEFAULT '', next_service date,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS appointments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), client_id uuid NOT NULL REFERENCES clients(id),
 equipment_id uuid REFERENCES equipment(id), order_id uuid REFERENCES service_orders(id),
 technician text NOT NULL, starts_at timestamptz NOT NULL, duration_minutes int NOT NULL CHECK(duration_minutes BETWEEN 15 AND 480),
 notes text NOT NULL DEFAULT '', status text NOT NULL DEFAULT 'planned' CHECK(status IN ('planned','completed','cancelled')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS appointments_schedule ON appointments(starts_at) WHERE status='planned';
CREATE TABLE IF NOT EXISTS training_progress (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
 tour text NOT NULL,version int NOT NULL,status text NOT NULL CHECK(status IN ('skipped','completed')),
 completed_at timestamptz,updated_at timestamptz NOT NULL DEFAULT now(),UNIQUE(user_id,tour,version)
);
CREATE TABLE IF NOT EXISTS notifications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
 training_id uuid NOT NULL UNIQUE REFERENCES training_progress(id) ON DELETE CASCADE,
 title text NOT NULL,body text NOT NULL,read_at timestamptz,created_at timestamptz NOT NULL DEFAULT now()
);
