import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import ApiContext from '../ApiContext';
import config from '../config';
import './App.css';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import NotefulErrors from '../noteful-error-boundaries';

class App extends Component {
    
    state = {
        notes: [],
        folders: [],
        newFolder: {
            hasError: false,
            touched: false,
            name: '',
        },
        newNote: {
            name: {
                touched: false,
                value:'',
            },
        folder_id: {
                touched: false,
                value: '',
              },
        content: {
                touched: false,
                value: '',
              },
        }
    };

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});
            })
            .catch(error => {
                console.error({error});
            });
    }

   
    updateNewFolderName = name => {
        this.setState({
          newFolder: {
            hasError: false,
            touched: true,
            name: name,
          },
        })
      }

    handleAddFolder = newFolder => {
        this.setState({
            folders: [...this.state.folders, newFolder]
        })
    }

    updateNewNoteData = (input, value) => {
        this.setState({
          newNote: {
              ...this.state.newNote,
            [input]: {
              touched: true,
              value: value,
            },
          },
        })
      }

    handleAddNote = newNote => {
        this.setState({
            notes: [...this.state.notes, newNote]
        })
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };

    getNumberOfNotes = (notes=[], folderId) => (
        notes.filter(note => note.folderId === folderId).length)
 
   findFolder = (folders=[], folderId) =>
   folders.find(folder => folder.id === folderId)

  findNote = (notes=[], noteId) =>
  notes.find(note => note.id === noteId)

  getNotesForFolder = (notes=[], folderId) => (
  (!folderId)
  ? notes
  : notes.filter(note => note.folderId === folderId)
)

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageMain} />
                <Route path="/add-folder" component={AddFolder} />
                <Route path="/add-note" component={AddNote} />
            </>
        );
    }

    render() {
        const value = {
            updateNewNoteData:this.updateNewNoteData,
            notes: this.state.notes,
            folders: this.state.folders,
            findFolder:this.findFolder,
            deleteNote: this.handleDeleteNote,
            addFolder: this.handleAddFolder,
            updateNewFolderName: this.updateNewFolderName,
            newFolder: this.state.newFolder,
            newNote: this.state.newNote,
            handleAddNote: this.handleAddNote,
            getNumberOfNotes:this.getNumberOfNotes,
            findNote: this.findNote,
            getNotesForFolder: this.getNotesForFolder

        };
        return (
            <ApiContext.Provider value={value}>
                <NotefulErrors>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
                </NotefulErrors>
            </ApiContext.Provider>
        );
    }
}

export default App;