import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  function handleUpdateQuestion(id, correctIndex){
    const requestOptions = {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({correctIndex}),
    };

    fetch(`http://localhost:4000/questions/${id}`, requestOptions)
      .then(response => response.json())
      .then(updatedQuestion => {
        setQuestions(prevQuestions => prevQuestions.map(question => question.id === id ? updatedQuestion : question));
      })
      .catch(error => console.error('Error:', error));
  }

  function handleDeleteQuestion(id){
    fetch(`http://localhost:4000/questions/${id}`, {method: 'DELETE'})
      .then(response => response.json())
      .then(() => {
        setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== id));
      })
      .catch(error => console.error('Error:', error));
  }

  function handleQuestionSubmit(newQuestion){
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
  }

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ?
       <QuestionForm onQuestionSubmit={handleQuestionSubmit}/> : 
       <QuestionList questions={questions} onDeleteQuestion={handleDeleteQuestion} onUpdateQuestion={handleUpdateQuestion}/>}
    </main>
  );
}

export default App;
