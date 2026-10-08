-- Create table for cast members
CREATE TABLE cast_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_name TEXT NOT NULL,
    base_hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    point_tier TEXT NOT NULL DEFAULT 'standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for table sessions
CREATE TABLE table_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_number TEXT NOT NULL,
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    set_duration_minutes INTEGER NOT NULL DEFAULT 60,
    set_rate NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- e.g., 'active', 'closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for cast assignments
CREATE TABLE cast_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES table_sessions(id) ON DELETE CASCADE,
    cast_id UUID NOT NULL REFERENCES cast_members(id) ON DELETE RESTRICT,
    role TEXT NOT NULL CHECK (role IN ('hon-shime', 'jonai_shime', 'help')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES table_sessions(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    ordered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for order attributions (backs/commissions)
CREATE TABLE order_attributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    cast_id UUID NOT NULL REFERENCES cast_members(id) ON DELETE RESTRICT,
    back_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for attendance adjustments (points/withheld bonuses)
CREATE TABLE attendance_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cast_id UUID NOT NULL REFERENCES cast_members(id) ON DELETE RESTRICT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    type TEXT NOT NULL, -- e.g., 'late', 'absence', 'bonus'
    adjustment_points INTEGER NOT NULL DEFAULT 0,
    adjustment_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE cast_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cast_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_adjustments ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Allow authenticated users full access for MVP, or anon read)
-- Strict RLS Policies for Staff/Black-Clothes
CREATE POLICY "Enable read access for authenticated users on cast_members" ON cast_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users on cast_members" ON cast_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users on cast_members" ON cast_members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users on cast_members" ON cast_members FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users on table_sessions" ON table_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users on table_sessions" ON table_sessions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users on table_sessions" ON table_sessions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users on table_sessions" ON table_sessions FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users on cast_assignments" ON cast_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users on cast_assignments" ON cast_assignments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users on cast_assignments" ON cast_assignments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users on cast_assignments" ON cast_assignments FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users on order_items" ON order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users on order_items" ON order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users on order_items" ON order_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users on order_items" ON order_items FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users on order_attributions" ON order_attributions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users on order_attributions" ON order_attributions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users on order_attributions" ON order_attributions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users on order_attributions" ON order_attributions FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users on attendance_adjustments" ON attendance_adjustments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users on attendance_adjustments" ON attendance_adjustments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users on attendance_adjustments" ON attendance_adjustments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users on attendance_adjustments" ON attendance_adjustments FOR DELETE TO authenticated USING (true);
