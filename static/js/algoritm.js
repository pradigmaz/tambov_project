var currentState = 'start';

function goBackToStart() {
  document.getElementById('button1').style.display = '';
  document.getElementById('button2').style.display = '';
  document.getElementById('linkButtons').style.display = 'none';
  document.getElementById('output_result').innerHTML = '';
  document.getElementById('back1').style.display = 'none';
  document.getElementById('back2').style.display = 'none';
  document.getElementById('download').style.display = 'none';
  currentState = 'start';
}

function goBackToFirstAction() {
  document.getElementById('button1').style.display = 'none';
  document.getElementById('button2').style.display = 'none';
  document.getElementById('linkButtons').style.display = 'none';
  document.getElementById('output_result').innerHTML = '';
  document.getElementById('back1').style.display = '';
  document.getElementById('back2').style.display = 'none';
  document.getElementById('download').style.display = 'none';
  currentState = 'firstAction';
}

function fetchNews() {
  fetch('/parsing/news', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    let output = document.getElementById('output_result');
    output.innerHTML = '';
    let linkButtons = document.getElementById('linkButtons');
    linkButtons.innerHTML = '';
    data.forEach(item => {
      let button = document.createElement('button');
      button.className = 'target-button news-button'; // Добавляем класс news-button
      button.innerHTML = item.title;
      button.onclick = function() {
        showModal(item.title, item.link);
      };
      linkButtons.appendChild(button);
    });
    document.getElementById('button1').style.display = 'none';
    document.getElementById('button2').style.display = 'none';
    linkButtons.style.display = 'grid';
    document.getElementById('back1').style.display = '';
  })
  .catch(error => console.error('Error:', error));
}

function fetchNewsBody(link) {
  fetch('/parsing/news_body', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ link: link })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('newsModalBody').innerHTML = data.content;
  })
  .catch(error => console.error('Error:', error));
}

function showModal(title, link) {
  document.getElementById('newsModalLabel').innerText = title;
  fetchNewsBody(link);
  let newsModal = new bootstrap.Modal(document.getElementById('newsModal'));
  newsModal.show();
}

function fetchForumTopics() {
  fetch('/parsing/forum', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    let output = document.getElementById('output_result');
    output.innerHTML = '';
    let linkButtons = document.getElementById('linkButtons');
    linkButtons.innerHTML = '';
    data.forEach(item => {
      let button = document.createElement('button');
      button.className = 'target-button forum-button'; // Добавляем класс forum-button
      button.innerHTML = item.title;
      button.onclick = function() {
        window.open(item.link, '_blank');
      };
      linkButtons.appendChild(button);
    });
    document.getElementById('button1').style.display = 'none';
    document.getElementById('button2').style.display = 'none';
    linkButtons.style.display = 'grid';
    document.getElementById('back1').style.display = '';
  })
  .catch(error => console.error('Error:', error));
}

document.getElementById('button1').onclick = function () {
  fetchNews();
};

document.getElementById('button2').onclick = function () {
  fetchForumTopics();
};

document.getElementById('action1').onclick = function () {
  document.getElementById('action1').style.display = 'none';
  document.getElementById('action2').style.display = 'none';
  document.getElementById('back1').style.display = 'none';
  document.getElementById('actionResult').style.display = '';
  document.getElementById('back2').style.display = '';
  document.getElementById('download').style.display = '';
  currentState = 'secondAction';
};

document.getElementById('action2').onclick = function () {
  document.getElementById('action1').style.display = 'none';
  document.getElementById('action2').style.display = 'none';
  document.getElementById('back1').style.display = 'none';
  document.getElementById('actionResult').style.display = '';
  document.getElementById('back2').style.display = '';
  document.getElementById('download').style.display = '';
  currentState = 'secondAction';
};
