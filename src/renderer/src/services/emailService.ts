// Definir los tipos localmente para evitar problemas de importación
export interface EmailData {
  name: string
  email: string
  reason: string
  message: string
}

export interface EmailResponse {
  success: boolean
  message: string
}

export class EmailService {
  static async sendSupportEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      if (window.api && 'sendSupportEmail' in window.api) {
        const result = await (window.api as any).sendSupportEmail(emailData)
        return result
      } else {
        throw new Error('API de email no disponible')
      }
    } catch (error) {
      console.error('Error al enviar email:', error)
      return {
        success: false,
        message: 'Error al enviar el mensaje. Por favor, inténtalo más tarde.'
      }
    }
  }

  static validateEmailData(emailData: Partial<EmailData>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {}

    if (!emailData.name || emailData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!emailData.email || !/^\S+@\S+\.\S+$/.test(emailData.email)) {
      errors.email = 'Por favor, introduce un correo electrónico válido'
    }

    if (!emailData.reason || emailData.reason.trim().length === 0) {
      errors.reason = 'Por favor, selecciona un motivo de contacto'
    }

    if (!emailData.message || emailData.message.trim().length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  static getReasonText(reason: string): string {
    const reasons: Record<string, string> = {
      technical: 'Problema Técnico',
      billing: 'Consulta',
      feature: 'Sugerencia',
      feedback: 'Comentarios Generales',
      other: 'Otro'
    }
    return reasons[reason] || 'Consulta General'
  }
}

export default EmailService 