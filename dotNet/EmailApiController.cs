    [Route("api/emails")]
    [ApiController]
    public class EmailApiController : BaseApiController
    {
        private IEmailService _service = null;
        public EmailApiController(IEmailService service,
            ILogger<PingApiController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpPost()]
        public async Task<ActionResult<SuccessResponse>> CreateEmail(EmailAddRequest model)
        {
            int code = 400;

            BaseResponse response = null;

            try
            {
               await _service.SendEmail(model);

                response = new SuccessResponse();

                code = 202;
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());

                response = new ErrorResponse(ex.Message);

                code = 500;
            }

            return StatusCode(code, response);

        }

    }
