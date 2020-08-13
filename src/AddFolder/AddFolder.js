import React, {Component} from 'react';
import config from '../config';
import ApiContext from '../ApiContext';
import './AddFolder.css'
import PropTypes from 'prop-types'


export default class AddFolder extends Component {
    static contextType = ApiContext;

    addNewFolder = (name) => {
        fetch(`${config.API_ENDPOINT}/folders/`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({name})
        })
        .then(res => res.json())
        .then(data => this.context.addFolder(data))
        .catch(error => {
            console.error({error});
        });
    }

    
    
    handleSubmit(event) {
        event.preventDefault();
        let newFolder = event.target.newFolder.value;
        this.addNewFolder(newFolder);
        this.props.history.goBack();
    }

    updateFolderName(e) {
        const newName = e.target.value;
          this.context.updateNewFolderName(newName);
      }    

      validateFolderName () {
          if (this.context.newFolder.name.trim() === 0) {
              return "Please enter a folder name"
          }
          else if (this.context.newFolder.name.trim().length <= 3) {
              return "The name must be at least 3 characters long"
          }
      }

      render() {
          return(
              <>
              <header>
                <h1 className = "add-folder-header"> Add a new folder</h1>
              </header>
              <form className="add-folder-form" onSubmit={e => this.handleSubmit(e)}>
              <label htmlFor="newFolder">
                  Name: 
                  {this.context.newFolder.touched && (
                      <p>{this.validateFolderName()}</p>
                  )}
              </label>
              <input
              type="text"
              name="newFolder"
              id="newFolder"
              aria-required="true"
              aria-label="Name"
              onChange={(e) => this.updateFolderName(e)} />
              <button type="submit">Submit</button>
            </form>
            </> 
          )
      }
}

AddFolder.propTypes = {
    history: PropTypes.object
  }