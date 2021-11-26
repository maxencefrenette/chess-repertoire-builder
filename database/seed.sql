-- Create the test user account
-- Email: user@example.com
-- Password: QPP%&5b2CV&*Vxds

create extension http;

create table public.debug_output as
select * from http((
  'POST',
  'http://host.docker.internal:54321/auth/v1/signup',
  ARRAY[
    http_header('apikey','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.ZopqoUt20nEV9cklpv9e3yw3PVyZLmKs5qLD6nGL1SI'),
    http_header('authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.ZopqoUt20nEV9cklpv9e3yw3PVyZLmKs5qLD6nGL1SI')
  ],
  'application/x-www-form-urlencoded',
  '{ "email": "user@example.com", "password": "QPP%&5b2CV&*VxdsÈ" }'
)::http_request);
