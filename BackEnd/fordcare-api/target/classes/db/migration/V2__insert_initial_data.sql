INSERT INTO roles (name) VALUES
                             ('ADMIN'),
                             ('ANALYST'),
                             ('DEALER_MANAGER');

INSERT INTO dealerships (name, city, state, cnpj) VALUES
    ('Ford Center São Paulo', 'São Paulo', 'SP', '00.000.000/0001-00');

INSERT INTO users (name, email, password, role_id, dealership_id) VALUES
    ('Luan Admin', 'admin@fordcare.com', '123456', 1, 1);

INSERT INTO customers (name, email, phone, cpf, birth_date, dealership_id) VALUES
                                                                               ('Carlos Silva', 'carlos@email.com', '11999999999', '123.456.789-00', '1985-04-12', 1),
                                                                               ('Mariana Costa', 'mariana@email.com', '11988888888', '987.654.321-00', '1990-08-22', 1),
                                                                               ('Roberto Lima', 'roberto@email.com', '11977777777', '456.789.123-00', '1978-11-03', 1);

INSERT INTO vehicles (customer_id, vin, model, year, last_service_date, warranty_active) VALUES
                                                                                             (1, 'VIN000000001', 'Ford Territory', 2023, '2025-12-10', true),
                                                                                             (2, 'VIN000000002', 'Ford Ranger', 2022, '2025-08-15', false),
                                                                                             (3, 'VIN000000003', 'Ford Ka', 2020, '2024-11-20', false);

INSERT INTO predictions (customer_id, risk_score, risk_level, customer_profile, model_version) VALUES
                                                                                                   (1, 0.82, 'HIGH', 'Cliente com alto risco de evasão', 'v1.0'),
                                                                                                   (2, 0.55, 'MEDIUM', 'Cliente com risco moderado', 'v1.0'),
                                                                                                   (3, 0.21, 'LOW', 'Cliente com baixo risco de evasão', 'v1.0');

INSERT INTO recommendations (customer_id, prediction_id, title, description, priority) VALUES
                                                                                           (1, 1, 'Oferta de revisão com desconto', 'Cliente apresenta alto risco. Recomenda-se contato ativo com oferta personalizada.', 'HIGH'),
                                                                                           (2, 2, 'Contato preventivo', 'Cliente com risco moderado. Recomenda-se lembrete de manutenção.', 'MEDIUM'),
                                                                                           (3, 3, 'Manter relacionamento', 'Cliente com baixo risco. Recomenda-se comunicação de relacionamento.', 'LOW');

INSERT INTO leads (customer_id, dealership_id, status, origin, notes) VALUES
                                                                          (1, 1, 'NEW', 'IA Prediction', 'Cliente com alto risco de evasão'),
                                                                          (2, 1, 'CONTACTED', 'IA Prediction', 'Cliente com risco moderado');