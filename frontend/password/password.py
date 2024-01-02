from flask import Flask, render_template, request, redirect

app = Flask(__name__)

# Hardcoded secret password (for demonstration purposes)
secret_password = "supersecret"

# Counter to keep track of the number of attempts
retry_count = 3

@app.route('/')
def index():
    return render_template('password_form.html', retry_count=retry_count)

@app.route('/check-password', methods=['POST'])
def check_password():
    global retry_count
    entered_password = request.form.get('password')

    # Check if the entered password matches the secret password
    if entered_password == secret_password:
        retry_count = 3  # Reset retry count on successful login
        # Redirect to the quiz pod upon successful login
        return redirect('/redirect-to-quizapp')
    else:
        retry_count -= 1

        if retry_count > 0:
            return render_template('password_form.html', retry_count=retry_count, message='Password is incorrect! Please try again.')
        else:
            retry_count = 3  # Reset retry count on reaching maximum attempts
            return render_template('password_form.html', retry_count=retry_count, message='Too many incorrect attempts. Please try again later.'), 401

# Add a route to handle the redirection
@app.route('/redirect-to-quizapp')
def redirect_to_quizapp():
    # Ensure the Kubernetes Service File in the Cluster uses this quizapp name and namespace:
    #return redirect('http://quizapp-clusterip.default.svc.cluster.local:8080') #<-- this is when using clusterIP LB
    #return redirect('http://192.168.49.2:31798') #<-- this is when using nodeport, I got the port after deploying the service
    print("redirecting to quiz app") #troubleshooting
    return redirect('http://127.0.0.1:52997')    #<-- this is when using nodeport, and local testing


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)