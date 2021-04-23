import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText 
import sys

class MailClient(object):
    '''
    A simple mail client object that sends mails
    '''   
    def __init__(self, from_address, password, mail_server, port):        
        self.from_address = from_address
        self.password = password
        self.mail_server = mail_server
        self.port = port


    def send(self, subject, message, to_address, mail_type='plain'):
        '''
        Mail type can either be "plain" or "html". (Default is "plain")
        '''   
        success = False 
        try:            
            msg = MIMEMultipart()
            msg['From'] = "Storage Handler <" + self.from_address + ">"
            msg['To'] = to_address
            msg['Subject'] = subject

            body = message              
            msg.attach(MIMEText(body, mail_type))

            # Configure server
            server = smtplib.SMTP(self.mail_server, self.port)
            server.starttls()
        
            server.login(self.from_address, self.password)

            # Send mail 
            text = msg.as_string()
            server.sendmail(self.from_address, to_address, text)
            server.quit()

            success = True        
        except:
            raise Exception(sys.exc_info()[0])
            success = False
        
        return success
 