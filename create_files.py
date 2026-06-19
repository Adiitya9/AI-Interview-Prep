import os

BASE_DIR = '/Users/adityamacbook/Documents/Resume Project/backend/src/main/java/com/interviewprep'

directories = [
    'dto/response',
    'exception',
    'security',
    'config',
    'util',
    'service/impl',
    'controller'
]

for d in directories:
    os.makedirs(os.path.join(BASE_DIR, d), exist_ok=True)
print("Directories created.")
