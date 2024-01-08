from flask import Flask, render_template, request, redirect, jsonify
import requests

app = Flask(__name__)

# Hardcoded secret password
secret_password = "admin"

# Counter to keep track of the number of password attempts
retry_count = 3

# URL of the endpoint in Pod 2 to send messages
pod2_endpoint_url = "http://quizapp.default.svc.cluster.local:8080/message-from-pod1"

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

        # Send a message to Pod 2
        send_message_to_pod2()

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

# Add a route to handle the redirection
@app.route('/redirect-to-quizapp')
def redirect_to_quizapp():
    print("Redirecting to http://quizapp.default.svc.cluster.local:8080")
    return redirect('http://quizapp.default.svc.cluster.local:8080')

# Function to send a message to Pod 2
def send_message_to_pod2():
    message = "Hello from Pod 1!"
    response = requests.post(pod2_endpoint_url, json={"message": message})
    
    if response.status_code == 200:
        print("Message sent to Pod 2 successfully")
    else:
        print(f"Failed to send message to Pod 2. Status code: {response.status_code}")

# Route to receive messages from Pod 1
@app.route('/message-from-pod1', methods=['POST'])
def receive_message_from_pod1():
    data = request.get_json()
    message = data.get('message')
    
    # Do something with the received message, for example:
    print(f"Received message from pod1: {message}")

    # Return a response if needed
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
