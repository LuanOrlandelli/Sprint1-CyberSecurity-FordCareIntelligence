CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE dealerships (
                             id BIGSERIAL PRIMARY KEY,
                             name VARCHAR(150) NOT NULL,
                             city VARCHAR(100),
                             state VARCHAR(50),
                             cnpj VARCHAR(20),
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(150) NOT NULL,
                       email VARCHAR(150) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role_id BIGINT NOT NULL,
                       dealership_id BIGINT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT fk_users_roles
                           FOREIGN KEY (role_id)
                               REFERENCES roles(id),

                       CONSTRAINT fk_users_dealerships
                           FOREIGN KEY (dealership_id)
                               REFERENCES dealerships(id)
);

CREATE TABLE customers (
                           id BIGSERIAL PRIMARY KEY,
                           name VARCHAR(150) NOT NULL,
                           email VARCHAR(150),
                           phone VARCHAR(30),
                           cpf VARCHAR(20),
                           birth_date DATE,
                           dealership_id BIGINT,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT fk_customers_dealerships
                               FOREIGN KEY (dealership_id)
                                   REFERENCES dealerships(id)
);

CREATE TABLE vehicles (
                          id BIGSERIAL PRIMARY KEY,
                          customer_id BIGINT NOT NULL,
                          vin VARCHAR(50) NOT NULL UNIQUE,
                          model VARCHAR(100) NOT NULL,
                          year INT,
                          last_service_date DATE,
                          warranty_active BOOLEAN DEFAULT FALSE,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_vehicles_customers
                              FOREIGN KEY (customer_id)
                                  REFERENCES customers(id)
);

CREATE TABLE predictions (
                             id BIGSERIAL PRIMARY KEY,
                             customer_id BIGINT NOT NULL,
                             risk_score DECIMAL(5,2) NOT NULL,
                             risk_level VARCHAR(30) NOT NULL,
                             customer_profile VARCHAR(255),
                             model_version VARCHAR(50),
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                             CONSTRAINT fk_predictions_customers
                                 FOREIGN KEY (customer_id)
                                     REFERENCES customers(id)
);

CREATE TABLE recommendations (
                                 id BIGSERIAL PRIMARY KEY,
                                 customer_id BIGINT NOT NULL,
                                 prediction_id BIGINT,
                                 title VARCHAR(150) NOT NULL,
                                 description TEXT,
                                 priority VARCHAR(30),
                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                 CONSTRAINT fk_recommendations_customers
                                     FOREIGN KEY (customer_id)
                                         REFERENCES customers(id),

                                 CONSTRAINT fk_recommendations_predictions
                                     FOREIGN KEY (prediction_id)
                                         REFERENCES predictions(id)
);

CREATE TABLE leads (
                       id BIGSERIAL PRIMARY KEY,
                       customer_id BIGINT NOT NULL,
                       dealership_id BIGINT,
                       status VARCHAR(30) NOT NULL,
                       origin VARCHAR(100),
                       notes TEXT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT fk_leads_customers
                           FOREIGN KEY (customer_id)
                               REFERENCES customers(id),

                       CONSTRAINT fk_leads_dealerships
                           FOREIGN KEY (dealership_id)
                               REFERENCES dealerships(id)
);