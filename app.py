from flask import Flask, request, render_template
import requests
from bs4 import BeautifulSoup
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/parse', methods=['POST'])
def parse():
    url = request.form['url']
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)
        response.raise_for_status()  # Проверка на HTTP ошибки
        soup = BeautifulSoup(response.text, 'lxml')
        comments = soup.find_all('li', class_='comment-item js-comment')

        reviews = []
        for comment in comments:
            author = comment.get('data-author', 'Неизвестно')
            if 'Официальный комментарий' in author:
                continue
            gender = comment.get('data-author-gender', 'Неизвестно')
            comment_id = comment.get('data-id', 'Неизвестно')
            review_text_element = comment.find('span', class_='js-comment-content')
            review_text = review_text_element.text.strip() if review_text_element else 'Нет текста'

            phone_review_element = comment.find('div', class_='z-text--13 z-text--dark-gray invisible-links')
            if phone_review_element and 'отзыв по телефону' in phone_review_element.text:
                phone_review_element.decompose()

            rating_element = comment.find('div', class_='z-text--16 z-text--bold')
            rating = rating_element.text.strip() if rating_element else 'Нет рейтинга'
            date_published_element = comment.find('div', class_='z-text--13 z-text--dark-gray invisible-links')
            date_published = date_published_element.text.strip() if date_published_element else 'Нет даты'

            if gender == 'F':
                gender = 'Женский'
            elif gender == 'M':
                gender = 'Мужской'

            review_info = {
                "author": author,
                "comment_id": comment_id,
                "review_text": review_text,
                "rating": rating,
                "date_published": date_published
            }
            reviews.append(review_info)

        return render_template('index.html', reviews=reviews)
    except requests.exceptions.RequestException as e:
        return f"An error occurred: {e}"

if __name__ == '__main__':
    app.run(debug=True)
