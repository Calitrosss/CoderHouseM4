import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "profile":
        cb(null, `public/profiles`);
        break;

      case "identity":
      case "residence":
      case "account":
        cb(null, `public/documents`);
        break;

      case "product":
        cb(null, `public/products`);
        break;

      default:
        cb(null, "public");
        break;
    }
  },
  filename: (req, file, cb) => {
    const fileName = `${file.fieldname}-${req.user?._id}-${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

export const uploader = multer({ storage });
