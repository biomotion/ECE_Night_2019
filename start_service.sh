uwsgi --socket :8009 --processes 2 --module ECE_Night.wsgi -H env/ --max-requests=5000 --harakiri=20