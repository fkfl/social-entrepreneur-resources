from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import requests
import sqlite3
import time

# Database setup
conn = sqlite3.connect('resources.db')
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY,
    section TEXT,
    title TEXT,
    description TEXT,
    timestamp TEXT
)
""")
conn.commit()

# Example crawler
def crawl_url(url, section):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        articles = soup.select('article')  # Adjust the selector for the target site
        for article in articles:
            title = article.select_one('h2').text.strip()
            description = article.select_one('p').text.strip()
            timestamp = time.strftime('%Y-%m-%dT%H:%M:%SZ')
            cursor.execute("INSERT INTO resources (section, title, description, timestamp) VALUES (?, ?, ?, ?)",
                           (section, title, description, timestamp))
        conn.commit()
    except Exception as e:
        print(f"Error crawling {url}: {e}")

# Example scraper for sites with restrictions
def scrape_dynamic_site(url, section):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get(url)
    time.sleep(3)  # Wait for dynamic content to load
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    articles = soup.select('article')  # Adjust the selector for the target site
    for article in articles:
        title = article.select_one('h2').text.strip()
        description = article.select_one('p').text.strip()
        timestamp = time.strftime('%Y-%m-%dT%H:%M:%SZ')
        cursor.execute("INSERT INTO resources (section, title, description, timestamp) VALUES (?, ?, ?, ?)",
                       (section, title, description, timestamp))
    conn.commit()
    driver.quit()

# Automate tasks
crawl_url('https://example.com/feeds', 'feeds')
scrape_dynamic_site('https://example.com/funding', 'funding')

conn.close()
