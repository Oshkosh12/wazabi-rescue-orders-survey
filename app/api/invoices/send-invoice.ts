import nodemailer from 'nodemailer'

async function testEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'info@wazabilabs.com',
      pass: 'your_app_password', // 🔥 Use direct app password just for testing
    },
  });

  try {
    const info = await transporter.sendMail({
      from: 'info@wazabilabs.com',
      to: 'okashaamjadali360@gmail.com',
      subject: 'Test Email',
      text: 'This is a test from Node.js',
    });
    console.log('✅ Sent:', info.messageId);
  } catch (err) {
    console.error('❌ Failed:', err);
  }
}

testEmail();
