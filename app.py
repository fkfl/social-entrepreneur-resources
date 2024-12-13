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
CORS(app, origins=["*"])  # Adjust origins as needed (e.g., specify your frontend URL)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["content_database"]
content_collection = db["content"]

# Crawl and scrape function
def scrape_data():
    logging.info("Starting scrape_data job...")
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

# Schedule the scraping task
scheduler = BackgroundScheduler()
scheduler.add_job(scrape_data, 'interval', hours=12)  # Run every 12 hours
scheduler.start()

# API endpoint
@app.route('/api/content', methods=['GET'])
def get_content():
    try:
        content = list(content_collection.find({}, {"_id": 0}))
        return jsonify(content)
    except Exception as e:
        logging.error(f"Error retrieving content: {e}")
        return jsonify({"error": "Failed to retrieve content"}), 500

if __name__ == "__main__":
    app.run(debug=True)
