const { onRequest} = require("firebase-functions/v2/https");
const admin = require('firebase-admin');
var serviceAccount = require("./service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});            

exports.sendNotification = onRequest((req, res) => {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { token, notification, data } = req.body;

  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    token: token,
    data: data,
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
      return res.status(200).send('Notification sent successfully');
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      return res.status(500).send('Error sending notification');
    });
});
