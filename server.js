const { dom } = require('isomorphic-jsx');

const express = require('express');
const app = express();

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

const Quiz = ({ movie, beer }) => (
  <Page>
    <h1>Guess!</h1>
    <a href="/">Go back</a>
    <hr />
    <h3 id="points"></h3>
    <div>
      (here comes the question)
    </div>

    <div>
      <button type="button" onclick="guess('beer')">Beer</button>
      <button type="button" onclick="guess('movie')">Movie</button>
    </div>

    <script type="application/javascript">
      var points = 0;
      var pointsContainer = document.getElementById('points');
    
      {function renderPoints() {
        pointsContainer.innerHTML = points;
      }}
      {function guess(index, answer) {
        fetch('/quiz/answer', {
          method: 'post',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ index, answer }),
        })
          .then(data => data.text())
          .then(correct => {
            if (correct) {
              points++;
            } else {
              points--;
            }

            renderPoints();
          });
      }}

      renderPoints();
    </script>
  </Page>
);

app.get('/', (req, res) => {
  res.send(<Home />);
});

app.get('/quiz', (req, res) => {
  res.send(<Quiz />);
});

app.listen(1024, () => console.log('listening on http://localhost:1024'));
