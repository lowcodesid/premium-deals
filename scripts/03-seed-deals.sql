-- Insert sample flight deals for testing
INSERT INTO deals (airline, departure_city, departure_airport, destination_city, destination_airport, cabin_class, price_aud, original_price_aud, discount_percentage, departure_date, return_date, is_return, booking_url, deal_type, alliance, availability_count, expires_at)
VALUES
  -- Business class deals
  ('Qantas', 'Sydney', 'SYD', 'London', 'LHR', 'business', 4299.00, 8599.00, 50, '2026-05-15', '2026-05-30', true, 'https://example.com/qf-syd-lhr', 'sale', 'oneworld', 4, '2026-02-01 23:59:59'),
  ('Singapore Airlines', 'Melbourne', 'MEL', 'Singapore', 'SIN', 'business', 1899.00, 3200.00, 41, '2026-06-10', '2026-06-24', true, 'https://example.com/sq-mel-sin', 'sale', 'star', 8, '2026-01-25 23:59:59'),
  ('Emirates', 'Sydney', 'SYD', 'Dubai', 'DXB', 'business', 3599.00, 6500.00, 45, '2026-04-20', '2026-05-05', true, 'https://example.com/ek-syd-dxb', 'mistake_fare', 'none', 2, '2026-01-18 23:59:59'),
  ('Cathay Pacific', 'Brisbane', 'BNE', 'Hong Kong', 'HKG', 'business', 1499.00, 2800.00, 46, '2026-07-01', '2026-07-15', true, 'https://example.com/cx-bne-hkg', 'sale', 'oneworld', 6, '2026-01-30 23:59:59'),
  ('ANA', 'Sydney', 'SYD', 'Tokyo', 'NRT', 'business', 2199.00, 4200.00, 48, '2026-08-05', '2026-08-20', true, 'https://example.com/nh-syd-nrt', 'best_available', 'star', 5, '2026-02-15 23:59:59'),
  
  -- First class deals
  ('Qatar Airways', 'Melbourne', 'MEL', 'Doha', 'DOH', 'first', 7999.00, 14500.00, 45, '2026-05-10', '2026-05-25', true, 'https://example.com/qr-mel-doh', 'sale', 'oneworld', 2, '2026-01-22 23:59:59'),
  ('Etihad', 'Sydney', 'SYD', 'Abu Dhabi', 'AUH', 'first', 8499.00, 15000.00, 43, '2026-06-15', '2026-07-01', true, 'https://example.com/ey-syd-auh', 'mistake_fare', 'none', 1, '2026-01-20 23:59:59'),
  ('Singapore Airlines', 'Sydney', 'SYD', 'Singapore', 'SIN', 'first', 3999.00, 7200.00, 44, '2026-09-01', '2026-09-14', true, 'https://example.com/sq-syd-sin', 'sale', 'star', 3, '2026-02-10 23:59:59'),
  
  -- Premium economy deals
  ('Qantas', 'Sydney', 'SYD', 'Los Angeles', 'LAX', 'premium_economy', 1899.00, 2800.00, 32, '2026-04-12', '2026-04-26', true, 'https://example.com/qf-syd-lax', 'sale', 'oneworld', 10, '2026-01-28 23:59:59'),
  ('Virgin Australia', 'Melbourne', 'MEL', 'Los Angeles', 'LAX', 'premium_economy', 1799.00, 2600.00, 31, '2026-05-20', '2026-06-05', true, 'https://example.com/va-mel-lax', 'best_available', 'none', 12, '2026-02-05 23:59:59'),
  
  -- Points redemption deals
  ('Qantas', 'Sydney', 'SYD', 'Tokyo', 'HND', 'business', 0.00, NULL, NULL, '2026-10-01', '2026-10-15', true, 'https://example.com/qf-syd-hnd-points', 'points_redemption', 'oneworld', 4, '2026-03-01 23:59:59'),
  ('Singapore Airlines', 'Melbourne', 'MEL', 'Paris', 'CDG', 'business', 0.00, NULL, NULL, '2026-11-10', '2026-11-25', true, 'https://example.com/sq-mel-cdg-points', 'points_redemption', 'star', 2, '2026-03-15 23:59:59'),
  
  -- More diverse routes
  ('Air New Zealand', 'Sydney', 'SYD', 'Auckland', 'AKL', 'business', 899.00, 1600.00, 44, '2026-03-15', '2026-03-22', true, 'https://example.com/nz-syd-akl', 'sale', 'star', 15, '2026-01-31 23:59:59'),
  ('Thai Airways', 'Brisbane', 'BNE', 'Bangkok', 'BKK', 'business', 1699.00, 3100.00, 45, '2026-06-05', '2026-06-19', true, 'https://example.com/tg-bne-bkk', 'mistake_fare', 'star', 5, '2026-01-26 23:59:59'),
  ('Lufthansa', 'Melbourne', 'MEL', 'Frankfurt', 'FRA', 'business', 4899.00, 8200.00, 40, '2026-07-20', '2026-08-10', true, 'https://example.com/lh-mel-fra', 'sale', 'star', 6, '2026-02-12 23:59:59');

-- Update points_required for points redemption deals
UPDATE deals 
SET points_required = 139000, points_currency = 'Qantas Points'
WHERE deal_type = 'points_redemption' AND airline = 'Qantas';

UPDATE deals 
SET points_required = 115000, points_currency = 'KrisFlyer Miles'
WHERE deal_type = 'points_redemption' AND airline = 'Singapore Airlines';
