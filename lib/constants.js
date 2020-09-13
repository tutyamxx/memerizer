// --| Define our common return error types
const ReturnErrorType =
{
    ERROR_PROVIDE_IMAGE: "You need to provide an actual image if you want your meme, duh... 🙄",
    ERROR_INVALID_FILETYPE: "Invalid file type provided. Allowed file types are: (*.JPEG, *.PNG, *.TIFF and *.BMP) 🙄",
    ERROR_INVALID_RETURN_FORMAT: "You either did not specify a return format query or the query value was wrong. Just add a query at the end named format='buffer or base64' ! 🙄"
};

// --| Allow only these file types since Jimp doesn't like anything else, well except GIFs.
const AcceptedImageTypes = [ "image/jpeg", "image/png", "image/tiff", "image/bmp" ];
const AcceptedReturnFormat = [ "buffer", "base64" ];

module.exports.ReturnErrorType = ReturnErrorType;
module.exports.AcceptedImageTypes = AcceptedImageTypes;
module.exports.AcceptedReturnFormat = AcceptedReturnFormat;
