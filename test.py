from flask import Flask, request, render_template_string
import sqlite3

app = Flask(__name__)

# Database setup (for demonstration purposes)
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT)')
    c.execute('INSERT INTO users (username, password) VALUES (?, ?)', ('admin', 'password123'))
    conn.commit()
    conn.close()

# Login function
def check_user(username, password):
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    # Vulnerable SQL query
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    c.execute(query)
    result = c.fetchone()
    conn.close()
    return result

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = check_user(username, password)
        if user:
            return f"Welcome, {username}!"
        else:
            return "Invalid credentials!", 401
    return '''
        <form method="POST">
            Username: <input type="text" name="username" required>
            Password: <input type="password" name="password" required>
            <button type="submit">Login</button>
        </form>
    '''

if __name__ == '__main__':
    init_db()
    app.run(debug=True)