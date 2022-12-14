import React, {Component} from "react";
import classes from './Quiz.module.css'
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";

class Quiz extends Component {
    state = {
        results: {}, // {[id]: success error}
        isFinished: false,
        activeQuestion: 0,
        answerState: null, // { [id]: 'success' 'error' }
        quiz: [
            {
                question: 'Какого цвета небо?',
                rightAnswerId: 2,
                id: 1,
                answers: [
                    { text: 'Черный', id: 1},
                    { text: 'Синий', id: 2 },
                    { text: 'Желтый', id: 3 },
                    { text: 'Красный', id: 4 }
                ]
            },
            {
                question: 'В каком году основали Санкт-Петербург?',
                rightAnswerId: 2,
                id: 2,
                answers: [
                    { text: '1700', id: 1},
                    { text: '1703', id: 2 },
                    { text: '1702', id: 3 },
                    { text: '1803', id: 4 }
                ]
            }
        ]
    }

    onAnswerClickHandler = (answerId) => {        
        if (this.state.answerState) {
            const key = Object.keys(this.state.answerState)[0] // возращаем id из стейта
            
            if (this.state.answerState[key] === 'success') return // если стейт по id равен успеху, то ничего не делаем, идем дальше
        }

        const question = this.state.quiz[this.state.activeQuestion] // получаем вопрос
        const results = this.state.results

        if (question.rightAnswerId === answerId) { // если правильный вопрос равен выбранному ответа
            if (!results[question.id]) {
                results[answerId] = 'success'
            }
           
            this.setState({
                answerState: {[answerId]: 'success'}, // меняем состояние на "успех"
                results: results
            })

            const timeout = window.setTimeout(() => { // делаем проверку на конец опросника
                if (this.isQuizFinished()) {
                    this.setState({
                        isFinished: true
                    })
                } else {
                    this.setState({ // если не конец, то переходим к след вопросу
                        activeQuestion: this.state.activeQuestion + 1,
                        answerState: null
                    })
                }
                window.clearTimeout(timeout)
            }, 1000)
        } else {
            results[question.id] = 'error'
            this.setState({ // если правильный ответ неравен выбранному ответу, то меняем состояние на "ошибка"
                answerState: { [answerId]: 'error' },
                results: results
            })
        }
    } 

    isQuizFinished() {
        return this.state.activeQuestion + 1 === this.state.quiz.length // закончилось, если id след вопроса равен общему количеству вопросов
    }

    render() {
        return (
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h1>Ответьте на все вопросы</h1>
                    {
                        this.state.isFinished 
                        ? <FinishedQuiz 
                            results={this.state.results}
                            quiz={this.state.quiz}
                        />
                        : <ActiveQuiz 
                            answers={this.state.quiz[this.state.activeQuestion].answers}
                            question={this.state.quiz[this.state.activeQuestion].question}
                            onAnswerClick={this.onAnswerClickHandler}
                            quizLength={this.state.quiz.length}
                            answerNumber={this.state.activeQuestion + 1}
                            state={this.state.answerState}
                        />
                    }
                </div>
            </div>
        )
    }
}

export default Quiz