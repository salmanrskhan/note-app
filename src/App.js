import './App.css';
import React, { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
// import { data } from "./data"
import Split from "react-split"
import { nanoid } from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { notesCollection, db } from './firebase';


function App() {

  // const [notes, setNotes] = useState(
  //   JSON.parse(localStorage.getItem("notes")) || []
  //   )

  //Lazily initialize
  // Example
  //   const [state, setState] = React.useState(
  //     () => console.log("State initialization")
  // )

  // for local sotrage
  // const [notes, setNotes] = useState(
  //   () => JSON.parse(localStorage.getItem("notes")) || []
  // )

  const [notes, setNotes] = useState([])

  // const [currentNoteId, setCurrentNoteId] = useState(
  //   (notes[0] && notes[0].id) || ""
  // )

  // new method notes[0] &&
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0]?.id) || ""
  )

  const currentNote =
    notes.find(note => note.id === currentNoteId)
    || notes[0]

  const sortedNotes = notes.sort((a,b) => b.updatedAt - a.updatedAt)

  // for local
  // useEffect(() => {
  //   localStorage.setItem("notes", JSON.stringify(notes))
  //   // console.log((notes[0].body.split('\n')))
  // }, [notes])


  // FOr firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      // Sync up our local notes array with the snapshot data
      const notesArr = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      setNotes(notesArr)
    })
    return unsubscribe
  }, [])


  // local and normal
  // function createNewNote() {
  //   const newNote = {
  //     id: nanoid(),
  //     body: "# Type your markdown note's title here"
  //   }
  //   setNotes(prevNotes => [newNote, ...prevNotes])
  //   setCurrentNoteId(newNote.id)
  // }


  // firebase
  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      // createdAt: Date.now(),
      // updatedAt: Date.now()
    }
    const newNoteRef = await addDoc(notesCollection, newNote)
    setCurrentNoteId(newNoteRef.id)
  }

  // Put the most recently-modified note at the top
  // function updateNote(text) {
  //   // Create a new empty array
  //   // Loop over the original array
  //   // if the id matches
  //   // put the updated note at the 
  //   // beginning of the new array
  //   // else
  //   // push the old note to the end
  //   // of the new array
  //   // return the new array
  //   setNotes(oldNotes => {
  //     const newArray = []
  //     for (let i = 0; i < oldNotes.length; i++) {
  //       const oldNote = oldNotes[i]
  //       if (oldNote.id === currentNoteId) {
  //         newArray.unshift({ ...oldNote, body: text })
  //       }
  //       else {
  //         newArray.push(oldNote)
  //       }
  //     }
  //     return newArray
  //   })
  // }

  // old one, not update latest one
  // function updateNote(text) {
  //   setNotes(oldNotes => oldNotes.map(oldNote => {
  //     return oldNote.id === currentNoteId
  //       ? { ...oldNote, body: text }
  //       : oldNote
  //   }))
  // }


  // firebase
  async function updateNote(text) {
    // const isEmpty = !text.trim();
    // if (isEmpty) {
    //   await deleteNote(currentNoteId);
    //   return;
    // }
    const docRef = doc(db, 'notes', currentNoteId)
    await setDoc(docRef,
      { body: text, updatedAt: Date.now() },
      { merge: true })
  }


  //Filter method
  // function deleteNote(event, noteId) {
  //   event.stopPropagation()
  //   setNotes(oldNotes => oldNotes.filter( note => note.id !== noteId))
  // }


  // firebase
  async function deleteNote(noteId) {
    const docRef = doc(db, 'notes', noteId)
    await deleteDoc(docRef)
  }

  // Normal with plain js
  // function deleteNote(event, noteId) {
  //   event.stopPropagation();
  //   const updatedNotes = [];
  //   for (let i = 0; i < notes.length; i++) {
  //     if (notes[i].id !== noteId) {
  //       updatedNotes.push(notes[i]);
  //     }
  //   }

  //   setNotes(updatedNotes);
  // }

  // passing two time, slider and editor. so make change above^ | currentNote
  // function findCurrentNote() {
  //   return notes.find(note => {
  //     return note.id === currentNoteId
  //   }) || notes[0]
  // }

  return (
    <main>
      {
        notes.length > 0
          ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={sortedNotes}
              // currentNote={findCurrentNote()}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote={deleteNote}
            />
            {
              currentNoteId &&
              notes.length > 0 &&
              <Editor
                currentNote={currentNote}
                updateNote={updateNote}
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>

      }
    </main>
  );
}

export default App;
