export const eventSchema = `CREATE TABLE IF NOT EXISTS events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_name VARCHAR(255) NOT NULL UNIQUE,
    event_description VARCHAR(300) NOT NULL,
    event_type ENUM ('free', 'paid') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    event_status ENUM ('active', 'inactive') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    
);`

