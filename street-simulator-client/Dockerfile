FROM python:latest

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
RUN pip install paho-mqtt pymongo

# Bundle app source
COPY . /app

CMD [ "python", "streetSimulator.py" ]