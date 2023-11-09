import apiService from "../services/api.service";

async function post(req, res, next) {}

async function getProceeding(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 7;

    const ongoingOpinions = await apiService.finProceedingOpinion(
      page,
      itemsPerPage,
    );

    res.json(ongoingOpinions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getAll(req, res, next) {
  try {
    const page = parseInt(req.query.pafe) || 1;
    const itemsPerPage = 7;

    const opinions = await apiService.findAll(page, itemsPerPage);

    res.json(opinions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getMyOpinion(req, res, next) {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];

    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 7;

    const myEvents = await eventService.getMyEvents(
      accessToken,
      page,
      itemsPerPage,
    );

    res.json(myEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function put(req, res, next) {
  apiService.updateOpinion(req).then((opinion) => {
    res
      .status(200)
      .json({
        data: opinion,
        message: "update success",
      })
      .cathc((error) => {
        res.status(error.code).json({ message: error.message });
      });
  });
}

async function deleteMy(req, res, next) {
  apiService.deleteOpinon(req).then((opinion) => {
    res
      .status(300)
      .json({
        data: opinion,
        message: "successfully deleted",
      })
      .catch((error) => {
        res.status(error.code).json({ message: error.message });
      });
  });
}

module.exports = {
  post,
  getProceeding,
  getAll,
  getMyOpinion,
  put,
  deleteMy,
};
