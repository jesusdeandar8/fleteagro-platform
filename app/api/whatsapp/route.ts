import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER!

const client = twilio(accountSid, authToken)

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()

    // Formato: whatsapp:+521XXXXXXXXXX
    const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`

    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioNumber}`,
      to: toNumber,
    })

    return NextResponse.json({ 
      success: true, 
      messageId: result.sid 
    })
  } catch (error: any) {
    console.error('Error enviando WhatsApp:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}