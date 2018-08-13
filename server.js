const { dom } = require('isomorphic-jsx');

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());

const Page = ({ children }) => (
  <html>
    <head></head>
    <body>
      <div style={{ margin: '0 auto', minWidth: 1024 }}>
        {children}
      </div>
    </body>
  </html>
);

const Home = () => (
  <Page>
    <h1>Is it a beer or is it a movie? CAN YOU FIGURE IT OUT?</h1>
    <a href="/quiz">Find out!</a>
  </Page>
);

const questions = [
  { question: 'Alesong', answer: 'beer' },
  { question: 'Dangerously Close to Stupid Amounts of Pineapple', answer: 'beer' },
  { question: 'Rubber', answer: 'movie' },
  { question: 'Frozen', answer: 'movie' },
  { question: 'Kriek Max', answer: 'beer' },
  { question: 'V for Vendetta', answer: 'movie' },
  { question: 'Nanny State', answer: 'beer' },
];

const questionsWithoutAnswers = questions.map(({ question }) => {
  return question;
});

const Quiz = ({ movie, beer }) => (
  <Page>
    <h1>Guess!</h1>
    <a href="/">Go back</a>
    <hr />
    <h3 id="points"></h3>
    <div id="question"></div>

    <div>
      <button type="button" onclick="guess('beer')">Beer</button>
      <button type="button" onclick="guess('movie')">Movie</button>
    </div>

    <script type="application/javascript">
      var questions = {JSON.stringify(questionsWithoutAnswers)};
      var index = 0;
      var questionContainer = document.getElementById('question');

      var points = 0;
      var pointsContainer = document.getElementById('points');

      {function renderPoints() {
        pointsContainer.innerHTML = points;
      }}
      {function renderQuestion() {
        questionContainer.innerHTML = questions[index];
      }}
      {function guess(answer) {
        fetch('/quiz/answer', {
          method: 'post',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ index, answer }),
        })
          .then(res => {
            if (res.ok) {
              points++;
            } else {
              points--;
            }

            renderPoints();

            index = (index + 1) % questions.length;
            renderQuestion();
          });
      }}

      renderPoints();
      renderQuestion();
    </script>
  </Page>
);

app.get('/', (req, res) => {
  res.send(<Home />);
});

app.get('/quiz', (req, res) => {
  res.send(<Quiz />);
});

app.post('/quiz/answer', (req, res) => {
  const { index, answer } = req.body;

  if (answer === questions[index].answer) {
    res.send();
  } else {
    res.status(400).send();
  }
});

app.listen(1024, () => console.log('listening on http://localhost:1024'));
