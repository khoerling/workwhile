import Head from 'next/head'
import { useState } from 'react'

const Question = (row) => {
  const { question, answers=[], correct_index, readOnly=false, onSelectAnswer } = row
  console.log(row)
  // TODO refactor classNames using `classnames` pkg
  return (
    <section>
      <h1>{question}</h1>
      <ul className={`${readOnly && 'read-only'}`}>
        {answers
          .map((answer, selected) =>
            readOnly
              ? <li
                  key={selected}
                  className={`${selected === correct_index && 'correct'} ${(row.selectedIndex !== correct_index) && selected === row.selectedIndex && 'incorrect'}`}
                >{answer}</li>
              : <li key={selected} onClick={onSelectAnswer(row, selected)}>{answer}</li>)}
      </ul>
      <style jsx>{`
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          padding: .5em 1em;
          cursor: pointer;
          border-radius: 3px;
        }
        li:hover {
          background-color: rgba(0,0,0,.1);
        }
        ul.read-only {
          cursor: inherit;
        }
        li.correct { background-color: green; }
        li.incorrect { background-color: red; }
      `}</style>
    </section>
  )
}

const FinalScore = ({answeredQuestions}) =>
  <div>
    <h1>Your Results</h1>
    {answeredQuestions
      .map((question, i) =>
        <Question key={i} {...answeredQuestions[i]} readOnly={true} />)}
  </div>

const Home = function(props) {
  const
    totalQuestions = props.questions.length - 1,
    [currentQuestion, setCurrentQuestion] = useState(0),
    [answeredQuestions, setAnsweredQuestion] = useState([])
  const
    onSelectAnswer = (row, selectedIndex) => {
      // save answer
      setAnsweredQuestion([...answeredQuestions, {...row,  selectedIndex}])
      console.log(`on ${row.question}; selected ${selectedIndex}`)
      // next question
      setCurrentQuestion(currentQuestion + 1)
      console.log(isFinished())
    },
    isFinished = () => currentQuestion >= totalQuestions
  return (
    <div className="container">
      <Head>
        <title>WorkWhile Challenge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {isFinished()
          ? <FinalScore answeredQuestions={answeredQuestions} />
          : <Question {...props.questions[currentQuestion]} onSelectAnswer={onSelectAnswer} />}
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          font-size: 20px;
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

Home.getInitialProps = async (ctx) => {
  const
    res = await fetch('http://interview.workwhilejobs.com/quiz/questions'),
    questions = await res.json()
  return { questions }
}

export default Home
