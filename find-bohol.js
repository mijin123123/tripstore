const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbhvavyipmlkbtrf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiaHZhdnlpcG1sa2J0cmYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNTYyNTkzMSwiZXhwIjoyMDUxMjAxOTMxfQ.FZRXE7_TKI7yK22AZrPuEtqyIJGJJa8GW4LJWwKEgSA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findBoholPackage() {
  try {
    // 보홀이 포함된 패키지 찾기
    const { data, error } = await supabase
      .from('packages')
      .select('id, title, itinerary, region')
      .ilike('title', '%보홀%');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('보홀 패키지들:');
    data.forEach(pkg => {
      console.log('-------------------');
      console.log('ID:', pkg.id);
      console.log('Title:', pkg.title);
      console.log('Region:', pkg.region);
      console.log('Itinerary Type:', typeof pkg.itinerary);
      console.log('Is Array:', Array.isArray(pkg.itinerary));
      if (Array.isArray(pkg.itinerary)) {
        console.log('Itinerary Length:', pkg.itinerary.length);
        console.log('First day:', pkg.itinerary[0] ? JSON.stringify(pkg.itinerary[0], null, 2) : 'No first day');
      } else {
        console.log('Itinerary:', pkg.itinerary);
      }
    });
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

findBoholPackage();
