from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/parsing/news', methods=['POST'])
def parse_news():
    url = 'https://lib.social/news'
    item_class = 'news-feed-item'
    title_class = 'news-feed-item__title'

    response = requests.get(url)
    html = response.text
    soup = BeautifulSoup(html, 'lxml')
    items = soup.find_all('div', class_=item_class)

    data = []
    for item in items:
        title_tag = item.find('h2', class_=title_class)
        if title_tag:
            title = title_tag.text.strip()
            link = title_tag.find('a')['href']
            data.append({'title': title, 'link': link})

    return jsonify(data)

@app.route('/parsing/forum', methods=['POST'])
def parse_forum():
    url = 'https://lib.social/forum/?category=all&title&user_id&subscription=0&page=1&sort=newest'
    item_class = 'discussion-item'
    title_class = 'discussion-item__name'

    response = requests.get(url)
    html = response.text
    soup = BeautifulSoup(html, 'lxml')
    items = soup.find_all('div', class_=item_class)

    data = []
    for item in items:
        title_tag = item.find('h2', class_=title_class)
        if title_tag:
            title = title_tag.text.strip()
            link = title_tag.find('a')['href']
            data.append({'title': title, 'link': link})

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)