require('dotenv').config();
const mjml2html = require('mjml');

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

app.post('/send-email', async (req, res) => {
  const { htmlContent, recipient } = req.body;

  if (!htmlContent || !recipient) {
    return res.status(400).json({ success: false, error: 'HTML content or recipient missing' });
  }

  const convertedHtml = mjml2html(htmlContent);

  if (convertedHtml.errors && convertedHtml.errors.length > 0) {
    console.error('MJML Conversion Errors:', convertedHtml.errors);
    return res.status(400).json({ success: false, error: 'MJML conversion failed', details: convertedHtml.errors });
  }

  console.log('Converted HTML:', convertedHtml.html);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: 'nadeeshamadusanka44@gmail.com',
      subject: 'Generated Email from GrapesJS',
      html: convertedHtml.html,
    });

    if (error) {
      console.error('Error sending email:', error);
      return res.status(400).json({ success: false, error: 'Failed to send email' });
    }

    res.status(200).json({ success: true, data, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
