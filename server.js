require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Resend = require('resend').Resend;


const app = express();
const port = 4000;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.get("/", async (req, res) => {
  console.log('inside GET /');
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["nadeeshamadusanka44@gmail.com"],
    subject: "hello world",
    html: "<strong>it works!</strong>",
  });

  if (error) {
    console.log('error:', error);
    return res.status(400).json({ error });
  }

  res.status(200).json({ data });
});

// app.post('/send-email', async (req, res) => {
//   const { htmlContent, recipient } = req.body;

//   if (!htmlContent || !recipient) {
//     return res.status(400).json({ success: false, error: 'HTML content or recipient missing' });
//   }
//   console.log(htmlContent, recipient);

//   const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "maddison53@ethereal.email",
//       pass: "jn7jnAPss4f63QBp6D",
//     },
//   });

//   const mailOptions = {
//     from: 'maddison53@ethereal.email',
//     to: recipient,
//     subject: 'Generated Email from GrapesJS',
//     html: htmlContent,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.json({ success: true, message: 'Email sent successfully!' });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).json({ success: false, error: 'Failed to send email' });
//   }
// });



// Start the server

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
