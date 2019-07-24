FROM python:3.7.2

# We add a user for building the application. This user has write access to
# the source code directory.
RUN groupadd -r skiff-build && useradd -r -g skiff-build skiff-build

# Create a separate runtime user, so they can't write to the filesystem
RUN groupadd -r skiff-app && useradd -r -g skiff-app skiff-app

# Setup a spot for the api code
WORKDIR /usr/local/src/skiff/app/api
RUN chown -R skiff-build:skiff-build /usr/local/src/skiff

# Setup a spot for data that's writeable by the application
RUN mkdir /usr/local/src/skiff/app/api/scratch
RUN chown -R skiff-app:skiff-app /usr/local/src/skiff/app/api/scratch

# Install Python dependencies
COPY --chown=skiff-build:skiff-build requirements.txt .
RUN pip install -r requirements.txt

# Python dependencies work better when installed as root, so we don't swith
# to the build user until after they're in place
USER skiff-build

# Copy over the source code
COPY --chown=skiff-build:skiff-build app app/

# This enables the Flask debugger and activates code that restarts the
# API as you make changes
ARG FLASK_ENV=development
ENV FLASK_ENV $FLASK_ENV

# This allows imports in our API to be fully qualified, i.e. `from app.api`
# rather than `from api`.
ENV PYTHONPATH "/usr/local/src/skiff/app/api:${PYTHONPATH}"

# Change to the runtime user
USER skiff-app

# Kick things off
ENTRYPOINT [ "python" ]
CMD [ "app/start.py" ]
