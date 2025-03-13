-- PRAGMA foreign_keys=OFF;
-- BEGIN TRANSACTION;

CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL
);

INSERT INTO users (id, email, password, role) VALUES
(1, 'test@gmail.com', 'test123', 'admin'),
(2, 'test2@gmail.com', 'admin123', 'admin'),
(3, 'sale@gmail.com', '$2b$10$KbZL99JMNa4/Bb8MnxMbwudtz3.IQnhnoOxDJbeTMfbPoEx7L5REG', 'salesperson'),
(4, 'sale1@gmail.com', '$2b$10$AMeM3/zTST9g6dYcUtDYr.QdiS4A/VmUP613go.HGfNCnG18VrUp.', 'salesperson'),
(5, 'admin', '$2b$10$4UehWsVeRv969819vFmTqOBqG4WOWRHUdZLkSNHJhKZY1JDum/8re', 'admin'),
(6, 'bash', '$2b$10$1ybhnxyHCIx.73ncuKOppurq7GLnZah/vXhKA.BPxlSYZwgXEg1MO', 'salesperson');

-- INSERT INTO sqlite_sequence VALUES('users',6);

-- COMMIT;
