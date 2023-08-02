#para cuando haya algun error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
