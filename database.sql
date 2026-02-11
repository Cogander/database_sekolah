CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    class VARCHAR(20),
    nis VARCHAR(50) UNIQUE
);

CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    subject VARCHAR(100)
);

CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    position VARCHAR(100)
);
