# 交大電機的夜網頁


## Getting Started

Make sure you have python3 and virtualenv in your local machine

1. Setup virtualenv, inside the django project run this command
```
    virtualenv -p python3 env
``` 
2. Install required depencies
```
    pip install -r requirements.txt
```
Note: If install failed, upgrade requests first
```
    pip install --upgrade requests
```

Then try running the pip install -r requirements.txt again


3. Start the server
```
    python manage.py runserver
```
4. Go to http://localhost:8000/main and try clicking the login button