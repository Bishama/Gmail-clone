document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
  // Call function when user submit
  document.querySelector('#compose-form').onsubmit = send_mail;
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox,email_id) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  //API 1
fetch(`/emails/${mailbox}`)
.then(response => response.json())
.then(emails => {
    // Query the API for latest emails 
    // Each email should be a link
    // Each email should then be rendered in its own box (e.g. as a <div> with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.
    emails.forEach(email => {
    let elem = document.createElement('div');
    //If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.
    elem.read ? elem.style.backgroundColor = 'lightgrey' : elem.style.backgroundColor = 'white';
    elem.innerHTML += `<b> ${email['sender']} <b> `;
    elem.innerHTML += `<span> ${email['subject']} <span>`;
    elem.innerHTML += `<span> <i> ${email['timestamp']} <i><span> `;
    document.querySelector('#emails-view').append(elem);
    //When email is clicked call view_email functio
    elem.addEventListener('click', () => view_email(email['id']));

    });
});

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
// Print email
 console.log(email);
//show the email’s sender, recipients, subject, timestamp, and body.
// add an additional div to inbox.html (in addition to emails-view and compose-view) for displaying the email.
//add an event listener to an HTML element that you’ve added to the DOM
//Once the email has been clicked on, you should mark the email as read. PUT request to /emails/<email_id> to update whether an email is read or not
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
      // Print result
      console.log(result);
  });

}
