import nodemailer from 'nodemailer'

export interface EmailData {
  name: string
  email: string
  reason: string
  message: string
}

export interface EmailServiceConfig {
  to: string
  service?: string
  host?: string
  port?: number
  secure?: boolean
  auth?: {
    user: string
    pass: string
  }
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private config: EmailServiceConfig

  constructor(config: EmailServiceConfig) {
    this.config = config
    this.initializeTransporter()
  }

  private async initializeTransporter() {
    try {
      // Configuración para Gmail usando OAuth2 o configuración simple
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER || this.config.to,
          pass: process.env.EMAIL_PASS || ''
        },
        // Fallback para desarrollo - usar ethereal email para testing
        ...(process.env.NODE_ENV === 'development' && {
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: 'ethereal.user@ethereal.email',
            pass: 'ethereal.pass'
          }
        })
      })

      // Verificar la conexión
      if (process.env.NODE_ENV === 'production' && this.transporter) {
        await this.transporter.verify()
        console.log('Email service initialized successfully')
      }
    } catch (error) {
      console.error('Failed to initialize email service:', error)
      this.transporter = null
    }
  }

  async sendSupportEmail(data: EmailData): Promise<{ success: boolean; message: string }> {
    if (!this.transporter) {
      return {
        success: false,
        message: 'Servicio de correo no disponible. Por favor, inténtalo más tarde.'
      }
    }

    try {
      const mailOptions = {
        from: `"GestureAI Support" <${this.config.to}>`,
        to: this.config.to,
        replyTo: data.email,
        subject: `[GestureAI Support] ${this.getReasonText(data.reason)} - ${data.name}`,
        html: this.generateEmailTemplate(data),
        text: this.generatePlainTextEmail(data)
      }

      if (process.env.NODE_ENV === 'development') {
        // En desarrollo, intentar enviar el correo si hay configuración
        console.log('Attempting to send email in development mode:', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          from: mailOptions.from
        })
        
        // Si no hay contraseña configurada, solo simular
        if (!process.env.EMAIL_PASS && (!this.config.auth || !this.config.auth.pass)) {
          console.log('No email password configured, simulating send')
          return {
            success: true,
            message: 'Mensaje enviado correctamente (modo desarrollo - simulado)'
          }
        }
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', result.messageId)

      return {
        success: true,
        message: 'Tu mensaje ha sido enviado correctamente. Te responderemos pronto.'
      }
    } catch (error) {
      console.error('Failed to send email:', error)
      return {
        success: false,
        message: 'Error al enviar el mensaje. Por favor, inténtalo más tarde o contacta directamente a gestos031@gmail.com'
      }
    }
  }

  private getReasonText(reason: string): string {
    const reasons: Record<string, string> = {
      technical: 'Problema Técnico',
      billing: 'Consulta',
      feature: 'Sugerencia',
      feedback: 'Comentarios Generales',
      other: 'Otro'
    }
    return reasons[reason] || 'Consulta General'
  }

  private generateEmailTemplate(data: EmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nuevo mensaje de soporte - GestureAI</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🤖 Nuevo mensaje de soporte - GestureAI</h2>
            <p>Has recibido un nuevo mensaje a través del formulario de contacto</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Nombre:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">📧 Correo electrónico:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="field">
              <div class="label">🏷️ Motivo:</div>
              <div class="value">${this.getReasonText(data.reason)}</div>
            </div>
            <div class="field">
              <div class="label">💬 Mensaje:</div>
              <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Este mensaje fue enviado desde la aplicación GestureAI el ${new Date().toLocaleString('es-ES')}</p>
            <p>Para responder, usa directamente el correo: ${data.email}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private generatePlainTextEmail(data: EmailData): string {
    return `
Nuevo mensaje de soporte - GestureAI

Nombre: ${data.name}
Correo: ${data.email}
Motivo: ${this.getReasonText(data.reason)}

Mensaje:
${data.message}

---
Enviado desde GestureAI el ${new Date().toLocaleString('es-ES')}
Para responder, usa directamente el correo: ${data.email}
    `.trim()
  }
}

// Singleton instance
let emailServiceInstance: EmailService | null = null

export function initializeEmailService(): void {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService({
      to: 'gestos031@gmail.com'
    })
  }
}

export function getEmailService(): EmailService | null {
  return emailServiceInstance
}

export { EmailService } 