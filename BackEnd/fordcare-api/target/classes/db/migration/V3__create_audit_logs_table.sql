CREATE TABLE audit_logs (
                            id BIGSERIAL PRIMARY KEY,
                            action VARCHAR(100) NOT NULL,
                            username VARCHAR(150),
                            endpoint VARCHAR(255),
                            ip_address VARCHAR(100),
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);