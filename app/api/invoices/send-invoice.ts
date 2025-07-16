import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Form parse error:", err);
      return res.status(500).json({ error: "Form parse error" });
    }

    const pdf = files.pdf;
    if (!pdf || Array.isArray(pdf)) {
      console.error("❌ No valid PDF received");
      return res.status(400).json({ error: "PDF missing" });
    }

    const buffer = fs.readFileSync(pdf.filepath);

    try {
      const response = await resend.emails.send({
        from: "Wazabi <info@wazabilabs.com>",   // MUST be verified in Resend
        to: ["okashaamjadali360@gmail.com"],              // Real email
        subject: "New Wazabi Order PDF Invoice",
        html: "<p>New order received. See attached invoice.</p>",
        attachments: [
          {
            filename: "invoice.pdf",
            content: buffer.toString("base64"),  // MUST be base64
          },
        ],
      });

      console.log("✅ Email sent:", response);
      res.status(200).json({ success: true });
    } catch (e) {
      console.error("❌ Error sending email:", e);
      res.status(500).json({ error: "Email failed" });
    }
  });
}
