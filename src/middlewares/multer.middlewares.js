import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);

    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    const uniquiSuffic = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, file.fieldname + "-" + uniquiSuffic);
  },
});

export const upload = multer({ storage: storage });
