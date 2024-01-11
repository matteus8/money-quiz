from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import os

app = Flask(__name__)

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Hardcoded secret password
secret_password = "admin"

# Counter to keep track of the number of password attempts
retry_count = 3

@app.route('/')
def index():
    print("Rendering password_form.html")
    return render_template('password_form.html', retry_count=retry_count)

@app.route('/check-password', methods=['POST'])
def check_password():
    global retry_count
    entered_password = request.form.get('password')

    print(f"Entered password: {entered_password}")

    # Check if the entered password matches the secret password
    if entered_password == secret_password:
        retry_count = 3  # Reset retry count on successful login
        print("Redirecting to /redirect-to-quizapp")
        # Redirect to the quiz pod upon successful login
        return redirect('/redirect-to-quizapp')
    else:
        retry_count -= 1

        if retry_count > 0:
            print(f"Password is incorrect! Retry count: {retry_count}")
            return render_template('password_form.html', retry_count=retry_count, message='Password is incorrect! Please try again.')
        else:
            retry_count = 3  # Reset retry count on reaching maximum attempts
            print("Too many incorrect attempts. Please try again later.")
            return render_template('password_form.html', retry_count=retry_count, message='Too many incorrect attempts. Please try again later.'), 401


@app.route('/redirect-to-quizapp')
def redirect_to_quizapp():
    return render_template('quiz-page/index.html')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)



