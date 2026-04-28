import jwt
import time

secret = 'my-secret-key-my-secret-key-12345'
payload = {
    'sub': 'test@test.com',
    'userId': 7,
    'iat': int(time.time()),
    'exp': int(time.time()) + 3600
}

token = jwt.encode(payload, secret, algorithm='HS256')
print(token)
