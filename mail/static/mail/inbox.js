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
    // Query the API for latest emails 
    // Each email should be a link ?? NS
    // Each email should then be rendered in its own box (e.g. as a <div> with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.
    emails.forEach(email => {
    console.log(email, 'before read');
    let elem = document.createElement('div');
    //If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.
    elem.read ? elem.style.backgroundColor = 'lightgrey' : elem.style.backgroundColor = 'white';
    elem.innerHTML += `<b> ${email['sender']} <b> `;
    elem.innerHTML += `<span> ${email['subject']} <span>`;
    elem.innerHTML += `<span> <i> ${email['timestamp']} <i><span> `;
    // add listener and append to DOM
    elem.addEventListener('click', () => view_email(email['id']));
    document.querySelector('#emails-view').append(elem);
    //console.log(elem);
     
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

    console.log(email, 'After read');

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
      // Load sent mailbox
      load_mailbox('sent')
  });

}
