const Photo = require("./../model/photoModel");
const responseHandler = require("./../utlis/responseHandler");
const globalerror = require("./../utlis/errorHandler");
const { mongoose } = require("mongoose");

exports.addPhoto = async(req, res) => {
    try{
        const { originalname, path, mimetype, size } = req.file;
        const image = new Photo({
            name: originalname,
            path,
            extension: mimetype.split('/')[1],
            size,
        });
        await image.save();
        const message = "Your image successfully upload";
        responseHandler.sendSuccessResponce(res,message,image);
    }catch(error){
        console.error(error);
        res.status(500).json({
          success: false,
          message: 'Server error',
        });
    }
}
exports.updatePhoto = async(req, res,next) => {
    const { id } = req.params;
    const { originalname, path, mimetype, size } = req.file;
    try{
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return globalerror.handleInvalidId(req, res, next);
          }
        const updatePhoto = await Photo.findByIdAndUpdate(id,
            {
                name: originalname,
                path,
                extension: mimetype.split('/')[1],
                size,    
            }, {
            new: true,
          });
          
          const message = "Your changes has been Successfully saved";
          responseHandler.sendSuccessResponce(res, message, updatePhoto);
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

exports.deletPhoto = async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return globalerror.handleInvalidId(req, res, next);
      } else {
        const photo = await Photo.findByIdAndUpdate(id, { active: false });
        const message = "Photo deleted successfully";
        responseHandler.sendSuccessResponce(res, message, photo);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: message.err });
    }
};

exports.getAll = async (req, res, next) => {
  try{
  const { page = 1, pageSize = 10 } = req.query;

  const [totalCount, photos] = await Promise.all([
    Photo.countDocuments(),
    Photo.find()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .select('-__v -active')
      .lean(),
  ]);
  res.json({
    error: false,
    data: photos,
    page,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  });
  }catch(error){
    console.log(error);
      res.status(500).json({ message: message.error });
  }
};


  