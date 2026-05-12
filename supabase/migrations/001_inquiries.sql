-- Motion Sickness: inquiry/order submissions

CREATE TABLE IF NOT EXISTS public.ms_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  instagram text,
  product text NOT NULL,
  size text,
  quantity integer NOT NULL DEFAULT 1,
  og_member boolean NOT NULL DEFAULT false,
  message text,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'confirmed', 'shipped', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ms_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry (public insert)
CREATE POLICY "Public can submit inquiry" ON public.ms_inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read all inquiries
CREATE POLICY "Admins read inquiries" ON public.ms_inquiries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Index for quick status filtering
CREATE INDEX IF NOT EXISTS ms_inquiries_status_idx ON public.ms_inquiries(status);
CREATE INDEX IF NOT EXISTS ms_inquiries_created_at_idx ON public.ms_inquiries(created_at DESC);
