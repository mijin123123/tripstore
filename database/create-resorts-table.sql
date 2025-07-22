CREATE TABLE IF NOT EXISTS public.resorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  rating DECIMAL(3,1) DEFAULT 4.5,
  price TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  region_id INTEGER REFERENCES public.regions(id),
  description TEXT,
  max_people INTEGER,
  has_beach_access BOOLEAN DEFAULT false,
  has_pool BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.resorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 리조트를 볼 수 있음" ON public.resorts
  FOR SELECT USING (true);

CREATE POLICY "인증된 사용자만 리조트를 추가할 수 있음" ON public.resorts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 리조트를 수정할 수 있음" ON public.resorts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 리조트를 삭제할 수 있음" ON public.resorts
  FOR DELETE USING (auth.role() = 'authenticated');
