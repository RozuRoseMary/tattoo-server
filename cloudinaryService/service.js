const cloudinary = require("../utils/cloudinary");

exports.uploadToCloudinary = async (file, profilePicture) => {
  const result = await cloudinary.upload(file);
  if (profilePicture) {
    const splitted = req.user.profilePicture.split("/");
    const publicId = splitted[splitted.length - 1].split(".")[0];
    await cloudinary.destroy(publicId);
  }
  return result.secure_url;
};
