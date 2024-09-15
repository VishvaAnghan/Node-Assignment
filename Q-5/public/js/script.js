$(document).ready(function() {
    // Register
    $('#register-form').submit(function(event) {
        event.preventDefault();
        const username = $('#register-username').val();
        const password = $('#register-password').val();
        $.ajax({
            url: '/auth/register',
            type: 'POST',
            data: { username, password },
            success: function(response) {
                if (response.success) {
                    // Redirect to login page
                    window.location.href = '/login';
                } else {
                    alert('Registration failed: ' + response.message);
                }
            },
            error: function() {
                alert('An error occurred during registration.');
            }
        });
    });

    // Login
    $('#login-form').submit(function(event) {
        event.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();
        $.ajax({
            url: '/auth/login',
            type: 'POST',
            data: { username, password },
            success: function(response) {
                if (response.token) {
                    // Save token in localStorage or sessionStorage
                    localStorage.setItem('authToken', response.token);
                    // Redirect to students page
                    window.location.href = '/students';
                } else {
                    alert('Login failed: ' + response.message);
                }
            },
            error: function() {
                alert('An error occurred during login.');
            }
        });
    });

    // Copy Token
    $('#copy-token-button').click(function() {
        const token = $('#token-input').val();
        navigator.clipboard.writeText(token).then(function() {
            alert('Token copied to clipboard');
        });
    });

    // Add Student
    $('#student-form').submit(function(event) {
        event.preventDefault();
        const name = $('#student-name').val();
        const age = $('#student-age').val();
        const course = $('#student-course').val();
        const token = localStorage.getItem('authToken');
        $.ajax({
            url: '/students',
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: { name, age, course },
            success: function() {
                alert('Student added');
                loadStudents();
            },
            error: function() {
                alert('Failed to add student');
            }
        });
    });

    // Load Students
    function loadStudents() {
        const token = localStorage.getItem('authToken');
        $.ajax({
            url: '/students',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(students) {
                $('#students-list').empty();
                students.forEach(student => {
                    $('#students-list').append(`<li>${student.name} (${student.age}) - ${student.course}</li>`);
                });
            },
            error: function() {
                alert('Failed to load students');
            }
        });
    }
});
