import React, { useState,useRef } from 'react';
import { useEffect } from 'react';
import './App.css';
function App() {

  // Storing the user data in localstorage to validate the user (Since we have only one page. I am storing it in this page)
  localStorage.setItem('user','karthick@gmail.com');

  //This state holds all the field value
  const [formData, setFormData] = useState({
    subject: '',
    query: '',
    contact: '',
    files:[],
    criticality: ''

  });
  const fileInput = document.getElementById('fileInput');
  //this state is for retriving the user from user storage;
  const [user,setUser] = useState('');

  // //It refers the <input type=file>
  const fileInputRef = useRef(null);
  const selectFile = () => {
    fileInput.click();
  };

  //using useEffect hook to get the user data from localStorage, to make sure the user is logged in
  useEffect(()=>{
    const storedUser = localStorage.getItem('user');
    if(storedUser !== null) {
      setUser(storedUser);
    }
  },[]);

  //useEffect to send the request only if the formData.subject is not null.
  // This is to make sure that the set is updated before the request is sent. 
  useEffect(() => {
    console.log(formData);
    if (formData.subject!='') {
      console.log('hello'+formData);
      sendHttpRequest();
      formData.subject='';
    }
  }, [formData.subject]);
 
  const sendHttpRequest = () => {

    // Access the updated state value here and send the HTTP request
    // Example of sending an HTTP request using fetch

    fetch('http://localhost:8080/feedback', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers:{
        'Content-type':'application/json'
      }
    }).then(response => response.json())
      .then(data => {
        // Handle response data
        console.log(data);
      }).catch(error => {
        // Handle error
        console.error(error);
      });
  };

  //This function to handle the input values and to update the state.
  function handleSetState(event){
    const files=event.target.elements.file.files;
    var filesArray=[];
    var loadedCount=0;
    // This function is used to read the image files and convert into base64.

      function handleFileReader(file,reader){
          reader.readAsDataURL(file);            //converts into base64
          reader.onload = ()=>{                  
            filesArray.push(reader.result);      //pushes the result into a array
            loadedCount++;
           
            if (loadedCount === files.length) {     //to check that the all the images has been converted.
              setFormData(prevState=>({              //updating the state value.
                ...prevState,
                subject:  event.target.elements.subject.value,
                query: event.target.elements.query.value,
                contact: event.target.elements.contact.value,
                files:filesArray,
                criticality: event.target.elements.criticality.value
              }));
            }
        }
      }
 

    for(let i=0;i<files.length;i++){                      //loops through all the files.
      let file = files[i];
      let fileReader = new FileReader();
      handleFileReader(file, fileReader);                 //calls the handleFileReader to convert a image into base64
    }
  }

  const handleSubmit = (event) => {  
    console.log(event.target.elements.subject.value);                   //This send handles the submit event and pass the event to handleSetState. 
    event.preventDefault();
    handleSetState(event);
    };
        
      return (
        <>
          <div className="title">
          <div className="p1">Feedback Form</div>
            <div className="p2">Responses to this email will be sent to {user}</div>
          </div>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className='top'>
                <div className="col-lab">
                  <label htmlFor="text">Subject</label>
                </div>
                <div className="col-in">
                  <input type="text" name="subject"   required/>
                </div>
                <div className="col-lab">
                    <label htmlFor="query">Mention your Query Here</label>
                </div>
                <div className="col-in">
                 <textarea type="text" name="query" >
                </textarea>
                </div>
                <div className="col-lab">
                  <label htmlFor="file">Attachments</label>
                </div>
                <div className="inline-btn">
                 <button className="choose-btn" onClick={selectFile}>Choose File</button>
                      <span className="p">*.Images should be in JPG Format</span> 
                </div>
                <input
                    type="file"
                    id="fileInput"
                    name="file"
                    multiple
                    style={{ display: 'none' }}
                    accept=".jpeg,.jpg"
                  />
            
                </div>
            <div className="middle">
              <div className="child">
                      <label htmlFor="contact">Contact</label>
              <div className="phone-input">
                <span className="flag-icon" alt="IND"></span>
                <input type="tel" name="contact" />
              </div>
             
              </div>
              <div className="child">

                <div className='cri-lab'>How critical is your request</div>
                
                  <select name="criticality">
                    <option value="low" default >Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
              </div>
              <div id ='btn' className="child">
                <div className="button">
                  <span>
                    <button type="submit">Send</button>
                    <button> Cancel</button>
                  </span>
                </div>
              </div>
              <div className="child">
                <p id="ch-element1">AIVision Helpline: +91-9924300511</p>
                <p id="ch-element2">Mon - Fri 10.00AM - 7:00PM</p>
              </div>
            </div>
        </form>
        </div>
        </>
        );
      }
export default App;
