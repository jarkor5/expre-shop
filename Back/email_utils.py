from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_USER"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASSWORD"),
    MAIL_FROM=os.getenv("EMAIL_USER"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Expre-Shop",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)


async def send_recovery_email(email: EmailStr, token: str):
    reset_link = f"http://localhost:3000/reset-password?token={token}"
    message = MessageSchema(
        subject="Recuperación de contraseña - Expre-Shop",
        recipients=[email],
        body=f"""<p>Hola,</p>
                 <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                 <p><a href="{reset_link}">{reset_link}</a></p>
                 <p>Este enlace expirará en 1 hora.</p>""",
        subtype="html",
    )
    fm = FastMail(conf)
    await fm.send_message(message)
