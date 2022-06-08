namespace Sabio.Services
{
    public class EmailService : IEmailService
    {

        AppKeys _appKeys = null;

        Email _email = null;

        IWebHostEnvironment _env = null;

        public EmailService(IOptions<AppKeys> appKeys, IOptions<Email> email, IWebHostEnvironment env)
        {
            _appKeys = appKeys.Value;
            _env = env;
            _email = email.Value;
        }
        public async Task<Response> EmailResponse(SendGridMessage msg)
        {

            SendGridClient client = new SendGridClient(_appKeys.SendGridAppKey);

            Response response = await client.SendEmailAsync(msg);
                
            if (response.StatusCode.ToString() != "Accepted")
            {
               throw new Exception(message: "error occured"); 
            };
            return response;
        }
        
        public async Task SendEmail(EmailAddRequest model)
        {
            EmailAddress from = new EmailAddress(_email.Sender, _email.Name);
            string subject = $"{model.Subject}";
            EmailAddress to = model.Email;
            string plainTextContent = $"{model.PlainText}";
            string htmlContent = File.ReadAllText($"{_env.WebRootPath}/EmailTemplates/EmailTemplate.html");
            htmlContent = htmlContent.Replace("{email}", $"{model.Email.Email}");

            SendGridMessage msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await EmailResponse(msg);
        }
    }
}
