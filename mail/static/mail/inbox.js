document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_mail);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  //API 1
fetch(`/emails/${mailbox}`)
.then(response => response.json())
.then(emails => {
    console.log(emails)
    emails.forEach(email => show_emails(email,mailbox))  
    });
  }


function show_emails(email,mailbox) {
  // Each email isrendered in its own box (as a <div> with a border) displaying sender ,subject and timestamp.
  let email_div = document.createElement('div');
  email_div.className = "row";

  //Create a div for sender and append to email_div
  let sender = document.createElement('div')  
  sender.className = "col-lg-2"
  if (mailbox == "inbox") {
    sender.innerHTML = email['sender'];
  }
  else {
    sender.innerHTML = email['recipients'][0];
  }
  email_div.append(sender);

  // Create a div for subject and append to email_div
  let subject = document.createElement('div');
  subject.className = "col-lg-6";
  subject.innerHTML = email['subject'];
  email_div.append(subject);

  //Create a div for timestamp and append to email_div
  let timestamp = document.createElement('div');
  timestamp.className = "col-lg-3";
  timestamp.innerHTML = email['timestamp'];
  email_div.append(timestamp);

  //Create a div for archive button and append to emai_div
  if (mailbox !== 'sent') {
    let button = document.createElement('img');
    button.src = "static/mail/archive.jpg";
    button.className = "col-lg-1"
    button.style.cssText = 'width:20px;height:20px'
    email_div.append(button)

    // When user click archive button, change the archived boolean value
     button.addEventListener('click', function() {
    fetch('/emails/' + email['id'], {
      method: 'PUT',
      body: JSON.stringify({ archived : !email['archived'] })
    })
    .then(response => load_mailbox('inbox'))
  });
 
  }
  
  //If the email is unread, it will have a white background. If the email has been read, it should appear with a gray background.
  email['read'] ? email_div.style.backgroundColor = 'lightgrey' : email_div.style.backgroundColor = 'white';

  // When user click on any email, call view_email function  
  email_div.addEventListener('click', () => view_email(email['id']));

  //Append email_div to emails-view
  document.querySelector('#emails-view').append(email_div);
}

  


function view_email (email_id) {
  //Show email view and hide other views
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  //API 
  //make a GET request to /emails/<email_id> to request the email
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    //console.log('View email', email_id, email);
    // display email
      const view = document.querySelector('#email-view');
      view.innerHTML = `
        <ul class="list-group">
          <li class="list-group-item"><b>From:</b> <span>${email['sender']}</span></li>
          <li class="list-group-item"><b>To: </b><span>${email['recipients']}</span></li>
          <li class="list-group-item"><b>Subject:</b> <span>${email['subject']}</span</li>
          <li class="list-group-item"><b>Time:</b> <span>${email['timestamp']}</span></li>
        </ul>
        <p class="m-2">${email['body']}</p>
      `;

      // mark this email as read
    if (!email['read']) {
      console.log('if Email read is false, set read property to true')
      fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({ read : true })
      })
    }

  
});

}

function send_mail() {
  // Send the email in json response when user compose the email
  let recipients = document.querySelector('#compose-recipients').value;
  let subject = document.querySelector('#compose-subject').value;
  let body = document.querySelector('#compose-body').value;
  
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      console.log(result)
  });
  localStorage.clear();
  load_mailbox('sent');
  return false;       //Returning false to prevent loading the inbox

}
