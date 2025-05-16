-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE
);

-- Create index on username
CREATE INDEX idx_users_username ON users(username);

-- Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- Create index on role name
CREATE INDEX idx_roles_name ON roles(name);

-- User Roles (Junction table for many-to-many relationship)
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Addresses table
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    address_type VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL
);

-- Create index on user_id for addresses
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Contacts table
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    contact_type VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20),
    mobile_number VARCHAR(20) NOT NULL
);

-- Create index on user_id for contacts
CREATE INDEX idx_contacts_user_id ON contacts(user_id);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('user', 'Standard user role'),
    ('admin', 'Administrator role');

-- Create a default admin user (password should be changed)
INSERT INTO users (username, hashed_password, full_name, is_active, is_superuser) VALUES
    ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN5Mbw/XIS.', 'System Administrator', true, true);

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'admin'; 