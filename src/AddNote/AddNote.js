import React from 'react';
import config from '../config'
import ApiContext from '../ApiContext'
import './addnote.css'


export default class AddNote extends React.Component{
    static contextType=ApiContext;

    addNewNote = note => {

        note.modified = new Date(note.modified);

        fetch(`${config.API_ENDPOINT}/notes`, {
            method: "POST",
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(note),
    })
    .then(res=> {
        return res.json()
    })
    .then(resJSON => this.context.handleAddNote(resJSON))
    .catch(error => {
        console.error({error});
    });
}
 handleFormSubmit = e => {
     e.preventDefault();
     if(this.checkName()|| this.checkContent() ) {
         return
     }
     const newNote = {
         name: e.target.name.value,
         content: e.target.content.value,
         folderId: e.target.folders.value,
         modified: new Date()
     }
     this.addNewNote(newNote);
     this.props.history.push('/');
    
 }

 checkName = () => {
    console.log(this.context.newNote); 
    if(this.context.newNote.name.value.trim().length ===0)  {
         return 'Please enter a name'
     }
 }

 checkContent = () => {
    if (this.context.newNote.content.value.trim().length ===0) {
        return ' Please add content for the note'
    }
 }


 createFoldersList = () => {
    return this.context.folders.map(folder => (
        <option key={folder.id} name={folder.id} value={folder.id}>
          {folder.name}
        </option>
      ))
 }

 
 

 render() {
     return (
         <>
         <header>
             <h1> Please add a new note!</h1>
         </header>
         <form
            className="add-note"
            onSubmit={e => this.handleFormSubmit(e)}
            >
         <label htmlFor="name">
             Name
            {this.context.newNote.name.touched && <p>{this.checkName()}</p>}
         </label>
         <input
          type="text"
          name="name"
          id="content"
          aria-required="true"
          aria-label="Description"
          onChange={e => this.context.updateNewNoteData(e.target.name, e.target.value)}
     
     />
     <label htmlFor="content">
         Description
         {this.context.newNote.content.touched && (
             <p>{this.checkContent()}</p>
         )}
     </label>
     <input
      type="text"
      name="content"
      id="content"
      aria-required="true"
      aria-label="Description"
      onChange={e => this.context.updateNewNoteData(e.target.name, e.target.value)}
      />
     <label htmlFor="folders">Select a Folder</label>
     <select
     name="folders"
     id="folders"
     aria-required="true"
     aria-label="Select a folder"
    >
    {this.createFoldersList()}
    </select>
    <button type="submit">Submit</button>
    </form>
    </>
)
}
}
 