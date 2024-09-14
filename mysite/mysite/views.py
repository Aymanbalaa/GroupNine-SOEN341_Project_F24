from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from .forms import CustomUserCreationForm
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')  # Replace 'home' with the name of your homepage view
        
        else:
            print(form.errors)  # Log form errors to the console
    else:
        form = CustomUserCreationForm()
    return render(request, 'mysite/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')  # Replace 'home' with the name of your homepage view
        else:
            # Invalid login credentials
            return render(request, 'mysite/login.html', {'error': 'Invalid username or password'})
    return render(request, 'mysite/login.html')

@login_required
def home(request):
    user = request.user
    if user.user_type == 'student':
        greeting = f"Hello Student, {user.username}!"
    elif user.user_type == 'instructor':
        greeting = f"Hello Instructor, {user.username}!"
    else:
        greeting = f"Hello, {user.username}!"
    
    return render(request, 'mysite/home.html', {'greeting': greeting})