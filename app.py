from flask import Flask, jsonify
from flask_cors import CORS  # Import Flask-CORS
from pymongo import MongoClient
from apscheduler.schedulers.background import BackgroundScheduler
import requests
from bs4 import BeautifulSoup
import datetime
import json
import logging

logging.basicConfig(level=logging.INFO)

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for the entire application
CORS(app, origins=["*"])  # Adjust for development. Restrict origins for production.

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["content_database"]
content_collection = db["content"]

# Apply CSP headers before each request
@app.before_request
def force_headers():
    response = jsonify()  
    # Create a placeholder response
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' https://f9c9-14-0-157-247.ngrok-free.app; "
        "connect-src 'self' https://f9c9-14-0-157-247.ngrok-free.app;"
    )
    return response

# Apply CSP headers after each request
@app.after_request
def apply_csp(response):
    # Allow resources from the same origin and specified external sources
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' https://f9c9-14-0-157-247.ngrok-free.app; "
        "connect-src 'self' https://f9c9-14-0-157-247.ngrok-free.app;"
    )
    return response

# Crawl and scrape function
def scrape_data():
    logging.info("Starting scrape_data job...")
    try:
        with open("sources.json", "r") as file:
            sources = json.load(file)

        for source in sources:
            try:
                response = requests.get(source["url"])
                logging.info(f"Scraping {source['url']}")
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all('article')  # Adjust for actual site structure
                for article in articles:
                    title = article.find('h2').text.strip()
                    description = article.find('p').text.strip()
                    timestamp = datetime.datetime.utcnow().isoformat()

                    content_collection.update_one(
                        {"title": title},
                        {"$set": {
                            "description": description,
                            "timestamp": timestamp,
                            "category": source["category"],
                            "source_url": source["url"],
                            "tags": []
                        }},
                        upsert=True
                    )
            except Exception as e:
                logging.error(f"Error scraping {source['url']}: {e}")
    except Exception as e:
        logging.error(f"Error loading sources.json: {e}")

# Schedule the scraping task
scheduler = BackgroundScheduler()
scheduler.add_job(scrape_data, 'interval', hours=12)  # Run every 12 hours
scheduler.start()

# API endpoint
@app.route('/api/content', methods=['GET'])
def get_content():
    try:
        # Fetch content from MongoDB
        content = list(content_collection.find({}, {"_id": 0}))
        logging.info(f"Content retrieved from database: {content}")
        return jsonify(content)
    except Exception as e:
        logging.error(f"Error retrieving content: {e}")
        return jsonify({"error": "Failed to retrieve content"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
