/*
  Supabase configuration.
*/

// Supabase dependency is imported near end of index.html
const { createClient } = supabase;

// Get these values from the API section of your Supabase account
const supabaseUrl = "https://tvyuknfeekidwvwnkulv.supabase.co";
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eXVrbmZlZWtpZHd2d25rdWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ5MzgwNzksImV4cCI6MTk2MDUxNDA3OX0.mNCXySUOpsqGQmtmZTpEkbQC1i2IXLmmAljwgsycvd0'
// Note text case: Supabase != supabase
const Supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase Instance: ', Supabase);

// Export to allow import elsewhere
export  {
  Supabase
};

