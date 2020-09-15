// --| Define our common return error types
const ReturnErrorType =
{
    ERROR_PROVIDE_IMAGE: "You need to provide an actual image URL if you want your meme, duh... 🙄",
    ERROR_INVALID_FILETYPE: "You need to provide a valid image URL 🙄",
    ERROR_INVALID_RETURN_FORMAT: "You either did not specify a return format query or the query value was wrong. Just add a query at the end named format='buffer or base64' ! 🙄"
};

const AcceptedReturnFormat = [ "buffer", "base64" ];

let Image = [];

module.exports.ReturnErrorType = ReturnErrorType;
module.exports.AcceptedReturnFormat = AcceptedReturnFormat;
module.exports.Image = Image;
