const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tbhvavyipmlkbtrf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiaHZhdnlpcG1sa2J0cmYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNTYyNTkzMSwiZXhwIjoyMDUxMjAxOTMxfQ.FZRXE7_TKI7yK22AZrPuEtqyIJGJJa8GW4LJWwKEgSA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPackageItinerary() {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('id, title, itinerary')
      .eq('id', '1753693323834')
      .single();
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Package ID:', data.id);
    console.log('Package Title:', data.title);
    console.log('Itinerary Data:');
    console.log(JSON.stringify(data.itinerary, null, 2));
    console.log('Itinerary Type:', typeof data.itinerary);
    console.log('Is Array:', Array.isArray(data.itinerary));
    
    if (Array.isArray(data.itinerary)) {
      console.log('Itinerary Length:', data.itinerary.length);
      data.itinerary.forEach((day, index) => {
        console.log(`Day ${index + 1}:`, JSON.stringify(day, null, 2));
      });
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkPackageItinerary();
