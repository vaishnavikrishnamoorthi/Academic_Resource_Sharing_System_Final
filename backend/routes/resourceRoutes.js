const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const verifyToken = require("../middleware/authMiddleware");
const allowUpload = require("../middleware/allowUpload");

const { deleteResource } = require("../controllers/resourceController");
const { updateResource } = require("../controllers/resourceController");
// const {getSubjects} = require("../controllers/resourceController")

const {
  uploadResource,
  getResources,
  downloadResource,
  getMyUploads,
  getAllResources,
  getCourses,
  getSemesters,
  getSubjects,
  getSpecializations
} = require("../controllers/resourceController");

router.get(
  "/",
  verifyToken,
  getResources
);

router.post(
  "/upload",
  verifyToken,
  allowUpload,
  upload.single("file"),
  uploadResource
);

router.get(
  "/download/:id",
  verifyToken,
  downloadResource
);

router.get(
  "/my-uploads",
  verifyToken,
  getMyUploads
);

router.get(
  "/all-resources",
  verifyToken,
  getAllResources
);


router.get("/courses", verifyToken, getCourses);
router.get("/semesters", verifyToken, getSemesters);
router.get("/subjects", verifyToken, getSubjects);
router.get("/specializations", verifyToken, getSpecializations);

router.delete(
  "/:id",
  verifyToken,
  deleteResource
);
router.put(
  "/:id",
  verifyToken,
  upload.single("file"),
  updateResource
);
router.get(
  "/subjects",
  verifyToken,
  getSubjects
);
router.get(
  "/courses",

  getCourses
);
router.get(
  "/semesters",
  verifyToken,
  getSemesters
);

module.exports = router;
