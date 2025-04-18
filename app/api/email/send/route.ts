import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      phone, 
      items,
      total,
    }: {
      name: string;
      email: string;
      phone: string;
      items: CartItem[];
      total: number;
    } = await req.json();

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER!,
          pass: process.env.EMAIL_PASS!,
        },
      });


    const itemsList = items
      .map((item: CartItem) => `- ${item.name} (x${item.quantity}) - $${item.price}`)
      .join("\n");

    const mailOptions = {
      from: `"ArtistHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Payment Confirmation - ArtistHub",
      text: `
Hi ${name},

✅ Thanks for your payment!

🧾 Order Summary:
${itemsList}

Total: $${total}

📦 Your delivery is being processed.
📞 We will contact you at ${phone} when your order is ready.

For inquiries, email delivery.artist@gmail.com or call +250787591929.

Thank you for supporting the artistHub!

– ArtistHub Team
      `.trim(),
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent" });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
console.log("ENV EMAIL_USER:", process.env.EMAIL_USER);
console.log("ENV EMAIL_PASS Present:", !!process.env.EMAIL_PASS);

}
